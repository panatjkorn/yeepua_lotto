<template>
  <div>
    <div class="col-span-12 lg:col-span-4 text-center mt-5 box py-4 px-4">
      <!-- <pre>{{ lotteryReport }}</pre> -->
      <h2 class="text-xl lg:text-3xl mt-2">งวดประจำวันที่ {{ dateOfLottery }}</h2>
      <div class="grid grid-flow-col grid-cols-4 gap-4 mt-5">
        <div class="grid-rows-2 text-blue-600 border-r-2 border-gray-400 p-2">
          <!-- <pre>{{lotteryReport}}</pre> -->
          <div>
            <h2 class="lg:text-xl">ยอดซื้อ(Credit)</h2>
            <h2 class="lg:text-xl">{{ lotteryReport.balance ? lotteryReport.balance.sum_turnover : 0 }} บาท</h2>
          </div>
          <div class="mt-5">
            <h2 class="lg:text-xl">ยอดซื้อ(Point)</h2>
            <h2 class="lg:text-xl">{{ lotteryReport.balance ? lotteryReport.balance.sum_turnover_points : 0 }} บาท</h2>
          </div>
           <!-- <div class="mt-5">
            <h2 class="lg:text-xl">จำนวนคนซื้อ</h2>
            <h2 class="lg:text-xl">{{ lotteryReport.balance ? lotteryReport.balance.count_user_buy : 0 }} คน</h2>
          </div> -->
        </div>
        <div class="grid-rows-2 text-theme-36 border-r-2 border-gray-400 p-2">
          <div>
            <h2 class="lg:text-xl">จำนวนคนซื้อ (Credit/Point)</h2>
            <h2 class="lg:text-xl">
              {{ lotteryReport.balance ? lotteryReport.balance.count_user_buy : 0 }} /
              {{ lotteryReport.balance ? lotteryReport.balance.count_user_points_buy : 0 }}
            คน</h2>
          </div>
          <div class="mt-5">
            <h2 class="lg:text-xl">จำนวน point ที่แจก</h2>
            <h2 class="lg:text-xl">{{ lotteryReport.balance ? lotteryReport.balance.pay_points : 0 }} point</h2>
          </div>
        </div>
        <div class="grid-rows-2 text-red-600 border-r-2 border-gray-400 p-2">
          <div>
            <h2 class="lg:text-xl">ยอดจ่ายถูกรางวัล</h2>
            <h2 class="lg:text-xl">{{ lotteryReport.balance ? lotteryReport.balance.sum_prize : 0 }} บาท</h2>
          </div>
          <div class="mt-5">
            <h2 class="lg:text-xl">จำนวนคนถูก</h2>
            <h2 class="lg:text-xl">{{ lotteryReport.balance ? lotteryReport.balance.count_user_won : 0 }} คน</h2>
          </div>
        </div>
        <div class="grid-rows-2 text-red-400">
          <div>
            <h2 class="lg:text-xl">ยอดจ่ายตัวแทน</h2>
            <h2 class="lg:text-xl">{{lotteryReport.balance && lotteryReport.balance.pay_agent > 0
                ? lotteryReport.balance.pay_agent : 0}} บาท
            </h2>
          </div>
          <div class="mt-5">
            <h2 class="lg:text-xl">โบนัสตัวแทน</h2>
            <h2 class="lg:text-xl">{{lotteryReport.balance && lotteryReport.balance.pay_bonus_agent > 0
              ? lotteryReport.balance.pay_bonus_agent : 0}} บาท
            </h2>
          </div>
        </div>
        <!-- <div class="grid-rows-2 text-green-600 p-2">
          <div>
            <h2 class="lg:text-3xl">ยอดคงเหลือ</h2>
          </div>
          <div class="mt-5">
            <h2 class="lg:text-3xl">{{ lotteryReport.balance ? lotteryReport.balance.system_profit.toFixed(2) : 0 }}</h2>
            <h2 class="lg:text-xl">บาท</h2>
          </div>
        </div> -->
      </div>
      <div class="grid grid-flow-col grid-cols-1 gap-4 mt-5 ">
        <div class="grid-rows-2 text-green-600 p-2 border-2 border-gray-400">
          <div>
            <h2 class="lg:text-3xl">ยอดคงเหลือ</h2>
          </div>
          <div class="mt-5">
            <h2 class="lg:text-3xl">{{ lotteryReport.balance ? lotteryReport.balance.system_profit.toFixed(2) : 0 }} บาท</h2>
            <!-- <h2 class="lg:text-xl">บาท</h2> -->
          </div>
        </div>
      </div>
      </div>
      <div v-if="lotteryTypeId !== 4 && lotteryTypeId !== 5" class="col-span-12 lg:col-span-4 text-left mt-5 box py-4 px-4 overflow-x-auto">
        <div class="flex">
          <b>สรุปข้อมูล</b>
          <div class="ml-auto text-blue-500 truncate flex items-center cursor-pointer" @click="goToReportTurnOverBetNum()">
            ดูข้อมูลเพิ่มเติม
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-right block mx-auto block mx-auto">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </div>
        </div>
        <table class="table mt-5">
          <thead>
            <tr>
              <th v-for="(col,index) in tbSummarizeLotto.columns" :key="index" class="border-b-2 dark:border-dark-5 whitespace-nowrap">
                  <b>{{ col.label }}</b>
              </th>
            </tr>
          </thead>
          <tbody v-if="tbSummarizeLotto.rows.length > 0">
            <tr v-for="(data,index) in tbSummarizeLotto.rows" :key="index" class="border-b">
              <td>{{ data.lotto_type }}</td>
              <td>{{ data.total_bill }}</td>
              <td>{{ data.total_purchase }}</td>
              <td>
                <div v-if="data.top10_number.length > 0">
                  <span v-for="(number,index) in data.top10_number" :key="index">{{ number.bet_number }} <span v-if="index != data.top10_number.length-1">,</span></span>
                </div>
              </td>
              <!-- <td>{{ data.top10_number }}</td> -->
            </tr>
          </tbody>
        </table>
      </div>
      <div class="col-span-12 lg:col-span-4 text-left mt-5 box py-4 px-4 overflow-x-auto">
        <b>สรุปถูกรางวัล</b>
        <table class="table mt-5">
          <thead>
            <tr>
              <th v-for="(col,index) in tbSummarizeLottoResult.columns" :key="index" class="border-b-2 dark:border-dark-5 whitespace-nowrap">
                  <b>{{ col.label }}</b>
              </th>
            </tr>
          </thead>
          <tbody v-if="tbSummarizeLottoResult.rows.length > 0">
            <tr v-for="(data,index) in tbSummarizeLottoResult.rows" :key="index">
              <td>{{ data ? data.bet_type_name : '' }}</td>
              <td>
                <div v-if="data.bet_type_number.length > 0">
                  <span v-for="(num,index2) in data.bet_type_number" :key="index2">{{ num }}<span v-if="index2 != data.bet_type_number.length-1">, </span></span>
                </div>
              </td>
              <td>{{ data ? data.count_bill_winner : '' }}</td>
              <td>{{ data ? data.payout : '' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
  </div>
</template>
<script>
export default {
  props : ['lotteryReport','dateOfLottery','lotteryTypeId'],
  data() {
    return {
      //สรุปข้อมูล
      tbSummarizeLotto: {
        page: 1,
        columns: [
          { label: "ประเภท"},
          { label: "จำนวนบิลทั้งหมด"},
          { label: "ยอดซื้อ(บาท)"},
          { label: "10 ตัวเลขที่มีคนซื้อมากที่สุด"},
        ],
        rows: [],
        modalConfirmType : null,
        createRoomLottoDrawListValue : ''
      },
      //สรุปผู้ถูกรางวัล
      tbSummarizeLottoResult: {
        page: 1,
        columns: [
          { label: "ประเภท"},
          { label: "ผลรางวัล"},
          { label: "จำนวนบิลถูกทั้งหมด"},
          { label: "ยอดจ่าย(บาท)"},
        ],
        rows: [
          // {
          //   lotto_type : '',
          //   lottery_awards : '',
          //   count_total_bill_win : '',
          //   count_total_pay : ''
          // }
        ],
        modalConfirmType : null,
        createRoomLottoDrawListValue : ''
      },
    }
  },
  watch : {
    lotteryReport : 'setData'
  },
  methods : {
    setData() {
      // console.log('data',data);
      // let numxxx = 20.97999999
      // console.log('numxxx',numxxx.toFixed(2));
      // console.log(this.lotteryReport.report_data);
      this.tbSummarizeLotto.rows = this.lotteryReport.report_data.map((item) => {
        return {
          lotto_type : item ? item.name : '',
          total_bill : item ? item.CountBillDetail : '',
          total_purchase : item ? item.sum_turnover : '',
          top10_number : item ? item.TopTenNumber : ''
        }
      })


      let group_bet_types = [];

      for(let i = 0; i < this.lotteryReport.lotto_result.length; i++ ) {
        const _data = this.lotteryReport.lotto_result[i];

        const result = group_bet_types.findIndex(d => d.bet_type_id == _data.bet_type.id);

        if(result === -1) {
          group_bet_types.push({
            bet_type_id: _data.bet_type.id,
            bet_type_name : _data.bet_type.name,
            bet_type_number : [_data.result_number],
            count_bill_winner : _data.amount_won_bill,
            payout : _data.payout
          })
        } else {
          group_bet_types && group_bet_types[result] ? group_bet_types[result].bet_type_number.push(_data.result_number) : ''
        }
        // console.log('group_bet_types',group_bet_types);
        this.tbSummarizeLottoResult.rows = group_bet_types;
        // this.tbManageResultLottery.rows = group_bet_types;
      }
    },
    goToReportTurnOverBetNum() {
      this.$emit('goToReportTurnOverBetNum');
    }
  }
}
</script>
