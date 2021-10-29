<template>
  <div>
    <!-- modal สร้างTemplate -->
    <div
        id="modal-edit-template"
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
            <div class="bg-blue-300 text-center py-5 px-5">
              <div class="grid justify-center">
                <span class="pt-2 mr-2 p-2"><b>เลือก Type หวย : </b></span>
                <select v-model="form.bet_type" class="form-control-sm">
                    <option value=""></option>
                    <option v-for="(bet,index) in dataBetTypes" :key="index" :value="bet.id">{{bet.name}}</option>
                </select>
                <div v-if="submitCreateStatus == 'ERROR' && !$v.form.bet_type.required" class="text-red-500 text-xs mt-1">
                  กรุณากรอก type หวย
                </div>
              </div>
              
            </div>
            <div class="mt-3">
              <label for="">ชื่อ Template</label>
              <input v-model="form.template_name" type="text" class="form-control">
              <div v-if="submitCreateStatus == 'ERROR' && !$v.form.template_name.required" class="text-red-500 text-xs mt-1">
                กรุณากรอกชื่อ Template
              </div>
            </div>
            <div class="mt-3">
              <label for="">ลิมิตต่อเลข/บิล(บาท)</label>
              <input v-model="form.max_bet_per_bill_number" type="text" class="form-control">
              <div v-if="submitCreateStatus == 'ERROR' && !$v.form.max_bet_per_bill_number.required" class="text-red-500 text-xs mt-1">
                  กรุณากรอกลิมิตต่อเลข/บิล(บาท)
                </div>
            </div>
            <div class="mt-3">
              <div class="grid grid-flow-col grid-cols-2 gap-4">
                <div>
                  <input v-model="checkForPayStep" id="check-for-pay-step" type="checkbox" class="cursor-pointer w-5 h-5" @change="setCheckbox()">
                  <label for="check-for-pay-step">จ่ายแบบลำดับขั้น</label>
                </div>
                <!-- <div>
                  <input v-model="checkForPayFull" id="check-for-pay-full" type="checkbox" class="cursor-pointer w-5 h-5" @change="setCheckbox2()">
                  <label for="check-for-pay-full">จ่ายแบบเต็ม (ทุกยอดซื้อจ่ายเต็ม)</label>
                </div> -->
              </div>
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
                          <button v-if="index != 0" :disabled="index != tbManagePayStep.rows.length-1" class="btn bg-red-500 text-white" @click="deleteRowPayStep()">
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
              <!-- จ่ายเต็ม -->
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
                        <td>
                          <input v-model="form.pay_ratio" type="text" class="form-control w-4/12">
                        </td>
                      </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary w-24 mr-1 mb-2" data-dismiss="modal" @click="refreshForm()">
              ยกเลิก
            </button>
            <button class="btn bg-blue-500 text-white" @click="confirmEditTemplate()">แก้ไข</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { required } from "vuelidate/lib/validators";

export default {
    props : ['formCreate','dataBetTypes'],
    data() {
        return {
            checkForPayStep : true,
            checkForPayFull : false,
            tbManagePayStep: {
                page: 1,
                columns: [
                  { label: "ขั้นที่"},
                  { label: "ยอดซื้อเริ่มต้น"},
                  { label: "ยอดซื้อสูงสุด"},
                  { label: "ราคาจ่าย (บาทละ)"},
                  { label: "ลบ"},
                ],
                rows: [
                //   {
                //     initial_purchase : 1,
                //     maximum_purchase : '',
                //     price_to_pay : '',
                //     statusCheckInitailPurchaseNotOk : false,
                //     statusCheckMaximumPurchaseNotOk : false,
                //     statusCheckPriceToPayNotOk : false,
                //   }
                ]
            },
            tbManagePayFull: {
                page: 1,
                columns: [
                    { label: "ขั้นที่"},
                    { label: "ราคาจ่าย (บาทละ)"},
                ],
                // rows: [
                //   {
                //     step : 1,
                //     price_to_pay_full : 90
                //   }
                // ],
            },
            submitCreateStatus : '',
            form : {
                is_fixed : '',
                pay_ratio : '',
                status : true,
                max_bet : '',
                max_bet_per_bill_number : '',
                round_number_ID : '',
                bet_type : '',
                template_name : '',
                template_id : ''
            }
        }
    },
    validations : {
      form : {
        bet_type  : { required },
        max_bet_per_bill_number : { required },
        template_name : { required }
      }
    },
    mounted() {
      this.$on('modalConfirmCreateTemplate', (callback) => {

            if(callback) {
                this.refreshForm();
            }
            
        })
    },
    watch : {
        formCreate : 'setDataTemplate'
    },
    methods : {
        setDataTemplate(data) {

            // if(data.is_fixed == true) {
            //   this.checkForPayStep = null;
            //   this.checkForPayFull = true;
            // } else {
            //   this.checkForPayStep = true;
            //   this.checkForPayFull = null;
            // }

            this.form.is_fixed = data.is_fixed,
            this.form.pay_ratio = data.pay_ratio,
            // this.form.max_bet = '',
            this.form.max_bet_per_bill_number = data.max_bet_per_bill_number,
            this.form.bet_type = data.bet_type_id,
            this.form.template_name = data.name
            this.form.template_id = data.id
            this.tbManagePayStep.rows = data.step_limit.map((item) => {
                // console.log(item);
                return {
                    initial_purchase : item ? item.min_reach : '',
                    maximum_purchase : item ? item.max_reach : '',
                    price_to_pay : item ? item.pay_ratio : ''             
                }
            })

            // console.log('xxxxxxxxx',this.tbManagePayStep.rows);
        },
        refreshForm() {
          this.form.is_fixed = '',
          this.form.pay_ratio = '',
          this.form.status = true,
          this.form.max_bet = '',
          this.form.max_bet_per_bill_number = '',
          this.form.round_number_ID = '',
          this.form.bet_type = '',
          this.form.template_name = '';
          this.tbManagePayStep.rows = [{
            initial_purchase : 1,
            maximum_purchase : '',
            price_to_pay : '',
            statusCheckInitailPurchaseNotOk : false,
            statusCheckMaximumPurchaseNotOk : false,
            statusCheckPriceToPayNotOk : false,
          }];
          this.submitCreateStatus = '';
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
                // step : this.tbManagePayStep.rows[this.tbManagePayStep.rows.length - 1].step + 1,
                initial_purchase : max_bet_row_max > 0 ? parseInt(max_bet_row_max)+1 : 1,
                maximum_purchase : '',
                price_to_pay : '',
                statusCheckInitailPurchaseNotOk : false,
                statusCheckMaximumPurchaseNotOk : false,
                statusCheckPriceToPayNotOk : false,
            }

            this.tbManagePayStep.rows.push(_data);
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
                    //ต้องมี 2 แถวขึ้นไป
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
                // console.log(this.tbManagePayStep.rows);
                // console.log(index);
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
        //     let numOfFirst = this.tbManagePayStep.rows && this.tbManagePayStep.rows[0] 
        //         ? parseInt(this.tbManagePayStep.rows[0].price_to_pay) : 0;
        //     let stepNow = this.tbManagePayStep.rows && this.tbManagePayStep.rows[index] 
        //         ? parseInt(this.tbManagePayStep.rows[index].price_to_pay) : 0;
        //     let stepBack = this.tbManagePayStep.rows && this.tbManagePayStep.rows[index-1] 
        //         ? parseInt(this.tbManagePayStep.rows[index-1].price_to_pay) : 0;
        //     let stepNext = this.tbManagePayStep.rows && this.tbManagePayStep.rows[index+1] 
        //         ? parseInt(this.tbManagePayStep.rows[index+1].price_to_pay) : 0;

        //     if(index == 0) {
        //         if(numOfFirst <= stepNext) {
        //         this.tbManagePayStep.rows[index].statusCheckPriceToPayNotOk  = true;
        //         } else {
        //         this.tbManagePayStep.rows[index].statusCheckPriceToPayNotOk  = false;
        //         }
        //     } else {
        //         if(stepNow >= stepBack || stepNow <= stepNext) {
        //         this.tbManagePayStep.rows[index].statusCheckPriceToPayNotOk  = true;
        //         } else {
        //         this.tbManagePayStep.rows[index].statusCheckPriceToPayNotOk  = false;
        //         }
        //     }
        
        // },
        changeStatusOfNumber() {
            // this.$emit('changeStatusOfSaleNumber',this.form)
            // console.log(this.form);
        },
        deleteRowPayStep() {
          this.tbManagePayStep.rows.splice(this.tbManagePayStep.rows.length-1,1)
        },
        confirmEditTemplate() {
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

          // console.log('statusSubmitInitail',statusSubmitInitail);
          // console.log('statusSubmitMaximum',statusSubmitMaximum);
          // console.log('statusSubmitPriceToPay',statusSubmitPriceToPay);
          // console.log('statusCheckSubmit',this.statusCheckSubmit);

          if(statusSubmitInitail.every((item) => item == true)
            && statusSubmitMaximum.every((item) => item == true)
            && statusSubmitPriceToPay.every((item) => item == true)
            && this.statusCheckSubmit.every((item) => item == true)
            && this.$v.form.bet_type.$invalid == false
            && this.$v.form.max_bet_per_bill_number.$invalid == false
            && this.$v.form.template_name.$invalid == false
            && this.tbManagePayStep.rows.length > 0) {

            const _dataStep =  this.tbManagePayStep.rows.map((item) => {
              // console.log(item);
              return {
                max_reach: item ? parseInt(item.maximum_purchase) : '',
                min_reach: item ? parseInt(item.initial_purchase) : '',
                pay_ratio: item ? parseInt(item.price_to_pay) : '',
              }
            })

            // console.log('_dataStep',_dataStep);
            const _data = {
              is_fixed : this.checkForPayStep == true ? false : true,
              step_limit : _dataStep.length > 0 ? _dataStep : null,
              pay_ratio : this.checkForPayStep == true ? _dataStep[0].pay_ratio : this.form.pay_ratio,
              status : this.form.status,
              max_bet : _dataStep.length > 0 ? _dataStep[_dataStep.length-1].max_reach : null,
              max_bet_per_bill_number : this.form.max_bet_per_bill_number,
              template_id : this.form.template_id,
              bet_type_id : this.form.bet_type,
              template_name : this.form.template_name
            }
            // console.log('_data',_data);

            this.$emit('modalConfirmEditTemplate',_data);
          } else {
            // console.log('not ok');
            this.submitCreateStatus = 'ERROR';
            this.$toast.error('กรุณาเช็คข้อมูลให้ถูกต้อง')
          }
        }
    }
}
</script>
