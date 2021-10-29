<template>
  <div>
    <!-- modal confirm submit withdraw -->
    <div
        id="modal-confirm-submit-withdraw"
        class="modal"
        tabindex="-1"
        aria-hidden="true"
        data-backdrop="static"
      >
      <div class="modal-dialog modal-md">
        <div class="modal-content">
          <div class="modal-body p-8 text-center">
            <div class="flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check-circle block mx-auto block mx-auto text-green-500 h-16 w-16">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h2 class="text-2xl maz-text-bold">อนุมัติการถอนสำเร็จ</h2>

            <p class="mt-3 mb-2">ดำเนินการถอนเงินให้กับลูกค้า</p>
            <div class="grid">
              <button class="btn bg-black text-white mt-2" @click="submitTransfer(1)">โอนเงินแบบ auto</button>
              <button class="btn border-black text-black mt-2" @click="submitTransfer(2)">โอนเงินแบบ Manual</button>
              <button class="btn bg-gray-200 text-black mt-2" @click="submitTransfer(3)">ไว้ภายหลัง</button>
            </div>
            <!-- <h2 class="text-xl"><b>โอนเงินให้กับ</b></h2> -->

          </div>
          <div class="modal-footer text-center">
            <button class="btn btn-secondary w-24 mr-1 mb-2" data-dismiss="modal">ยกเลิก</button>
            <button class="btn bg-green-500 text-white" >ยืนยัน</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {

    }  
  },
  methods : {
    submitTransfer(submit_status) {
      // submit_status = 1 โอนเงิน auto
      // submit_status = 2 โอนเงิน manual
      // submit_status = 3 ไว้ภายหลัง
      this.$emit('submitTransfer',submit_status)
    }
  }
}
</script>
