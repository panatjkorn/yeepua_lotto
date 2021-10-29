<template>
    <div>
        <div class="col-span-12 mt-8">
            <div class="intro-y flex items-center h-10">
                <div>
                    <span class="lg:text-lg"><b>จัดการผู้ดูแลระบบ</b></span>
                </div>
            </div>
        </div>
        <div class="col-span-12 mt-2">
            <div class="box p-5 relative overflow-y-hidden">
                <div class="intro-y flex items-center h-10">
                    <div class="ml-auto">
                        <button class="btn bg-blue-500 text-white" @click="modalCreateAdmin()">เพิ่มผู้ดูแลระบบ</button>
                    </div>
                </div>
                <div class="mt-3">
                    <table class="table">
                        <thead>
                            <tr>
                            <th v-for="(col,index) in tbShowAdmin.columns" :key="index" class="border-b-2 dark:border-dark-5 whitespace-nowrap">
                                <b>{{ col.label }}</b>
                            </th>
                            </tr>
                        </thead>
                        <tbody v-if="tbShowAdmin.rows.length > 0">
                            <tr v-for="(data,index) in tbShowAdmin.rows" :key="index" class="border-b dark:border-dark-5">
                                <td>{{ index+1 }}</td>
                                <td>{{ data.admin_name }}</td>
                                <td>{{ data.admin_position }}</td>
                                <!-- <td>
                                    <button class="btn bg-yellow-500 text-white" @click="modalEditAdmin()">แก้ไข</button>
                                </td> -->
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <client-only>

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

            <ModalCreateAdmin 
                :data-permission="dataPermission"
                :modal-create-type="modalCreateType"
                :data-position="dataPosition"
                @modalComfirmCreateAdmin="modalComfirmCreateAdmin"
            />

            <ModalConfirm
                :HeaderMassage="headerModalConfirm"
                :warning-massage="warningMassageModalConfirm"
                @submitConfirmModal="submitConfirm()"
                @cancelModal="cancelModal"
            />

        </client-only>
    </div>
</template>
<script>
import ModalCreateAdmin from '@/components/Modal/Admin/ModalCreateAdmin'; //modal สร้าง admin
import ModalConfirm from '@/components/Modal/ModalConfirm';

import alertMixins from "~/mixins/alertMixin";
export default {
    layout : 'dashboard',
    components : {
        ModalCreateAdmin,
        ModalConfirm
    },
    mixins : [alertMixins],
    data() {
        return {
            tbShowAdmin: {
                page: 1,
                columns: [
                  { label: "#"},
                  { label: "ชื่อผู้ดูแลระบบ"},
                  { label: "ตำแหน่ง"},
                //   { label: "ตัวเลือก"},
                ],
                rows: [],
            },
            dataPermission : '',
            dataPosition : '',
            headerModalConfirm : '',
            warningMassageModalConfirm : '',
            typeModalConfirmSubmit : '',
            form : '',
            currentPage: 1,
            totalItem: 0,
            itemPerPage: 20,
            currentPageApi: 0,
            modalCreateType : ''
        }
    },
    created() {
        this.getDataAdmin();
        this.getDropdownPermission();
        this.getDropdownPosition();
    },
    methods : {
        async handleTogglePage() {
            this.currentPageApi = this.currentPage - 1;
            this.getDataAdmin();
        },

        async getDataAdmin() {
            const url = `admin/admins`;

            const params = {
                page: this.currentPageApi,
                limit: this.itemPerPage,
            }

            try {
                const getAdmin = await this.$axios.get(url,{params:params}); //Admins
                if(getAdmin.data.data.admins) {
                    this.tbShowAdmin.rows = getAdmin.data.data.admins.map((item) => {
                        // console.log(item);
                        return {
                            admin_name : item ? item.name_profile : '',
                            admin_position : item.admin_position ? item.admin_position.name : '',
                            id : item ? item.id : ''
                        }
                    })
                }
                this.totalItem = getAdmin.data.data.total;
                
            } catch(err) {
                console.log(err);
            }
        },

        modalCreateAdmin() {
            this.modalCreateType = 'create';
            this.$cash('#modal-create-admin').modal('show');
        },
        
        async getDropdownPermission() {
            const url = `data/admin_position_details`; //DataAdminPermissionDetails

            try {
                const getPermission = await this.$axios.get(url);
                this.dataPermission = getPermission.data.data;
            } catch(err) {
                console.log(err);
            }
        },

        async getDropdownPosition() {
            const url = `data/admin_positions`; //DataAdminPositions

            try {
                const getPosition = await this.$axios.get(url);
                this.dataPosition = getPosition.data.data;
                // this.dataPermission = getPermission.data.data;
            } catch(err) {
                console.log(err);
            }
        },

        modalComfirmCreateAdmin(data) {
            // console.log(data);
            this.form = data;
            this.headerModalConfirm = 'ยืนยันสร้างผู้ดูแลระบบ',
            this.typeModalConfirmSubmit = 'createAdmin'
            this.$cash('#modal-create-admin').modal('hide');
            this.$cash('#modal-confirm').modal('show');
        },

        cancelModal() {
            this.$cash('#modal-confirm').modal('hide');
            this.warningMassageModalConfirm = null;
        },

        submitConfirm() {
            if(this.typeModalConfirmSubmit == 'createAdmin') {
                this.createAdmin();
            }
        },

        async createAdmin() {
            const url = `admin/` //CreateAdmin

            try {
                const createAdmin = await this.$axios.post(url,this.form);
                // console.log('createAdmin',createAdmin);
                if(createAdmin.status == 200) {
                    this.getDataAdmin();
                    this.$cash('#modal-confirm').modal('hide');
                    this.successAlertWord(createAdmin.data.message);
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
        },

        modalEditAdmin() {
            this.modalCreateType = 'edit';
            
            this.$cash('#modal-create-admin').modal('show');
        }

    }
}
</script>