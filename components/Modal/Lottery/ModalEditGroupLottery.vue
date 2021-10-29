<template>
  <div>
    <div
        id="modal-edit-type-lottery"
        class="modal"
        tabindex="-1"
        aria-hidden="true"
        data-backdrop="static"
      >
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header text-xl">
            <b>แก้ไขรายการทายหวย</b>
          </div>
          <div class="modal-body p-8">
            <div class="flex">
              <div class="flex-none w-24">
                <p>รูปหวย</p>
                <img :src="url" class="w-20 h-20 mt-1" alt="">
              </div>
               <div class="col-span-12 sm:col-span-12 file-input flex justify-center mt-8">
                <input
                  id="file"
                  ref="file"
                  type="file"
                  class="file-link"
                  @change="onFileChange"
                />
                <label class="label-button-upload" for="file">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                  </svg>
                  อัพโหลดรูปภาพ
                </label>
              </div>
            </div>
            <div v-if="statusUploadImage == 'ERROR'" class="text-red-500">กรุณาอัพโหลดรูปภาพ</div>
            <div class="mt-4">
              <p>ชื่อหวย</p>
              <input v-model="form.lotto_group_name" type="text" class="form-control w-full">
              <div v-if="submitCreateStatus == 'ERROR' && !$v.form.lotto_group_name.required" class="text-red-500 text-xs">
                กรุณาระบุชื่อหวย
              </div>

              <div class="grid grid-flow-col grid-cols-2 mt-3">
                <div>
                  <span>วัน-เวลาเปิดรับแทง</span>
                  <MazPicker
                    v-model="form.open_time"
                    format="HH:mm:mm"
                    formatted="HH:mm:mm"
                    placeholder="วัน-เวลาเปิดรับแทง"
                    no-date
                    size="sm"
                    class="mt-2 pr-1"
                    @formatted="pickerFormatted = $event"
                />
                <div v-if="submitCreateStatus == 'ERROR' && !$v.form.open_time.required" class="text-red-500 text-xs">
                  กรุณาระบุเวลาเปิดรับแทง
                </div>
                </div>
                <div>
                  <span>วัน-เวลาปิดรับแทง</span>
                  <MazPicker
                    v-model="form.closing_time"
                    format="HH:mm:mm"
                    formatted="HH:mm:mm"
                    placeholder="วัน-เวลาปิดรับแทง"
                    no-date
                    size="sm"
                    class="mt-2"
                    @formatted="pickerFormatted = $event"
                  />
                  <div v-if="submitCreateStatus == 'ERROR' && !$v.form.closing_time.required" class="text-red-500 text-xs">
                    กรุณาระบุเวลาปิดรับแทง
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary w-24 mr-1 mb-2" data-dismiss="modal">
              ยกเลิก
            </button>
            <!-- <button class="btn btn-secondary w-24 mr-1 mb-2" @click="closeModalEditLottoType()">
              ยกเลิก
            </button> -->
            <button class="btn btn btn-success" @click="editLottoType()">บันทึก</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { required } from "vuelidate/lib/validators";
export default {
  // props: ['dataEdit'],
  props : {
    dataEdit: {
      default: null,
    },
  },
  data() {
    return {
      url : null,
      form : {
        image : null,
        lotto_group_name : '',
        open_time : '',
        closing_time : '',
        id : ''
      },
      statusUploadImage : '',
      submitCreateStatus : ''
    }
  },
  validations : {
    form : {
      lotto_group_name  : { required },
      open_time  : { required },
      closing_time  : { required },
    }
  },
  watch : {
    dataEdit : 'setDataValue'
  },
  created() {
    // this.setDataValue();
  },
  methods : {
    onFileChange(e) {
      if (e.target.files[0]) {
        this.form.image = this.$refs.file ? this.$refs.file.files[0] : null;
        this.url = URL.createObjectURL(this.form.image);
        this.statusUploadImage = "";
      }
    },
    setDataValue(data) {
      this.form.image = data ? data.image_url : '';
      this.url = data ? data.image_url : '';
      this.form.lotto_group_name = data ? data.name : '';
      this.form.open_time = data ? data.default_open_time : '';
      this.form.closing_time = data ? data.default_close_time : ''
      this.form.id = data ? data.id : ''

    },
    editLottoType() {
      if (!this.form.image) {
        this.statusUploadImage = "ERROR";
      }

      if(
          this.$v.form.lotto_group_name.$invalid == false
          && this.$v.form.open_time.$invalid == false
          && this.$v.form.closing_time.$invalid == false
          && this.form.image
        ) {
        this.$emit('editLottoType',this.form);
      } else {
        this.submitCreateStatus = 'ERROR'
      }
    },
    closeModalEditLottoType() {
      this.statusUploadImage = '';
      this.submitCreateStatus = '';
      this.form.lotto_group_name = '';
      this.form.open_time = '';
      this.form.closing_time = '';
      this.form.id = '';
      this.$refs.file.value = null;
      this.$cash('#modal-edit-type-lottery').modal('hide');
    }
  }
};
</script>

<style scoped>
  .file-link {
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
