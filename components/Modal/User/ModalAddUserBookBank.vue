<template>
<!-- modal add user bookbank -->
    <div>
        <div
            id="modal-add-user-book-bank"
            class="modal overflow-auto max-h-screen"
            tabindex="-1"
            aria-hidden="true"
            data-backdrop="static"
        >
            <div class="modal-dialog modal-xl ">
                <div class="modal-content">
                <div class="modal-header">
                    <b>เพิ่มบัญชีธนาคาร</b>
                </div>
                <div class="modal-body px-14">
                    <div class="grid justify-self-center p-5 lg:px-24">
                        <div>
                            <label for="" class="mt-2 mr-2 col-span-1"><b>ธนาคาร :</b></label>
                            <div class="lg:grid md:grid-flow-col grid-cols-6 mt-3">
                                <select v-model="form.bank_id" class="input form-control input--sm border col-span-5">
                                    <option value="">เลือกบัญชีธนาคาร</option>
                                    <option v-for="bank in dataBanks" :key="bank.id" :value="bank.id">{{ bank.name }}</option>
                                </select>
                            </div>
                            <div v-if="submitCreateStatus == 'ERROR' && !$v.form.bank_id.required" class="text-red-500 text-xs">
                                กรุณาเลือกบัญชีธนาคาร
                            </div>

                            <div class="mt-3">
                                <label for="" class="mt-5 mr-2 col-span-1 "><b>ชื่อบัญชี :</b></label>
                                <div class="lg:grid md:grid-flow-col grid-cols-6">
                                    <input v-model="form.bank_name" class="form-control form-control-sm mt-2 col-span-5" type="text">
                                </div>
                                <div v-if="submitCreateStatus == 'ERROR' && !$v.form.bank_name.required" class="text-red-500 text-xs">
                                    กรุณากรอกชื่อบัญชี
                                </div>
                            </div>

                            <div class="mt-3">
                                <label for="" class="mt-5 mr-2 col-span-1"><b>เลขบัญชี :</b></label>
                                <div class="lg:grid md:grid-flow-col grid-cols-6">
                                    <input v-model="form.bank_number" class="form-control form-control-sm mt-2 col-span-5" type="text">
                                </div>
                                <div v-if="submitCreateStatus == 'ERROR' && !$v.form.bank_number.required" class="text-red-500 text-xs">
                                    กรุณากรอกเลขบัญชีธนาคาร
                                </div>
                            </div>

                            
                        </div>
                    </div>
                </div>
                <div class="modal-footer text-center">
                    <button class="btn btn-secondary w-24 mr-1 mb-2" data-dismiss="modal" @click="refreshForm()">
                    ปิด
                    </button>
                    <button class="btn bg-green-500 text-white" @click="confirmAddBookBank()">บันทึก</button>
                </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { required } from "vuelidate/lib/validators";
const initForm = () => {
  return {
    bank_id : '',
    bank_name : '',
    bank_number : ''
  };
};
export default {
    props : ['dataBanks'],
    data() {
        return {
            // form : {
            //     bank_id : '',
            //     bank_name : '',
            //     bank_number : ''
            // },
            form : initForm(),
            submitCreateStatus : ''
        }
    },
    validations : {
        form : {
            bank_id : {required},
            bank_name : {required},
            bank_number : {required},
        }
    },
    mounted() {
        this.$on('confirmAddBookbank', (callback) => {

            if(callback) {
                this.refreshForm();
            }
            
        })
    },
    methods : {
        refreshForm() {
            this.form = initForm();
            this.submitCreateStatus = '';       
        },

        confirmAddBookBank() {

            if(
                this.$v.form.bank_id.$invalid == false &&
                this.$v.form.bank_name.$invalid == false &&
                this.$v.form.bank_number.$invalid == false
            ) {
                this.$emit('confirmAddBookbank',this.form)

            } else {
                this.submitCreateStatus = 'ERROR';
            }
        }
    }
}
</script>