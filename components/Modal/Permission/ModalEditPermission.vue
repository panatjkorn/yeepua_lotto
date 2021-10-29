<template>
    <div>
        <div
        id="modal-edit-permission"
        class="modal"
        tabindex="-1"
        aria-hidden="true"
        data-backdrop="static"
      >
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header text-xl">
                        <b>เพิ่มสิทธิ์การใช้งาน</b>
                    </div>
                <div class="modal-body p-8">
                    
                    <div class="col-span-12 sm:col-span-12 m-5">
                        <!-- <div class="flex">
                            <MazSwitch v-model="form.status" color="secondary" class="mt-2" />
                            <label for="" class="mt-2 ml-2 mb-2">เปิด-ปิดการใช้งาน</label>
                        </div> -->

                        <input v-model="form.editPermissionName" type="text" class="form-control w-full border mt-2" placeholder="ชื่อสิทธิ์การใช้งาน...">
                        <div v-if="submitCreateStatus == 'ERROR' && !$v.form.editPermissionName.required" class="text-red-500 text-xs mt-1">
                            กรุณากรอกชื่อสิทธิ์การใช้งาน
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary w-24 mr-1 mb-2" data-dismiss="modal">
                        ยกเลิก
                    </button>
                    <button class="btn btn bg-blue-500 text-white" @click="modalConfirmCreatePermission()">บันทึก</button>
                </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
const initForm = () => {
  return {
    editPermissionName : '',
    status : false
  }
};

import { required } from "vuelidate/lib/validators";
export default {
    props : ['permissionDetailList','dataPermissionById'],
    data() {
        return {
            form : initForm(),
            allSelected: false,
            submitCreateStatus : '',
        }
    },
    validations : {
      form : {
        editPermissionName  : { required },
      }
    },
    mounted() {
      this.$on('modalConfirmCreatePermission', (callback) => {
            if(callback) {
                this.refreshForm();
            }
            
        })
    },
    watch : {
        dataPermissionById : 'setFormPermission'
    },
    methods : {
        modalConfirmCreatePermission() {
            if(this.$v.form.editPermissionName.$invalid == false) {
                this.$emit('modalConfirmEditPermission',this.form)

            } else {
                this.submitCreateStatus = 'ERROR';
            }
        },

        refreshForm() {
            this.form = initForm()
            // this.form.checkedRole = [];
        },

        setFormPermission(data) {
            // console.log('data',data);
            this.form.editPermissionName = data.detail;
            // this.form.status = data.status;
        }
    }
}
</script>