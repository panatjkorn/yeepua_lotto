<template>
<!-- modal แก้ไขอัตราการจ่ายของประเภทหลักเลขหวย ex.3ตัวบน -->
  <div>
     <div
        id="modal-change-rate-group-lottery"
        class="modal"
        tabindex="-1"
        aria-hidden="true"
        data-backdrop="static"
      >
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header text-xl">
            <!-- <pre>{{ dataNumber }}</pre> -->
            <b>ปรับราคาจ่าย</b>
          </div>
          <div class="modal-body py-5 px-8 overflow-y-auto">
            <div class="bg-blue-300 text-center py-5 px-5 text-3xl">
              <b>{{ dataRoundPayRatio.bet_type ? dataRoundPayRatio.bet_type.name : '' }}</b>
            </div>

            <div class="mt-3">
              <p>ลิมิตต่อเลข/บิล (บาท)</p>
              <input v-model="form.max_bet_per_bill_number" type="text" class="form-control">
              <div v-if="submitCreateStatus == 'ERROR' && !$v.form.max_bet_per_bill_number.required" class="text-red-500 text-xs">กรุณากรอกลิมิตต่อเลข/บิล</div>

              <table class="table mt-3">
                <thead>
                  <tr>
                    <th v-for="(col,index) in tbManagePayFullGroupNumber.columns" :key="index" class="border-b-2 dark:border-dark-5 whitespace-nowrap">
                      <b>{{ col.label }}</b>
                    </th>
                  </tr>
                </thead>
                <tbody>
                    <tr>
                      <td>1</td>
                      <td>
                        <input v-model="form.pay_ratio" type="text" class="form-control w-4/12">
                        <div v-if="submitCreateStatus == 'ERROR' && !$v.form.pay_ratio.required" class="text-red-500 text-xs">กรุณากรอกราคาจ่าย</div>
                      </td>
                    </tr>
                </tbody>
              </table>
            </div>

          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary w-24 mr-1 mb-2" data-dismiss="modal" @click="closeModal()">
              ยกเลิก
            </button>
            <button class="btn bg-blue-500 text-white" @click="modalConfirmEditChangeRateGroupNumber()">บันทึก</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { required } from "vuelidate/lib/validators";
export default {
  props : ['dataRoundPayRatio'],
  data() {
    return {
      tbManagePayFullGroupNumber: {
        page: 1,
        columns: [
          { label: "ขั้นที่"},
          { label: "ราคาจ่าย (บาทละ)"},
        ],
      },
      form : {
        max_bet_per_bill_number : '',
        pay_ratio : '',
        round_pay_ratio_id : ''
      },
      submitCreateStatus : ''
    }
  },
  validations : {
    form : {
      max_bet_per_bill_number  : { required },
      pay_ratio  : { required },
    }
  },
  watch : {
    dataRoundPayRatio : 'setDataFormEditRoundPayRatio'
  },
  methods : {
    modalConfirmEditChangeRateGroupNumber() {
      if(this.$v.form.max_bet_per_bill_number.$invalid == false && this.$v.form.pay_ratio.$invalid == false) {
        // console.log('ok');
        this.$emit('modalConfirmEditChageRatePayGroupNumber',this.form)
      } else {
        this.submitCreateStatus = 'ERROR';
      }
    },
    closeModal() {
      this.form.max_bet_per_bill_number = '';
      this.form.pay_ratio = '';
      this.$emit('closeModalEditRatePayGroupNumber');
    },
    setDataFormEditRoundPayRatio(data) {
      this.form.max_bet_per_bill_number = data ? data.max_bet_per_bill_number : '';
      this.form.pay_ratio = data ? data.pay_ratio : '';
      this.form.round_pay_ratio_id = data ? data.id : '';
    }
  }
}
</script>
