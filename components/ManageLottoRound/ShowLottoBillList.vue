<template>
  <div>
    <div class="box overflow-x-auto">
      <div class="grid grid-flow-col grid-cols-2 gap-4 mt-5 py-4 px-4">
        <div class="flex items-center">
          <!-- <pre>{{ dataBillList }}</pre> -->
          <b>รายการบิล <span class="text-blue-500">[ ทั้งหมด {{ dataBillList ? dataBillList.count_bill : '' }} บิล | {{ dataBillList ? dataBillList.sum_turnover : '' }} บาท ]</span></b>
        </div>
        <div class="flex ml-auto items-center">
          <b class="w-100 mr-2 w-32 lg:w-24">ค้นหา : </b>
          <select v-model="search_type" class="w-36 lg:w-36 form-select box mt-3 sm:mt-0 mr-2">
            <option value="1">เบอร์โทร</option>
            <option value="2">รหัสบิล</option>
            <option value="3">ชื่อบัญชี</option>
          </select>
          <input v-model="search" type="text" placeholder="ค้นหา..." class="form-control mr-2" @keyup.enter="filterSearchBill()">
          <button class="btn bg-yellow-500 text-white mr-2" @click="filterSearchBill()">ค้นหา</button>
        </div>
      </div>
      <div class="col-span-12 lg:col-span-4 text-left px-4 overflow-x-auto">
        <table class="table mt-5">
          <thead>
            <tr>
              <th v-for="(col,index) in tbShowBillUser.columns" :key="index" class="border-b-2 dark:border-dark-5 whitespace-nowrap">
                  <b>{{ col.label }}</b>
              </th>
            </tr>
          </thead>
          <tbody v-if="tbShowBillUser.rows.length > 0">
            <tr v-for="(data,index) in tbShowBillUser.rows" :key="index">
              <td>{{ data.num }}</td>
              <td>{{ data.datetime_buy }}</td>
              <td>{{ data.bill_tracking }}</td>
              <td>{{ data.phone }}</td>
              <td><p v-for="(account,index) in data.account_name" :key="index">{{ account.name }}</p></td>
              <td>{{ data.amount_purchase }}</td>
              <td>{{ data.is_points == true ? 'point' : 'credit' }}</td>
              <td>
                <button class="btn bg-blue-500 text-white" @click="modalShowDetailBillUser(data.id)">รายละเอียดบิล</button>
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
  props : ['dataBillList'],
  data() {
    return {
      tbShowBillUser: {
        page: 1,
        columns: [
          { label: "#"},
          { label: "วันที่ซื้อ"},
          { label: "รหัสบิล"},
          { label: "เบอร์โทร"},
          { label: "ชื่อบัญชี"},
          { label: "ยอดซื้อ(บาท)"},
          { label: "ประเภทบิล"},
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
          //   id : '1'
          // },
        ],
        modalConfirmType : null,
        createRoomLottoDrawListValue : '',
      },
      search_type : '1',
      search : ''
    }
  },
  watch : {
    dataBillList : 'setDataBillList'
  },
  methods : {
    modalShowDetailBillUser(bill_id) {
      // console.log('id',bill_id);
      this.$emit('openModalShowDetailBillUser',bill_id)
    },
    setDataBillList(data) {
      this.tbShowBillUser.rows = data.bills.map((item,index) => {
        // console.log(item);
        return {
          num : index+1,
          datetime_buy : item ? moment(item.created_at).format("YYYY-MM-DD HH:mm") : '',
          bill_tracking : item ? item.bill_code : '',
          phone : item.user ? item.user.phone_number : '',
          account_name : item.user && item.user.user_bank_accounts.length > 0 ? item.user.user_bank_accounts.map((item2) => {
            // console.log('item2',item2.bank_account_name);
            return {
              name : item2 ? item2.bank_account_name : ''
            }
          }) : '',
          amount_purchase : item ? item.turnover : '',
          id : item ? item.id : '',
          is_points : item ? item.is_points : ''
        }
      })
    },
    filterSearchBill() {
      const _dataSearch = {
        search_type : this.search_type,
        search : this.search
      }
      this.$emit('filterSearchBill',_dataSearch)
    }
  }
}
</script>
