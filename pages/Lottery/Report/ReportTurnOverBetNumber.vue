<template>
    <div>
      <div class="col-span-12 lg:col-span-4 text-left mt-5 box py-4 px-6 overflow-x-auto">
        <div class="flex">
          <b>สรุปข้อมูลเลขที่มีคนซื้อมากที่สุด</b>
        </div>
        <div class="grid grid-flow-col grid-cols-auto gap-4 mt-5">
          <div v-for="(lotto_group,index) in tbOverBetNumber.columns" :key="index">
            {{lotto_group.name}}
            <div v-for="(num,index2) in lotto_group.BetNumbers" :key="index2" 
              class="p-2 pl-0 grid justify-items-stretch mt-2">
              <div class="flex">
                <div class="bg-gray-800 text-white w-10 rounded-sm text-center mr-1">
                  {{num.bet_number}} 
                </div>
                {{num.sum_turnover}}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-span-12 lg:col-span-4 text-left mt-5 box py-4 px-6 overflow-x-auto">
        <div class="flex">
          <b>สรุปข้อมูลเลขที่มีคนซื้อเต็มยอด</b>
          <select v-model="filter_bet_type_id" name="" id="" 
            class="sm:ml-auto mt-3 sm:mt-0 sm:w-auto form-select box ml-auto" @change="getNumberMaxBet()">
            <option value="">เลือก type หวย</option>
            <option v-for="(type,index) in dd_roundLotto" :key="index" :value="type">
              {{type.bet_type ? type.bet_type.name : ''}}
            </option>
          </select>
        </div>
        <div>
          <b>{{filter_bet_type_id && filter_bet_type_id.bet_type ? filter_bet_type_id.bet_type.name : ''}}</b>
          <div 
            v-if="data_maxbet_number && data_maxbet_number.round_numbers && data_maxbet_number.round_numbers.length > 0"
            class="grid grid-flow-row auto-rows-max grid-cols-4 md:grid-cols-12 mt-3">
            <div 
                v-for="(number,index) in data_maxbet_number.round_numbers" :key="index" 
                class="bg-gray-200 text-black p-2 rounded-md text-center mr-2 mt-1"
              >
              <div >{{number ? number.number : ''}}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-span-12 lg:col-span-4 text-left mt-5 box py-4 px-6 overflow-x-auto">
        <div class="flex">
          <b>สรุปข้อมูลเลขที่ถูกปิดการขาย</b>
          <select v-model="filter_num_closed" name="" id="" 
            class="sm:ml-auto mt-3 sm:mt-0 sm:w-auto form-select box ml-auto" @change="getNumberClosed()">
            <option value="">เลือก type หวย</option>
            <option v-for="(type,index) in dd_roundLotto" :key="index" :value="type">
              {{type.bet_type ? type.bet_type.name : ''}}
            </option>
          </select>
        </div>
        <div>
          <b>{{filter_num_closed && filter_num_closed.bet_type ? filter_num_closed.bet_type.name : ''}}</b>
          <div 
            v-if="data_num_closed && data_num_closed.round_numbers && data_num_closed.round_numbers.length > 0"
            class="grid grid-flow-row auto-rows-max grid-cols-4 md:grid-cols-12 mt-3">
            <div 
                v-for="(number,index) in data_num_closed.round_numbers" :key="index" 
                class="bg-gray-200 text-black p-2 rounded-md text-center mr-2 mt-1"
              >
              <div >{{number ? number.number : ''}}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-span-12 lg:col-span-4 text-left mt-5 box py-4 px-6 overflow-x-auto">
        <div class="flex">
          <b>สรุปข้อมูลเลขที่ถูกยกเลิก</b>
          <select v-model="filter_num_cancel" name="" id="" 
            class="sm:ml-auto mt-3 sm:mt-0 sm:w-auto form-select box ml-auto" @change="getNumberCancel()">
            <option value="">เลือก type หวย</option>
            <option v-for="(type,index) in dd_roundLotto" :key="index" :value="type">
              {{type.bet_type ? type.bet_type.name : ''}}
            </option>
          </select>
        </div>
        <div>
          <b>{{filter_num_cancel && filter_num_cancel.bet_type ? filter_num_cancel.bet_type.name : ''}}</b>
          <div 
            v-if="data_num_cancel && data_num_cancel.round_numbers && data_num_cancel.round_numbers.length > 0"
            class="grid grid-flow-row auto-rows-max grid-cols-4 md:grid-cols-12 mt-3">
            <div 
                v-for="(number,index) in data_num_cancel.round_numbers" :key="index" 
                class="bg-gray-200 text-black p-2 rounded-md text-center mr-2 mt-1"
              >
              <div >{{number ? number.number : ''}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>
<script>
export default {
    layout : 'dashboard',
    data() {
        return {
            lottery_type_ID : '',
            lottery_round_ID : '',
            turnOverBetNumber : '', //เลขที่มีคนซื้อเยอะที่สุด
            tbOverBetNumber: {
                page: 1,
                columns: [],
                rows: [
                  
                ],
                modalConfirmType : null,
                createRoomLottoDrawListValue : ''
            },
            dd_roundLotto : '',
            filter_bet_type_id : '',
            data_maxbet_number : '',
            filter_num_closed : '',
            data_num_closed : '',
            filter_num_cancel : '',
            data_num_cancel : ''
        }
    },
    async created() {
        this.lottery_type_ID = await this.$route.query.lottery_type_ID;
        this.lottery_round_ID = await this.$route.query.lottery_round_ID;
        this.getTurnoverBetNumbers();
        this.getRoundLottoDropdown();
    },
    methods : {
        async getTurnoverBetNumbers() {
            const url = `admin_manage_lotto/turnover/bet_numbers/${this.lottery_type_ID}/${this.lottery_round_ID}`; //TurnoverBetNumbers
            try {
                const getTurnOverBetNum = await this.$axios.get(url);
                // console.log('getTurnOverBetNum',getTurnOverBetNum.data.data);
                this.tbOverBetNumber.columns = getTurnOverBetNum.data.data;
                this.tbOverBetNumber.rows = getTurnOverBetNum.data.data;
            } catch(err) {
                console.log(err);
            }
        },
        async getRoundLottoDropdown() {
          const url = `admin_manage_lotto/round_pay_ratio/bet_type/${this.lottery_round_ID}`; //GetRoundPayRatios
          try {
              const getRoundLottoDropdown = await this.$axios.get(url);
              // console.log('getRoundLottoDropdown',getRoundLottoDropdown.data.data);
              this.dd_roundLotto = getRoundLottoDropdown.data.data;
            } catch(err) {
              console.log(err);
            }
        },

        async getNumberMaxBet() {
          const url = `admin_manage_lotto/numbers/max_bet/${this.lottery_round_ID}/${this.filter_bet_type_id.bet_type_id}`; //NumberMaxBets

          try {
              const getNumberMaxbet = await this.$axios.get(url);
              // console.log('getNumberMaxbet',getNumberMaxbet);
              this.data_maxbet_number = getNumberMaxbet.data.data[0];
            } catch(err) {
              console.log(err);
          }
        },

        async getNumberClosed() {
          const url = `admin_manage_lotto/numbers/closed/${this.lottery_round_ID}/${this.filter_num_closed.bet_type_id}`; //NumberClosed

          try {
              const getNumberClosed = await this.$axios.get(url);
              // console.log('getNumberClosed',getNumberClosed);
              this.data_num_closed = getNumberClosed.data.data[0];
            } catch(err) {
              console.log(err);
          }
        },

        async getNumberCancel() {
          const url = `admin_manage_lotto/numbers/cancels/${this.lottery_round_ID}/${this.filter_num_cancel.bet_type_id}`; //NumberCancels

          try {
              const getNumberCancel = await this.$axios.get(url);
              // console.log('getNumberCancel',getNumberCancel);
              this.data_num_cancel = getNumberCancel.data.data[0];
            } catch(err) {
              console.log(err);
          }
        }
    }
}
</script>