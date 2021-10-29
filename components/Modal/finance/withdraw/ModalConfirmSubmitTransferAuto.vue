<template>
  <div>
    <!-- modal confirm cancel withdraw -->
    <div
        id="modal-confirm-submit-transfer-auto"
        class="modal"
        tabindex="-1"
        aria-hidden="true"
        data-backdrop="static"
      >
      <div class="modal-dialog modal-md">
        <div class="modal-content">
          <div class="modal-body p-8 text-center">
            <div class="flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 class="text-2xl maz-text-bold">ยืนยันโอนเงิน ?</h2>

            <p class="mt-3 mb-2">ผู้รับ</p>
            <!-- <pre>{{ dataTransferAuto.data_bank_show }}</pre> -->
            <p class="mt-3 mb-2">{{ dataTransferAuto.data_bank_show ? dataTransferAuto.data_bank_show.bank_account_name : ''}}</p>
            <p class="mt-3 mb-2">
              {{ dataTransferAuto.data_bank_show ? dataTransferAuto.data_bank_show.bank.name : ''}} 
              {{ dataTransferAuto.data_bank_show ? dataTransferAuto.data_bank_show.bank_account_number : '' }}
            </p>
            <p class="mt-3 mb-2 text-red-500 text-lg"><b>จำนวนเงิน {{ dataTransferAuto ? dataTransferAuto.amount_withdraw : '' }} บาท</b></p>

          </div>
          <div class="modal-footer text-center">
            <button class="btn btn-secondary w-24 mr-1 mb-2" data-dismiss="modal">ยกเลิก</button>
            <button class="btn bg-green-500 text-white" @click="submitTransferAuto()">ยืนยัน</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props : ['dataTransferAuto'],
  data() {
    return {

    }
  },
  methods : {
    submitTransferAuto() {
      this.$emit('submitTransferAuto')
    }
  }
}
</script>
