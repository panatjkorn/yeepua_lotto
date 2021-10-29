<template>
    <div>
        <div
        id="modal-manage-admin-permission"
        class="modal"
        tabindex="-1"
        aria-hidden="true"
        data-backdrop="static"
      >
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header text-xl">
                        <b>จัดการสิทธิ์การใช้งาน</b>
                    </div>
                <div class="modal-body p-8">
                    <!-- <pre>{{adminPermission}}</pre> -->

                    <div class="col-span-12 sm:col-span-12 m-5">
                        <input v-model="allSelected" type="checkbox" class="form-check-input" @click="selectAll()">&nbsp;
                        <label for="" class="ml-1">เลือกเมนูทั้งหมด</label>
                    </div>

                    <div class="col-span-12 sm:col-span-12 m-5 scoll-role max-h-screen overflow-y-scroll">
                        <div v-for="(permission,index) in adminPermission.permissions" :key="index" 
                            class="mb-5">
                            
                            <input 
                                v-model="form.checkedRole" 
                                :value="permission.id"  
                                type="checkbox" 
                                class="form-check-input">&nbsp;
                            <label class="ml-2">{{permission.detail}}</label>
                        </div>
                    </div>

                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary w-24 mr-1 mb-2" data-dismiss="modal">
                        ยกเลิก
                    </button>
                    <!-- <button class="btn btn-secondary w-24 mr-1 mb-2" @click="closeModalEditLottoType()">
                    ยกเลิก
                    </button> -->
                    <button class="btn btn bg-blue-500 text-white" @click="modalManagePermissionAdmin()">บันทึก</button>
                </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props : ['adminPermission'],
    data() {
        return {
            form : {
                checkedRole : []
            },
            allSelected : false
        }
    },
    watch : {
        adminPermission : 'setPermissionAdmin'
    },
    methods : {
        setPermissionAdmin(data) {
            this.allSelected = false;
            this.form.checkedRole = [];

            for(let i = 0; i < data.permissions.length; i++) {
                // console.log(data.permissions[i].permission);
                if(data.permissions[i].permission == true) {
                    this.form.checkedRole.push(data.permissions[i].id);
                }
            }
        },
        modalManagePermissionAdmin() {
            // console.log(this.form.checkedRole);
            this.$emit('confirmManagePermissionAdmin',this.form.checkedRole);
        },
        // select role all
        selectAll: function() {
            this.form.checkedRole = [];
            
            if (!this.allSelected) {
                for(let i = 0; i < this.adminPermission.permissions.length; i++) {

                    this.form.checkedRole.push(this.adminPermission.permissions[i].id);

                }
            }
        },
    }
}
</script>