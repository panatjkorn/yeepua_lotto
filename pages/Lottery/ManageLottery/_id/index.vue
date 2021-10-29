<template>
  <div>
    <div class="col-span-12 mt-8">
      <div class="intro-y flex items-center h-10">
        <div class="ml-auto">
          <button class="btn bg-blue-500 text-white w-auto mr-1 mb-2" @click="modalCreateLottoDrawList()">สร้างงวดแทงหวย</button>
          <nuxt-link to="/Lottery">
            <button class="btn border-gray-700 text-gray-700 w-24 mr-1 mb-2">กลับ</button>
          </nuxt-link>
        </div>
      </div>
    </div>
    <div class="col-span-12 lg:col-span-4">
      <div class="intro-y pr-1">
        <div class="box p-2 ">
          <div class="pos__tabs nav-tabs justify-center flex overscroll-x-scroll">
              <!-- เมนู แต่ละ status -->
              <a
                v-for="(tab,index) in statusLottoRoundTab" :key="index"
                  data-toggle="tab"
                  data-target="#showRoomWithStatus"
                  href="javascript:;"
                  class="flex-1 py-2 rounded-md text-center active"
                  style="border:none;"
                  :class="{
                      'bg-white-900': openTab !== index+1,
                      'bg-blue-400 text-white mb-px': openTab === index+1,
                      }"
                  @click="getDataLotteryRound(index+1)"
                >{{ tab ? tab.status_detail : '' }} [{{ tab ? tab.count : '' }}]
              </a>
          </div>
        </div>
      </div>
    </div>
    <div class="col-span-12 mt-5">
      <div class="box p-5 relative overflow-y-hidden">
        <div class="py-3">
          <div class="flex">
            <span class="lg:text-lg"><b>รายการงวดแทงหวย</b></span>
            <div class="ml-auto">
              <select v-model="search" name="" id="" 
                class="form-select box lg:w-auto w-auto mt-5 lg:mt-0 mr-auto mr-2" @change="getDataLotteryRound(openTab)">
                <option value="">ทุกงวด</option>
                <option v-for="(lotto,index) in dd_lotto_round_filter" 
                  :key="index" :value="lotto.id">{{ lotto.round_name }}</option>
              </select>
              <!-- <input v-model="search" type="text" placeholder="ค้นหางวดออกรางวัล" class="border-gray-400 form-control" @keyup.enter="getDataLotteryRound()"> -->
            </div>
          </div>
          <table class="table mt-5">
            <thead>
              <tr>
                <th v-for="(col,index) in tbLotteryDraw.columns" :key="index" class="border-b-2 dark:border-dark-5 whitespace-nowrap">
                    <b>{{ col.label }}</b>
                </th>
              </tr>
            </thead>
            <tbody v-if="tbLotteryDraw.rows.length > 0">
                <tr v-for="(data,index) in tbLotteryDraw.rows" :key="index" :class="{'bg-gray-200 dark:bg-dark-1' : index%2 == 0}">
                    <td>{{ data.lotto_draw_date }}</td>
                    <td>{{ data.open_time }}</td>
                    <td>{{ data.closing_time }}</td>
                    <td>{{ data.announcement_lotto_time }}</td>
                    <td class="text-green-500"><CheckIcon v-if="data.is_pay_points" /></td>
                    <td class="text-green-500"><CheckIcon v-if="data.is_use_points_buy" /></td>
                    <td>{{data.ratio_points}} %</td>
                    <td>
                      <div v-if="data.status.id == 1" class="w-auto bg-gray-600 text-white p-2 rounded-3xl text-center">{{ data.status.status_detail }}</div>
                      <div v-if="data.status.id == 2" class="w-auto bg-yellow-400 text-white p-2 rounded-3xl text-center">{{ data.status.status_detail }}</div>
                      <div v-if="data.status.id == 3" class="w-auto bg-yellow-600 text-white p-2 rounded-3xl text-center">{{ data.status.status_detail }}</div>
                      <div v-if="data.status.id == 4"  class="w-auto bg-green-500 text-white p-2 rounded-3xl text-center">{{ data.status.status_detail }}</div>
                      <div v-if="data.status.id == 5"  class="w-auto bg-red-500 text-white p-2 rounded-3xl text-center">{{ data.status.status_detail }}</div>
                    </td>
                    <td>
                      <button class="btn bg-blue-500 text-white w-auto mr-1" @click="manageLotteryRound(data.id)">จัดการงวดแทงหวย</button>
                      <button 
                        v-if="openTab == 6" 
                        class="btn bg-green-500 text-white w-auto"
                        @click="modalCancelEmergencyCloseLottoRound(data)">
                        ยกเลิกการปิดงวดแทงหวย
                      </button>
                    </td>
                </tr>
            </tbody>
          </table>
        </div>
      </div>
      <client-only>
        <div class="grid lg:grid-cols-3 gap-4 mt-3">
          <t-pagination
          v-model="currentPage"
          :total-items="totalItem"
          :per-page="itemPerPage"
          :limit="7"
          :disabled="false"
          @input="handleTogglePage()"
        />
        </div>

        <ModalCreateLottoDraw 
          :modal-type="modalConfirmType ? modalConfirmType : null"
          :lottery-type-id="lottery_type_ID"
          @createLotto="submitConfirm" />

        <ModalConfirm
          :HeaderMassage="headerModalConfirm"
          :warning-massage="warningMassageModalConfirm"
          @submitConfirmModal="submitConfirmModal()"
          @cancelModal="cancelModal"/>
        <!-- <ModalConfirm
          :HeaderMassage="'ยืนยันสร้างงวดแทงหวย'"
          @submitConfirmModal="createLotteryRound"
          @cancelModal="cancelModal"
        /> -->
      </client-only>
    </div>
  </div>
</template>
<script>
import ModalCreateLottoDraw from '@/components/Modal/Lottery/ModalCreateLottoDraw';
import ModalConfirm from '@/components/Modal/ModalConfirm';
import alertMixins from '~/mixins/alertMixin'
import moment from 'moment'
export default {
  layout: 'dashboard',
  components : { ModalCreateLottoDraw,ModalConfirm },
  mixins : [alertMixins],
  data() {
    return {
      openTab : '',
      tbLotteryDraw: {
        page: 1,
        columns: [
          { label: "งวดแทงหวย"},
          { label: "เปิดรับแทง"},
          { label: "ปิดรับแทง"},
          { label: "ประกาศผล"},
          { label: "ได้รับ point"},
          { label: "ซื้อด้วย point"},
          { label: "เปอร์เซ็นการให้ point"},
          { label: "สถานะ"},
          { label: "ตัวเลือก"},
        ],
        rows: [],
      },
      modalConfirmType : null,
      createRoomLottoDrawListValue : '',
      lottery_type_ID : '', //type หวย ex.หวยใต้ดิน
      currentPage : 1,
      totalItem : 0,
      itemPerPage : 20,
      currentPageApi : 0,
      search : '',
      statusLottoRoundTab : '',
      dd_lotto_round_filter : '',
      headerModalConfirm : '',
      warningMassageModalConfirm : '',
      typeModalConfirmSubmit : '',
      lottery_round_ID : ''
    }
  },
  created() {
    this.lottery_type_ID = this.$route.params.id;
    this.getDataLotteryRound(1);
    this.countLottoRoundStatus();
    this.getDataFilterLotteryRound();
  },
  mounted() {

  },
  methods : {
    async handleTogglePage() {
      this.currentPageApi = this.currentPage - 1;
      this.getDataLotteryRound(this.openTab);
    },
    submitConfirmModal() {
      if(this.typeModalConfirmSubmit == 'createLottoRound') {
        this.createLotteryRound();
      } else if(this.typeModalConfirmSubmit == 'cancelEmergencyCloseLottoRound') {
        this.cancelCloseEmergencyLottoRound();
      }
    },
    //get data filter lottery round
    async getDataFilterLotteryRound() {
      const url = `data/lotto_rounds/${this.lottery_type_ID}`; //DataLottoRounds
      try {
        const getDropdownLottoRound = await this.$axios.get(url);
        this.dd_lotto_round_filter = getDropdownLottoRound.data.data;
      } catch(err) {
        console.log(err);
      }
    },
    //count tab lotto round
    async countLottoRoundStatus() {
      const url = `admin_manage_lotto/status/lotto_round`; //CountLottoRoundsStatus
      
      const params = {
        lotto_id : this.lottery_type_ID
      }

      try {
        const getCountLottoRoundTab = await this.$axios.get(url,{params:params});
        this.statusLottoRoundTab = getCountLottoRoundTab.data.data;
      } catch(err) {
        console.log(err);
      }
    },
    //get data lottery round
    async getDataLotteryRound(status) {
      this.openTab = status;
      // ?page=${this.currentPageApi}&limit=${this.itemPerPage}
      const url = `admin_manage_lotto/${this.lottery_type_ID}/lotto_rounds`; //GetLottoRounds
      const params = {
        page : parseInt(this.currentPageApi),
        limit : parseInt(this.itemPerPage),
        status_id : parseInt(this.openTab),
        round_id : parseInt(this.search)
      }
      try {
        const getLottoRound = await this.$axios.get(url,{params:params});
        this.totalItem = getLottoRound.data.data.total;
        // console.log('getLottoRound',getLottoRound);
        this.tbLotteryDraw.rows = getLottoRound.data.data.lotto_rounds.map((item) => {
          // console.log(item);
          return {
            lotto_draw_date :item ? item.round_name : '',
            open_time : item ? moment(item.open_time).format("YYYY-MM-DD HH:mm") : '',
            closing_time : item ? moment(item.close_time).format("YYYY-MM-DD HH:mm") : '',
            announcement_lotto_time : item && item.announce_time != null ? moment(item.announce_time).format("YYYY-MM-DD HH:mm") : '',
            status : item ? item.lotto_round_status : '',
            is_pay_points: item ? item.is_pay_points : false,
            is_use_points_buy: item ? item.is_use_points_buy : false,
            ratio_points : item ? item.ratio_points * 100 : 0,
            id : item ? item.id : ''
          }
        })
      } catch(err) {
        console.log(err);
      }

    },
    //สร้างงวดแทงหวย
    async createLotteryRound() {
      this.$cash('#modal-confirm').modal('hide');
      const loader = this.$loading.show({});
      const url = `admin_manage_lotto/${this.lottery_type_ID}/lotto_rounds`;

      const _data = {
        open_time : this.createRoomLottoDrawListValue.open_draw_lotto,
        close_time : this.createRoomLottoDrawListValue.closing_draw_lotto,
        draw_date_at : this.createRoomLottoDrawListValue.draw_date_lotto,
        quantity : `${this.createRoomLottoDrawListValue.quantity}`,
        price : `${this.createRoomLottoDrawListValue.price}`
      }

      try {
        const createLottoRound = await this.$axios.post(url,_data);
        // console.log('createLottoRound',createLottoRound);
        if(createLottoRound.status == 200) {
          loader.hide();
          this.successAlertWord(createLottoRound.data.message);
          this.countLottoRoundStatus();
          this.getDataLotteryRound(this.openTab);
        }
      } catch(err) {
        loader.hide();
        if(err.response.status == 400) {
          this.errorAlertStatusCode(err.response.data.errors);
        } else {
          this.errorAlertStatusCode(err);
        }
        console.log(err);
      }
      // console.log('createRoomLottoDrawListValue',this.createRoomLottoDrawListValue);
    },
    //จัดการงวดแทงหวย
    manageLotteryRound(id) {
      this.$router.push(`/Lottery/ManageLottery/${this.lottery_type_ID}/${id}?tab=1`)
    },
    //สร้างงวดแทงหวย
    modalCreateLottoDrawList() {
      this.modalConfirmType = 'create'
      this.typeModalConfirmSubmit = 'createLottoRound'
      this.headerModalConfirm = 'ยืนยันสร้างงวดแทงหวย'
      this.$cash('#modal-create-lotto-draw').modal('show');
    },
    submitConfirm(value) {
      if(this.modalConfirmType == 'create') {
        this.createRoomLottoDrawListValue = value;
        this.$cash('#modal-create-lotto-draw').modal('hide');
        this.$cash('#modal-confirm').modal('show');
      }
    },
    cancelModal() {
      if(this.modalConfirmType == 'create') {
        this.$cash('#modal-confirm').modal('hide');
        this.createRoomLottoDrawListValue = null;
      } else {
        this.$cash('#modal-confirm').modal('hide');
      }
    },
    //modal cancel emergency close lotto round
    modalCancelEmergencyCloseLottoRound(data) {
      this.lottery_round_ID = data.id;
      this.headerModalConfirm = 'ยืนยันยกเลิกการปิดงวดแทงหวย ?'
      this.typeModalConfirmSubmit = 'cancelEmergencyCloseLottoRound';
      this.$cash('#modal-confirm').modal('show');
    },
    //ยกเลิกการปิดงวดแทงหวย
    async cancelCloseEmergencyLottoRound() {
      const url = `admin_manage_lotto/emergency_cancel/${this.lottery_round_ID}`; //EmergencyCancel
      try {
        const cancelEmergencyCloseLottoRound = await this.$axios.post(url);

        if(cancelEmergencyCloseLottoRound.status == 200) {
          this.getDataLotteryRound(this.openTab);
          this.countLottoRoundStatus();
          this.$cash('#modal-confirm').modal('hide');
          this.successAlertWord(cancelEmergencyCloseLottoRound.data.message);
        }
      } catch(err) {
        console.log(err);
        this.$cash('#modal-confirm').modal('hide');
        if(err.response.status == 400) {
          this.errorAlertStatusCode(err.response.data.errors);
        } else {
          this.errorAlertStatusCode(err);
        }
      }
    }
  }
}
</script>]
