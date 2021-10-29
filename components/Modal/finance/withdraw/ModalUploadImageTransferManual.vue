<template>
    <div>
        <div
        id="modal-upload-image-transfer-manual"
        class="modal"
        tabindex="-1"
        aria-hidden="true"
        data-backdrop="static"
      >
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <b class="text-lg">อัพโหลดรูปภาพสลิป</b>
                    </div>
                    <div class="modal-body p-8 text-left">

                        <div class="grid justify-center">
                            <div class="col-span-1 sm:col-span-1 file-input flex justify-center mt-8">
                                <input
                                    id="file_manual"
                                    ref="file_manual"
                                    type="file"
                                    class="file-manual"
                                    @change="onFileChangeManual"
                                />
                                <label class="label-button-upload" for="file_manual">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                                </svg>
                                อัพโหลดรูปภาพ
                                </label>
                            </div>
                        </div>
                        <div class="flex justify-center items-center mt-2">
                            <img :src="url" class="w-auto mt-1" alt="">
                        </div>
                    </div>
                    <div class="modal-footer text-center">
                        <button class="btn btn-secondary w-24 mr-1 mb-2" data-dismiss="modal" @click="closeModalUploadImageTransferManual">ปิด</button>
                        <button class="btn bg-green-500 text-white" @click="uploadImageSlipTransferManual">บันทึก</button>
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
        url : null,
        form : {
            image : null
        }
      }  
    },
    mounted() {
        this.$on('uploadImageTransferManual', () => {
        this.closeModalUploadImageTransferManual();
        })
    },
    methods : {
        onFileChangeManual(e) {
            // console.log(this.$refs.file_manual.files[0]);
            if (e.target.files[0]) {
                this.form.image = this.$refs.file_manual ? this.$refs.file_manual.files[0] : null;
                this.url = URL.createObjectURL(this.form.image);
                // this.statusUploadImage = "";
            }
        },
        closeModalUploadImageTransferManual() {
            this.form.image = null;
            this.url = null;
        },
        uploadImageSlipTransferManual() {
            this.$emit('uploadImageTransferManual',this.form.image)
        }
    }
}
</script>
<style scoped>
  .file-manual {
    opacity: 0;
    width: 0.1px;
    height: 0.1px;
    position: absolute;
  }
  .file-input .label-button-upload {
    display: block;
    position: relative;
    width: auto;
    padding: 20px;
    height: 25px;
    background: #6495ed;
    box-shadow: 0 4px 7px rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-weight: bold;
    cursor: pointer;
  }
</style>