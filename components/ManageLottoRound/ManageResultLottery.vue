<template>
  <div>
    <div class="box overflow-x-auto mt-5">
      <div class="grid grid-flow-col grid-cols-2 gap-4 mt-5 py-4 px-4">
        <div class="flex items-center">
          <b>ประกาศผลรางวัล</b>
        </div>
        <div class="flex ml-auto items-center">
          <button
            :class="{
              'bg-blue-500 text-white mr-2' :
                dataResultLottery.lotto_results &&
                dataResultLottery.lotto_results.length > 0 ||
                dataLottoRoundById.lotto_round_status &&
                dataLottoRoundById.lotto_round_status.id <= 4,
            'bg-gray-200 text-black' :
              dataResultLottery.lotto_results &&
              dataResultLottery.lotto_results.length == 0 ||
              dataLottoRoundById.lotto_round_status &&
              dataLottoRoundById.lotto_round_status.id > 4}"
            :disabled="dataResultLottery.lotto_results
            && dataResultLottery.lotto_results.length == 0 ||
            dataLottoRoundById.lotto_round_status &&
            dataLottoRoundById.lotto_round_status.id > 4"
            class="btn"
            @click="processUserWinnerLotto()"
          >ประมวลผลผู้ถูกรางวัล
          </button>
          <button
            :class="{
              'bg-yellow-500' :
              dataLottoRoundById.lotto_round_status &&
              dataLottoRoundById.lotto_round_status.id == 3,
            'bg-gray-200 text-black' :
            dataLottoRoundById.lotto_round_status &&
            dataLottoRoundById.lotto_round_status.id != 3}"
            class="btn"
            :disabled="dataLottoRoundById.lotto_round_status && dataLottoRoundById.lotto_round_status.id != 3"
            @click="manageLotteryResult()">จัดการผลรางวัล
          </button>
        </div>
      </div>
      <div class="col-span-12 lg:col-span-4 text-left px-4 overflow-x-auto">
        <!-- <pre>{{tbManageResultLottery}}</pre> -->
        <table class="table mt-2 mb-2">
          <thead>
            <tr>
              <th v-for="(col,index) in tbManageResultLottery.columns" :key="index" class="border-b-2 dark:border-dark-5 whitespace-nowrap">
                  <b>{{ col.label }}</b>
              </th>
            </tr>
          </thead>
          <tbody v-if="tbManageResultLottery.rows.length > 0">
            <tr v-for="(data,index) in tbManageResultLottery.rows" :key="index" class="border-b-2">
              <td class="w-36"><b>{{ data ? data.bet_type_name : '' }} :</b></td>
              <td>
                <span v-for="(num,index2) in data.bet_type_number" :key="index2">{{ num }} <span v-if="index2 != data.bet_type_number.length-1"> ,</span></span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  props : ['dataResultLottery','dataLottoRoundById'],
  data() {
    return {
      tbManageResultLottery: {
        page: 1,
        columns: [
          // { label: "ประกาศผลรางวัล"},
        ],
        rows: [
          // {
          //   lotto_type : '6 ตัว รางวัลที่ 1',
          //   lotto_number : '046750'
          // },
          // {
          //   lotto_type : '6 ตัว รางวัลที่ 1',
          //   lotto_number : '046750'
          // },
        ],
        modalConfirmType : null,
        createRoomLottoDrawListValue : '',
        lottery_type_ID : ''
      },
    }
  },
  watch : {
    dataResultLottery : 'setDataResultLottery'
  },
  created() {
    this.lottery_type_ID = this.$route.params.id;
  },
  methods : {
    manageLotteryResult() {
      this.$emit('modalManageLotteryResult')
    },
    setDataResultLottery(data) {
      let group_bet_types = [];
      // console.log(data.result_number.split(',')[0].length);
      // console.log(data.result_number);
      if(data.result_number != null) {
        group_bet_types.push({
          // bet_type_name : `${data ? data.result_number ? data.result_number.length : '' : '' } ตัวรางวัลที่ 1`,
          bet_type_name : `${data && data.result_number &&  data.result_number != null && data.result_number.length < 10
          ? data.result_number.length : data.result_number.split(',')[0].length } ตัวรางวัลที่ 1`,
          bet_type_number : data ? [data.result_number] : ''
        })
      }

      for(let i of data.lotto_results) {

        const result = group_bet_types.findIndex(d => d.bet_type_id == i.bet_type.id);
        if(result === -1) {
          group_bet_types.push({
            bet_type_id: i.bet_type.id,
            bet_type_name : i.bet_type.name,
            bet_type_number : [i.result_number]
          })
        } else {
          group_bet_types && group_bet_types[result] ? group_bet_types[result].bet_type_number.push(i.result_number) : ''
        }

        this.tbManageResultLottery.rows = group_bet_types;
      }

    },
    processUserWinnerLotto() {
      this.$emit('processWinnerLotto');
    }
  }
}
</script>
