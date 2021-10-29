<template>
    <div>
         <div class="col-span-12 mt-8">
            <div class="intro-y flex items-center h-10 mb-3">
                <div>
                    <span class="lg:text-lg"><b>ตำแหน่งและสิทธิ์การใช้งานระบบ</b></span>
                </div>
                <div class="ml-auto">
                    <button 
                        v-if="openTab == 1"  
                        class="btn bg-blue-500 text-white" 
                        @click="modalCreateAdmin()"
                    >
                        เพิ่มผู้ดูแลระบบ
                    </button>
                    <button 
                        v-if="openTab == 2" 
                        class="btn bg-blue-500 text-white"
                        @click="modalCreatePosition()">เพิ่มตำแหน่ง</button>
                </div>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-4">
            <div class="intro-y pr-1">
                <div class="box p-2 ">
                    <div class="pos__tabs nav-tabs justify-center flex overscroll-x-scroll w-1/2">
                        <!-- เมนู แต่ละ status -->
                        <a
                            v-for="(tab,index) in tabStatus" :key="index"
                            data-toggle="tab"
                            data-target="#showRoomWithStatus"
                            href="javascript:;"
                            class="flex-1 py-2 rounded-md text-center active"
                            style="border:none;"
                            :class="{
                                'bg-white-900': openTab !== index+1,
                                'bg-blue-400 text-white mb-px': openTab === index+1,
                                }"
                            @click="getDataPermissionTab(index+1)"
                            >{{ tab }}
                        </a>
                    </div>
                </div>
                <div class="box mt-5 p-2 overflow-x-auto">

                    <AdminUsePermission
                        v-if="openTab == 1"
                        :admin-use-permission="dataAdminUsePermission"
                        @ManagePermissionAdmin="ManagePermissionAdmin"
                        @modalManagePositionAdmin="modalManagePositionAdmin"
                        @modalChangePassword="modalChangePassword"
                        @banAdmin="banAdmin"
                    />

                    <!-- <Permission 
                        v-if="openTab == 2"
                        :data-permission="dataPermission"
                        @modalEditPermission="modalEditPermission"
                    /> -->

                    <Position 
                    v-if="openTab == 2" 
                    :data-position="dataPossition" 
                    @modalEditPosition="modalEditPosition" />
                    

                </div>
            </div>
        </div>
        <client-only>
            <ModalCreatePermission 
                :permission-detail-list="permissionDetailList"
                @modalConfirmCreatePermission="modalConfirmCreatePermission"
            />

            <ModalEditPermission 
                :data-permission-by-id="dataPermissionByID"
                @modalConfirmEditPermission="modalConfirmEditPermission"
            />

            <ModalManagePermissionAdmin 
                :admin-permission="adminPermission"
                @confirmManagePermissionAdmin="confirmManagePermissionAdmin"
            />

            <ModalManagePositionAdmin 
                :dd-position="ddPosition"
                :data-admin-use-position="dataAdminUsePosition"
                @modalConfirmManagemanagePositionAdmin="modalConfirmManagemanagePositionAdmin"
            />

            <ModalCreatePosition
                :data-position-by-id="dataPositionById"
                :type-modal="typeModalCreatePosition"
                @modalConfirmEditPosition="modalConfirmEditPosition"
                @modalComfirmCreatePosition="modalComfirmCreatePosition" 
            />

            <ModalCreateAdmin 
                :data-permission="dataPermission"
                :modal-create-type="modalCreateType"
                :data-position="ddPosition"
                @modalComfirmCreateAdmin="modalComfirmCreateAdmin"
            />

            <ModalChangePasswordAdmin 
                @modalConfirmChangePassword="modalConfirmChangePassword"
            />

            <ModalConfirm
                :HeaderMassage="headerModalConfirm"
                :warning-massage="warningMassageModalConfirm"
                @submitConfirmModal="submitConfirm()"
                @cancelModal="cancelModal"
            />

            <div class="grid lg:grid-cols-3 gap-4 mt-4">
                <t-pagination
                    v-if="openTab == 1"
                    v-model="currentPageAdmin"
                    :total-items="totalItemAdmin"
                    :per-page="itemPerPageAdmin"
                    :limit="7"
                    :disabled="false"
                    @input="handleTogglePageAdmin()"
                />

                <t-pagination
                    v-if="openTab == 2"
                    v-model="currentPagePosition"
                    :total-items="totalItemPosition"
                    :per-page="itemPerPagePosition"
                    :limit="7"
                    :disabled="false"
                    @input="handleTogglePagePosition()"
                />

            </div>
        </client-only>
        
    </div>
</template>
<script>
import Permission from '~/components/Permission/Permission'; //permission
import Position from '~/components/Permission/Position'; //Position
import AdminUsePermission from '~/components/Permission/AdminUsePermission'; //AdminUsePermission

import ModalCreatePermission from '~/components/Modal/Permission/ModalCreatePermission'; //ModalCreatePermission
import ModalEditPermission from '~/components/Modal/Permission/ModalEditPermission'; //ModalEditPermission
import ModalManagePermissionAdmin from '~/components/Modal/Permission/ModalManagePermissionAdmin'; //ModalManagePermissionAdmin
import ModalCreatePosition from '~/components/Modal/Permission/ModalCreatePosition'; //ModalCreatePosition
import ModalChangePasswordAdmin from '~/components/Modal/Permission/ModalChangePasswordAdmin'; //ModalChangePasswordAdmin
import ModalManagePositionAdmin from '~/components/Modal/Permission/ModalManagePositionAdmin'; //ModalManagePositionAdmin
import ModalCreateAdmin from '@/components/Modal/Admin/ModalCreateAdmin'; //modal สร้าง admin
import ModalConfirm from '@/components/Modal/ModalConfirm';
import alertMixins from "~/mixins/alertMixin";

export default {
    layout : 'dashboard',
    middleware : ['permission'],
    components : {
        Permission,
        ModalCreatePermission,
        ModalConfirm,
        AdminUsePermission,
        ModalManagePermissionAdmin,
        ModalEditPermission,
        ModalCreatePosition,
        Position,
        ModalManagePositionAdmin,
        ModalCreateAdmin,
        ModalChangePasswordAdmin
    },
    mixins: [alertMixins],
    data() {
        return {
            tabStatus : ['ผู้ดูแลระบบ','ตำแหน่ง'],
            openTab : '',
            dataPermission : '',
            permissionDetailList : '',
            headerModalConfirm : '',
            warningMassageModalConfirm : '',
            typeModalConfirmSubmit : '',
            formCreatePermission : '',
            dataAdminUsePermission : '',
            adminPermission : '',
            formManagePermission : '',
            adminPermissionId : '',
            currentPageAdmin: 1,
            totalItemAdmin: 0,
            itemPerPageAdmin: 20,
            currentPageApiAdmin: 0,
            dataPermissionByID : '',
            formEditPermission : '',
            dataPossition : '',
            formPosition : '',
            positionId : '',
            dataPositionById : '',
            typeModalCreatePosition : '',
            currentPagePosition: 1,
            totalItemPosition: 0,
            itemPerPagePosition: 20,
            currentPageApiPosition: 0,
            adminId : '',
            ddPosition : '',
            dataAdminUsePosition : '',
            positionId : '',
            modalCreateType : '',
            dataPermission : '',
            dataPosition : '',
            formChangePassword : ''
        }
    },
    created() {
        this.getDataPermissionTab(1);
        this.getDropdownPosition();
        this.getDropdownPermission();
        // this.getAdminPermissionDetail();

    },
    methods : {
        handleTogglePageAdmin() {
            this.currentPageApiAdmin = this.currentPageAdmin - 1;
            this.getAdminUsePermission();
        },

        handleTogglePagePosition() {
            this.currentPageApiPosition = this.currentPagePosition - 1;
            this.getDataPosition();
        },
        
        getDataPermissionTab(status) {
            this.openTab = status;
            if(this.openTab == 1) {
                this.getAdminUsePermission();
            } else if(this.openTab == 2) {
                // this.getDataPermission();
                this.getDataPosition();
            }
        },

        async getAdminUsePermission() {
            const url = `admin/admins`
            
            // const url = `admin/admin_permissions`;
            const params = {
                page: this.currentPageApiAdmin,
                limit: this.itemPerPageAdmin,
            }

            try {
                const getAdminUsePermission = await this.$axios.get(url,{params : params});
                // console.log('getAdminUsePermission',getAdminUsePermission);
                this.dataAdminUsePermission = getAdminUsePermission.data.data;
                // console.log('dataAdminUsePermission',this.dataAdminUsePermission);
                this.totalItemAdmin = this.dataAdminUsePermission.total;
            } catch(err) {
                console.log(err);
            }
        },

        async getDataPermission() {
            const url = `admin/admin_permission_details`; //AdminPermissionDetails
            
            try {
                const getPermissionList = await this.$axios.get(url);
                this.dataPermission = getPermissionList.data.data;
            } catch(err) {
                console.log(err);
            }
        },
        modalCreatePermission() {
            // this.getAdminPermissionDetail();
            this.$cash('#modal-create-permission').modal('show');
        },

        modalConfirmCreatePermission(data) {
            this.formCreatePermission = data;
            // console.log(data);
            this.headerModalConfirm = 'ยืนยันสร้างสิทธิ์การเข้าถึง',
            this.typeModalConfirmSubmit = 'createPermission'
            this.$cash('#modal-create-permission').modal('hide');
            this.$cash('#modal-confirm').modal('show');
        },

        modalConfirmEditPermission(data) {
            this.formEditPermission = data;
            // console.log(data);
            this.headerModalConfirm = 'ยืนยันแก้ไขสิทธิ์การเข้าถึง',
            this.typeModalConfirmSubmit = 'editPermission'
            this.$cash('#modal-edit-permission').modal('hide');
            this.$cash('#modal-confirm').modal('show');
        },

        submitConfirm() {
            if(this.typeModalConfirmSubmit == 'createPermission') {
                this.createPermission();
            } else if(this.typeModalConfirmSubmit == 'managePermissionAdmin') {
                this.managePermissionAdmin();
            } else if(this.typeModalConfirmSubmit == 'editPermission') {
                this.editPermission();
            } else if(this.typeModalConfirmSubmit == 'createPosition') {
                this.createPosition();
            } else if(this.typeModalConfirmSubmit == 'editPosition') {
                this.editPosition();
            } else if(this.typeModalConfirmSubmit == 'managePositionAdmin') {
                this.managePositionAdmin();
            } else if(this.typeModalConfirmSubmit == 'createAdmin') {
                this.createAdmin();
            } else if(this.typeModalConfirmSubmit == 'changePasswordAdmin') {
                this.changePasswordAdmin();
            }
        },

        cancelModal() {
            this.$cash('#modal-confirm').modal('hide');
            this.warningMassageModalConfirm = null;
        },

        async createPermission() {
            // console.log('formCreatePermission',this.formCreatePermission); //CreateAdminPermissionDetail

            const url = `admin/admin_permission_details`;

            const _data = {
                detail : this.formCreatePermission.admin_permission_name
            }

            try {
                const createPermission = await this.$axios.post(url,_data);
                console.log('createPermission',createPermission);
                if(createPermission.status == 201) {
                    this.getDataPermissionTab(this.openTab);
                    // this.getAdminPermissionDetail();
                    this.$cash('#modal-confirm').modal('hide');
                    this.successAlertWord(createPermission.data.message);
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
        //ดึงข้อมูล permission ของแอดมิน
        async ManagePermissionAdmin(data) {
            this.adminPermissionId = data.admin_id;
            const permission_id = parseInt(data.admin_id);
            const url = `admin/admin_permissions/${permission_id}` //GetAdminPermissionById
            
            try {
                const getAdminPermissionById = await this.$axios.get(url);
                // console.log('getAdminPermissionById',getAdminPermissionById);
                this.adminPermission = getAdminPermissionById.data.data;
                this.$cash('#modal-manage-admin-permission').modal('show');
            } catch(err) {
                console.log(err);
            }
        },

        confirmManagePermissionAdmin(data) {
            this.formManagePermission = data;
            this.headerModalConfirm = 'ยืนยันจัดการสิทธิ์การเข้าถึง',
            this.typeModalConfirmSubmit = 'managePermissionAdmin'
            this.$cash('#modal-manage-admin-permission').modal('hide');
            this.$cash('#modal-confirm').modal('show');
        },

        async managePermissionAdmin() {
            let permissions = [];
            const _data = {
                permissions : null
            }

            const url = `admin/admin_permissions/${this.adminPermissionId}`; //EditAdminPermissionById

            for(let i = 0; i < this.formManagePermission.length; i++) {
                if(this.formManagePermission[i] != undefined) {
                    // console.log(this.formManagePermission[i]);
                    permissions.push(this.formManagePermission[i]);
                }
            }
            _data.permissions = permissions;
            // console.log('_data',_data);

            try {
                const managePermissionAdmin = await this.$axios.put(url,_data);
                // console.log('managePermissionAdmin',managePermissionAdmin);
                if(managePermissionAdmin.status == 200) {
                    this.$cash('#modal-confirm').modal('hide');
                    this.successAlertWord(managePermissionAdmin.data.message);
                }
                
            } catch(err) {
                console.log(err);
                if(err.response.status == 400) {
                    this.errorAlertStatusCode(err.response.data.errors);
                } else {
                    this.errorAlertStatusCode(err);
                }
            }
        },

        async modalEditPermission(permission_id) {
            this.adminPermissionId = permission_id;
            const url = `admin/admin_permission_details/${permission_id}`

            try {
                const getPermissionById = await this.$axios.get(url);
                // console.log('getPermissionById',getPermissionById);
                this.dataPermissionByID = getPermissionById.data.data;
                this.$cash('#modal-edit-permission').modal('show');
            } catch(err) {
                console.log(err);
            }
        },

        async editPermission() {
            // console.log(this.formEditPermission);
            const url = `admin/admin_permission_details/${this.adminPermissionId}`

            const _data = {
                detail : this.formEditPermission.editPermissionName,
                // status : this.formEditPermission.status == true ? 1 : 0
            }

            try {
                const editPermission = await this.$axios.put(url,_data);
                // console.log('editPermission',editPermission);
                if(editPermission.status == 200 ) {
                    this.getDataPermissionTab(this.openTab);
                    // this.getAdminPermissionDetail();
                    this.$cash('#modal-confirm').modal('hide');
                    this.successAlertWord(editPermission.data.message);
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

        modalCreatePosition() {
            this.typeModalCreatePosition = 'create';
            this.$cash('#modal-create-position').modal('show');
        },

        async getDataPosition() {
            const url = `admin/positions` //Positions

            const params = {
                page: this.currentPageApiPosition,
                limit: this.itemPerPagePosition,
            }

            try {
                const getPosition = await this.$axios.get(url,{params:params});
                // console.log('getPosition',getPosition);
                this.dataPossition = getPosition.data.data;
                this.totalItemPosition = getPosition.data.data.total;
            } catch(err) {
                console.log(err);
            }
        },

        modalComfirmCreatePosition(form_position) {
            this.formPosition = form_position;
            this.headerModalConfirm = 'ยืนยันสร้างตำแหน่ง',
            this.typeModalConfirmSubmit = 'createPosition'
            this.$cash('#modal-create-position').modal('hide');
            this.$cash('#modal-confirm').modal('show');
        },

        async createPosition() {
            const url = `admin/positions` //CreatePosition
            const _data = {
                name : this.formPosition.position_name
            }

            try {
                const createPosition = await this.$axios.post(url,_data);
                // console.log('createPosition',createPosition);
                if(createPosition.status == 200) {
                    this.getDataPermissionTab(this.openTab);
                    this.$cash('#modal-confirm').modal('hide');
                    this.successAlertWord(createPosition.data.message);
                }
            } catch(err) {
                console.log(err);
                if(err.response.status == 400) {
                    this.errorAlertStatusCode(err.response.data.errors);
                } else {
                    this.errorAlertStatusCode(err);
                }
            }
        },

        async modalEditPosition(positionId) {
            this.positionId = positionId;
            this.typeModalCreatePosition = 'edit';
        
            const url = `admin/positions/${this.positionId}`; //GetPositionById

            try {
                const getPositionById = await this.$axios.get(url);
                // console.log('getPositionById',getPositionById);
                this.dataPositionById = getPositionById.data.data;
                this.$cash('#modal-create-position').modal('show');
            } catch(err) {
                console.log(err);
            }
        },

        modalConfirmEditPosition(form_position) {
            this.formPosition = form_position;
            this.headerModalConfirm = 'ยืนยันแก้ไขตำแหน่ง',
            this.typeModalConfirmSubmit = 'editPosition'
            this.$cash('#modal-create-position').modal('hide');
            this.$cash('#modal-confirm').modal('show');
        },

        async editPosition() {

            const url = `admin/positions/${this.positionId}`; //EditAdminPermissionById

            const _data = {
                name : this.formPosition.position_name
            }

            try {
                const editPosition = await this.$axios.put(url,_data);
                // console.log('createPosition',createPosition);
                if(editPosition.status == 200) {
                    this.getDataPermissionTab(this.openTab);
                    this.$cash('#modal-confirm').modal('hide');
                    this.successAlertWord(editPosition.data.message);
                }
            } catch(err) {
                console.log(err);
                if(err.response.status == 400) {
                    this.errorAlertStatusCode(err.response.data.errors);
                } else {
                    this.errorAlertStatusCode(err);
                }
            }
        },

        async modalManagePositionAdmin(data) {
            this.adminId = data.admin_id;

            const url = `admin/admin_positions/${this.adminId}`;

            try {
                const getAdminUsePosition = await this.$axios.get(url);
                this.$cash('#modal-manage-admin-position').modal('show');
                // console.log('getAdminUsePosition',getAdminUsePosition);
                this.dataAdminUsePosition = getAdminUsePosition.data.data;
            } catch(err) {
                console.log(err);
            }
        },

        async getDropdownPosition() {
            const url = `data/admin_positions` //DataAdminPositions

            try {
                const getDDPosition = await this.$axios.get(url);
                // console.log('getDDPosition',getDDPosition);
                this.ddPosition = getDDPosition.data.data;
            } catch(err) {
                console.log(err);
            }
        },

        modalConfirmManagemanagePositionAdmin(positionId) {
            // console.log('adminId',this.adminId);
            this.positionId = positionId;
            this.headerModalConfirm = 'ยืนยันจัดการตำแหน่ง',
            this.typeModalConfirmSubmit = 'managePositionAdmin'
            this.$cash('#modal-manage-admin-position').modal('hide');
            this.$cash('#modal-confirm').modal('show');
        },

        async managePositionAdmin() {
            // console.log(this.adminId);
            const url = `admin/admin_positions/${this.adminId}`

            const _data = {
                position_id : this.positionId
            }

            try {
                const managePositionAdmin = await this.$axios.put(url,_data);
                // console.log('managePositionAdmin',managePositionAdmin);
                if(managePositionAdmin.status == 200) {
                    this.getAdminUsePermission();
                    this.$cash('#modal-confirm').modal('hide');
                    this.successAlertWord(managePositionAdmin.data.message);
                }
            } catch(err) {
                console.log(err);
                if(err.response.status == 400) {
                    this.errorAlertStatusCode(err.response.data.errors);
                } else {
                    this.errorAlertStatusCode(err);
                }
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

        modalComfirmCreateAdmin(data) {
            // console.log(data);
            this.form = data;
            this.headerModalConfirm = 'ยืนยันสร้างผู้ดูแลระบบ',
            this.typeModalConfirmSubmit = 'createAdmin'
            this.$cash('#modal-create-admin').modal('hide');
            this.$cash('#modal-confirm').modal('show');
        },

        async createAdmin() {
            const url = `admin/` //CreateAdmin

            try {
                const createAdmin = await this.$axios.post(url,this.form);
                // console.log('createAdmin',createAdmin);
                if(createAdmin.status == 200) {
                    this.getDataPermissionTab(1);
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

        modalChangePassword(data) {
            this.adminId = data.admin_id;
            this.$cash('#modal-change-password').modal('show');
        },

        modalConfirmChangePassword(data) {
            this.formChangePassword = data;
            this.headerModalConfirm = 'ยืนยันบันทึกข้อมูล',
            this.typeModalConfirmSubmit = 'changePasswordAdmin'
            this.$cash('#modal-change-password').modal('hide');
            this.$cash('#modal-confirm').modal('show');
        },

        async changePasswordAdmin() {
            console.log('formChangePassword',this.formChangePassword);

            const url = `admin/admins/${this.adminId}`
            const _data = {
                password : this.formChangePassword ? this.formChangePassword.newPassword : '',
            }

            try {
                const changePasswordAdmin = await this.$axios.put(url,_data);
                if(changePasswordAdmin.status == 200) {
                    this.getDataPermissionTab(1);
                    this.$cash('#modal-confirm').modal('hide');
                    this.successAlertWord(changePasswordAdmin.data.message);
                }
            } catch(err) {
                console.log(err);
                if(err.response.status == 400) {
                    this.errorAlertStatusCode(err.response.data.errors);
                } else {
                    this.errorAlertStatusCode(err);
                }
            }
        },

        async banAdmin(data) {
            const url = `admin/admins/${data.admin_id}`
            const _data = {
                password : null,
                status : data.admin_status
            }

            try {
                const isBanAdmin = await this.$axios.put(url,_data);
                if(isBanAdmin.status == 200) {
                    this.getDataPermissionTab(1);
                    this.successAlertWord(isBanAdmin.data.message);
                }
            } catch(err) {
                console.log(err);
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