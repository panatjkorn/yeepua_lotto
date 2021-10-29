<template>
  <div>
    <div
        id="modal-show-detail-bill-won"
        class="modal"
        tabindex="-1"
        aria-hidden="true"
        data-backdrop="static"
      >
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header text-xl">
            <b>รายละเอียดบิล</b>
          </div>
          <div class="modal-body py-5 px-8 overflow-y-auto h-screen">
            <div class="bg-yellow-100 rounded-sm">
              <div class="grid grid-flow-col grid-rows-6 gap-2 p-4 pb-2">
                <div class="flex">
                  <div class="flex-none w-28"><b> รหัสบิล : </b></div>
                  <div class="flex-grow">{{ dataBillWonById ? dataBillWonById.bill_code : '' }}</div>
                </div>
                <div class="flex">
                  <div class="flex-none w-28"><b> ประเภทบิล : </b></div>
                  <div class="flex-grow">{{ dataBillWonById && dataBillWonById.is_points == true ? 'point' : 'credit' }}</div>
                </div>
                <div class="flex">
                  <div class="flex-none w-28"><b>วันที่ซื้อ : </b></div>
                  <div class="flex-grow">{{ dataBillWonById ? convertDateTime(dataBillWonById.created_at) : '' }}</div>
                </div>
                <div class="flex">
                  <div class="flex-none w-28"><b>เบอร์โทร : </b></div>
                  <div class="flex-grow">{{ dataBillWonById && dataBillWonById.user ? dataBillWonById.user.phone_number : '' }}</div>
                </div>
                <div class="flex">
                  <div class="flex-none w-28"><b>ชื่อบัญชี : </b></div>
                  <div class="flex-grow">
                    <div v-if="dataBillWonById && dataBillWonById.user && dataBillWonById.user.user_bank_accounts.length > 0">
                      <p v-for="(bankAccount,index) in dataBillWonById.user.user_bank_accounts" :key="index">{{ bankAccount.bank_account_name }}</p>
                    </div>
                  </div>
                </div>
                <div class="flex">
                  <div class="flex-none w-28"><b>ยอดซื้อ : </b></div>
                  <div class="flex-grow">{{ dataBillWonById ? dataBillWonById.turnover : '' }} บาท</div>
                </div>
                <!-- <div class="flex text-red-500">
                  <div class="flex-none w-28"><b>ยอดถูกรางวัล : </b></div>
                  <div class="flex-grow">{{ dataBillWonById ? dataBillWonById.profit : '' }} บาท</div>
                </div> -->
              </div>
              <div class="grid grid-flow-col grid-rows-1 gap-2 p-4 pt-0">
                <div class="flex text-red-500">
                  <div class="flex-none w-28"><b>ยอดถูกรางวัล : </b></div>
                  <div class="flex-grow">{{ dataBillWonById ? dataBillWonById.profit : '' }} บาท</div>
                </div>
              </div>
            </div>
            <div class="flex mt-4">
              <b>รายการตัวเลขในบิล</b>
              <select v-if="lottery_type_ID != 4 && lottery_type_ID != 5" 
                v-model="filter_type_lotto" 
                name="filter_type_lotto" 
                id="filter_type_lotto" 
                class="form-control w-auto ml-auto" 
                @change="filterDetailBillByType()"
              >
                <option value="">ประเภทหวย</option>
                <option v-for="(type,index) in dropdownLottoType" :key="index" :value="type.id">{{ type.name }}</option>
              </select>
            </div>
            <table class="table mt-5">
              <thead>
                <tr>
                  <th v-for="(col,index) in columnShow" :key="index" class="border-b-2 dark:border-dark-5 whitespace-nowrap">
                      <b>{{ col.label }}</b>
                  </th>
                </tr>
              </thead>
              <tbody v-if="tbShowDetailBillWonUser.rows.length > 0">
                <tr v-for="(data,index) in tbShowDetailBillWonUser.rows" :key="index">
                  <td>
                    <div v-if="data.lotto_type != null">{{ data.lotto_type }}</div>
                    <div v-else>
                      <p v-for="(type,index2) in data.lotto_type_blueswan" :key="index2">
                        {{type.bet_type ? type.bet_type.name : ''}} 
                      </p>
                    </div>
                  </td>
                  <td :class="{'text-red-500' : data.status_closed_num == 2}">{{ data.lotto_number }}</td>
                  <td>{{ data.bet_price }}</td>
                  <td v-if="lottery_type_ID != 4 && lottery_type_ID != 5">{{ data.price_to_pay }}</td>
                  <td>{{ data.prize }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="modal-footer">
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

const LOTTO_GLO = 1;
const LOTTO_BLUESWAN = 4;
const LOTTO_GSB = 2;
const LOTTO_BAAC = 3;
const LOTTO_SHARE_BLUESWAN = 5;
const LOTTO_SHARE_BLUESWAN_THAI = 6; //หวยหุ้นไทย
const LOTTO_LAO = 7; //หวยลาว
const LOTTO_HANOI = 8; //หวยฮานอย

import moment from 'moment'
export default {
  props : ['dataBillWonById','dropdownLottoType'],
  data() {
    return {
      tbShowDetailBillWonUser: {
        page: 1,
        columns: [
          { label: "ประเภท"},
          { label: "เลข"},
          { label: "ราคาแทง(บาท)"},
          { label: "ราคาจ่าย(บาทละ)",showTabStatus : [LOTTO_GLO,LOTTO_GSB,LOTTO_BAAC,LOTTO_SHARE_BLUESWAN_THAI,LOTTO_LAO,LOTTO_HANOI]},
          { label: "ยอดถูกรางวัล (บาท)"},
        ],
        rows: [],
        modalConfirmType : null,
        createRoomLottoDrawListValue : ''
      },
      detailBill : '',
      dd_type_of_lottery : [
        {label : 'ประเภททั้งหมด' , value : ''},
        {label : '3 ตัวบน' , value : 1},
        {label : '3 ตัวโต๊ด' , value : 2},
        {label : '3 ตัวหน้า' , value : 3},
        {label : '3 ตัวท้าย' , value : 4},
        {label : '2 ตัวบน' , value : 5},
        {label : '2 ตัวล่าง' , value : 6},
        {label : 'วิ่งบน' , value : 7},
        {label : 'วิ่งล่าง' , value : 8},
      ],
      filter_type_lotto : '',
      lottery_type_ID : ''
    }
  },
  watch : {
    dataBillWonById : 'setDataBillWonByID'
  },
  created() {
    this.lottery_type_ID = parseInt(this.$route.params.id);
    // console.log(this.$route.params.id);
    // if(this.lottery_type_ID >= 4) {
    //   //เช็คว่าถ้าเปนหวยหงส์ฟ้า type 4 และ 5 ไม่ให้มี type หวย
    //   this.tbShowDetailBillWonUser.columns.splice(0,1)
    // }
  },
  computed : {
    columnShow() {
      return this.tbShowDetailBillWonUser.columns.filter(
        (col) =>
          !col.showTabStatus || col.showTabStatus.includes(this.lottery_type_ID)
      );
    },
  },
  methods : {
    setDataBillWonByID(data) {
      // console.log('dataaa',data);
      if(data.bill_details.length > 0) {
        this.tbShowDetailBillWonUser.rows = data.bill_details.map((item) => {
          // console.log(item);
          return {
            lotto_type : item.bet_type != null ? item.bet_type.name : null,
            lotto_type_blueswan : item ? item.sub_bill_details : '',
            lotto_number : item ? item.bet_number : '',
            bet_price : item ? item.amount : '',
            price_to_pay : item ? item.pay_ratio : '',
            prize : item ? item.prize : '',
            status_closed_num : item.bill_detail_status ? item.bill_detail_status.id : ''
          }
        })
      } else {
        this.tbShowDetailBillWonUser.rows = [];
      }
    },
    convertDateTime(dateTime) {
      return moment(dateTime).format("YYYY-MM-DD HH:mm");
    },
    filterDetailBillByType() {
      this.$emit('filterDetailBillWonByType',this.filter_type_lotto)
    }
  }
}
</script>
