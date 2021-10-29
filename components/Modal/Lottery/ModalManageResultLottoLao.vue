<template>
  <div>
    <!-- จัดการผลออกรางวัล หวยลาว -->
    <div
        id="modal-manage-result-lottery-lao"
        class="modal"
        tabindex="-1"
        aria-hidden="true"
        data-backdrop="static"
      >
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header text-lg">
            <b>จัดการผลรางวัล</b>
            <!-- loading -->
            <div class="flex">
              <svg v-if="statusLoading" width="20" viewBox="0 0 57 57" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 ml-2">
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
            <!-- หวยลาว -->
            <div class="flex items-center">
              <div class="flex-none w-36">
                <b>รางวัลที่ 1 (4ตัว) : </b>
              </div>
              <div class="flex-grow">
                <div class="flex">
                  <div>
                    <input 
                      v-model="form.first_prize" 
                      type="text" 
                      placeholder="ระบุตัวเลข" 
                      class="form-control w-auto mr-2"
                      @input="checkFirstPrize()">
                      <div v-if="validateFirstPrize == true" class="text-red-500 text-xs">
                        กรุณากรอกข้อมูลให้ถูกต้อง
                    </div>
                    <div v-if="submitCreateStatus == 'ERROR' && !$v.form.first_prize.required" class="text-red-500 text-xs">
                      กรุณากรอกข้อมูล
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn bg-green-500 text-white mr-1" @click="getResultLottoLao()">ดึงข้อมูลหวย</button>
            <button class="btn btn-secondary w-24 mr-1 mb-2" data-dismiss="modal" @click="refreshForm()">
              ปิด
            </button>
            <button class="btn bg-blue-500 text-white w-24 mr-1 mb-2" @click="modalComfirmManageLottoLao()">
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
    props : ['setInitFormLottoLao','resultLottoLao','statusLoading'],
    data() {
        return {
            form : {
                first_prize : '',
            },
            validateFirstPrize : false,
            submitCreateStatus : ''
        }
    },
    validations : {
        form : {
            first_prize  : { required },
        }
    },
    mounted() {

    },
    watch : {
        setInitFormLottoLao : 'setInitForm',
        resultLottoLao : 'setResultLottoLao'
    },
    methods : {
        setInitForm(data) {
            this.form.first_prize = data.first_prize;
            this.submitCreateStatus = '';
            this.validateFirstPrize = false;
        },

        refreshForm() {
            this.form.first_prize = '';
            // this.form.last_two_prize = '';
            this.submitCreateStatus = '';
            this.validateFirstPrize = false;
        },

        modalComfirmManageLottoLao() {
            if(
                this.$v.form.first_prize.$invalid == false && 
                this.validateFirstPrize == false
            ) {
                this.$emit('confirmManageResultLottoLao',this.form);
            } else {
                this.submitCreateStatus = 'ERROR';
            }
        },

        checkFirstPrize() {
            if(this.form.first_prize.length != 4) {
                this.validateFirstPrize = true;
            } else {
                this.validateFirstPrize = false;
            }
        },

        getResultLottoLao() {
          this.$emit('getResultLottoLao');
        },

        setResultLottoLao(data) {
          // console.log('data',data);
          this.form.first_prize = data.number;
        }
    }
}
</script>
