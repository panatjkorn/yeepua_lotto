<template>
  <div>
    <!-- ประกาศผลผู้ถูกรางวัล -->
    <div
        id="modal-announcment-winner"
        class="modal"
        tabindex="-1"
        aria-hidden="true"
        data-backdrop="static"
      >
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header text-xl">
            <b>ประกาศผลผู้ถูกรางวัล</b>
          </div>
          <!-- <pre>{{dataAnnouncmentResult}}</pre> -->
          <div class="modal-body p-8 text-center">
            <h2 class="text-2xl"><b>ยืนยันประกาศผลผู้ถูกรางวัล</b></h2>
            <!-- <pre>{{dataAnnouncmentResult}}</pre> -->
            <h2 class="text-xl"><b>งวดประจำวันที่ {{ dataAnnouncmentResult ? dataAnnouncmentResult.round_name : '' }}</b></h2>
          </div>
          <div class="flex justify-center text-center">
            <div class="w-1/2 ">
              <div class="grid grid-flow-col grid-cols-2 gap-4 mb-2">
                <div class="bg-green-100 p-5 rounded-sm text-green-600">
                  <p><b>ยอดซื้อ(บาท)</b></p>
                  <p><b class="text-xl mt-2">{{ dataAnnouncmentResult ? dataAnnouncmentResult.sum_turnover : 0 }}</b></p>
                </div>
                <div class="bg-green-100 p-5 rounded-sm text-green-600">
                  <p><b>ยอดซื้อ(point)</b></p>
                  <p><b class="text-xl mt-2">{{ dataAnnouncmentResult ? dataAnnouncmentResult.sum_turnover_points : 0 }}</b></p>
                </div>
              </div>
              <div class="grid grid-flow-col grid-cols-2 gap-4">
                <div class="bg-red-100 p-5 rounded-sm">
                  <p><b>จำนวนผู้ถูกรางวัล (คน)</b></p>
                  <p><b class="text-xl mt-2">{{ dataAnnouncmentResult ? dataAnnouncmentResult.count_user_won : 0 }}</b></p>
                </div>
                <div class="bg-red-100 p-5 rounded-sm">
                  <p><b>จำนวนรายการบิล (บิล)</b></p>
                  <p><b class="text-xl mt-2">{{ dataAnnouncmentResult ? dataAnnouncmentResult.count_bill : 0  }}</b></p>
                </div>
              </div>
              <div class="grid grid-flow-col grid-cols-2 gap-4 mt-2">
                <div class="bg-red-100 p-5 rounded-sm">
                  <p><b>ยอดจ่ายถูกรางวัล (บาท)</b></p>
                  <p><b class="text-xl mt-2">{{ dataAnnouncmentResult ? dataAnnouncmentResult.sum_prize : 0 }}</b></p>
                </div>
                <div class="bg-red-100 p-5 rounded-sm">
                  <p><b>ยอดจ่าย (point)</b></p>
                  <p><b class="text-xl mt-2">{{ dataAnnouncmentResult ? dataAnnouncmentResult.pay_points : 0 }}</b></p>
                </div>
              </div>
              <div class="grid grid-flow-col grid-cols-2 gap-4 mt-2">
                <div class="bg-red-100 p-5 rounded-sm">
                  <p><b>ยอดจ่ายให้ตัวแทน (บาท)</b></p>
                  <p><b class="text-xl mt-2">{{ dataAnnouncmentResult ? dataAnnouncmentResult.pay_agent : 0 }}</b></p>
                </div>
                <div class="bg-red-100 p-5 rounded-sm">
                  <p><b>ยอดโบนัสตัวแทน (บาท)</b></p>
                  <p><b class="text-xl mt-2">{{ dataAnnouncmentResult ? dataAnnouncmentResult.pay_bonus_agent : 0 }}</b></p>
                </div>
              </div>
              <div class="grid grid-flow-col grid-cols-1 gap-4 mt-2">
                <div class="bg-blue-100 p-5 rounded-sm">
                  <p><b>กำไรของระบบ</b></p>
                  <p><b class="text-xl mt-2">{{ dataAnnouncmentResult ? dataAnnouncmentResult.profit : 0 }}</b></p>
                </div>
              </div>
              <!-- <p class="text-red-600 mt-2"><b>* กรุณาตรวจสอบให้ถูกต้อง หากประกาศผู้ถูกรางวัลแล้วจะไม่สามารถแก้ไขได้ *</b></p> -->
            </div>
          </div>
          <p class="text-red-600 mt-5 text-center mb-2"><b>* กรุณาตรวจสอบให้ถูกต้อง หากประกาศผู้ถูกรางวัลแล้วจะไม่สามารถแก้ไขได้ *</b></p>
          <div class="modal-footer">
            <button class="btn btn-secondary w-24 mr-1 mb-2" @click="closeModalAnnouncmentWinner()">
              ยกเลิก
            </button>
            <button class="btn btn btn-success" @click="confirmAnnouncment()">ยืนยันประกาศผู้ถูกรางวัล</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props : ['dataAnnouncmentResult'],
  // watch : {
  //   dataAnnouncmentResult : 'setDataAnnouncmentResult'
  // },
  methods : {
    closeModalAnnouncmentWinner() {
      this.$emit('closeModalAnnouncmentWinner');
    },
    confirmAnnouncment() {
      this.$emit('confirmAnnouncment')
    }
    // setDataAnnouncmentResult(data) {
    //   console.log('data',data);
    // }
  }
}
</script>
