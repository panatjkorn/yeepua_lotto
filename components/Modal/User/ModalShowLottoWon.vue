<template>
<!-- โชว์รางวัลที่ถูก -->
  <div>
    <div
        id="modal-show-lotto-won"
        class="modal"
        tabindex="-1"
        aria-hidden="true"
        data-backdrop="static"
      >
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <b>รางวัลที่ถูก</b>
          </div>
          <div class="modal-body px-14">
            <div class="grid grid-flow-col grid-rows-3 gap-4">
              <div>
                <div class="flex">
                  <div class="flex-none w-36">
                    งวดออกรางวัล :
                  </div>
                  <div class="flex-grow">
                    {{ dataBillWonById.lotto_round ? dataBillWonById.lotto_round.round_name : '' }}
                  </div>
                </div>
              </div>
              <div>
                <div class="flex">
                  <div class="flex-none w-36">
                    จำนวนที่ถูกรางวัล :
                  </div>
                  <div class="flex-grow">
                    {{ dataBillWonById.amount_number }}
                  </div>
                </div>
              </div>
              <div>
                <div class="flex">
                  <div class="flex-none w-36">
                    ยอดรวมทั้งหมด :
                  </div>
                  <div class="flex-grow">
                    {{ dataBillWonById.profit }}
                  </div>
                </div>
              </div>
            </div>
            <div v-if="lotteryTypeId < 4"> 
              <div v-for="(lotto,index) in dataGroupTypeBillWon" :key="index">
                <div class="bg-black text-white p-1 mt-2 rounded-sm flex px-2">
                  <b>{{ lotto.bet_type_name }}</b>
                  <span class="ml-auto"><b>[ {{ lotto.total_price }} บาท ]</b></span>
                </div>
                <div class="grid grid-flow-row auto-rows-max grid-cols-6 mt-1">
                  <div v-for="(num,index2) in lotto.bet_type_number" :key="index2" class="border border-black text-black p-2 rounded-md flex justify-center mr-2 text-bold mt-1">
                    <b>{{ num }}</b>
                  </div>
                </div>
              </div>
            </div>
            <div v-else>
                <div class="bg-black text-white p-1 mt-2 rounded-sm flex px-2">
                  <b>เลขที่ซื้อ</b>
                  <span class="ml-auto"><b>[ {{ sum_user_won }} บาท ]</b></span>
                </div>
                <div class="grid grid-flow-row auto-rows-max grid-cols-6 mt-1">
                  <!-- <pre>{{dataGroupTypeBillWon}}</pre> -->
                  <div v-for="(num,index2) in dataGroupTypeBillWon" :key="index2" class="border border-black text-black p-2 rounded-md flex justify-center mr-2 text-bold mt-1">
                    <b>{{ num.bet_number }}</b>
                  </div>
                </div>
            </div>
          
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary w-24 mr-1 mb-2 text-center" data-dismiss="modal">
              ปิด
            </button>
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
      dataGroupTypeBillWon : '',
      sum_user_won : ''
      // detail : [
      //   {
      //     amount: 500,
      //     bet_number: "111",
      //     bet_type: {
      //       id: 1,
      //       name: "3 ตัวบน"
      //     },
      //     id: 44
      //   },
      //   {
      //     amount: 600,
      //     bet_number: "222",
      //     bet_type: {
      //       id: 1,
      //       name: "3 ตัวบน"
      //     },
      //     id: 44
      //   },
      //   {
      //     amount: 700,
      //     bet_number: "333",
      //     bet_type: {
      //       id: 1,
      //       name: "3 ตัวบน"
      //     },
      //     id: 44
      //   },
      //   {
      //     amount: 250,
      //     bet_number: "44",
      //     bet_type: {
      //       id: 2,
      //       name: "2 ตัวบน"
      //     },
      //     id: 44
      //   },
      //   {
      //     amount: 350,
      //     bet_number: "555",
      //     bet_type: {
      //       id: 3,
      //       name: "3 ตัวล่าง"
      //     },
      //     id: 44
      //   },
      // ]
    }
  },
  props : ['dataBillWonById','lotteryTypeId'],
  watch : {
    dataBillWonById : 'setDataBillWon'
  },
  methods : {
    setDataBillWon(data) {
      //group data bill
      this.groupDataBillWon(data.bill_details);
    },
    groupDataBillWon(data) {
      // console.log('data',data);
      let group_bet_types = [];
      let total_price = [];

      if(this.lotteryTypeId < 4) {
        if(data.length > 0) {
          for(let i of data) {
            const result = group_bet_types.findIndex(d => d.bet_type_id == i.bet_type.id);

            if(result === -1) {
              group_bet_types.push({
              bet_type_id: i.bet_type.id,
              bet_type_name : i.bet_type.name,
              bet_type_number : [i.bet_number],
              total_price : i.amount,
            })
            } else {
              group_bet_types && group_bet_types[result] ? group_bet_types[result].bet_type_number.push(i.bet_number) : '',
              group_bet_types && group_bet_types[result] ? group_bet_types[result].total_price += i.amount : ''
            }
          }
        }
        this.dataGroupTypeBillWon = group_bet_types;
      } else {
        for(let i = 0; i < data.length; i++) {

          group_bet_types.push({
            bet_number : data[i].bet_number,
          })

          total_price.push(data[i].amount)
        }
        // console.log('total_price',total_price.reduce((previousValue, currentValue) => previousValue + currentValue));
        this.sum_user_won = total_price.reduce((previousValue, currentValue) => previousValue + currentValue);
        // console.log('group_bet_types',group_bet_types);
        // group_bet_types = data.map((item) => {
        //   return {
        //     bet_number : item ? item.bet_number : ''
        //   }
        // })
        this.dataGroupTypeBillWon = group_bet_types;
      }
      // console.log('dataGroupTypeBillWon',this.dataGroupTypeBillWon);
    }
  }
}
</script>
