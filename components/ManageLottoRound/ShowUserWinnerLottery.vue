<template>
  <div>
    <div class="box overflow-x-auto mt-5">
      <div class="grid grid-flow-col grid-cols-2 gap-4 mt-5 py-4 px-4">
        <div class="flex items-center">
          
          <b>รายการบิล <span class="text-blue-500">[ ทั้งหมด {{ dataUserBillWon ? dataUserBillWon.count_bill_won : '' }} บิล |
            {{ dataUserBillWon ? dataUserBillWon.sum_payout : 0 }} บาท ]</span></b>
        </div>
        <div class="flex ml-auto items-center">
          <b class="w-100 mr-2 w-32 lg:w-24">ค้นหา : </b>
          <select v-model="filter_type" class="w-36 lg:w-36 form-select box mt-3 sm:mt-0 mr-2">
            <option value="1">เบอร์โทร</option>
            <option value="2">รหัสบิล</option>
            <option value="3">ชื่อบัญชี</option>
          </select>
          <input v-model="search" type="text" placeholder="ค้นหา..." class="form-control mr-2" @keyup.enter="filterBillWonByType()">
          <button @click="filterBillWonByType()" class="btn bg-yellow-500 text-white mr-2">ค้นหา</button>
        </div>
      </div>
      <div class="col-span-12 lg:col-span-4 text-left px-4 overflow-x-auto">
        <table class="table mt-5">
          <thead>
            <tr>
              <th v-for="(col,index) in tbShowUserWinnerLottery.columns" :key="index" class="border-b-2 dark:border-dark-5 whitespace-nowrap">
                  <b>{{ col.label }}</b>
              </th>
            </tr>
          </thead>
          <tbody v-if="tbShowUserWinnerLottery.rows.length > 0">
            <tr v-for="(data,index) in tbShowUserWinnerLottery.rows" :key="index">
              <td>{{ data.num }}</td>
              <td>{{ data.datetime_buy }}</td>
              <td>{{ data.bill_tracking }}</td>
              <td>{{ data.is_points == true ? 'point' : 'credit'}}</td>
              <td>{{ data.phone }}</td>
              <td>
                <div v-if="data && data.account_name.length > 0">
                  <p v-for="(bankAccount,index) in data.account_name" :key="index">{{ bankAccount.bank_account_name }}</p>
                </div>
              </td>
              <td>{{ data.amount_purchase }}</td>
              <td>{{ data.amount_winner_price }}</td>
              <td>
                <button class="btn bg-blue-500 text-white" @click="modalShowDetailBillWonUser(data.id)">รายละเอียดบิล</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
export default {
  props : ['dataBillWon'],
  data() {
    return {
      tbShowUserWinnerLottery: {
        page: 1,
        columns: [
          { label: "#"},
          { label: "วันที่ซื้อ"},
          { label: "รหัสบิล"},
          { label: "ประเภทบิล"},
          { label: "เบอร์โทร"},
          { label: "ชื่อบัญชี"},
          { label: "ยอดซื้อ(บาท)"},
          { label: "ยอดถูกรางวัล(บาท)"},
          { label: "ตัวเลือก"},
        ],
        rows: [
          // {
          //   num : '1',
          //   datetime_buy : '18/7/2564 10:00',
          //   bill_tracking : 'JUL-0000001',
          //   phone : '0611111111',
          //   account_name : 'testttttttttt',
          //   amount_purchase : '1000',
          //   amount_winner_price : '1000',
          //   id : '1'
          // },
        ],
        modalConfirmType : null,
        createRoomLottoDrawListValue : '',
      },
      filter_type : 1,
      search : '',
      dataUserBillWon : ''
    }
  },
  watch : {
    dataBillWon : 'setDataBillWonLottery'
  },
  methods : {
    setDataBillWonLottery(data) {
      this.dataUserBillWon = data;
      // console.log(data);

        this.tbShowUserWinnerLottery.rows = data.bills.map((item,index) => {
          // console.log(item);
          return {
            num : index+1,
            datetime_buy : item ? moment(item.created_at).format("YYYY-MM-DD HH:mm") : '',
            bill_tracking : item ? item.bill_code : '',
            is_points : item ? item.is_points : '',
            phone : item.user ? item.user.phone_number : '',
            account_name : item.user && item.user.user_bank_accounts.length > 0 ? item.user.user_bank_accounts : '',
            amount_purchase : item ? item.turnover : '',
            amount_winner_price : item ? item.profit : '',
            id : item ? item.id : ''
          }
        })

    },
    modalShowDetailBillWonUser(bill_id) {
      this.$emit('modalShowDetailBillWon',bill_id)
    },
    filterBillWonByType() {
      const _data = {
        type_id : this.filter_type,
        search : this.search
      }
      this.$emit('filterBillWonByType',_data);
    }
  }
}
</script>
