<template>
    <div>
        <div class="col-span-12 mt-8">
            <div class="intro-y flex items-center h-10">
                <div>
                    <span class="lg:text-lg"><b>Template การจัดการเรทราคา</b></span>
                </div>
            </div>
        </div>
        <div class="col-span-12 mt-2">
            <div class="box p-5 relative overflow-y-hidden">
                <div class="intro-y flex items-center h-10">
                    <div class="ml-auto">
                        <button class="btn bg-blue-500 text-white" @click="modalCreateTemplate()">สร้าง Template</button>
                    </div>
                </div>
                <div class="mt-3">
                    <table class="table">
                        <thead>
                            <tr>
                            <th v-for="(col,index) in tbShowTemplate.columns" :key="index" class="border-b-2 dark:border-dark-5 whitespace-nowrap">
                                <b>{{ col.label }}</b>
                            </th>
                            </tr>
                        </thead>
                        <tbody v-if="tbShowTemplate.rows.length > 0">
                            <tr v-for="(data,index) in tbShowTemplate.rows" :key="index" class="border-b dark:border-dark-5">
                                <td>{{ index+1 }}</td>
                                <td>{{ data.template_name }}</td>
                                <td>{{ data.bet_type }}</td>
                                <td>{{ data.max_bet_per_bill_number }}</td>
                                <td>{{ data.pay_ratio }}</td>
                                <td>{{ data.is_fixed == false ? 'จ่ายแบบลำดับขั้น' : 'จ่ายเต็มจำนวน' }}</td>
                                <td>
                                    <button class="btn bg-yellow-400 text-white" @click="modalEditTemplate(data)">แก้ไข</button>
                                    <button class="btn bg-red-500 text-white" @click="modalDeleteTemplate(data)">ลบ</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <client-only>
            <ModalCreateTemplateChangeRate 
                :form-create="form_create_template"
                :data-bet-types="dataBetTypes"
                @modalConfirmCreateTemplate="modalConfirmCreateTemplate"
            />

            <ModalEditTemplate
                :form-create="dataEditTemplate"
                :data-bet-types="dataBetTypes"
                @modalConfirmEditTemplate="modalConfirmEditTemplate"
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
import ModalCreateTemplateChangeRate from '@/components/Modal/Template/ModalCreateTemplateChangeRate'; //modal สร้าง template
import ModalEditTemplate from '@/components/Modal/Template/ModalEditTemplate'; //modal edit template
import ModalConfirm from '@/components/Modal/ModalConfirm';
import alertMixins from "~/mixins/alertMixin";

export default {
    layout : 'dashboard',
    middleware : ['permission'],
    components : {
        ModalCreateTemplateChangeRate,
        ModalConfirm,
        ModalEditTemplate
    },
    mixins : [alertMixins],
    data() {
        return {
            form_create_template : {
                is_fixed : '',
                pay_ratio : '',
                status : true,
                max_bet : '',
                max_bet_per_bill_number : '',
                round_number_ID : '',
                bet_type : '',
                template_name : ''
            },
            dataBetTypes : '',
            headerModalConfirm : '',
            warningMassageModalConfirm : '',
            typeModalConfirmSubmit : '',
            formCreateTemplate : '',
            tbShowTemplate: {
                page: 1,
                columns: [
                  { label: "#"},
                  { label: "ชื่อ Template"},
                  { label: "ประเภทการแทงหวย"},
                  { label: "ลิมิตต่อเลข/บิล(บาท)"},
                  { label: "ราคาจ่าย (บาทละ)"},
                  { label: "รูปแบบการจ่าย"},
                  { label: "ตัวเลือก"},
                ],
                rows: [],
            },
            currentPage: 1,
            totalItem: 0,
            itemPerPage: 20,
            currentPageApi: 0,
            dataEditTemplate : '',
            formEdit : '',
            templateId : ''
        }
    },
    created() {
        this.getDataBetType();
        this.getTemplateList();
        // console.log('xxxxxxxxxxxxxxxxxxxxx',this.$auth.strategy.token.get());
    },
    methods : {
        async handleTogglePage() {
            this.currentPageApi = this.currentPage - 1;
            this.getTemplateList();
        },
        async getTemplateList() {
            const url = `admin_manage_template/` //TemplateUseRatios
            const params = {
                page: this.currentPageApi,
                limit: this.itemPerPage,
            }
            try {
                const getTemplateLists = await this.$axios.get(url,{params:params});
                // console.log('getTemplateLists',getTemplateLists);
                this.totalItem = getTemplateLists.data.data.total;
                this.tbShowTemplate.rows = getTemplateLists.data.data.templates.map((item,index) => {
                    // console.log(item);
                    return {
                        template_name : item ? item.name : '',
                        id : item ? item.id : '',
                        max_bet_per_bill_number : item ? item.max_bet_per_bill_number : '',
                        pay_ratio : item ? item.pay_ratio : '',
                        is_fixed : item ? item.is_fixed : '',
                        bet_type : item.bet_type ? item.bet_type.name : '' 
                    }
                })
            } catch(err) {
                console.log(err);
            }
        },
        modalCreateTemplate() {
            this.$cash('#modal-create-template-change-rate-to-pay').modal('show');
        },
        async getDataBetType() {
            const url = `data/bet_types`
            try {
                const dataBetType = await this.$axios.get(url);
                // console.log('dataBetType',dataBetType);
                this.dataBetTypes = dataBetType.data.data;
            } catch(err) {
                console.log(err);
            }
        },
        modalConfirmCreateTemplate(data) {
            this.formCreateTemplate = data;
            // console.log('formCreateTemplate',this.formCreateTemplate);
            this.headerModalConfirm = 'ยืนยันสร้าง Template',
            this.typeModalConfirmSubmit = 'createTemplate'
            this.$cash('#modal-create-template-change-rate-to-pay').modal('hide');
            this.$cash('#modal-confirm').modal('show');
        },
        cancelModal() {
            this.$cash('#modal-confirm').modal('hide');
            this.warningMassageModalConfirm = null;
        },
        submitConfirm() {
            if(this.typeModalConfirmSubmit == 'createTemplate') {
                this.createTemplate();
            } else if(this.typeModalConfirmSubmit == 'editTemplate') {
                this.editTemplate();
            } else if(this.typeModalConfirmSubmit == 'deleteTemplate') {
                this.deleteTemplate();
            }
        },
        async createTemplate() {
            // console.log('create template',this.formCreateTemplate);
            const url = `admin_manage_template/` //CreateTemplateUseRatio

            const _data = {
                name : this.formCreateTemplate ? this.formCreateTemplate.template_name : '',
                bet_type_id :  this.formCreateTemplate ? this.formCreateTemplate.bet_type_id : '',
                is_fixed : this.formCreateTemplate ? this.formCreateTemplate.is_fixed : false,
                pay_ratio : this.formCreateTemplate ? this.formCreateTemplate.pay_ratio : '',
                step_limit : this.formCreateTemplate ? this.formCreateTemplate.step_limit : '',
                max_bet_per_bill_number : this.formCreateTemplate ? this.formCreateTemplate.max_bet_per_bill_number : '',
            }
            // console.log('_data',_data);
            try {
                const createTemplateChangeRate = await this.$axios.post(url,_data);
                // console.log('createTemplateChangeRate',createTemplateChangeRate);
                if(createTemplateChangeRate.status == 200) {
                    this.getTemplateList();
                    this.$cash('#modal-confirm').modal('hide');
                    this.successAlertWord(createTemplateChangeRate.data.message);
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
        async modalEditTemplate(data) {
            // console.log(data);
            const url = `admin_manage_template/${data.id}` //GetTemplateUseRatioById

            try {
                const getTemplateById = await this.$axios.get(url);
                // console.log('getTemplateById',getTemplateById);
                this.dataEditTemplate = getTemplateById.data.data;
                this.$cash('#modal-edit-template').modal('show');
            } catch(err) {
                console.log(err);
            }
        },
        modalConfirmEditTemplate(data) {
            this.formEdit = data;
            // console.log('formEdit',this.formEdit);
            this.headerModalConfirm = 'ยืนยันแก้ไข Template',
            this.typeModalConfirmSubmit = 'editTemplate'
            this.$cash('#modal-edit-template').modal('hide');
            this.$cash('#modal-confirm').modal('show');
        },
        async editTemplate() {
            const url = `admin_manage_template/${this.formEdit.template_id}` //EditTemplateUseRatioById
            const _data = {
                name : this.formEdit ? this.formEdit.template_name : '',
                bet_type_id :  this.formEdit ? this.formEdit.bet_type_id : '',
                is_fixed : this.formEdit ? this.formEdit.is_fixed : false,
                pay_ratio : this.formEdit ? this.formEdit.pay_ratio : '',
                step_limit : this.formEdit ? this.formEdit.step_limit : '',
                max_bet_per_bill_number : this.formEdit ? this.formEdit.max_bet_per_bill_number : '',
            }
            // console.log('_data',_data);

            try {
                const editTemplate = await this.$axios.put(url,_data);
                // console.log('editTemplate',editTemplate);
                if(editTemplate.status == 200) {
                    this.getTemplateList();
                    this.$cash('#modal-confirm').modal('hide');
                    this.successAlertWord(editTemplate.data.message);
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
        modalDeleteTemplate(data) {
            this.templateId = data.id;
            this.headerModalConfirm = 'ยืนยันลบ Template',
            this.typeModalConfirmSubmit = 'deleteTemplate'
            this.$cash('#modal-confirm').modal('show');
        },
        async deleteTemplate() {
            const url = `admin_manage_template/${this.templateId}` //DeleteTemplateUseRatioById

            try {
                const deleteTemplate = await this.$axios.delete(url);
                if(deleteTemplate.status == 200) {
                    this.getTemplateList();
                    this.$cash('#modal-confirm').modal('hide');
                    this.successAlertWord(deleteTemplate.data.message);
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
        // async getTemplateRatioCreate() {
        //     const url = `admin_manage_template/`
        //     try {
        //         const getTemplateRatio = await this.$axios.get(url);
        //         console.log('getTemplateRatio',getTemplateRatio);
        //     } catch(err) {
        //         console.log(err);
        //     }
        // }
        // async getTemplateRatioCreate() {
        //     const url = `data/template_use_ratios`

        //     try {
        //         const getTemplateRatio = await this.$axios.get(url);
        //         console.log('getTemplateRatio',getTemplateRatio);
        //     } catch(err) {
        //         console.log(err);
        //     }
        // }
    }
}
</script>