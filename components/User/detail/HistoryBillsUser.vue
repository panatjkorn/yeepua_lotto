<template>
  <div>
    <!-- ประวัติการซื้อ -->
    <!-- <div v-if="openTab == 3" class="col-span-12 lg:col-span-8 p-3 lg:mt-3"> -->
      <b class="text-xl">ประวัติการซื้อ</b>
      <div class="box grid justify-self-center p-5 lg:px-5 mt-3 overflow-x-auto">
        <p>เลือกงวด</p>
         <div class="flex mt-2">
          <div class="flex-initial">
            <select v-model="filterLottoType" name="" id="" class="form-select box lg:w-auto w-auto mt-5 lg:mt-0 mr-auto">
              <option value="">เลือกประเภทหวย</option>
              <option v-for="(type,index) in dropdownLottoType" :key="index" :value="type.id">{{type.name}}</option>
            </select>
          </div>
          <div class="flex-initial ml-2">
            <select v-model="filterLottoRound" name="" id="" 
              class="form-select box lg:w-auto w-auto mt-5 lg:mt-0 mr-auto">
              <option value="">ทุกงวด</option>
              <option v-for="(ddRound,index) in dd_lotto_round" :key="index" :value="ddRound.id">
                {{ ddRound.round_name }}
              </option>
            </select>
          </div>
          <p class="ml-auto">จำนวนรายการ {{countBillUser}} รายการ</p>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th v-for="(col,index) in tbShowUserBuyLotto.columns" :key="index" class="border-b-2 dark:border-dark-5 whitespace-nowrap">
                <b>{{ col.label }}</b>
              </th>
            </tr>
          </thead>
          <!-- <pre>{{tbShowUserBuyLotto.rows}}</pre> -->
          <tbody v-if="tbShowUserBuyLotto.rows.length > 0">
              <tr 
              v-for="(data,index) in tbShowUserBuyLotto.rows" :key="index" 
              :class="{
                'bg-gray-200 dark:bg-dark-1' : index%2 == 0,
                'text-red-500' : data.bill_status == 2
              }"
              >
                <td>{{ data.lottery_draw_date }}</td>
                <td>{{ data.lottery_type }}</td>
                <td>{{ data.count_lottery }}</td>
                <td>{{ data.turnover }} <span v-if="data.is_points == true">(P)</span></td>
                <td>
                  <button class="btn btn-dark w-24 mr-1 mb-2" @click="showDetailBillUser(data)">ดูข้อมูล</button>
                </td>
              </tr>
          </tbody>
        </table>
      </div>
    <!-- </div> -->
  </div>
</template>
<script>
export default {
  props : ['dataBillsUser','dropdownLottoType','dropdownLottoRound'],
  data() {
    return {
      tbShowUserBuyLotto: {
        page: 1,
        columns: [
          { label: "งวดออกรางวัล"},
          { label : "ประเภทหวย"},
          { label: "จำนวน(เลข)"},
          { label: "ยอดซื้อ"},
          { label: "ตัวเลือก"},
        ],
        rows: [

        ],
      },
      filterLottoType : '',
      countBillUser : '',
      dd_lotto_round : '',
      filterLottoRound : ''
    }
  },
  watch : {
    dataBillsUser : 'setDataBillsUser',
    filterLottoType : 'changeLottoTypeFilter',
    dropdownLottoRound : 'setDropdownLottoRound',
    filterLottoRound : 'filterHistoryUserBuyLotto'
  },
  methods : {
    setDataBillsUser(data) {
      // console.log('data',data);
      this.countBillUser = data.total;
      this.tbShowUserBuyLotto.rows = data.bills.map((item) => {
        // console.log(item);
        return {
          lottery_draw_date : item.lotto_round ? item.lotto_round.round_name : '',
          lottery_type : item.lotto_round && item.lotto_round.lotto ? item.lotto_round.lotto.name : '',
          count_lottery : item ? item.amount_number : '',
          turnover : item ? item.turnover : '',
          bill_id : item ? item.id : '',
          lotto_type_id : item.lotto_round && item.lotto_round.lotto ? item.lotto_round.lotto.id : '',
          is_points : item.is_points ? item.is_points : false,
          bill_status : item.bill_status ? item.bill_status.id : ''
        }
      })
    },
    showDetailBillUser(data) {
      this.$emit('showDetailBillUser',data)
    },
    setDropdownLottoRound(data) {
      this.dd_lotto_round = data;
    },
    changeLottoTypeFilter(data) {
      if(data != '') {
        this.$emit('getDataDropdownLottoRoundFilter',data);
      } else {
        //ถ้ากด lotto type กลับมาเปนค่าว่างให้รี filter lotto round
        this.dd_lotto_round = '';
        this.filterLottoRound = '';
        this.$emit('filterHistoryUserBuyLotto',data);
      }
    },
    filterHistoryUserBuyLotto(data) {
      this.$emit('filterHistoryUserBuyLotto',data);
    }
  }
}
</script>
