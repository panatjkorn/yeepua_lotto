<template>
    <div>
        <div
        id="modal-create-permission"
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
                        <input v-model="form.admin_permission_name" type="text" class="form-control w-full border mt-2" placeholder="ชื่อสิทธิ์การใช้งาน...">
                        <div v-if="submitCreateStatus == 'ERROR' && !$v.form.admin_permission_name.required" class="text-red-500 text-xs mt-1">
                            กรุณากรอกชื่อสิทธิ์การใช้งาน
                        </div>
                    </div>

                    <!-- <div class="col-span-12 sm:col-span-12 m-5">
                        จัดการกลุ่มเมนูที่เปิดให้ใช้งานได้
                        <hr>
                    </div>

                    <div class="col-span-12 sm:col-span-12 m-5">
                        <input v-model="allSelected" type="checkbox" class="form-check-input" @click="selectAll()">&nbsp;
                        <label for="" class="ml-1">เมนูทั้งหมด</label>
                    </div>

                    <div class="col-span-12 sm:col-span-12 m-5 scoll-role max-h-screen">
                        <div v-for="(permission,index) in permissionDetailList" :key="index" class="mb-5">
                            <input v-model="form.checkedRole" :value="permission.id"  type="checkbox" 
                                class="form-check-input">&nbsp;<label class="ml-2">{{ permission ? permission.detail : '' }}</label>
                        </div>
                    </div> -->

                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary w-24 mr-1 mb-2" data-dismiss="modal">
                        ยกเลิก
                    </button>
                    <!-- <button class="btn btn-secondary w-24 mr-1 mb-2" @click="closeModalEditLottoType()">
                    ยกเลิก
                    </button> -->
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
    admin_permission_name : ''
  }
};

import { required } from "vuelidate/lib/validators";
export default {
    props : ['permissionDetailList'],
    data() {
        return {
            form : initForm(),
            allSelected: false,
            submitCreateStatus : '',
        }
    },
    validations : {
      form : {
        admin_permission_name  : { required },
      }
    },
    mounted() {
      this.$on('modalConfirmCreatePermission', (callback) => {
        //   console.log('callback',callback);
            if(callback) {
                this.refreshForm();
            }
            
        })
    },
    methods : {
        // select role all
        // selectAll() {
        //     this.form.checkedRole = [];
        //     if (!this.allSelected) {
        //         // console.log('permissionDetailList',this.permissionDetailList);
        //         this.permissionDetailList.map((item) => {
        //             this.form.checkedRole.push(item.id);
        //         })
        //     }
        // },
        modalConfirmCreatePermission() {
            if(this.$v.form.admin_permission_name.$invalid == false) {
                this.$emit('modalConfirmCreatePermission',this.form)

            } else {
                this.submitCreateStatus = 'ERROR';
            }
        },

        refreshForm() {
            this.form = initForm()
            // this.form.checkedRole = [];
        }
    }
}
</script>