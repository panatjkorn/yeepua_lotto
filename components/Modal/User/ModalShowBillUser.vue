<template>
<!-- modal show bill user -->
  <div>
    <div
        id="modal-show-bill-user"
        class="modal overflow-auto max-h-screen"
        tabindex="-1"
        aria-hidden="true"
        data-backdrop="static"
      >
      <div class="modal-dialog modal-xl ">
        <div class="modal-content">
          <div class="modal-header">
            <b>รายการซื้อ</b>
          </div>
          <div class="modal-body px-14">
            <div class="grid grid-flow-col grid-rows-3 gap-4">
              <div>
                <div class="flex">
                  <div class="flex-none w-36">
                    งวดออกรางวัล :
                  </div>
                  <div class="flex-grow">
                    {{ dataBillUserById && dataBillUserById.lotto_round ? dataBillUserById.lotto_round.round_name : '' }}
                  </div>
                </div>
              </div>
              <div>
                <div class="flex">
                  <div class="flex-none w-36">
                    จำนวนที่ซื้อ :
                  </div>
                  <div class="flex-grow">
                    {{ dataBillUserById ? dataBillUserById.amount_number : '' }} เลข
                  </div>
                </div>
              </div>
              <div>
                <div class="flex">
                  <div class="flex-none w-36">
                    ยอดรวมทั้งหมด :
                  </div>
                  <div class="flex-grow">
                    {{ dataBillUserById ? dataBillUserById.turnover : '' }} บาท
                  </div>
                </div>

              </div>
            </div>
            <div>
            </div>
            <hr class="mt-3 mb-3">

            <b>รายการซื้อ</b>
            <div v-if="lottoTypeId < 4">
              <div v-if="dataGroupBetType.length > 0" class="mt-3">
                <div v-for="(lotto,index) in dataGroupBetType" :key="index">
                  <b>{{lotto.bet_type_name}}</b>
                  <div class="grid grid-flow-row auto-rows-max grid-cols-6 mt-2 mb-2 gap-2">
                    <div v-for="(number,index2) in lotto.bet_type_number" :key="index2" >
                      <div  class="p-3 border border-black align-center text-center rounded-md">
                        <b class="break-words">{{number}}</b>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else>
              <div class="grid grid-flow-row auto-rows-max grid-cols-6 mt-2 mb-2 gap-2">
                <div v-for="(number,index2) in dataGroupBetType" :key="index2" >
                  <div  class="p-3 border border-black align-center text-center rounded-md">
                    <b class="break-words">{{number.bet_number}}</b>
                  </div>
                </div>
              </div>
            </div>

            <!-- <div v-if="dataBillUserById && dataBillUserById.bill_details.length > 0" class="grid grid-flow-row auto-rows-max grid-cols-6 mt-3 gap-2">
              <div v-for="(bill,index) in dataBillUserById.bill_details" :key="index" class="p-3 border border-black align-center text-center rounded-md">
                <b class="break-words ">{{ bill ? bill.bet_number : '' }}</b>
              </div>
            </div> -->
          </div>
          <div class="modal-footer text-center">
            <button class="btn btn-secondary w-24 mr-1 mb-2" data-dismiss="modal">
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
  props : ['lottoTypeId','dataBillUserById'],
  data() {
    return {
      dataGroupBetType : '',

      // dataTest : [
      //   {
      //     amount: 100,
      //     bet_number: "123",
      //     bet_type: {
      //       id: 1,
      //       name: "3 ตัวบน"
      //     },
      //     id: 33
      //   },
      //   {
      //     amount: 100,
      //     bet_number: "44",
      //     bet_type: {
      //       id: 2,
      //       name: "2 ตัวบน"
      //     },
      //     id: 33
      //   },
      //   {
      //     amount: 100,
      //     bet_number: "333",
      //     bet_type: {
      //       id: 1,
      //       name: "3 ตัวบน"
      //     },
      //     id: 33
      //   },
      //   {
      //     amount: 100,
      //     bet_number: "555",
      //     bet_type: {
      //       id: 1,
      //       name: "3 ตัวบน"
      //     },
      //     id: 33
      //   },
      //   {
      //     amount: 100,
      //     bet_number: "666",
      //     bet_type: {
      //       id: 3,
      //       name: "3 ตัวท้าย"
      //     },
      //     id: 33
      //   },
      // ]
    }
  },
  watch : {
    dataBillUserById : 'setDataBillUser'
  },
  methods : {
    setDataBillUser(data) {
      
      
      let group_bet_types = [];

      if(this.lottoTypeId < 4) {
        for(let i of data.bill_details) {

          const result = group_bet_types.findIndex(d => d.bet_type_id == i.bet_type.id);

          if(result === -1) {
            group_bet_types.push({
              bet_type_id: i.bet_type.id,
              bet_type_name : i.bet_type.name,
              bet_type_number : [i.bet_number],
            })
          } else {
            group_bet_types && group_bet_types[result] ? group_bet_types[result].bet_type_number.push(i.bet_number) : ''
          }
          this.dataGroupBetType = group_bet_types;
          // console.log('dataGroupBetType',this.dataGroupBetType);
        }

      } else {
        // console.log(data);
        if(data.bill_details && data.bill_details.length > 0) {
          this.dataGroupBetType = data.bill_details.map((item) => {
            return {
              bet_number : item ? item.bet_number : ''
            }
          })
        }
      }

      

    }
  }
}
</script>
