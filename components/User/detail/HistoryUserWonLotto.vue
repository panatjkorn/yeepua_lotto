<template>
  <div>
    <b class="text-xl">ประวัติการถูกรางวัล</b>
    <div class="box grid justify-self-center p-5 lg:px-5 mt-3 overflow-x-auto">
        <p>เลือกงวด</p>
        <div class="flex mt-2">
          <div class="flex-initial">
            <select v-model="filterLottoType" name="" id="" class="form-select box lg:w-auto w-auto mt-5 lg:mt-0 mr-auto">
              <option value="">เลือกประเภทหวย</option>
              <option v-for="(type,index) in dd_lotto_type" :key="index" :value="type.id">{{type.name}}</option>
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
          <p class="ml-auto">จำนวนรายการ {{ dataShowBillsWon.bills && dataShowBillsWon.bills.length > 0 
            ? dataShowBillsWon.bills.length : 0 }} รายการ</p>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th v-for="(col,index) in tbShowUserWonLotto.columns" :key="index" class="border-b-2 dark:border-dark-5 whitespace-nowrap">
                <b>{{ col.label }}</b>
              </th>
            </tr>
          </thead>
          <tbody v-if="tbShowUserWonLotto.rows.length > 0">
              <tr v-for="(data,index) in tbShowUserWonLotto.rows" :key="index" :class="{'bg-gray-200 dark:bg-dark-1' : index%2 == 0}">
                <td>{{ data.lotto_round_name }}</td>
                <td>{{ data.lottery_type }}</td>
                <td>{{ data.amount_number_won }}</td>
                <td>{{ data.profit }}</td>
                <td>
                  <button class="btn btn-dark w-24 mr-1 mb-2" @click="showLottoWon(data)">รางวัลที่ถูก</button>
                </td>
              </tr>
          </tbody>
        </table>
      </div>
  </div>
</template>
<script>
export default {
  props : ['dataShowBillsWon','dropdownLottoType','dropdownLottoRound'],
  data() {
    return {
      tbShowUserWonLotto: {
        page: 1,
        columns: [
          { label: "งวดออกรางวัล"},
          { label : "ประเภทหวย"},
          { label: "จำนวนถูกรางวัล(เลข)"},
          { label: "ยอดที่ได้รับ"},
          { label: "ตัวเลือก"},
        ],
        rows: [],
      },
      filterLottoType : '',
      filterLottoRound : '',
      dd_lotto_type : '',
      dd_lotto_round : ''
    }
  },
  watch : {
    dataShowBillsWon : 'setDataShowBillsWon',
    dropdownLottoType : 'setDropdownLottoType',
    filterLottoType : 'changeLottoTypeFilter',
    dropdownLottoRound : 'setDropdownLottoRound',
    filterLottoRound : 'filterHistoryWonLotto'
  },
  methods : {
    showLottoWon(data) {
      this.$emit('modalShowLottoWon',data)
    },
    setDataShowBillsWon(data) {
      // console.log('data',data.bills);
      // console.log('data.length',data.bills.length);
      if(data && data.bills && data.bills.length > 0) {
        this.tbShowUserWonLotto.rows = data.bills.map((item) => {
          return {
            lotto_round_name : item.lotto_round ? item.lotto_round.round_name : '',
            lottery_type : item.lotto_round && item.lotto_round.lotto ? item.lotto_round.lotto.name : '',
            amount_number_won : item ? item.amount_number_won : '',
            profit : item ? item.profit : '',
            bill_id : item ? item.id : '',
            lotto_type_id : item.lotto_round && item.lotto_round.lotto ? item.lotto_round.lotto.id : ''
          }
        })
      }
    },
    setDropdownLottoType(data) {
      this.dd_lotto_type = data;
    },
    //get lotto round when change lotto type
    changeLottoTypeFilter(data) {
      if(data != '') {
        this.$emit('getDataDropdownLottoRoundFilter',data);
      } else {
        //ถ้ากด lotto type กลับมาเปนค่าว่างให้รี filter lotto round
        this.dd_lotto_round = '';
        this.filterLottoRound = '';
        this.$emit('filterHistoryWonLotto',data);
      }

    },
    setDropdownLottoRound(data) {
      this.dd_lotto_round = data;
    },
    //filter history won lottery
    filterHistoryWonLotto(data) {
      this.$emit('filterHistoryWonLotto',data);
    }
  }
}
</script>
