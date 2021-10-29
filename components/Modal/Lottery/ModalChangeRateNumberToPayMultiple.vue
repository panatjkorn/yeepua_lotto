<template>
  <div>
    <!-- modal ปรับเรทราคาจ่าย -->
    <div
        id="modal-change-rate-to-pay-multiple"
        class="modal"
        tabindex="-1"
        aria-hidden="true"
        data-backdrop="static"
      >
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header text-xl">
            <b>ปรับราคาจ่าย</b>
          </div>
          <div class="modal-body py-5 px-8 overflow-y-auto h-screen">
            <div class="text-center py-5 px-5 border-2 border-gray-400 rounded-md">
              <div class="flex">
                <div class="flex-none w-18 mt-2 mr-2">
                  <p>เพิ่มตัวเลข : </p>
                </div>
                <div class="flex-grow">
                  <input v-model="numberLottery" type="number" placeholder="ระบุตัวเลข .... ?" class="form-control" @keyup.enter="addNumLottoToManage()">
                  <div v-if="submitCreateStatus == 'ERROR' && multiNumberLottery.length <= 0" class="text-red-500 text-xs">
                    กรุณาระบุเวลาปิดรับแทง
                  </div>
                </div>
                <div class="flex-none w-16">
                  <button class="btn bg-blue-500 text-white" @click="addNumLottoToManage()">เพิ่ม</button>
                </div>
                <div class="flex-none w-auto">
                  <button class="btn bg-green-500 text-white" @click="addNumberLottoAllToManage()">เลือกทุกเลข</button>
                </div>
                
              </div>
              <div v-if="multiNumberLottery.length > 0" class="grid grid-flow-row auto-rows-max grid-cols-6 mt-3 max-h-96 overflow-auto">
                <div v-for="(lotto,index) in multiNumberLottery" :key="index" class="bg-gray-200 text-black p-2 rounded-sm text-left flex items-center mr-2 mt-1">
                  {{ lotto }}
                  <svg @click="removeLottoToManage(index)" xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x-circle ml-auto cursor-pointer text-white bg-red-500 rounded-full">
                    <circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15">
                    </line>
                  </svg>
                </div>
              </div>
            </div>
            <div class="mt-3">
              <label for="">ลิมิตต่อเลข/บิล(บาท)</label>
              <input v-model="form.max_bet_per_bill_number" type="text" class="form-control">
              <div v-if="submitCreateStatus == 'ERROR' && !$v.form.max_bet_per_bill_number.required" class="text-red-500 text-xs">
                กรุณาระบุเวลาเปิดรับแทง
              </div>
            </div>
            <div class="mt-3">
              <div class="grid grid-flow-col grid-cols-2 gap-4">
                <div>
                  <input v-model="checkForPayStep" id="check-for-pay-step" type="checkbox" class="cursor-pointer w-5 h-5" @change="setCheckbox()">
                  <label for="check-for-pay-step">จ่ายแบบลำดับขั้น</label>
                </div>
                <div>
                  <input v-model="checkForPayFull" id="check-for-pay-full" type="checkbox" class="cursor-pointer w-5 h-5" @change="setCheckbox2()">
                  <label for="check-for-pay-full">จ่ายแบบเต็ม (ทุกยอดซื้อจ่ายเต็ม)</label>
                </div>
              </div>
            </div>
            <div class="mt-3 grid grid-flow-col grid-cols-3 gap-4">
              <!-- <pre>{{dropdownTemplate}}</pre> -->
              <select v-model="dd_template"  name="dd_template" id="dd_template" class="form-select form-select" 
                @change="getTemplateById()">
                <option value="">template</option>
                <option v-for="(template,index) in dropdownTemplate" :key="index" :value="template.id">{{ template.name }}</option>
              </select>
            </div>
            <div class="mt-3">
              <div v-if="checkForPayStep == true">
                <table class="table">
                  <thead>
                    <tr>
                      <th v-for="(col,index) in tbManagePayStep.columns" :key="index" class="border-b-2 dark:border-dark-5 whitespace-nowrap">
                          <b>{{ col.label }}</b>
                      </th>
                    </tr>
                  </thead>
                  <tbody v-if="tbManagePayStep.rows.length > 0">
                      <tr v-for="(data,index) in tbManagePayStep.rows" :key="index" class="border-b dark:border-dark-5">
                        <td>{{ index+1 }}</td>

                        <td>
                          <input v-model="tbManagePayStep.rows[index].initial_purchase" type="number" class="form-control" disabled>
                          <p v-if="data && data.statusCheckInitailPurchaseNotOk == true" class="text-red-500 text-sm">กรุณาระบุค่าให้ถูกต้อง</p>
                          <!-- <p v-if="
                            tbManagePayStep.rows[index] 
                            && tbManagePayStep.rows[index].initial_purchase < 0 
                            || tbManagePayStep.rows[index].initial_purchase == ''"
                            class="text-red-500 text-sm">กรุณากรอกข้อมูล
                          </p> -->
                        </td>

                        <td>
                          <input v-model="tbManagePayStep.rows[index].maximum_purchase" type="number" class="form-control" @input="setDefaultMinBetNextRow(index)">
                          <p v-if="data && data.statusCheckMaximumPurchaseNotOk == true" class="text-red-500 text-sm">กรุณาระบุค่าให้ถูกต้อง</p>
                          <p v-if="
                            tbManagePayStep.rows[index] 
                            && tbManagePayStep.rows[index].maximum_purchase < 0 
                            || tbManagePayStep.rows[index].maximum_purchase == ''"
                            class="text-red-500 text-sm">กรุณากรอกข้อมูล
                          </p>
                        </td>
                        
                        <td>
                          <input v-model="tbManagePayStep.rows[index].price_to_pay" type="number" class="form-control" @input="checkPriceToPay(index)">
                          <p v-if="data && data.statusCheckPriceToPayNotOk == true" class="text-red-500 text-sm">กรุณาระบุค่าให้ถูกต้อง</p>
                          <p v-if="
                            tbManagePayStep.rows[index] 
                            && tbManagePayStep.rows[index].price_to_pay < 0 
                            || tbManagePayStep.rows[index].price_to_pay == ''"
                            class="text-red-500 text-sm">กรุณากรอกข้อมูล
                          </p>
                        </td>
                        <td>
                          <button :disabled="index != tbManagePayStep.rows.length-1" class="btn bg-red-500 text-white" @click="deleteRowPayStep()">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                  </tbody>
                </table>
                <button
                class="btn bg-blue-400 text-white mt-2"
                @click="addRowPayStep()">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  เพิ่มลำดับขั้น
                </button>
              </div>
              <div v-if="checkForPayFull == true">
                <table class="table">
                  <thead>
                    <tr>
                      <th v-for="(col,index) in tbManagePayFull.columns" :key="index" class="border-b-2 dark:border-dark-5 whitespace-nowrap">
                          <b>{{ col.label }}</b>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                      <tr>
                        <td>1</td>
                        <td><input v-model="form.pay_ratio" type="text" class="form-control w-4/12"></td>
                      </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary w-24 mr-1 mb-2" data-dismiss="modal" @click="closeModalChageRatePriceMulti()">
              ยกเลิก
            </button>
            <button class="btn bg-blue-500 text-white" @click="submitEditChangeRatePriceStep()">บันทึก</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
const initForm = () => {
  return {
    is_fixed : '',
    pay_ratio : '',
    // status : false,
    max_bet : '',
    max_bet_per_bill_number : '',
    round_pay_ratio_id : ''
  }
};
import { required } from "vuelidate/lib/validators";
export default {
  props : ['dataMultiRoundPayRatio','dataNumberLottoAll','dropdownTemplate'],
  data() {
    return {
      switch_check : false,
      checkForPayStep : null,
      checkForPayFull : null,
      tbManagePayStep: {
        page: 1,
        columns: [
          { label: "ขั้นที่"},
          { label: "ยอดซื้อเริ่มต้น"},
          { label: "ยอดซื้อสูงสุด"},
          { label: "ราคาจ่าย (บาทละ)"},
          { label: "ลบ"},
        ],
        rows: [],
      },
      tbManagePayFull: {
        page: 1,
        columns: [
          { label: "ขั้นที่"},
          { label: "ราคาจ่าย (บาทละ)"},
        ],
        rows: [
          {
            step : 1,
            price_to_pay_full : 90
          }
        ],
      },
      statusCheckSubmit : [],
      multiNumberLottery : [],
      numberLottery : null,
      duplicateNumber : null,
      // max_bet_per_bill_number : '',
      submitCreateStatus : '',
      form : initForm(),
      betTypeId : '',
      dd_template : '',
    }
  },
  validations : {
    form : {
      max_bet_per_bill_number : {required}
    }
  },
  created() {
    // console.log(this.$route.query.bet_type_id);
    this.betTypeId = this.$route.query.bet_type_id;
    // this.checkForPayStep = true;
  },
  mounted() {
    this.$on('modalConfirmEditRateMultiNumber', (callback) => {

        if(callback) {
            this.refreshForm();
        }
        
    })
  },
  watch : {
    dataMultiRoundPayRatio : 'setDataMultiRoundPayRatio'
  },
  methods : {
    setDataMultiRoundPayRatio(data) {
      // console.log('data',data);

      this.form.is_fixed = data ? data.is_fixed : '';
      this.form.max_bet_per_bill_number = data ? data.max_bet_per_bill_number : '';
      this.form.pay_ratio = data ? data.pay_ratio : ''
      this.form.round_pay_ratio_id = data ? data.id : ''

      if(data.is_fixed == false) {
        //จ่ายลำดับขั้น
        this.checkForPayStep = true;
        this.checkForPayFull = null;
      } else {
        this.checkForPayStep = null;
        this.checkForPayFull = true;
      }

      this.tbManagePayStep.rows = data.step_limit.map((item) => {
        // console.log(item);
        return {
          initial_purchase: item ? item.min_reach : '',
          maximum_purchase: item ? item.max_reach : '',
          price_to_pay: item ? item.pay_ratio : '',
          statusCheckInitailPurchaseNotOk : false,
          statusCheckMaximumPurchaseNotOk : false,
          statusCheckPriceToPayNotOk : false,
        }
      })
    },
    setCheckbox() {
      this.checkForPayFull = null;
    },
    setCheckbox2() {
      this.checkForPayStep = null;
    },
    addRowPayStep() {
      let max_bet_row_max = this.tbManagePayStep.rows && this.tbManagePayStep.rows.length > 0 
        ? this.tbManagePayStep.rows[this.tbManagePayStep.rows.length-1].maximum_purchase : ''

      const _data = {
        step : this.tbManagePayStep.rows[this.tbManagePayStep.rows.length - 1].step + 1,
        initial_purchase : max_bet_row_max > 0 ? parseInt(max_bet_row_max)+1 : '',
        maximum_purchase : '',
        price_to_pay : '',
        statusCheckInitailPurchaseNotOk : false,
        statusCheckMaximumPurchaseNotOk : false,
        statusCheckPriceToPayNotOk : false,
      }
      this.tbManagePayStep.rows.push(_data);
    },
    deleteRowPayStep() {
      this.tbManagePayStep.rows.splice(this.tbManagePayStep.rows.length-1,1)
    },
    //เช็คยอดซื้อเริ่มต้นให้มากกว่ายอดซื้อสูงสุดของ row ที่ต่ำกว่า
    checkInitailPurchase(index) {

      let max_bet_now = this.tbManagePayStep.rows[index] && this.tbManagePayStep.rows[index].maximum_purchase
        ? parseInt(this.tbManagePayStep.rows[index].maximum_purchase) : 0;
      let max_bet_lows = this.tbManagePayStep.rows[index-1] && this.tbManagePayStep.rows[index-1].maximum_purchase
        ? parseInt(this.tbManagePayStep.rows[index-1].maximum_purchase) : 0;

      let min_bet_now = this.tbManagePayStep.rows[index] && this.tbManagePayStep.rows[index].initial_purchase
        ? parseInt(this.tbManagePayStep.rows[index].initial_purchase) : 0;
      let min_bet_next = this.tbManagePayStep.rows[index+1] && this.tbManagePayStep.rows[index+1].initial_purchase
        ? parseInt(this.tbManagePayStep.rows[index+1].initial_purchase) : 0;
      let min_bet_lows = this.tbManagePayStep.rows[index-1] && this.tbManagePayStep.rows[index-1].initial_purchase
        ? parseInt(this.tbManagePayStep.rows[index-1].initial_purchase) : 0;
      
      if(index == 0 ) {
        if(
          min_bet_now >= max_bet_now ||
          min_bet_now >= min_bet_next
        ) {
          this.tbManagePayStep.rows[index].statusCheckInitailPurchaseNotOk = true;
        } else {
          this.tbManagePayStep.rows[index].statusCheckInitailPurchaseNotOk = false;
        }
      } else {
        if(
          min_bet_now <= min_bet_lows ||
          min_bet_now <= max_bet_lows ||
          min_bet_now >= max_bet_now || 
          min_bet_now >= min_bet_next ||
          min_bet_now - max_bet_lows > 1
        ) {
          this.tbManagePayStep.rows[index].statusCheckInitailPurchaseNotOk = true;
        } else {
          this.tbManagePayStep.rows[index].statusCheckInitailPurchaseNotOk = false;
        }
      }

    },
    
    //เช็คยอดซื้่อสูงสุดให้มากกว่ายอดซื้อเริ่มต้นของแถวเดียวกัน
    checkMaximumPurchase(index) {

      let max_bet_now = this.tbManagePayStep.rows[index] && this.tbManagePayStep.rows[index].maximum_purchase
        ? parseInt(this.tbManagePayStep.rows[index].maximum_purchase) : 0;
      let max_bet_next = this.tbManagePayStep.rows[index+1] && this.tbManagePayStep.rows[index+1].maximum_purchase
        ? parseInt(this.tbManagePayStep.rows[index+1].maximum_purchase) : 0;
      let max_bet_lows = this.tbManagePayStep.rows[index-1] && this.tbManagePayStep.rows[index-1].maximum_purchase
        ? parseInt(this.tbManagePayStep.rows[index-1].maximum_purchase) : 0;

      let min_bet_now = this.tbManagePayStep.rows[index] && this.tbManagePayStep.rows[index].initial_purchase
        ? parseInt(this.tbManagePayStep.rows[index].initial_purchase) : 0;
      let min_bet_next = this.tbManagePayStep.rows[index+1] && this.tbManagePayStep.rows[index+1].initial_purchase
        ? parseInt(this.tbManagePayStep.rows[index+1].initial_purchase) : 0;

      if(index == 0) {
        //ตำแหน่งแรก
        if(
          max_bet_now >= max_bet_next || 
          max_bet_now <= min_bet_now || 
          max_bet_now >= min_bet_next ||
          min_bet_next - max_bet_now > 1
        ) {
          this.tbManagePayStep.rows[index].statusCheckMaximumPurchaseNotOk = true;
        } else {
          this.tbManagePayStep.rows[index].statusCheckMaximumPurchaseNotOk = false;
        }
      } else {
        if(
          max_bet_now <= max_bet_lows || 
          max_bet_now >= max_bet_next ||
          max_bet_now <= min_bet_now ||
          max_bet_now >= min_bet_next ||
          min_bet_next - max_bet_now > 1
        ) {
          this.tbManagePayStep.rows[index].statusCheckMaximumPurchaseNotOk = true;
        } else {
          this.tbManagePayStep.rows[index].statusCheckMaximumPurchaseNotOk = false;
        }
      }
      
      // if(parseInt(this.tbManagePayStep.rows[index].maximum_purchase) <= parseInt(this.tbManagePayStep.rows[index].initial_purchase)) {
      //   this.tbManagePayStep.rows[index].statusCheckMaximumPurchaseNotOk = true;
      // } else {
      //   this.tbManagePayStep.rows[index].statusCheckMaximumPurchaseNotOk = false;
      // }
    },

    //เช็คราคาจ่าย
    checkPriceToPay(index) {
      let numOfFirst = this.tbManagePayStep.rows && this.tbManagePayStep.rows[0] 
          ? parseInt(this.tbManagePayStep.rows[0].price_to_pay) : 0;
      let stepNow = this.tbManagePayStep.rows && this.tbManagePayStep.rows[index] 
          ? parseInt(this.tbManagePayStep.rows[index].price_to_pay) : 0;
      let stepBack = this.tbManagePayStep.rows && this.tbManagePayStep.rows[index-1] 
          ? parseInt(this.tbManagePayStep.rows[index-1].price_to_pay) : 0;
      let stepNext = this.tbManagePayStep.rows && this.tbManagePayStep.rows[index+1] 
          ? parseInt(this.tbManagePayStep.rows[index+1].price_to_pay) : 0;

      if(index == 0) {
          if(numOfFirst <= stepNext) {
            this.tbManagePayStep.rows[index].statusCheckPriceToPayNotOk  = true;
          } else {
            this.tbManagePayStep.rows[index].statusCheckPriceToPayNotOk  = false;
          }
      } else {
        
          if(index == this.tbManagePayStep.rows.length-1) {
            //แถวสุดท้าย
            if(stepNow >= stepBack) {
              this.tbManagePayStep.rows[index-1].statusCheckPriceToPayNotOk  = true;
            } else {
              this.tbManagePayStep.rows[index-1].statusCheckPriceToPayNotOk  = false;
              this.tbManagePayStep.rows[index].statusCheckPriceToPayNotOk  = false;
            }
          } else {

            if(stepNow >= stepBack) {
              this.tbManagePayStep.rows[index-1].statusCheckPriceToPayNotOk  = true;
            } else {
              this.tbManagePayStep.rows[index-1].statusCheckPriceToPayNotOk  = false;
            }

            if(stepNow <= stepNext) {
              this.tbManagePayStep.rows[index+1].statusCheckPriceToPayNotOk  = true;
            } else {
              this.tbManagePayStep.rows[index].statusCheckPriceToPayNotOk  = false;
              this.tbManagePayStep.rows[index+1].statusCheckPriceToPayNotOk  = false;
            }
          }
      }
  
  },
    // checkPriceToPay(index) {
    //   let numOfFirst = this.tbManagePayStep.rows && this.tbManagePayStep.rows[0] 
    //     ? parseInt(this.tbManagePayStep.rows[0].price_to_pay) : 0;
    //   let stepNow = this.tbManagePayStep.rows && this.tbManagePayStep.rows[index] 
    //     ? parseInt(this.tbManagePayStep.rows[index].price_to_pay) : 0;
    //   let stepBack = this.tbManagePayStep.rows && this.tbManagePayStep.rows[index-1] 
    //     ? parseInt(this.tbManagePayStep.rows[index-1].price_to_pay) : 0;
    //   let stepNext = this.tbManagePayStep.rows && this.tbManagePayStep.rows[index+1] 
    //     ? parseInt(this.tbManagePayStep.rows[index+1].price_to_pay) : 0;

    //   if(index == 0) {
    //     if(numOfFirst <= stepNext) {
    //       this.tbManagePayStep.rows[index].statusCheckPriceToPayNotOk  = true;
    //     } else {
    //       this.tbManagePayStep.rows[index].statusCheckPriceToPayNotOk  = false;
    //     }
    //   } else {
    //     if(stepNow >= stepBack || stepNow <= stepNext) {
    //       this.tbManagePayStep.rows[index].statusCheckPriceToPayNotOk  = true;
    //     } else {
    //       this.tbManagePayStep.rows[index].statusCheckPriceToPayNotOk  = false;
    //     }
    //   }
      
    // },
    async submitEditChangeRatePriceStep() {
      let statusSubmitInitail = [];
      let statusSubmitMaximum = [];
      let statusSubmitPriceToPay = [];
      this.statusCheckSubmit = [];

      for(var i = 0; i < this.tbManagePayStep.rows.length; i++) {
        if(this.tbManagePayStep.rows[i].statusCheckInitailPurchaseNotOk == true) {
          statusSubmitInitail.push(false);
        } else {
          statusSubmitInitail.push(true);
        }

        if(this.tbManagePayStep.rows[i].statusCheckMaximumPurchaseNotOk == true) {
          statusSubmitMaximum.push(false);
        } else {
          statusSubmitMaximum.push(true);
        }

        if(this.tbManagePayStep.rows[i].statusCheckPriceToPayNotOk == true) {
          statusSubmitPriceToPay.push(false);
        } else {
          statusSubmitPriceToPay.push(true);
        }

        //เช็คค่าว่างทั้งหมด
        if(this.tbManagePayStep.rows[i].initial_purchase > 0
        && this.tbManagePayStep.rows[i].maximum_purchase > 0
        && this.tbManagePayStep.rows[i].price_to_pay > 0) {
          this.statusCheckSubmit.push(true);
        } else {
          this.statusCheckSubmit.push(false);
        }
      }

      if(statusSubmitInitail.every((item) => item == true)
        && statusSubmitMaximum.every((item) => item == true)
        && statusSubmitPriceToPay.every((item) => item == true)
        && this.statusCheckSubmit.every((item) => item == true)) {

        if(this.multiNumberLottery.length > 0 && this.$v.form.max_bet_per_bill_number.$invalid == false) {

          const _dataStep = await this.tbManagePayStep.rows.map((item) => {
            // console.log(item);
            return {
              max_reach: item ? parseInt(item.maximum_purchase) : '',
              min_reach: item ? parseInt(item.initial_purchase) : '',
              pay_ratio: item ? parseInt(item.price_to_pay) : '',
            }
          })

          const _data = {
            is_fixed : this.checkForPayStep == true ? 0 : 1,
            step_limit : _dataStep.length > 0 ? _dataStep : null,
            pay_ratio : this.form.pay_ratio,
            max_bet : _dataStep.length > 0 ? _dataStep[_dataStep.length-1].max_reach : null,
            max_bet_per_bill_number : this.form.max_bet_per_bill_number,
            round_pay_ratio_id : this.form.round_pay_ratio_id,
            match_number_arr : this.multiNumberLottery
          }

          await this.$emit('modalConfirmEditRateMultiNumber',_data);
          this.closeModalChageRatePriceMulti();
        } else {
          this.submitCreateStatus = 'ERROR';
        }
      } else {
        // console.log('not ok');
        this.$toast.error('กรุณากรอกข้อมูลให้ครบถ้วน');
      }
    },
    addNumLottoToManage() {
      if(this.numberLottery != null && this.numberLottery != '') {
        if(this.multiNumberLottery.includes(this.numberLottery)) {
          // console.log('เลขซ้ำ');
          this.$toast.error('เลขซ้ำ');
        } else {
          // console.log('ไม่ซ้ำ');
          this.multiNumberLottery.push(this.numberLottery);
          this.numberLottery = '';
        }
        // this.multiNumberLottery.push(this.numberLottery);
      }
    },
    //ลบเลขที่ใช้ในการ manage แบบ multi
    removeLottoToManage(index) {
      this.multiNumberLottery.splice(index,1);
      let findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) != index)
      this.duplicateNumber = [...new Set(findDuplicates(this.multiNumberLottery))];
      // console.log('dup',this.duplicateNumber)
    },
    closeModalChageRatePriceMulti() {
      this.multiNumberLottery = [];
      this.numberLottery = null;
      this.form = initForm();
      this.submitCreateStatus = '';
      this.refreshForm();
    },

    setDefaultMinBetNextRow(index) {

      let max_bet_now = this.tbManagePayStep.rows[index] && this.tbManagePayStep.rows[index].maximum_purchase
        ? parseInt(this.tbManagePayStep.rows[index].maximum_purchase) : 0;
      let max_bet_next = this.tbManagePayStep.rows[index+1] && this.tbManagePayStep.rows[index+1].maximum_purchase
        ? parseInt(this.tbManagePayStep.rows[index+1].maximum_purchase) : 0;
      let max_bet_low = this.tbManagePayStep.rows[index-1] && this.tbManagePayStep.rows[index-1].maximum_purchase
        ? parseInt(this.tbManagePayStep.rows[index-1].maximum_purchase) : 0;
      let min_bet_now = this.tbManagePayStep.rows[index] && this.tbManagePayStep.rows[index].initial_purchase
        ? parseInt(this.tbManagePayStep.rows[index].initial_purchase) : 0;

      //เพิ่มเลขต่ำสุดใน row ถัดไป
      if(index != this.tbManagePayStep.rows.length-1) {
        this.tbManagePayStep.rows[index+1].initial_purchase = parseInt(max_bet_now)+1;
      }

      if(index == 0) {
        if(this.tbManagePayStep.rows.length > 1) { 

          if(max_bet_now >= max_bet_next) {
            this.tbManagePayStep.rows[index+1].statusCheckMaximumPurchaseNotOk = true;
          } else {
            this.tbManagePayStep.rows[index+1].statusCheckMaximumPurchaseNotOk = false;
          }

          if(max_bet_now <= min_bet_now) {
            this.tbManagePayStep.rows[index].statusCheckMaximumPurchaseNotOk = true;
          } else {
            this.tbManagePayStep.rows[index].statusCheckMaximumPurchaseNotOk = false;
          }

        } else {
          //แถวแรก
          if(max_bet_now <= min_bet_now) {
            this.tbManagePayStep.rows[index].statusCheckMaximumPurchaseNotOk = true;
          } else {
            this.tbManagePayStep.rows[index].statusCheckMaximumPurchaseNotOk = false;
          }
        }

      } else {

        if(index != this.tbManagePayStep.rows.length-1) {

          this.tbManagePayStep.rows[index+1].initial_purchase = parseInt(max_bet_now)+1;

          if(max_bet_now >= max_bet_next) {

            this.tbManagePayStep.rows[index+1].statusCheckMaximumPurchaseNotOk = true;
          } else {
            this.tbManagePayStep.rows[index].statusCheckMaximumPurchaseNotOk = false;
            this.tbManagePayStep.rows[index+1].statusCheckMaximumPurchaseNotOk = false;
          }

          if(max_bet_now <= max_bet_low || max_bet_now <= max_bet_low+1) {
            this.tbManagePayStep.rows[index].statusCheckMaximumPurchaseNotOk = true;
          } else {
            this.tbManagePayStep.rows[index].statusCheckMaximumPurchaseNotOk = false;
          }

        } else {

          if(max_bet_now <= max_bet_low || max_bet_now <= max_bet_low+1) {
            this.tbManagePayStep.rows[index].statusCheckMaximumPurchaseNotOk = true;
          } else {
            this.tbManagePayStep.rows[index].statusCheckMaximumPurchaseNotOk = false;
          }
        }

      }
    },

    addNumberLottoAllToManage() {
      // console.log(this.dataNumberLottoAll.data.data.round_numbers);
      this.multiNumberLottery = [];
      let arrayNumber = this.dataNumberLottoAll.data.data ? this.dataNumberLottoAll.data.data.round_numbers : ''
      for(let i = 0; i < arrayNumber.length; i++) {
        // console.log(arrayNumber[i].number);
        this.multiNumberLottery.push(arrayNumber[i].number);
      }
      // multiNumberLottery = arrayNumber
      
    },

    async getTemplateById() {
      // console.log(this.dd_template);
      if(this.dd_template > 0) {
        const url = `admin_manage_template/${this.dd_template}`;
      
        try {
          const getDataTemplateById = await this.$axios.get(url);
          // console.log('getDataTemplateById',getDataTemplateById);
          this.templateById = await getDataTemplateById.data.data;
          this.setDataTemplateChange();
        } catch(err) {
          console.log(err);
        }
      } else {
        this.tbManagePayStep.rows = [];
        this.form.max_bet_per_bill_number = '';
        this.form.pay_ratio = '';
      }
      
    },

    setDataTemplateChange() {
      // console.log(this.templateById);
      this.tbManagePayStep.rows = [];
      if(this.templateById.is_fixed == false) {
        this.checkForPayStep = true;
        this.checkForPayFull = null;
      } else {
        this.checkForPayStep = null;
        this.checkForPayFull = true;
      }

      this.form.max_bet_per_bill_number = this.templateById ? this.templateById.max_bet_per_bill_number : 0;
      // this.form.status = data ? data.status : false;
      // this.form.round_number_ID = data ? data.id : '';
      this.form.pay_ratio = this.templateById ? this.templateById.pay_ratio : '';
      // this.form.max_bet = data ? data.max_bet : '';
      this.tbManagePayStep.rows = this.templateById.step_limit.map((item) => {
        // console.log(item);
        return {
          initial_purchase : item ? item.min_reach : '',
          maximum_purchase : item ? item.max_reach : '',
          price_to_pay : item ? item.pay_ratio : ''
        }
      })
    },

    refreshForm() {
      this.dd_template = '';
    }
  }
}
</script>
