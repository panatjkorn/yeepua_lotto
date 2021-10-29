<template>
  <div>
    <!-- จัดการผลออกรางวัล หวยใต้ดิน หวยออมสิน หวยธกส -->
    <div
        id="modal-manage-result-lottery"
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
            <div v-if="lotteryTypeId == 1" class="flex items-center">
              <div class="flex-none w-36">
                <b>3 ตัวหน้า : </b>
              </div>
              <div class="flex-grow">
                <div class="flex">
                  <div>
                    <input 
                      v-model="form.first_three_prize1" 
                      type="text" 
                      placeholder="ระบุตัวเลข" 
                      class="form-control w-auto mr-2"
                    @input="checkValidateFirstThreePrize1()">
                    <div v-if="submitCreateStatus == 'ERROR' && !$v.form.first_three_prize1.required" class="text-red-500 text-xs">
                      กรุณากรอกเลข 3 ตัวหน้า
                    </div>
                    <div v-if="validateFirstThreePrize1 == true" class="text-red-500 text-xs">
                      กรุณากรอกข้อมูลให้ถูกต้อง
                    </div>
                  </div>
                  <div>
                    <input 
                    v-model="form.first_three_prize2" 
                    type="text" 
                    placeholder="ระบุตัวเลข" 
                    class="form-control w-auto"
                    @input="checkValidateFirstThreePrize2()"
                  >
                    <div v-if="submitCreateStatus == 'ERROR' && !$v.form.first_three_prize2.required" class="text-red-500 text-xs">
                      กรุณากรอกเลข 3 ตัวหน้า
                    </div>
                    <div v-if="validateFirstThreePrize2 == true" class="text-red-500 text-xs">
                      กรุณากรอกข้อมูลให้ถูกต้อง
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="lotteryTypeId == 1" class="flex items-center mt-4">
              <div class="flex-none w-36">
                <b>3 ตัวท้าย : </b>
              </div>
              <div class="flex-grow">
                <div class="flex">
                  <div>
                    <input 
                    v-model="form.last_three_prize1" 
                    type="text" placeholder="ระบุตัวเลข" 
                    class="form-control w-auto mr-2"
                    @input="checkValidateLastThreePrize1()"
                  >
                    <div v-if="submitCreateStatus == 'ERROR' && !$v.form.last_three_prize1.required" class="text-red-500 text-xs">
                      กรุณากรอกเลข 3 ตัวท้าย
                    </div>
                    <div v-if="validateLastThreePrize1 == true" class="text-red-500 text-xs">
                      กรุณากรอกข้อมูลให้ถูกต้อง
                    </div>
                  </div>

                  <div>
                    <input 
                    v-model="form.last_three_prize2" 
                    type="text" 
                    placeholder="ระบุตัวเลข" 
                    class="form-control w-auto"
                    @input="checkValidateLastThreePrize2()"
                    >
                    <div v-if="submitCreateStatus == 'ERROR' && !$v.form.last_three_prize2.required" class="text-red-500 text-xs">
                      กรุณากรอกเลข 3 ตัวท้าย
                    </div>
                    <div v-if="validateLastThreePrize2 == true" class="text-red-500 text-xs">
                      กรุณากรอกข้อมูลให้ถูกต้อง
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="lotteryTypeId == 1" class="flex items-center mt-4">
              <div class="flex-none w-36">
                <b>2 ตัวล่าง : </b>
              </div>
              <div class="flex-grow">
                <div class="flex">
                  <div>
                    <input 
                      v-model="form.last_two_prize" 
                      type="text" 
                      placeholder="ระบุตัวเลข" 
                      class="form-control w-auto mr-2"
                      @input="checkValidateLastTwoNum()"
                    >
                    <div v-if="validateLastTwoPrize == true" class="text-red-500 text-xs">
                      กรุณากรอกข้อมูลให้ถูกต้อง
                    </div>
                    <div v-if="submitCreateStatus == 'ERROR' && !$v.form.last_two_prize.required" class="text-red-500 text-xs">
                      กรุณากรอกเลข 2 ตัวล่าง
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex items-center mt-4">
              <div class="flex-none w-36">
                <b>{{lotteryTypeId == 1 || lotteryTypeId == 2 ? '6 ตัวรางวัลที่ 1 :' : '7 ตัวรางวัลที่ 1'}} </b>
              </div>
              <div class="flex-grow">
                <div class="flex">
                  <div>
                    <input v-model="form.first_prize" type="text" placeholder="ระบุตัวเลข" class="form-control w-auto mr-2" 
                      @input="checkFirstPrizeNumber()">
                    <div v-if="submitCreateStatus == 'ERROR' && !$v.form.first_prize.required" class="text-red-500 text-xs">
                      กรุณากรอกเลขรางวัลที่ 1
                    </div>
                    <!-- หวย ธกส -->
                    <div v-if="statusCheckNumberFirstPrize == 'ERROR'" class="text-red-500 text-xs">
                      {{ msgErrorCheckNumberFirstPrize }}
                    </div>
                  </div>
                  <!-- รางวัลที่ 1 เบอร์ที่ 2 ของออมสิน -->
                  <div v-if="lotteryTypeId == 2">
                    <input v-model="form.first_prize2" type="text" placeholder="ระบุตัวเลข" class="form-control w-auto mr-2"
                    @input="checkFirstPrizeNumber()">
                    <div v-if="submitCreateStatus == 'ERROR' && !$v.form.first_prize2.required" class="text-red-500 text-xs">
                      กรุณากรอกเลขรางวัลที่ 1
                    </div>
                    <div v-if="statusCheckNumberFirstPrize2 == 'ERROR'" class="text-red-500 text-xs">
                      {{ msgErrorCheckNumberFirstPrize2 }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn bg-green-500 text-white mr-1" @click="getResultLottory()">ดึงข้อมูลหวย</button>
            <button class="btn btn-secondary w-24 mr-1 mb-2" data-dismiss="modal">
              ปิด
            </button>
            <button class="btn bg-blue-500 text-white w-24 mr-1 mb-2" @click="submitManageResultLottery()">
              บันทึก
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// const initForm = () => {
//   return {
//     first_prize : null,
//     first_prize2 : null,
//     first_three_prize1 : null,
//     first_three_prize2 : null,
//     last_three_prize1 : null,
//     last_three_prize2 : null,
//     last_two_prize : null,
//   };
// };
import { required } from "vuelidate/lib/validators";
export default {
  props : ['lotteryTypeId','resultLotto','setFormManageResultLottery','statusLoading'],
  data() {
    return {
      form : '',
      submitCreateStatus : '',
      statusCheckNumberFirstPrize : null,
      msgErrorCheckNumberFirstPrize : null,
      statusCheckNumberFirstPrize2 : null, //status check รางวัลที่ 1 ออมสิน
      msgErrorCheckNumberFirstPrize2 : null,
      validateLastTwoPrize : false,
      validateFirstThreePrize1 : false,
      validateFirstThreePrize2 : false,
      validateLastThreePrize1 : false,
      validateLastThreePrize2 : false
    }
  },
  validations : {
    form : {
      first_prize  : { required },
      first_prize2 : { required },
      first_three_prize1  : { required },
      first_three_prize2  : { required },
      last_three_prize1  : { required },
      last_three_prize2  : { required },
      last_two_prize  : { required },
    }
  },
  mounted() {
    // this.$on('confirmManageResultLotto', () => {
    //   this.resetForm();
    // })
    // this.$on('confirmManageResultLottoGsb', () => {
    //   this.resetForm();
    // })
    // this.$on('confirmManageResultLotto', () => {
    //   this.resetForm();
    // })
  },
  watch : {
    setFormManageResultLottery : 'setFormManageResultLotto',
    resultLotto : 'setDataResultLotto',
  },
  methods : {
    submitManageResultLottery() {
      if(this.lotteryTypeId == 1) {
        this.confirmManageResultLottery();
      } else if(this.lotteryTypeId == 2) {
        this.confirmManageResultLottoGsb();
      } else if(this.lotteryTypeId == 3) {
        this.confirmManageResultLottoBaac();
      }
    },
    //หวยรัฐบาล
    async confirmManageResultLottery() {
      if (
        this.$v.form.first_prize.$invalid == false
        && this.$v.form.first_three_prize1.$invalid == false
        && this.$v.form.first_three_prize2.$invalid == false
        && this.$v.form.last_three_prize1.$invalid == false
        && this.$v.form.last_three_prize2.$invalid == false
        && this.$v.form.last_two_prize.$invalid == false
        && this.statusCheckNumberFirstPrize != 'ERROR'
        && this.validateLastTwoPrize == false
        && this.validateFirstThreePrize1 == false
        && this.validateFirstThreePrize2 == false
        && this.validateLastThreePrize1 == false
        && this.validateLastThreePrize2 == false
      ) {
        this.$emit('confirmManageResultLotto', this.form)
      } else {
        this.submitCreateStatus = 'ERROR';
      }
    },
    //หวยออมสิน
    async confirmManageResultLottoGsb() {
      if (
        this.$v.form.first_prize.$invalid == false 
        && this.$v.form.first_prize2.$invalid == false
        && this.statusCheckNumberFirstPrize != 'ERROR'
        && this.statusCheckNumberFirstPrize2 != 'ERROR'
      ) {
        this.$emit('confirmManageResultLottoGsb', this.form);
      } else {
        this.submitCreateStatus = 'ERROR';
      }
    },
    //หวย ธกส
    async confirmManageResultLottoBaac() {
      if (
        this.$v.form.first_prize.$invalid == false  && this.statusCheckNumberFirstPrize != 'ERROR'
      ) {
        this.$emit('confirmManageResultLottoBaac', this.form);
      } else {
        this.submitCreateStatus = 'ERROR';
      }
    },
    //เช็ค validate รางวัลที่ 1
    checkFirstPrizeNumber() {
      if(this.lotteryTypeId == 1) {

        if(this.form.first_prize != null && this.form.first_prize.length != 6) {
          this.statusCheckNumberFirstPrize = 'ERROR';
          this.msgErrorCheckNumberFirstPrize = 'กรุณากรอกเลข 6 ตัว'
        } else {
          this.statusCheckNumberFirstPrize = null;
          this.msgErrorCheckNumberFirstPrize = null;
        }

      } else if(this.lotteryTypeId == 2) {

        if(this.form.first_prize != null && this.form.first_prize.length != 6) {
          this.statusCheckNumberFirstPrize = 'ERROR';
          this.msgErrorCheckNumberFirstPrize = 'กรุณากรอกเลข 6 ตัว'
        } else {
          this.statusCheckNumberFirstPrize = null;
          this.msgErrorCheckNumberFirstPrize = null;
        }

        if(this.form.first_prize2 != null && this.form.first_prize2.length != 6) {
          this.statusCheckNumberFirstPrize2 = 'ERROR';
          this.msgErrorCheckNumberFirstPrize2 = 'กรุณากรอกเลข 6 ตัว'
        } else {
          this.statusCheckNumberFirstPrize2 = null;
          this.msgErrorCheckNumberFirstPrize2 = null;
        }

      } else if(this.lotteryTypeId == 3) {
        if(this.form.first_prize.length != 7) {
          this.statusCheckNumberFirstPrize = 'ERROR';
          this.msgErrorCheckNumberFirstPrize = 'กรุณากรอกเลข 7 ตัว'
        } else {
          this.statusCheckNumberFirstPrize = null;
          this.msgErrorCheckNumberFirstPrize = null;
        }
      }
    },
    // resetForm() {
    //   this.form = ''
    //   this.submitCreateStatus = null;
    // },
    //ดึงข้อมูลผลหวย
    getResultLottory() {
      this.$emit('getResultLottory');
    },
    setDataResultLotto(data) {
      // console.log(data);

      if(this.lotteryTypeId == 1) {
        //หวยใต้ดิน
        this.form.first_prize = data.first ? data.first[0] : '';
        this.form.first_three_prize1 = data.last3f ? data.last3f[0] : '';
        this.form.first_three_prize2 = data.last3f ? data.last3f[1] : '';
        this.form.last_three_prize1 = data.last3b ? data.last3b[0] : '';
        this.form.last_three_prize2 = data.last3b ? data.last3b[1] : '';
        this.form.last_two_prize = data.last2 ? data.last2[0] : '';

        this.checkFirstPrizeNumber();
        this.checkValidateLastTwoNum();
        this.checkValidateFirstThreePrize1();
        this.checkValidateFirstThreePrize2();
        this.checkValidateLastThreePrize1();
        this.checkValidateLastThreePrize2();

      } else if(this.lotteryTypeId == 2) {
        //หวยออมสิน
        this.form.first_prize = data.number ? data.number[0] : ''
        this.form.first_prize2 = data.number ? data.number[1] : ''

        this.checkFirstPrizeNumber();

      } else if(this.lotteryTypeId == 3) {
        //หวยธกส
        this.form.first_prize = data.number ? data.number : ''
      }
      
    },

    setFormManageResultLotto(data) {
      this.form = data;
      this.submitCreateStatus = '';
      this.statusCheckNumberFirstPrize = null;
      this.msgErrorCheckNumberFirstPrize = null,
      this.statusCheckNumberFirstPrize2 = null, //status check รางวัลที่ 1 ออมสิน
      this.msgErrorCheckNumberFirstPrize2 = null,
      this.validateLastTwoPrize = false
      this.validateFirstThreePrize1 = false;
      this.validateLastThreePrize1 = false;
      this.validateLastThreePrize2 = false;
      
    },

    //check validate 2 ตัว
    checkValidateLastTwoNum() {
      if(this.lotteryTypeId == 1) {
        // ใต้ดิน
        if(this.form.last_two_prize.length != 2) {
          this.validateLastTwoPrize = true;
        } else {
          this.validateLastTwoPrize = false;
        }
      }
    },
    //check validate 3 ตัวหน้าเลข 1
    checkValidateFirstThreePrize1() {
      if(this.form.first_three_prize1.length != 3) {
        this.validateFirstThreePrize1 = true;
      } else {
        this.validateFirstThreePrize1 = false;
      }
    },

    checkValidateFirstThreePrize2() {
      if(this.form.first_three_prize2.length != 3) {
        this.validateFirstThreePrize2 = true;
      } else {
        this.validateFirstThreePrize2 = false;
      }
    },

    checkValidateLastThreePrize1() {
      if(this.form.last_three_prize1.length != 3) {
        this.validateLastThreePrize1 = true;
      } else {
        this.validateLastThreePrize1 = false;
      }
    },

    checkValidateLastThreePrize2() {
      if(this.form.last_three_prize2.length != 3) {
        this.validateLastThreePrize2 = true;
      } else {
        this.validateLastThreePrize2 = false;
      }
    }
  }
}
</script>
