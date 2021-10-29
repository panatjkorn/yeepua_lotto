<template>
  <div>
    <div
        id="modal-create-lotto-draw"
        class="modal"
        tabindex="-1"
        aria-hidden="true"
        data-backdrop="static"
      >
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header text-xl">
            <b>{{ title }}</b>
          </div>
          <div class="modal-body p-5">
            <div class="grid">
              <!-- {{modalType}} -->
              งวดประจำวันที่
              <!-- {{ dataEditLottoRound.lotto_round_status && dataEditLottoRound.lotto_round_status.id }} -->
              <MazPicker
                v-model="form.draw_date_lotto"
                format="YYYY-MM-DD HH:mm:mm"
                formatted="YYYY-MM-DD HH:mm"
                placeholder="งวดประจำวันที่"
                size="sm"
                class="mt-2"
                @input="setFormatDrawDate"
                @formatted="pickerFormatted = $event"
              />
              <div v-if="submitCreateStatus == 'ERROR' && !$v.form.draw_date_lotto.required" class="text-red-500 text-xs">
                กรุณาระบุงวดวันที่
              </div>
            </div>
            <div class="grid grid-flow-col grid-cols-2 grid-rows-1 mt-3">
              <div class="p-1">
                <span>วัน-เวลาเปิดรับแทง</span>
                <MazPicker
                  v-model="form.open_draw_lotto"
                  format="YYYY-MM-DD HH:mm:mm"
                  formatted="YYYY-MM-DD HH:mm"
                  placeholder="วัน-เวลาเปิดรับแทง"
                  size="sm"
                  class="mt-2"
                  @input="setFormatOpenDrawLotto"
                  @formatted="pickerFormatted = $event"
                />
                <div v-if="submitCreateStatus == 'ERROR' && !$v.form.open_draw_lotto.required" class="text-red-500 text-xs">
                  กรุณาระบุเวลาเปิดรับแทง
                </div>
              </div>
              <div class="p-1">
                <span>วัน-เวลาปิดรับแทง</span>
                <MazPicker
                  v-model="form.closing_draw_lotto"
                  format="YYYY-MM-DD HH:mm:mm"
                  formatted="YYYY-MM-DD HH:mm"
                  placeholder="วัน-เวลาปิดรับแทง"
                  size="sm"
                  class="mt-2"
                  @input="setFormatClosingDrawLotto"
                  @formatted="pickerFormatted = $event"
                />
                <div v-if="submitCreateStatus == 'ERROR' && !$v.form.closing_draw_lotto.required" class="text-red-500 text-xs">
                  กรุณาระบุเวลาปิดรับแทง
                </div>
              </div>
            </div>

            <div v-if="lotteryTypeId == 4 || lotteryTypeId == 5" class="grid grid-flow-col grid-cols-2 grid-rows-1 mt-3">
              <div class="p-1">
                <span>ราคาขายต่อใบ</span>
                <input v-model="form.lottoPrice" type="text" class="form-control" placeholder="ราคาขายต่อใบ">
                <div v-if="submitCreateStatus == 'ERROR' && !$v.form.lottoPrice.required" class="text-red-500 text-xs">
                  กรุณาระบุราคาขายต่อใบ
                </div>
              </div>
              <div class="p-1">
                <span>จำนวนหวย(ชุด)</span>
                <input v-model="form.lottoSet" type="text" class="form-control" placeholder="จำนวนหวย(ชุด)">
                <div v-if="submitCreateStatus == 'ERROR' && !$v.form.lottoSet.required" class="text-red-500 text-xs">
                  กรุณาระบุจำนวนหวย(ชุด)
                </div>
              </div>
            </div>
            <div v-if="modalType == 'edit'" class="grid grid-flow-col grid-cols-2 grid-rows-1 mt-3">
              <div class="flex">
                <input v-model="form.is_pay_points" type="checkbox" class="form-check-input mr-2">
                <label for="">จ่าย point ให้ user</label>
              </div>
              <div>
                <input v-model="form.is_use_points_buy" type="checkbox" class="form-check-input mr-2">
                <label for="">ซื้อด้วย point</label>
              </div>
            </div>
            <div v-if="modalType == 'edit' && form.is_pay_points == true" class="grid grid-flow-col grid-cols-2 grid-rows-1 mt-3">
              <div>
                <label for="">เปอร์เซ็นการจ่าย point ให้ user ( % )</label>
                <input v-model="form.ratio_points" type="number" min="0" max="100" class="form-control" 
                  @input="validateRatioPoint()">
                <p class="text-red-500 text-xs mt-2">กรุณากรอกเป็นเปอร์เซ็น</p>
                <p v-if="isValidateRatioPoint == true" class="text-red-500 text-xs mt-2">กรุณากรอกข้อมูลให้ถูกต้อง</p>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
            v-if="modalType == 'edit'"
            :class="{'bg-red-500 text-white' : dataEditLottoRound && dataEditLottoRound.lotto_round_status && dataEditLottoRound.lotto_round_status.id <= 4,
            'bg-gray-200 text-black' : dataEditLottoRound && dataEditLottoRound.lotto_round_status && dataEditLottoRound.lotto_round_status.id > 4}"
            class="btn float-left"
            :disabled="dataEditLottoRound && dataEditLottoRound.lotto_round_status && dataEditLottoRound.lotto_round_status.id > 4"
            @click="modalConfirmCancelLottoRound()">ยกเลิกงวดแทงหวย</button>
            <button class="btn btn-secondary w-24 mr-1 mb-2" @click="closeModalCreateLottoDraw()">
              ยกเลิก
            </button>
            <button class="btn btn btn-success" @click="createDrawListLotto()">บันทึก</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
// const initForm = () => {
//   return {
//     draw_date_lotto : null,
//     open_draw_lotto : null,
//     closing_draw_lotto : null,
//     lottoPrice : 80,
//     lottoSet : 1
//   };
// };

import { required } from "vuelidate/lib/validators";
export default {
  // props : ['modalType','lotteryTypeId'],
  props : {
    modalType: {
      type: String,
      default: 'create',
      validator: (modalType) => {
        return ['create', 'edit'].includes(modalType);
      },
    },
    dataEditLottoRound : {
      default: null,
    },
    lotteryTypeId : {
      default: null,
    }
  },
  data() {
    return {
      // form : initForm(),
      form : {
        draw_date_lotto : null,
        open_draw_lotto : null,
        closing_draw_lotto : null,
        lottoPrice : this.lotteryTypeId == 4 ? 80 : 100,
        lottoSet : this.lotteryTypeId == 4 ? 3 : 3,
        is_pay_points : false,
        is_use_points_buy : false,
        ratio_points : 0
      },
      submitCreateStatus : '',
      isValidateRatioPoint : false
    }
  },
  validations : {
    form : {
      draw_date_lotto  : { required },
      open_draw_lotto  : { required },
      closing_draw_lotto  : { required },
      lottoPrice  : { required },
      lottoSet  : { required },
    }
  },
  computed: {
    title() {
      return this.modalType === 'create' ? 'สร้างงวดแทงหวย' : 'แก้ไขงวดแทงหวย';
    },
  },
  mounted() {
    this.$on('createLotto', () => {
      this.clearDataForm();
    })
  },
  watch : {
    dataEditLottoRound : 'setDataEditLottoRound',
  },
  destroyed() {
    this.resetForm();
  },
  methods : {
    resetForm() {
      this.form = {
        draw_date_lotto : null,
        open_draw_lotto : null,
        closing_draw_lotto : null,
        lottoPrice : this.lotteryTypeId == 4 ? 80 : 100,
        lottoSet : this.lotteryTypeId == 4 ? 3 : 3,
        is_pay_points : false,
        is_use_points_buy : false,
        ratio_points : 0
      }
      this.submitCreateStatus = null;
    },
    createDrawListLotto() {
      if(this.lotteryTypeId == 4 || this.lotteryTypeId == 5) {
        //หวย blueswan
        if(this.modalType == 'create') {
          if(
            this.$v.form.draw_date_lotto.$invalid == false 
            && this.$v.form.open_draw_lotto.$invalid == false
            && this.$v.form.closing_draw_lotto.$invalid == false
            && this.$v.form.lottoPrice.$invalid == false
            && this.$v.form.lottoSet.$invalid == false
          ) {

            const _data = {
              closing_draw_lotto: `${this.form.closing_draw_lotto}`,
              draw_date_lotto: `${this.form.draw_date_lotto}`,
              open_draw_lotto : `${this.form.open_draw_lotto}`,
              quantity : `${this.form.lottoSet}`,
              price : `${this.form.lottoPrice}`
            }
            this.$emit('createLotto',_data)

          } else {
            this.submitCreateStatus = 'ERROR';
          }
        } else {
          if(
            this.$v.form.draw_date_lotto.$invalid == false
            && this.$v.form.open_draw_lotto.$invalid == false 
            && this.$v.form.closing_draw_lotto.$invalid == false
            && this.$v.form.lottoPrice.$invalid == false
            && this.$v.form.lottoSet.$invalid == false
            && this.isValidateRatioPoint == false
          ) {
            this.$emit('editLottoRound',this.form)
          } else {
            this.submitCreateStatus = 'ERROR';
          }
        }

      } else {

        if(this.modalType == 'create') {
          if(
            this.$v.form.draw_date_lotto.$invalid == false 
            && this.$v.form.open_draw_lotto.$invalid == false
            && this.$v.form.closing_draw_lotto.$invalid == false
          ) {
            const _data = {
              closing_draw_lotto: `${this.form.closing_draw_lotto}`,
              draw_date_lotto: `${this.form.draw_date_lotto}`,
              open_draw_lotto : `${this.form.open_draw_lotto}`
            }
            this.$emit('createLotto',_data)

          } else {
            this.submitCreateStatus = 'ERROR';
          }
        } else {
          if(this.$v.form.draw_date_lotto.$invalid == false 
          && this.$v.form.open_draw_lotto.$invalid == false 
          && this.$v.form.closing_draw_lotto.$invalid == false
          && this.isValidateRatioPoint == false) {
            this.$emit('editLottoRound',this.form)
          } else {
            this.submitCreateStatus = 'ERROR';
          }
        }

      }
    },
    closeModalCreateLottoDraw() {
      this.$cash('#modal-create-lotto-draw').modal('hide');
      this.form.draw_date_lotto = null;
      this.form.open_draw_lotto = null;
      this.form.closing_draw_lotto = null;
      this.submitCreateStatus = '';
    },
    setDataEditLottoRound(data) {
      // console.log('data',data);
      this.form.draw_date_lotto = moment(data.draw_date_at).format();
      this.form.open_draw_lotto = moment(data.open_time).format();
      this.form.closing_draw_lotto = moment(data.close_time).format();
      this.form.lottoPrice = data ? data.price : ''
      this.form.lottoSet = data ? data.quantity : '',
      this.form.is_pay_points = data ? data.is_pay_points : false,
      this.form.is_use_points_buy = data ? data.is_use_points_buy : false,
      this.form.ratio_points = data ? data.ratio_points * 100 : 0
    },
    setFormatDrawDate(value) {
      this.form.draw_date_lotto = moment(value).format();
      // this.form.draw_date_lotto = `${value}+07`
    },
    setFormatOpenDrawLotto(value) {
      this.form.open_draw_lotto = moment(value).format();
      // this.form.open_draw_lotto = `${value}+07`
    },
    setFormatClosingDrawLotto(value) {
      this.form.closing_draw_lotto = moment(value).format();
      // this.form.closing_draw_lotto = `${value}+07`
    },
    modalConfirmCancelLottoRound() {
      this.$emit('modalConfirmCancelLottoRound');
    },
    clearDataForm() {

      this.form.draw_date_lotto = null;
      this.form.open_draw_lotto = null;
      this.form.closing_draw_lotto = null;
      this.lottoPrice = this.lotteryTypeId == 4 ? 80 : 100,
      this.lottoSet = this.lotteryTypeId == 4 ? 3 : 3
      this.submitCreateStatus = '';
      this.form.is_pay_points = false,
      this.form.is_use_points_buy = false,
      this.form.ratio_points = 0
      
    },

    validateRatioPoint() {
      if(this.form.is_pay_points == true) {
        // console.log(this.form.ratio_points);
        if(this.form.ratio_points < 0 || this.form.ratio_points > 100) {
          this.isValidateRatioPoint = true;
        } else {
          this.isValidateRatioPoint = false;

        }
      }
    }
  }
}
</script>
