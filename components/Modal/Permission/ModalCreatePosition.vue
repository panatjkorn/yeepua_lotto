<template>
    <div>
        <div
        id="modal-create-position"
        class="modal"
        tabindex="-1"
        aria-hidden="true"
        data-backdrop="static"
      >
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header text-xl">
                        <b>เพิ่มตำแหน่ง</b>
                    </div>
                <div class="modal-body p-8">
                    
                    <div class="col-span-12 sm:col-span-12 m-5">
                        <input v-model="form.position_name" type="text" class="form-control w-full border mt-2" placeholder="ชื่อตำแหน่ง...">
                        <div v-if="submitCreateStatus == 'ERROR' && !$v.form.position_name.required" class="text-red-500 text-xs mt-1">
                            กรุณากรอกชื่อตำแหน่ง
                        </div>
                    </div>

                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary w-24 mr-1 mb-2" data-dismiss="modal" @click="refreshForm()">
                        ยกเลิก
                    </button>
                    <button class="btn btn bg-blue-500 text-white" @click="modalComfirm()">บันทึก</button>
                </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
const initForm = () => {
  return {
    position_name : ''
  }
};

import { required } from "vuelidate/lib/validators";
export default {
    props : ['dataPositionById','typeModal'],
    data() {
        return {
            form : initForm(),
            submitCreateStatus : '',
        }
    },
    validations : {
      form : {
        position_name  : { required },
      }
    },
    mounted() {
    //   this.$on('modalComfirmCreatePosition', (callback) => {

    //         if(callback) {
    //             this.refreshForm();
    //         }
            
    //     })
    },
    watch : {
        dataPositionById : 'setDataPositionById'
    },
    methods : {
        
        modalComfirm() {
            if(this.$v.form.position_name.$invalid == false) {
                if(this.typeModal == 'create') {
                    // console.log('create');
                    this.$emit('modalComfirmCreatePosition',this.form)

                    this.$on('modalComfirmCreatePosition', (callback) => {

                        if(callback) {
                            this.refreshForm();
                        }
                        
                    })
                } else {
                    this.$emit('modalConfirmEditPosition',this.form)

                    this.$on('modalConfirmEditPosition', (callback) => {
                        // console.log('edit');
                        if(callback) {
                            this.refreshForm();
                        }
                        
                    })
                }
                

            } else {
                this.submitCreateStatus = 'ERROR';
            }
        },
        
        setDataPositionById(data) {
            // console.log(data);
            this.form.position_name = data.name;
        },

        refreshForm() {
            this.form = initForm()
        }
    }
}
</script>