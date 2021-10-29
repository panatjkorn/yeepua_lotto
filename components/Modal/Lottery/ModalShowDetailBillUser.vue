<template>
  <div>
    <div
        id="modal-show-detail-bill"
        class="modal"
        tabindex="-1"
        aria-hidden="true"
        data-backdrop="static"
      >
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header text-xl">
            <b>รายละเอียดบิล</b>
            <!-- <pre>{{dataDetailBill}}</pre> -->
          </div>
          <div class="modal-body py-5 px-8 overflow-y-auto h-screen">
            <div class="bg-yellow-100 rounded-sm">
              <div class="grid grid-flow-col grid-rows-6 gap-2 p-4">
                <div class="flex">
                  <div class="flex-none w-20"><b> รหัสบิล : </b></div>
                  <div class="flex-grow">{{ detailBill ? detailBill.bill_code : '' }}</div>
                </div>
                <div class="flex">
                  <div class="flex-none w-20"><b> ประเภทบิล : </b></div>
                  <div class="flex-grow">{{detailBill.is_points == true ? 'point' : 'credit'}}</div>
                </div>
                <div class="flex">
                  <div class="flex-none w-20"><b>วันที่ซื้อ : </b></div>
                  <div class="flex-grow">{{ detailBill ? convertDateTime(detailBill.created_at) : '' }}</div>
                </div>
                <div class="flex">
                  <div class="flex-none w-20"><b>เบอร์โทร : </b></div>
                  <div class="flex-grow">{{ detailBill && detailBill.user ? detailBill.user.phone_number : '' }}</div>
                </div>
                <div class="flex">
                  <div class="flex-none w-20"><b>ชื่อบัญชี : </b></div>
                  <div class="flex-grow">
                    <div v-if="detailBill && detailBill.user && detailBill.user.user_bank_accounts.length > 0">
                      <p v-for="(bankAccount,index) in detailBill.user.user_bank_accounts" :key="index">{{ bankAccount.bank_account_name }}</p>
                    </div>
                  </div>
                </div>
                <div class="flex">
                  <div class="flex-none w-20"><b>ยอดเติม : </b></div>
                  <div class="flex-grow">{{ detailBill ? detailBill.turnover : '' }} บาท</div>
                </div>
              </div>
            </div>
            <div class="flex mt-4">
              <b>รายการตัวเลขในบิล</b>
              <!-- <pre>{{dropdownLottoType}}</pre> -->
              <select 
                v-if="lottery_type_ID != 4 && lottery_type_ID != 5" 
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
                  <!-- <pre>{{columnShow}}</pre> -->
                  <th v-for="(col,index) in columnShow" :key="index" class="border-b-2 dark:border-dark-5 whitespace-nowrap">
                      <b>{{ col.label }}</b>
                  </th>
                </tr>
              </thead>
              <tbody v-if="tbShowDetailBillUser.rows.length > 0">
                <tr v-for="(data,index) in tbShowDetailBillUser.rows" :key="index">
                  <!-- {{lottery_type_ID}} -->
                  <td v-if="lottery_type_ID != 4 && lottery_type_ID != 5">{{ data.lotto_type }}</td>
                  <td :class="{'text-red-500' : data.status_closed == 2}">{{ data.lotto_number }}</td>
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
            <button class="btn bg-red-500 text-white w-24 mr-1 mb-2" data-dismiss="modal" @click="modalConfirmCancelBill()">
              ยกเลิกบิล
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
  props : ['dataDetailBill','dropdownLottoType'],
  data() {
    return {
      tbShowDetailBillUser: {
        page: 1,
        columns: [
          { label: "ประเภท",showTabStatus : [LOTTO_GLO,LOTTO_GSB,LOTTO_BAAC,LOTTO_SHARE_BLUESWAN_THAI,LOTTO_LAO,LOTTO_HANOI]},
          { label: "เลข"},
          { label: "ราคาแทง(บาท)"},
          { label: "ราคาจ่าย(บาทละ)",showTabStatus : [LOTTO_GLO,LOTTO_GSB,LOTTO_BAAC,LOTTO_SHARE_BLUESWAN_THAI,LOTTO_LAO,LOTTO_HANOI]},
          { label: "รางวัล"},
        ],
        rows: [],
        modalConfirmType : null,
        createRoomLottoDrawListValue : ''
      },
      detailBill : '',
      filter_type_lotto : '',
      lottery_type_ID : ''
    }
  },
  created() {
    // console.log(this.$route.params.id);
    this.lottery_type_ID = parseInt(this.$route.params.id);
    // console.log('lottery_type_ID',this.lottery_type_ID);
    // if(this.lottery_type_ID >= 4) {
    //   //เช็คว่าถ้าเปนหวยหงส์ฟ้า type 4 และ 5 ไม่ให้มี type หวย
    //   this.tbShowDetailBillUser.columns.splice(0,1)
    //   this.tbShowDetailBillUser.columns.splice(2,1)
    // }
  },
  computed : {
    columnShow() {
      return this.tbShowDetailBillUser.columns.filter(
        (col) =>
        // console.log('col',!col.showTabStatus || col.showTabStatus.includes(this.lottery_type_ID))
          !col.showTabStatus || col.showTabStatus.includes(this.lottery_type_ID)
      );
    },
  },
  watch : {
    dataDetailBill : 'setDataDetailBill',
  },
  methods : {
    setDataDetailBill(data) {
      // console.log(data);
      this.detailBill = data;
      if(data) {
        this.tbShowDetailBillUser.rows = data.bill_details.map((item) => {
        // console.log(item);
        return {
          lotto_type : item.bet_type ? item.bet_type.name : '',
          lotto_number : item ? item.bet_number : '',
          bet_price : item ? item.amount : '',
          price_to_pay : item ? item.pay_ratio : '',
          prize : item ? item.prize : '',
          status_closed : item.bill_detail_status ? item.bill_detail_status.id : ''
        }
      })
      }

      // console.log('data',data);
    },
    convertDateTime(dateTime) {
      return moment(dateTime).format("YYYY-MM-DD HH:mm");
    },
    filterDetailBillByType() {
      this.$emit('filterDetailBillByType',this.filter_type_lotto)
    },
    modalConfirmCancelBill() {
      this.$emit('modalConfirmCancelBill')
    },
  }
}
</script>
