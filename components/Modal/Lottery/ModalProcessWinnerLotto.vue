<template>
<!-- modal ประมวลผลผู้ถูกรางวัล -->
  <div>
    <div
        id="modal-process-winner-lotto"
        class="modal"
        tabindex="-1"
        aria-hidden="true"
      >
      <div class="modal-dialog modal-">
        <div class="modal-content">
          <div class="modal-body py-5 px-8 overflow-y-auto grid text-xl text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              class="feather feather-check-circle block mx-auto block mx-auto w-16 h-16 text-green-500">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <b class="mt-3">บันทึกข้อมูลสำเร็จ</b>
            <button class="w-100 btn bg-yellow-300 mt-3" @click="processWinnerLotto()">ประมวลผลผู้ถูกรางวัล</button>
            <button class="w-100 btn bg-gray-300 text-black mt-3" data-dismiss="modal">ไว้ภายหลัง</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  methods : {
    processWinnerLotto() {
      this.$emit('processWinnerLotto');
    }
  }
}
</script>
