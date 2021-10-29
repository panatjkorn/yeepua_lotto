<template>
    <div>
        <div class="intro-y flex items-center h-10 mb-3">
            <div>
                <span class="lg:text-lg"><b>เพิ่มโบนัส</b></span>
            </div>
            <div class="ml-auto">
                <button class="btn bg-blue-500 text-white" @click="modalAddBonus()">+ เพิ่มโบนัส</button>
            </div>
        </div>
        <div class="box mt-3 px-5 py-5 overflow-x-auto">
            <client-only>
                <table class="table mt-5 mb-5">
                    <thead>
                    <tr>
                        <th v-for="(col,index) in tbBonusUser.columns" :key="index" class="border-b-2 dark:border-dark-5 whitespace-nowrap" :class="col.color">
                        <b>{{ col.label }}</b>
                        </th>
                    </tr>
                    </thead>
                    <tbody v-if="tbBonusUser.rows.length > 0">
                        <tr v-for="(data,index) in tbBonusUser.rows" :key="index">
                            <td>{{ index+1 }}</td>
                            <td>{{ data.created_at }}</td>
                            <td>{{ data.user }}</td>
                            <td>{{ data.phone_number }}</td>
                            <td>
                                <div v-if="data.bank_account.length > 0">
                                    <p v-for="(bank,index) in data.bank_account" :key="index">
                                        {{bank.bank_account_name}} [ {{bank.bank_account_number}} ({{bank.bank_code}}) ]
                                    </p>
                                </div>
                            </td>
                            <td>{{data.credit}}</td>
                            <td>{{data.remark}}</td>
                            <td>{{data.admin}}</td>
                        </tr>
                    </tbody>
              </table>
            </client-only>
        </div>
        
        <client-only>
            <ModalAddBonus 
                :data-user-by-phone="dataUserByPhone"
                :descript-add-bonus="dataDescriptAddBonus"
                :form-add-bonus="form"
                :err-response-find-phone="errResponseFindPhone"
                @findPhoneNumber="findPhoneNumber"
                @modalConfirmAddBonus="modalConfirmAddBonus"
            />

            <ModalConfirm
                :HeaderMassage="headerModalConfirm"
                :warning-massage="warningMassageModalConfirm"
                @submitConfirmModal="submitConfirm()"
                @cancelModal="cancelModal"
            />

            <div class="grid lg:grid-cols-3 gap-4 mt-5">
                <t-pagination
                    v-model="currentPage"
                    :total-items="totalItem"
                    :per-page="itemPerPage"
                    :limit="7"
                    :disabled="false"
                    @input="handleTogglePage()"
                />
          </div>
        </client-only>
    </div>
</template>
<script>
import ModalAddBonus from '~/components/Modal/Bonus/ModalAddBonus';
import alertMixins from "~/mixins/alertMixin";
import ModalConfirm from '@/components/Modal/ModalConfirm';
import moment from "moment";

export default {
    layout : 'dashboard',
    middleware : ['permission'],
    components : {
        ModalAddBonus,
        ModalConfirm
    },
    mixins : [alertMixins],
    data() {
        return {
            dataUserByPhone : null,
            submitCreateStatus : '',
            tbBonusUser: {
                page: 1,
                columns: [
                    { label: "#"},
                    { label: "วันที่"},
                    { label: "ผู้ใช้งานระบบ"},
                    { label: "เบอร์โทรศัพท์"},
                    { label: "ชื่อบัญชีธนาคาร"},
                    { label: "จำนวน bonus"},
                    { label: "หมายเหตุ"},
                    { label: "ทำรายการโดย"},
                ],
                rows: [],
            },
            dataDescriptAddBonus : '',
            headerModalConfirm : '',
            warningMassageModalConfirm : '',
            typeModalConfirmSubmit : '',
            form : {
                remark : '',
                credit : ''
            },
            user_id : '',
            currentPage: 1,
            totalItem: 0,
            itemPerPage: 20,
            currentPageApi: 0,
            errResponseFindPhone : null
        }
    },
    
    created() {
        this.getListBonus();
        this.getDescriptAddBonus();
    },
    methods : {
        async handleTogglePage() {
            this.currentPageApi = this.currentPage - 1;
            this.getListBonus();
        },
        modalAddBonus() {
            this.errResponseFindPhone = null;
            this.dataUserByPhone = null;
            this.form.remark = '';
            this.form.credit = '';
            this.$cash('#modal-add-bonus').modal('show');
        },
        //ค้นหา user ด้วยเบอร์โทร
        async findPhoneNumber(data) {
            // console.log(data);
            this.errResponseFindPhone = null;
                const url = `admin_manage_statement/user/phone_number` //GetUserByIdPhoneNumber

                const _data = {
                    phone_number : data
                }

                try {
                    const getUserByPhone = await this.$axios.post(url,_data);
                    this.dataUserByPhone = getUserByPhone.data.data;
                    // console.log('dataUserByPhone',this.dataUserByPhone);
                    if(this.dataUserByPhone != null) {
                        this.user_id = this.dataUserByPhone.id;
                    }
                } catch(err) {
                    this.dataUserByPhone = null;
                    if(err.response.status == 404) {
                        // console.log(err.response.data.errors);
                        this.errResponseFindPhone = err.response.data.errors;
                    } else {
                        console.log(err);
                    }
                    
                }
        },
        async getListBonus() {
            const url = `admin_manage_statement/user/bonus` //BonusUsers

            const params = {
                page: this.currentPageApi,
                limit: this.itemPerPage,
            }

            try {
                const getUser = await this.$axios.get(url,{params:params});
                // console.log('getUser',getUser.data.data.total);
                this.totalItem = getUser.data.data.total;
                this.tbBonusUser.rows = getUser.data.data.bonus.map((item) => {
                    // console.log(item);
                    return {
                        created_at : item.created_at ? moment(item.created_at).format("YYYY-MM-DD HH:mm") : '',
                        credit : item ? item.credit : '',
                        remark : item ? item.remark : '',
                        user : item.user && item.user.user_bank_accounts.length > 0 
                            ? item.user.user_bank_accounts[0].bank_account_name : '',
                        phone_number : item.user ? item.user.phone_number : '',
                        bank_account : item.user && item.user.user_bank_accounts.length > 0 
                            ? item.user.user_bank_accounts : '',
                        admin : item.admin ? item.admin.name_profile : ''
                    }
                })
            } catch(err) {
                console.log(err);
            }
            
        },

        async getDescriptAddBonus() {
            const url = `data/credit_bonus_descriptions` //DataCreditBonusDescriptions

            try {
                const getDescriptAddBonus = await this.$axios.get(url);
                // console.log('getDescriptAddBonus',getDescriptAddBonus);
                this.dataDescriptAddBonus = getDescriptAddBonus.data.data;
            } catch(err) {
                console.log(err);
            }
        },

        modalConfirmAddBonus(data) {
            // console.log('data',data);
            this.form = data;
            this.headerModalConfirm = 'ยืนยันสร้างเพิ่มโบนัส',
            this.typeModalConfirmSubmit = 'addBonusToUser'
            this.$cash('#modal-add-bonus').modal('hide');
            this.$cash('#modal-confirm').modal('show');
        },

        cancelModal() {
            this.$cash('#modal-confirm').modal('hide');
            this.warningMassageModalConfirm = null;
        },

        submitConfirm() {
            if(this.typeModalConfirmSubmit == 'addBonusToUser') {
                this.addBonusToUser();
            }
        },

        async addBonusToUser() {
            const url = `admin_manage_statement/add_bonus/${this.user_id}`

            const _data = {
                credit : this.form.credit,
                remark : this.form.remark,
            }

            try {
                const addBonusToUser = await this.$axios.post(url,_data);
                // console.log('addBonusToUser',addBonusToUser);
                if(addBonusToUser.status == 200) {
                    this.getListBonus();
                    this.$cash('#modal-confirm').modal('hide');
                    this.successAlertWord(addBonusToUser.data.message);
                }
            } catch(err) {
                console.log(err);
                this.$cash('#modal-confirm').modal('hide');
                if(err.response.status == 400) {
                    this.errorAlertStatusCode(err.response.data.errors);
                } else {
                    this.errorAlertStatusCode(err);
                }
            }
        }
    }
}
</script>