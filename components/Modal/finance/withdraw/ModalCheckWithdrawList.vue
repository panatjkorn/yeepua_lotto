<template>
  <div>
    <!-- ตรวจสอบขอถอนเงิน -->
    <div
        id="modal-check-withdraw-list"
        class="modal"
        tabindex="-1"
        aria-hidden="true"
        data-backdrop="static"
      >
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header text-xl">
            <b>ตรวจสอบขอถอนเงิน</b>
          </div>
          <div class="modal-body p-8 text-left">
            <h2 class="text-xl"><b>โอนเงินให้กับ</b></h2>
            <p class="mt-4"><b>วันที่ส่งคำขอ</b></p>
            <MazPicker
                v-model="form.date_time"
                format="YYYY-MM-DD HH:mm"
                formatted="YYYY-MM-DD HH:mm"
                placeholder="งวดประจำวันที่"
                size="sm"
                class="mt-2 w-1/2"
                @formatted="pickerFormatted = $event"
              />

            <p class="mt-3 mb-2">ลูกค้า</p>
            <input v-model="form.phone" type="text" class="form-control" placeholder="เบอร์โทร" disabled>

            <p class="mt-3 mb-2">จำนวนเงินถอน(บาท)</p>
            <input v-model="form.withdraw" type="text" class="form-control" placeholder="จำนวนเงินถอน" disabled>

            <p class="mt-3 mb-2">บัญชีรับเงินของลูกค้า</p>
            <input v-model="form.bank_account" type="text" class="form-control" placeholder="บัญชีรับเงิน" disabled>
          </div>
          <div class="modal-footer text-center">
            <button class="btn btn-secondary w-24 mr-1 mb-2" data-dismiss="modal">ปิด</button>
            <button class="btn bg-black text-white" @click="modalConfirmCancelWithdraw()">ปฏิเสธ</button>
            <button class="btn bg-green-500 text-white" @click="modalConfirmSubmitWithdraw()">ยืนยันอนุมัติ</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import moment from "moment";
export default {
  props : ['dataWithdrawList','typeWithdraw'],
  data() {
    return {
      form : {
        date_time : '',
        phone : '',
        withdraw : '',
        bank_account : ''
      }
    }
  },
  watch : {
    dataWithdrawList : 'setDataForm'
  },
  methods : {
    setDataForm(data) {
      if(this.typeWithdraw == 1) {
        // user
        this.form.date_time = data ? moment(data.created_at).format() : '',
        this.form.phone = data.user ? data.user.phone_number : '',
        this.form.withdraw = data ? data.credit : '',
        this.form.bank_account = data.user_bank_account 
          ? data.user_bank_account.bank_account_name + ' [' +
          data.user_bank_account.bank.name + ' ' +
          data.user_bank_account.bank_account_number + ']' : ''
      } else {
        //agent
        this.form.date_time = data ? moment(data.created_at).format() : '',
        this.form.phone = data.agent ? data.agent.phone_number : '',
        this.form.withdraw = data ? data.credit : '',
        this.form.bank_account = data.agent && data.agent.agent_bank_account ? 
          data.agent.agent_bank_account.bank_account_name 
          + ' [ ' + data.agent.agent_bank_account.bank.name
          + data.agent.agent_bank_account.bank_account_number + ' ] ' : ''
      }
      
    },
    modalConfirmCancelWithdraw() {
      this.$emit('modalConfirmCancelWithdraw')
    },
    modalConfirmSubmitWithdraw() {
      this.$emit('modalConfirmSubmitWithdraw')
    }
  }
}
</script>
