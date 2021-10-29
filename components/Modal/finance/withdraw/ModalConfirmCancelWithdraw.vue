<template>
  <div>
    <!-- modal confirm cancel withdraw -->
    <div
        id="modal-confirm-cancel-withdraw"
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
            <h2 class="text-2xl maz-text-bold">ยืนยันปฏิเสธการถอน</h2>

            <p class="mt-3 mb-2">เลือกหมายเหตุ</p>
            <select v-model="note_cancel" name="note-cancel-withdraw" id="note-cancel-withdraw" class="form-control">
              <option value="">เลือกหมายเหตุ</option>
              <option value="ข้อมูลการชำระเงินไม่ถูกต้อง">ข้อมูลการชำระเงินไม่ถูกต้อง</option>
              <option value="บัญชีที่ถอนไม่ตรงกับข้อมูล">บัญชีที่ถอนไม่ตรงกับข้อมูล</option>
              <option value="ยอดเงินไม่ถูกต้อง">ยอดเงินไม่ถูกต้อง</option>
              <option value="ไม่พบข้อมูล">ไม่พบข้อมูล</option>
              <option value="โกง">โกง</option>
            </select>

            <!-- <h2 class="text-xl"><b>โอนเงินให้กับ</b></h2> -->

          </div>
          <div class="modal-footer text-center">
            <button class="btn btn-secondary w-24 mr-1 mb-2" data-dismiss="modal" @click="resetFormCancel()">ยกเลิก</button>
            <button class="btn bg-green-500 text-white" @click="cancelWithdraw()">ยืนยัน</button>
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
      note_cancel : ''
    } 
  },
  methods : {
    cancelWithdraw() {
      this.$emit('cancelWithdraw',this.note_cancel)
    },
    resetFormCancel() {
      this.note_cancel = ''
    }
  }
}
</script>
