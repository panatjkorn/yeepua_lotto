<template>
<!-- โอนเงิน แบบ auto -->
  <div>
    <div
        id="modal-transfer-money-auto"
        class="modal"
        tabindex="-1"
        aria-hidden="true"
        data-backdrop="static"
      >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <b class="text-lg">โอนเงินแบบ Auto</b>
          </div>
          <div class="modal-body p-8 text-left">
            <!-- <p class="text-green-700"><b>โอนเงินให้กับ</b></p> -->
            <MazPicker
                v-model="form.lotto_round_date"
                format="YYYY-MM-DD HH:mm"
                formatted="YYYY-MM-DD HH:mm"
                placeholder="งวดประจำวันที่"
                size="sm"
                class="mt-2 w-1/2"
                @formatted="pickerFormatted = $event"
                disabled
              />

            <p class="mt-3 mb-2">ลูกค้า</p>
            <input v-model="form.phone" type="text" class="form-control" placeholder="เบอร์โทร" disabled>

            <p class="mt-3 mb-2">จำนวนเงินถอน(บาท)</p>
            <input v-model="form.amount_withdraw" type="text" class="form-control" placeholder="จำนวนเงินถอน" disabled>

            <p class="mt-3 mb-2">บัญชีรับเงินของลูกค้า</p>
            <input v-model="form.bank_account" type="text" class="form-control" placeholder="บัญชีรับเงิน" disabled>

            <hr>
            <p class="mt-3 mb-2 text-green-700"><b>โอนเงินออกจากบัญชี</b></p>
            <select v-model="form.company_bank" name="bank_account_transfer_auto" id="bank_account_transfer_auto" 
            class="form-control" @change="getDataBalanceCompanyBank()">
              <option value="">บัญชี</option>
              <option v-for="(bank,index) in dataCompanyBank" :key="index" :value="bank.id">
                {{ bank.bank_account_name }} {{ bank.bank ? bank.bank.name : '' }} 
                <!-- {{bank}} -->
              </option>
            </select>
            <div v-if="submitCreateStatus == 'ERROR' && !$v.form.company_bank.required" class="text-red-500 text-xs">
              กรุณาระบุ company bank
            </div>

            <div class="flex">
              <p class="text-red-500 mt-2">คงเหลือ {{ dataBalance ? dataBalance.balance : 0}} บาท</p>
              <svg v-if="loadingShow == true" width="20" viewBox="0 0 57 57" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mt-2 ml-1">
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
          <div class="modal-footer text-center">
            <button class="btn btn-secondary w-24 mr-1 mb-2" data-dismiss="modal" @click="closeModalTransferAuto()">ปิด</button>
            <button class="btn bg-green-500 text-white" @click="modalConfirmTransferAuto()">ยืนยันโอนเงิน</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { required } from "vuelidate/lib/validators";
import moment from "moment";
export default {
  props : ['dataTransferAuto','dataCompanyBank','typeWithdraw','dataBalance','loadingShow'],
  data() {
    return {
      form : {
        lotto_round_date : null,
        phone : '',
        amount_withdraw : '',
        bank_account : '',
        company_bank : '',
        data_bank_show : ''
      },
      submitCreateStatus : ''
    }
  },
  validations : {
    form : {
      company_bank : {required}
    }
  },
  watch : {
    dataTransferAuto : 'setDataTransferAuto',
  },
  methods : {
    setDataTransferAuto(data) {
      if(this.typeWithdraw == 1) {

        //user
        this.form.lotto_round_date = data ? moment(data.created_at).format() : null,
        this.form.phone = data.user ? data.user.phone_number : ''
        this.form.amount_withdraw = data ? data.credit : ''
        this.form.bank_account = data.user_bank_account 
          ? data.user_bank_account.bank_account_name + ' [' +
          data.user_bank_account.bank.name + ' ' +
          data.user_bank_account.bank_account_number + ']' : '';
        this.form.data_bank_show = data ? data.user_bank_account : ''

      } else {
        //agent
        this.form.lotto_round_date = data ? moment(data.created_at).format() : null,
        this.form.phone = data.agent ? data.agent.phone_number : ''
        this.form.amount_withdraw = data ? data.credit : ''
        this.form.bank_account = data.agent && data.agent.agent_bank_account ? 
          data.agent.agent_bank_account.bank_account_name + ' [ ' + data.agent.agent_bank_account.bank_account_number + ' ' 
          + data.agent.agent_bank_account.bank.name + ' ] ': ''
        this.form.data_bank_show = data ? data.agent.agent_bank_account : ''
      }
      
    },
    modalConfirmTransferAuto() {
      if(this.$v.form.company_bank.$invalid == false) {
        this.$emit('modalConfirmTransferAuto',this.form);
        this.$on('modalConfirmTransferAuto', (callback) => {
          if(callback) {
            this.closeModalTransferAuto();
          }
          
        })
        // this.$emit('modalConfirmTransferAuto', this.form, function (callback) {
        //   if (callback) {
        //     this.closeModalTransferAuto();
        //   }
        // })
      } else {
        this.submitCreateStatus = 'ERROR';
      }
    },
    closeModalTransferAuto() {
      this.submitCreateStatus = '';
      this.form.company_bank = '';
    },
    getDataBalanceCompanyBank() {
      
      this.$emit('getDataBalanceCompanyBank',this.form.company_bank);
      // const url = `admin_manage_statement/balance/company_bank/${this.form.company_bank}`

      // try {
      //   const getBalance = await this.$axios.post(url);
      //   console.log('getBalance',getBalance);
      // } catch(err) {
      //   console.log(err);
      // }
    }
  }
}
</script>
