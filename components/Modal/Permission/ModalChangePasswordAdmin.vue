<template>
    <div>
        <div
        id="modal-change-password"
        class="modal"
        tabindex="-1"
        aria-hidden="true"
        data-backdrop="static"
      >
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header text-xl">
                        <b>เปลี่ยนรหัสผ่านผู้ดูแลระบบ</b>
                    </div>
                <div class="modal-body p-8">
                    
                    <div class="col-span-12 sm:col-span-12 m-5">
                        <!-- <div class="flex">
                            <MazSwitch v-model="form.status" color="secondary" class="mt-2" />
                            <label for="" class="mt-2 ml-2 mb-2">เปิด-ปิดการใช้งาน</label>
                        </div> -->
                        
                        <div class="mt-2">
                            <label for=""><b>รหัสผ่านใหม่(ไม่จำเป็นต้องกรอก)</b></label>
                            <input v-model="form.newPassword" type="text" class="form-control w-full border mt-2" placeholder="รหัสผ่านใหม่">
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary w-24 mr-1 mb-2" data-dismiss="modal">
                        ยกเลิก
                    </button>
                    <button class="btn btn bg-blue-500 text-white" @click="modalConfirmChangePassword()">บันทึก</button>
                </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>

export default {
    data() {
        return {
            form : {
                // status : false,
                newPassword : null
            },
        }
    },
    created() {
      this.$on('modalConfirmChangePassword', (callback) => {
        if(callback) {
            this.refreshForm();
        }
            
    })
    },
    methods : {
        modalConfirmChangePassword() {
            this.$emit('modalConfirmChangePassword',this.form)
        },

        refreshForm() {
            this.form = {
                newPassword : null
            }
            // this.form.checkedRole = [];
        },
    }
}
</script>