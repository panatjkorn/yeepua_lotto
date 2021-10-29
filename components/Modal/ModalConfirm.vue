<template>
  <div>
    <div
        id="modal-confirm"
        class="modal"
        tabindex="-1"
        aria-hidden="true"
        data-backdrop="static"
      >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-body p-5 text-center">
            <div class="flex justify-center items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mb-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div class="grid">
              <b class="text-xl">{{ HeaderMassage }}</b>
              <span v-if="WarningMassage" class="text-red-500 mt-2 text-md">{{ WarningMassage }}</span>
            </div>
          </div>
          <div class="modal-footer text-center">
            <button class="btn btn-secondary w-24 mr-1 mb-2" @click="cancelModal()">
              ยกเลิก
            </button>
            <button class="btn btn btn-success" @click="submitConfirm()">บันทึก</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    HeaderMassage: {
      type: String,
      default: null
    },
    WarningMassage: {
      type: String,
      default: null
    },
  },
  methods : {
    submitConfirm() {
      this.$emit('submitConfirmModal');
    },
    cancelModal() {
      this.$emit('cancelModal');
    }
  }
}
</script>
