<template>
    <div>
        <!-- หวยรัฐบาล -->
        <div
            id="modal-manage-result-lottery-share-blueswan"
            class="modal"
            tabindex="-1"
            aria-hidden="true"
            data-backdrop="static"
        >
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header text-lg">
                        <b>จัดการผลรางวัล</b>
                        <div class="flex">
                            <svg v-if="statusLoading == true" width="20" viewBox="0 0 57 57" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 ml-2">
                                <g fill="none" fill-rule="evenodd"><g transform="translate(1 1)"><circle cx="5" cy="50" r="5" fill="#2d3748">
                                <animate attributeName="cy" begin="0s" dur="2.2s" values="50;5;50;50" calcMode="linear" repeatCount="indefinite">
                                </animate><animate attributeName="cx" begin="0s" dur="2.2s" values="5;27;49;5" calcMode="linear" repeatCount="indefinite"></animate>
                                </circle><circle cx="27" cy="5" r="5" fill="#2d3748"><animate attributeName="cy" begin="0s" dur="2.2s" from="5" to="5" values="5;50;50;5" calcMode="linear" repeatCount="indefinite">
                                    </animate><animate attributeName="cx" begin="0s" dur="2.2s" from="27" to="27" values="27;49;5;27" calcMode="linear" repeatCount="indefinite">
                                    </animate></circle><circle cx="49" cy="50" r="5" fill="#2d3748"><animate attributeName="cy" begin="0s" dur="2.2s" values="50;50;5;50" calcMode="linear" repeatCount="indefinite">
                                    </animate><animate attributeName="cx" from="49" to="49" begin="0s" dur="2.2s" values="49;5;27;49" calcMode="linear" repeatCount="indefinite"></animate></circle></g></g>
                            </svg>
                        </div>
                    </div>
                    <div class="modal-body py-5 px-10 overflow-y-auto h-auto">
                        <!-- หวยรัฐบาล -->
                        <div>
                            <div class="mt-2">
                                <label for="" >
                                    <b>รางวัลที่ 1 : </b>
                                </label>
                                <div 
                                    class="grid grid-flow-row auto-rows-max md:grid-cols-4 mt-2">
                                        <div class="mr-2 mt-2">
                                            <input v-model="dataFormShareBlueswan" type="number" class="form-control" @input="validateFirstPrize">
                                            <div>
                                                <span v-if="statusValidate == true" class="text-red-500">กรุณากรอกข้อมูลให้ถูกต้อง</span>
                                                <span 
                                                v-if="statusSubmitForm == 'ERROR' && !$v.dataFormShareBlueswan.required"
                                                class="text-red-500">กรุณากรอกข้อมูลให้ถูกต้อง</span>
                                            </div>
                                        </div>
                                </div>
                            </div>
                        </div>
                    </div>
                <div class="modal-footer">
                    <button class="btn bg-green-500 text-white mr-1" @click="getResultLotteryShare()">ดึงข้อมูลหวย</button>
                    <button class="btn btn-secondary w-24 mr-1 mb-2" data-dismiss="modal" @click="closeModalManageResultShare()">
                    ปิด
                    </button>
                    <button class="btn bg-blue-500 text-white w-24 mr-1 mb-2" @click="confirmManageResultLottoShare()">
                    บันทึก
                    </button>
                </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { required } from "vuelidate/lib/validators";
export default {
    props : ['dataShareLotto','statusLoading'],
    data() {
        return {
            dataFormShareBlueswan : '',
            statusValidate : false,
            statusSubmitForm : ''
        }
    },
    validations : {
        dataFormShareBlueswan : {required}
    },
    watch : {
        dataShareLotto : 'setDataShareBlueswan'
    },
    mounted() {
        this.$on('confirmManageResultLottoShare', (callback) => {

            if(callback) {
                this.refreshForm();
            }
            
        })
    },
    methods : {
        getResultLotteryShare() {
            this.$emit('getResultLotteryShare');
        },
        setDataShareBlueswan(data_form) {
            this.dataFormShareBlueswan = data_form ? data_form.number : '';
        },
        confirmManageResultLottoShare() {
            if(this.statusValidate == false && this.$v.dataFormShareBlueswan.$invalid == false) {
                this.$emit('confirmManageResultLottoShare',this.dataFormShareBlueswan);
            } else {
                this.statusSubmitForm = 'ERROR';
            }
        },
        validateFirstPrize() {
            if(this.dataFormShareBlueswan.length != 4) {
                this.statusValidate = true;
            } else {
                this.statusValidate = false;
            }
        },
        closeModalManageResultShare() {
            this.dataFormShareBlueswan = '';
            this.statusValidate = false;
            this.statusSubmitForm = '';
        },

        refreshForm() {
            this.dataFormShareBlueswan = ''
        }
    }
}
</script>