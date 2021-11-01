<template>
  <div>
    <div class="col-span-12 lg:col-span-4 pt-5 pb-5 overflow-x-auto">
      <div class="grid grid-flow-col grid-cols-2">
        <div class="grid-rows-2">
          <div class=""><b>จัดการงวดแทงหวย > {{lottoTypeName}} > งวดประจำวันที่ {{ dataLottoRoundByID ? dataLottoRoundByID.round_name : '' }}</b></div>
          <div>[เวลาเปิด - ปิด แทงหวย :
            {{ dataLottoRoundByID ? convertDataTime(dataLottoRoundByID.open_time) : '' }} -
            {{ dataLottoRoundByID ? convertDataTime(dataLottoRoundByID.close_time) : '' }}]</div>
        </div>
        <div class="flex ml-auto">
          <!-- ปิดงวดแทงหวยชั่วคราว -->
          <button 
            v-if="dataLottoRoundByID.lotto_round_status && dataLottoRoundByID.lotto_round_status.id != 6"
            class="btn bg-red-500 text-white mr-2" @click="modalEmergencyClose()">ปิดงวดแทงหวย
          </button>
          <!-- ยกเลิกปิดงวดแทงหวย -->
          <button  v-if="dataLottoRoundByID.lotto_round_status && dataLottoRoundByID.lotto_round_status.id == 6" class="btn bg-green-500 text-white mr-2" @click="modalCancelEmergencyClose()">ยกเลิกปิดงวดแทงหวย</button>

          <button class="btn bg-blue-500 text-white mr-2" @click="modalEditRoundLotto()">แก้ไขวันที่เปิด - ปิด แทงหวย</button>
          <button
          :class="{
            'bg-gray-500 text-black':  dataLottoRoundByID && dataLottoRoundByID.is_process == false
              || dataLottoRoundByID.lotto_round_status && dataLottoRoundByID.lotto_round_status.id > 4,
            'bg-green-500 text-white' : dataLottoRoundByID && dataLottoRoundByID.is_process == true
              || dataLottoRoundByID.lotto_round_status && dataLottoRoundByID.lotto_round_status.id <= 4}"
          class="btn mr-2"
          :disabled="dataLottoRoundByID && dataLottoRoundByID.is_process == false || dataLottoRoundByID.lotto_round_status && dataLottoRoundByID.lotto_round_status.id > 4"
          @click="modalAnnouncementOfWinners()">ประกาศผลผู้ถูกรางวัล</button>
          <button class="btn border-gray-700 text-gray-700 w-24"
          @click="$router.push(`/Lottery/ManageLottery/${lottery_type_ID}`)">กลับ</button>
        </div>
      </div>
    </div>
    <div class="col-span-12 lg:col-span-4">
      <div class="intro-y pr-1">
        <div class="box p-2 ">
          <div class="pos__tabs nav-tabs justify-center flex overscroll-x-scroll">
              <!-- เมนู แต่ละ status -->
              <a
                v-for="(tab,index) in tabStatus" :key="index"
                  data-toggle="tab"
                  data-target="#showRoomWithStatus"
                  href="javascript:;"
                  class="flex-1 py-2 rounded-md text-center active"
                  style="border:none;"
                  :class="{
                      'bg-white-900': openTab !== index+1,
                      'bg-blue-400 text-white mb-px': openTab === index+1,
                      }"
                  @click="getDataLottoRoundTab(index+1)"
                >{{ tab }}
              </a>
          </div>
        </div>
      </div>
    </div>
    <OverviewLotto
      v-if="openTab == 1"
      :lottery-type-id="lottery_type_ID"
      :lottery-report="lotteryReport"
      :date-of-lottery="dataLottoRoundByID.round_name"
      @goToReportTurnOverBetNum="goToReportTurnOverBetNum"
    />

    <ShowPriceRateLottery
      v-if="openTab == 2"
      :data-round-pay-ratio="dataRoundPayRatio"
      @goToChangeRate="goToChangeRatePrice"
    />

    <ShowLottoBillList
      v-if="openTab == 3"
      :data-bill-list="dataBillList"
      @filterSearchBill="filterSearchBill"
      @openModalShowDetailBillUser="openModalShowDetailBillUser"
    />

    <ManageResultLottery
      v-if="openTab == 4"
      :data-result-lottery="dataResultLottery"
      :data-lotto-round-by-id="dataLottoRoundByID"
      @modalManageLotteryResult="modalManageLotteryResult"
      @processWinnerLotto="processWinnerLotto"
    />

    <ShowUserWinnerLottery
      v-if="openTab == 5"
      :data-bill-won="dataBillWon"
      @filterBillWonByType="filterBillWonByType"
      @modalShowDetailBillWon="modalShowDetailBillWon"
    />

    <ShowBillCancel v-if="openTab == 6" 
      :data-show-bill-cancel="dataShowBillCancel"
      @filterBillCancelType="filterBillCancelType"
    />


    <client-only>
      <ModalCreateLottoDraw
        :modal-type="modalConfirmType"
        :data-edit-lotto-round="dataLottoRoundByID"
        :lottery-type-id="lottery_type_ID"
        @modalConfirmCancelLottoRound="modalConfirmCancelLottoRound"
        @editLottoRound="confirmEditLottoRound" />

      <ModalConfirm
        :HeaderMassage="headerModalConfirm"
        :warning-massage="warningMassageModalConfirm"
        @submitConfirmModal="submitConfirmEdit()"
        @cancelModal="cancelModal"/>

      <!-- modal change rate group lottery -->
      <ModalChangeRatePayGroupLotto :data-round-pay-ratio="dataGetRoundPayRatioByID" @closeModalEditRatePayGroupNumber="closeModalEditRatePayGroupNumber"
        @modalConfirmEditChageRatePayGroupNumber="modalConfirmEditChageRatePayGroupNumber" />

      <!-- modal manage lottery result -->
      <ModalManageResultLottery
       :lottery-type-id="lottery_type_ID"
       :set-form-manage-result-lottery="setFormManageResultLotto"
       :result-lotto="result_lotto"
       :status-loading="statusLoadingManageResult"
        @confirmManageResultLotto="confirmManageResultLotto" 
        @confirmManageResultLottoGsb="confirmManageResultLottoGsb"
        @confirmManageResultLottoBaac="confirmManageResultLottoBaac" 
        @getResultLottory="getResultLottory" />

      <!-- modal ประมวลผลผู้ชนะ -->
      <ModalProcessWinnerLotto @processWinnerLotto="processWinnerLotto" />

      <!-- modal ประกาศผล -->
      <ModalAnnouncmentWinner
        :data-announcment-result="dataAnnouncmentResult"
        @confirmAnnouncment="confirmAnnouncment"
        @closeModalAnnouncmentWinner="closeModalAnnouncmentWinner" />

      <!-- modal โชว์ bill tab3 -->
      <ModalShowDetailBillUser
        :data-detail-bill="dataDetailBill"
        :dropdown-lotto-type="dropdownLottoType"
        @modalConfirmCancelBill="modalConfirmCancelBill"
        @filterDetailBillByType="filterDetailBillByType"  />

      <!-- modal show detail bill won -->
      <ModalShowDetailBillWon
        :data-bill-won-by-id="dataBillWonByID"
        :dropdown-lotto-type="dropdownLottoType"
        @filterDetailBillWonByType="filterDetailBillWonByType" />
      
      <!-- modal manage result lottery slark -->
      <ModalManageResultLottoSlark 
        :form-slark="formSlark ? formSlark : ''"
        :data-slark="dataSlarkLotto"
        :validate-number-lotto="validateNumberLottoSlark"
        :status-loading="statusLoadingManageResult"
        @confirmManageResultLottoSlark="confirmManageResultLottoSlark"
        @getResultLotterySlark="getResultLotterySlark"
      />

      <ModalManageResultLottoShare 
        :data-share-lotto="dataShareLotto"
        :status-loading="statusLoadingManageResult"
        @confirmManageResultLottoShare="confirmManageResultLottoShare"
        @getResultLotteryShare="getResultLotteryShare"
      />

      <ModalManageResultShareThai 
        :set-form-result-share-thai="setFormManageResultLottoShareThai"
        :status-loading="statusLoadingManageResult"
        :result-lotto-share-thai="resultLottoShareThai"
        @getResultLottoryShareThai="getResultLottoryShareThai"
        @confirmManageResultLottoShareThai="confirmManageResultLottoShareThai"
      />

      <ModalManageResultLottoLao 
        :set-init-form-lotto-lao="form_lotto_lao"
        :result-lotto-lao="resultLottoLao"
        :status-loading="statusLoadingManageResult"
        @confirmManageResultLottoLao="confirmManageResultLottoLao"
        @getResultLottoLao="getResultLottoLao"
      />

      <ModalManageResultLottoHanoi 
       :set-init-form-lotto-hanoi="form_lotto_hanoi"
       :result-lotto-hanoi="resultLottoHanoi"
       :status-loading="statusLoadingManageResult"
       @confirmManageResultLottoHanoi="confirmManageResultLottoHanoi"
       @getResultLottoHanoi="getResultLottoHanoi"
      />

      <div class="grid lg:grid-cols-3 gap-4 mt-3">
        <t-pagination
          v-if="openTab == 3"
          v-model="currentPage"
          :total-items="totalItem"
          :per-page="itemPerPage"
          :limit="7"
          :disabled="false"
          @input="handleTogglePage()"
        />
        <t-pagination
          v-if="openTab == 5"
          v-model="currentPageBillWon"
          :total-items="totalItemBillWon"
          :per-page="itemPerPageBillWon"
          :limit="7"
          :disabled="false"
          @input="handleTogglePageBillWon()"
        />
      </div>
    </client-only>
  </div>
</template>
<script>
import OverviewLotto from '~/components/ManageLottoRound/OverviewLotto.vue'; //ภาพรวมงวดนี้
import ShowPriceRateLottery from '~/components/ManageLottoRound/ShowPriceRateLottery.vue'; //อัตราคูณ/ปรับอัตราจ่าย
import ShowLottoBillList from '~/components/ManageLottoRound/ShowLottoBillList.vue'; //รายการบิล
import ManageResultLottery from '~/components/ManageLottoRound/ManageResultLottery.vue'; //จัดการผลออกรางวัล
import ShowUserWinnerLottery from '~/components/ManageLottoRound/ShowUserWinnerLottery.vue'; //จัดการผลออกรางวัล
import ShowBillCancel from '~/components/ManageLottoRound/ShowBillCancel.vue'; //โชว์บิลที่ถูกยกเลิก

import ModalChangeRatePayGroupLotto from '@/components/Modal/Lottery/ModalChangeRatePayGroupLotto';
import ModalCreateLottoDraw from '@/components/Modal/Lottery/ModalCreateLottoDraw';
import ModalConfirm from '@/components/Modal/ModalConfirm';
import ModalManageResultLottery from '@/components/Modal/Lottery/ModalManageResultLottery'; //modal manage result lottery
import ModalProcessWinnerLotto from '@/components/Modal/Lottery/ModalProcessWinnerLotto'; //modal ประมวลผลผู้ชนะ
import ModalAnnouncmentWinner from '@/components/Modal/Lottery/ModalAnnouncmentWinner'; //modal ประกาศผลออกรางวัล
import ModalShowDetailBillUser from '@/components/Modal/Lottery/ModalShowDetailBillUser'; //modal โชว์ bill
import ModalShowDetailBillWon from '@/components/Modal/Lottery/ModalShowDetailBillWon'; //modal โชว์ bill ที่ถูกรางวัล
import ModalManageResultLottoSlark from '@/components/Modal/Lottery/ModalManageResultLottoSlark'; //modal manage result lottery slak
import ModalManageResultLottoShare from '@/components/Modal/Lottery/ModalManageResultLottoShare'; //modal manage result lottery share blueswan
import ModalManageResultShareThai from '@/components/Modal/Lottery/ModalManageResultShareThai'; //modal manage result lottery share thai
import ModalManageResultLottoLao from '@/components/Modal/Lottery/ModalManageResultLottoLao'; //modal manage result lotto loa
import ModalManageResultLottoHanoi from '@/components/Modal/Lottery/ModalManageResultLottoHanoi'; //modal manage result lotto hanoi

import moment from 'moment'
import alertMixins from '~/mixins/alertMixin'
// import ModalAnnouncmentWinner from '~/components/Modal/ModalAnnouncmentWinner'; //จัดการผลออกรางวัล
export default {
  layout: 'dashboard',
  components : {
    OverviewLotto,
    ShowPriceRateLottery,
    ShowLottoBillList,
    ManageResultLottery,
    ShowUserWinnerLottery,
    ModalCreateLottoDraw,
    ModalConfirm,
    ModalChangeRatePayGroupLotto,
    ModalManageResultLottery,
    ModalProcessWinnerLotto,
    ModalAnnouncmentWinner,
    ModalShowDetailBillUser,
    ModalShowDetailBillWon,
    ShowBillCancel,
    ModalManageResultLottoSlark,
    ModalManageResultLottoShare,
    ModalManageResultShareThai,
    ModalManageResultLottoLao,
    ModalManageResultLottoHanoi
  },
  mixins : [alertMixins],
  data() {
    return {
      tabStatus : ['ภาพรวมงวดนี้','อัตราคูณ/ปรับราคาจ่าย','รายการบิล','จัดการผลออกรางวัล','รายชื่อผู้ถูกรางวัล','รายการบิลที่ถูกยกเลิก'],
      currentPage : 1,
      totalItem : 0,
      itemPerPage : 20,
      currentPageApi : 0,
      openTab : '',
      lottery_type_ID : '',
      lottery_round_ID : '',
      lotteryReport : '',
      modalConfirmType : null,
      dataLottoRoundByID : '',
      dataRoundPayRatio : '', //อัตราคูณ/จ่าย
      dataEditLottoRoundByID : '',
      typeModalConfirmSubmit : '',
      dataEditRatePayGroupNumber : '', // data แก้ไขเรทการจ่ายของ group lottery
      round_type_group_lottery_ID : '', // id ของ group หวย
      dataGetRoundPayRatioByID : '',
      dataManageResultLotto : '', // data manage result lotto
      warningMassageModalConfirm : null,
      dataResultLottery : '', //data result lotto tab4
      dataBillList : '', // data bills tab3
      search_type : '',
      search : '',
      bill_user_ID : '',
      dataDetailBill : '', //data detail bill
      type_lotto_ID : '',
      dataBillWon : '', //data bill ถูกรางวัล
      currentPageBillWon : 1,
      totalItemBillWon : 0,
      itemPerPageBillWon : 20,
      currentPageApiBillWon : 0,
      dataBillWonByID : '',
      dataFilterBillWon : '',
      dataAnnouncmentResult : '', // data ประกาศผลผู้ถูกรางวัล
      headerModalConfirm : '',
      dataShowBillCancel : '', //โชว์บิลที่ถูกยกเลิก tab6
      dataFilterBillCancel : '',
      formSlark : '',
      dataSlarkLotto : '',
      form_slark : '',
      result_lotto : '', //ใต้ดิน ออมสิน ธกส
      dataShareLotto : '',
      form_share : '',
      setFormManageResultLotto : '',
      statusLoadingManageResult : false,
      validateNumberLottoSlark : null,
      dropdownLottoType : '',
      setFormManageResultLottoShareThai : '',
      resultLottoShareThai : '',
      form_share_thai:'',
      form_lotto_lao : null,
      form_lotto_hanoi : null,
      lottoTypeName : '',
      resultLottoLao : '',
      resultLottoHanoi : ''
    }
  },
  async created() {
    this.openTab = parseInt(this.$route.query.tab);
    this.lottery_type_ID = parseInt(this.$route.params.id);
    this.lottery_round_ID = parseInt(this.$route.params.lotto_round_id);
    await this.getLottoRoundByID();
    await this.getDataLottoRoundTab(this.openTab);
    this.getFilterLottoType();
    this.setHeaderLottoTypeName();
  },
  methods : {
    setHeaderLottoTypeName() {
      let lotto_type = parseInt(this.lottery_type_ID)
      switch (lotto_type) {
        case 1 : this.lottoTypeName = 'หวยรัฐบาลไทย'
        break;

        case 2 : this.lottoTypeName = 'หวยออมสิน'
        break;

        case 3 : this.lottoTypeName = 'หวยธกส'
        break;

        case 4 : this.lottoTypeName = 'ล็อตเตอรี่หงส์ฟ้า'
        break;

        case 5 : this.lottoTypeName = 'หวยหุ้นหงส์ฟ้า'
        break;

        case 6 : this.lottoTypeName = 'หวยหุ้นไทย'
        break;

        case 7 : this.lottoTypeName = 'หวยลาว'
        break;

        case 8 : this.lottoTypeName = 'หวยฮานอย'
        break;
      }
    },

    handleTogglePage() {
      this.currentPageApi = this.currentPage - 1;
      this.getDataLottoRoundTab(this.openTab);
    },

    handleTogglePageBillWon() {
      this.currentPageApiBillWon = this.currentPageBillWon - 1;
      this.getDataLottoRoundTab(this.openTab);
    },

    convertDataTime(dataTime) {
      return moment(dataTime).format("YYYY-MM-DD HH:mm");
    },

    async getDataLottoRoundTab(status) {
      this.openTab = status;
      this.$router.push({query: { tab: status }});

      if(status == 1) {
        this.getDataReportLottoRound();
      } else if(status == 2) {
        this.getRoundPayRatio();
      } else if(status == 3) {
        this.getDataBillList();
      } else if(status == 4) {
        this.getResultLottery();
      } else if(status == 5) {
        this.getUserWinLottoBill();
      } else if(status == 6) {
        this.getBillCancel();
      }
    },

    //get data report lottery tab1
    async getDataReportLottoRound() {
      const url = `admin_manage_lotto/${this.lottery_type_ID}/lotto_rounds/${this.lottery_round_ID}/reports`

      try {
        const lottoReport = await this.$axios.get(url);
        this.lotteryReport = lottoReport.data.data;
        // console.log(this.lotteryReport);
      } catch(err) {
        console.log(err);
      }
    },

    //get ข้อมูลอัตราการคูณ การจ่าย tab 2
    async getRoundPayRatio() {
      // GetLottoRoundPayRatio
      const url = `admin_manage_lotto/${this.lottery_type_ID}/lotto_rounds/${this.lottery_round_ID}/round_pay_ratio`;
      try {
        const getRoundPay = await this.$axios.get(url);
        // console.log('getRoundPay',getRoundPay);
        this.dataRoundPayRatio = getRoundPay.data.data;
      } catch(err) {
        console.log(err);
      }
    },

    //get data bill tab 3
    async getDataBillList() {
      const url = `admin_manage_lotto/${this.lottery_round_ID}/bills`; //GetBills
      const params = {
        page : parseInt(this.currentPageApi),
        limit : parseInt(this.itemPerPage),
        type_id : this.search_type,
        search : this.search
      }
      try {
        const getBills = await this.$axios.get(url,{params:params});
        // console.log('getBills',getBills);
        this.totalItem = getBills.data.data.total;
        this.dataBillList = getBills.data.data;
        // console.log('dataBillList',this.dataBillList);
      } catch(err) {
        console.log(err);
      }
    },

    //get data ผลของ lottery tab4
    async getResultLottery() {
      const url = `admin_manage_lotto/lotto_result/${this.lottery_round_ID}`; //GetLottoResult
      try {
        const getResultLotto = await this.$axios.get(url);
        this.dataResultLottery = getResultLotto.data.data;
        // console.log('dataResultLottery',this.dataResultLottery);
      } catch(err) {
        console.log(err);
      }
    },

    //get รายชื่อผู้ถูกรางวัล tab5
    async getUserWinLottoBill() {
      const url = `admin_manage_lotto/${this.lottery_round_ID}/bill_wons`; //GetBillWons
      const params = {
        page : parseInt(this.currentPageApiBillWon),
        limit :parseInt(this.itemPerPageBillWon),
        type_id : this.dataFilterBillWon ? parseInt(this.dataFilterBillWon.type_id) : '',
        search : this.dataFilterBillWon ? this.dataFilterBillWon.search : ''
      }
      try {
        const getUserWinLottoBill = await this.$axios.get(url,{params:params});
        this.dataBillWon = getUserWinLottoBill.data.data;
        this.totalItemBillWon = getUserWinLottoBill.data.data.total;
        // console.log('getUserWinLottoBill',getUserWinLottoBill);
      } catch(err) {
        console.log(err);
      }
    },

    //get bill ที่ถูกยกเลิก tab6
    async getBillCancel() {
      const url = `admin_manage_lotto/${this.lottery_round_ID}/cancel_bills`; //GetCancelBills
      const params = {
        page : parseInt(this.currentPageApiBillWon),
        limit :parseInt(this.itemPerPageBillWon),
        type_id : this.dataFilterBillCancel ? parseInt(this.dataFilterBillCancel.type_id) : '',
        search : this.dataFilterBillCancel ? this.dataFilterBillCancel.search : ''
      }
      try {
        const getBillCancel = await this.$axios.get(url,{params:params});
        this.dataShowBillCancel = getBillCancel.data.data;
      } catch(err) {
        console.log(err);
      }
    },

    //get lotto round by id
    async getLottoRoundByID() {
      const url = `admin_manage_lotto/${this.lottery_type_ID}/lotto_rounds/${this.lottery_round_ID}/`
      try {
        const lottoRoundByID = await this.$axios.get(url);
        // console.log('lottoRoundByID',lottoRoundByID);
        this.dataLottoRoundByID = lottoRoundByID.data.data;
      } catch(err) {
        console.log(err);
      }
    },

    goToChangeRatePrice(data) {
      this.round_type_group_lottery_ID = data.id;
      if(data.default_type_to_pay.type == false) {
        this.$router.push(
          { 
            path: "/Lottery/ChangeRatePrice/",
            query : {
              lottety_type_id : this.lottery_type_ID, 
              lottery_round_id : this.lottery_round_ID,
              round_pay_ratio_id : data ? data.id : '',
              lotto_type : data ? data.lotto_type : '',
              tab : this.openTab,
              bet_type_id : data ? data.bet_type_id : ''
          }});
      } else {
        this.getDataRoundPayRatioByID();

        // console.log('ปรับแบบเต็ม');
      }
    },

    //get data ปรับราคาจ่ายของหมวดหมู่หวย
    async getDataRoundPayRatioByID() {
      //GetLottoRoundPayRatioById
      const url = `admin_manage_lotto/round_pay_ratio/${this.round_type_group_lottery_ID}`;
      try {
        const getRoundPayRatio = await this.$axios.get(url);
        if(getRoundPayRatio.status == 200) {
          // console.log('getRoundPayRatio',getRoundPayRatio);
          this.dataGetRoundPayRatioByID = getRoundPayRatio.data.data;
          this.$cash('#modal-change-rate-group-lottery').modal('show');
        }
      } catch(err) {
        console.log(err);
      }
    },

    //modal edit lotto round
    async modalEditRoundLotto() {
      this.modalConfirmType = 'edit';
      await this.getLottoRoundByID();
      this.$cash('#modal-create-lotto-draw').modal('show');
    },

    //confirm edit lotto round by id
    confirmEditLottoRound(data_edit) {
      this.typeModalConfirmSubmit = 'editLottoRoundById';
      this.headerModalConfirm = 'ยืนยันบันทึกข้อมูล';
      this.dataEditLottoRoundByID = data_edit;

      this.$cash('#modal-create-lotto-draw').modal('hide');
      this.$cash('#modal-confirm').modal('show');
    },

     submitConfirmEdit() {
      if(this.typeModalConfirmSubmit == 'editLottoRoundById') {
        //แก้ไขเวลารอบการออกรางวัล หวย
        this.editLottoRoundById();
      } else if(this.typeModalConfirmSubmit == 'editRatePayGroup') {
        //แก้ไขอัตราจ่ายรวมของ group หวย
        this.editRatePayGroupLotto();
      } else if(this.typeModalConfirmSubmit == 'manageResultLotto') {
        this.manageResultLottery();
      } else if(this.typeModalConfirmSubmit == 'confirmAnnouncmentResult') {
        this.announcmentResultLottery();
      } else if(this.typeModalConfirmSubmit == 'cancelLottoRound') {
        this.cancelLottoRoundByID();
      } else if(this.typeModalConfirmSubmit == 'confirmCancelBill') {
        //ยกเลิกบิล
        this.cancelBillUserBuyLotto();
      } else if(this.typeModalConfirmSubmit == 'emergencyCloseLottoRound') {
        //ปิดงวดแทงหวยชั่วคราว
        this.emergencyCloseLottoRound();
      } else if(this.typeModalConfirmSubmit == 'cancelEmergencyCloseLottoRound') {
        //ยกเลิกการปิดงวดแทงหวย
        this.cancelCloseEmergencyLottoRound();
      } else if(this.typeModalConfirmSubmit == 'manageResultLottoGsb') {
        //จัดการผลออกรางวัลหวยออมสิน
        this.ManageResultLotteryGsb();
      } else if(this.typeModalConfirmSubmit == 'manageResultLottoBaac') {
        //จัดการผลออกรางวัลหวยธกส
        this.ManageResultLotteryBaac();
      } else if(this.typeModalConfirmSubmit == 'confirmManageResultLottoSlark') {
        this.ManageResultLottoSlark();
      } else if(this.typeModalConfirmSubmit == 'confirmManageResultLottoShare') {
        this.ManageResultLottoShareBlueswan();
      } else if(this.typeModalConfirmSubmit == 'confirmManageResultLottoShareThai') {
        this.ManageResultLottoShareThai();
      } else if(this.typeModalConfirmSubmit == 'confirmManageLottoLao') {
        this.ManageResultLottoLao();
      } else if(this.typeModalConfirmSubmit == 'confirmManageLottoHanoi') {
        this.ManageResultLottoHanoi();
      }
    },
    //แก้ไขรอบการออกรางวัลหวย
    async editLottoRoundById() {
      const url = `admin_manage_lotto/${this.lottery_type_ID}/lotto_rounds/${this.lottery_round_ID}/`; //EditLottoRoundById
      // console.log('dataEditLottoRoundByID',this.dataEditLottoRoundByID);
      const _data = {
        draw_date_at : this.dataEditLottoRoundByID.draw_date_lotto,
        open_time : this.dataEditLottoRoundByID.open_draw_lotto,
        close_time : this.dataEditLottoRoundByID.closing_draw_lotto,
        quantity : this.dataEditLottoRoundByID.lottoSet,
        price : this.dataEditLottoRoundByID.lottoPrice,
        is_use_points_buy : this.dataEditLottoRoundByID.is_use_points_buy == true ? 1 : 0,
        is_pay_points : this.dataEditLottoRoundByID.is_pay_points == true ? 1 : 0,
        ratio_points : this.dataEditLottoRoundByID.ratio_points ? 
          parseInt(this.dataEditLottoRoundByID.ratio_points) / 100 : 0
      }

      // console.log('_data',_data);

      try {
        const editLotto = await this.$axios.put(url,_data);
        // console.log('editLotto',editLotto);

        if(editLotto.status == 200) {
          // console.log('editLotto',editLotto);
          this.getLottoRoundByID();
          this.$cash('#modal-confirm').modal('hide');
          this.successAlertWord(editLotto.data.message);
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
    },

    cancelModal() {
      this.$cash('#modal-confirm').modal('hide');
      this.warningMassageModalConfirm = null;
    },

    //close modal
    closeModalEditRatePayGroupNumber() {
      this.$cash('#modal-change-rate-group-lottery').modal('hide');
    },

    //modal confirm แก้ไขเรทราคา
    modalConfirmEditChageRatePayGroupNumber(data) {
      // console.log(data);
      this.dataEditRatePayGroupNumber = data;
      this.headerModalConfirm = 'ยืนยันบันทึกข้อมูล'
      this.typeModalConfirmSubmit = 'editRatePayGroup'
      this.$cash('#modal-change-rate-group-lottery').modal('hide');
      this.$cash('#modal-confirm').modal('show');
    },

    //แก้ไขอัตราจ่ายของ group type จ่ายแบบเต็ม
    async editRatePayGroupLotto() {
      //EditLottoRoundPayRatioById
      const url = `admin_manage_lotto/round_pay_ratio/${this.round_type_group_lottery_ID}`;

      const _data = {
        pay_ratio : this.dataEditRatePayGroupNumber.pay_ratio,
        max_bet_per_bill_number : this.dataEditRatePayGroupNumber.max_bet_per_bill_number
      }
      // console.log('_data',_data);
      try {
        const editRoundPayRatio = await this.$axios.put(url,_data);
        // console.log('editRoundPayRatio',editRoundPayRatio);
        if(editRoundPayRatio.status == 200) {
          this.getDataLottoRoundTab(this.openTab);
          this.$cash('#modal-confirm').modal('hide');
          this.successAlertWord(editRoundPayRatio.data.message);
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
    },

    //modal manage lottery result
    async modalManageLotteryResult() {
      if(this.lottery_type_ID < 4) {
        //หวยใต้ดิน ,ออมสิน,ธกส
        this.setFormManageResultLotto = {
          first_prize : null,
          first_prize2 : null,
          first_three_prize1 : null,
          first_three_prize2 : null,
          last_three_prize1 : null,
          last_three_prize2 : null,
          last_two_prize : null,
        }
        this.$cash('#modal-manage-result-lottery').modal('show');
      } else if(this.lottery_type_ID == 4) {
        //หวยรัฐบาล
        await this.setFormSlark();
        this.$cash('#modal-manage-result-lottery-slark').modal('show');
      } else if(this.lottery_type_ID == 5) {
        this.form_share = ''
        this.$cash('#modal-manage-result-lottery-share-blueswan').modal('show');
      } else if(this.lottery_type_ID == 6) {
        this.setFormManageResultLottoShareThai = {
          first_prize : null,
        }
        this.$cash('#modal-manage-result-lottery-share-thai').modal('show');
      } else if(this.lottery_type_ID == 7) {
        this.form_lotto_lao = {
          first_prize : null,
        }
        this.$cash('#modal-manage-result-lottery-lao').modal('show');
      } else if(this.lottery_type_ID == 8) {
        this.form_lotto_hanoi = {
          first_prize : null,
          last_two_prize : null
        }
        this.$cash('#modal-manage-result-lottery-hanoi').modal('show');
      }
      
    },

    //confirm จัดการผลหวยใต้ดิน
    confirmManageResultLotto(data) {
      this.typeModalConfirmSubmit = 'manageResultLotto';
      this.headerModalConfirm = 'ยืนยันบันทึกข้อมูล'
      this.warningMassageModalConfirm = 'หลังจากบันทึกสำเร็จกรุณากดปุ่ม ประมวลผลผู้ถูกรางวัล'
      this.$cash('#modal-manage-result-lottery').modal('hide');
      this.$cash('#modal-confirm').modal('show');
      this.dataManageResultLotto = data;
    }, 

    //confirm จัดการผลหวยออมสิน
    confirmManageResultLottoGsb(data) {
      this.typeModalConfirmSubmit = 'manageResultLottoGsb';
      this.headerModalConfirm = 'ยืนยันบันทึกข้อมูล'
      this.warningMassageModalConfirm = 'หลังจากบันทึกสำเร็จกรุณากดปุ่ม ประมวลผลผู้ถูกรางวัล'
      this.$cash('#modal-manage-result-lottery').modal('hide');
      this.$cash('#modal-confirm').modal('show');
      this.dataManageResultLotto = data;
    },

    //confirm จัดการผลหวยออมสิน
    confirmManageResultLottoBaac(data) {
      this.typeModalConfirmSubmit = 'manageResultLottoBaac';
      this.headerModalConfirm = 'ยืนยันบันทึกข้อมูล'
      this.warningMassageModalConfirm = 'หลังจากบันทึกสำเร็จกรุณากดปุ่ม ประมวลผลผู้ถูกรางวัล'
      this.$cash('#modal-manage-result-lottery').modal('hide');
      this.$cash('#modal-confirm').modal('show');
      this.dataManageResultLotto = data;
    },

    //manage result หวยใต้ดิน
    async manageResultLottery() {
      // console.log(this.dataManageResultLotto);
      const url = `admin_manage_lotto/lotto_result/${this.lottery_round_ID}/${this.lottery_type_ID}`; //ManageResultReward
      const _data = {
        first_prize : this.dataManageResultLotto.first_prize,
        first_three_prize : [],
        last_three_prize : [],
        last_two_prize : this.dataManageResultLotto.last_two_prize
      }

      _data.first_three_prize.push(this.dataManageResultLotto.first_three_prize1);
      _data.first_three_prize.push(this.dataManageResultLotto.first_three_prize2);
      _data.last_three_prize.push(this.dataManageResultLotto.last_three_prize1);
      _data.last_three_prize.push(this.dataManageResultLotto.last_three_prize2);

      try {
        const manageLottoResult = await this.$axios.post(url,_data);
        if(manageLottoResult.status == 200) {
          // console.log('manageLottoResult',manageLottoResult);
          this.$cash('#modal-confirm').modal('hide');
          this.getDataLottoRoundTab(this.openTab);
          this.$cash('#modal-process-winner-lotto').modal('show');
          // this.successAlertWord(manageLottoResult.data.message);
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


      this.warningMassageModalConfirm = null;
    },

    //manage result หวยออมสิน
    async ManageResultLotteryGsb() {
      const url = `admin_manage_lotto/lotto_result/${this.lottery_round_ID}/${this.lottery_type_ID}`; //ManageResultReward
      const _data = {
        results : [],
      }
      _data.results.push(this.dataManageResultLotto.first_prize);
      _data.results.push(this.dataManageResultLotto.first_prize2);

      try {
        const manageLottoResult = await this.$axios.post(url,_data);
        if(manageLottoResult.status == 200) {
          // console.log('manageLottoResult',manageLottoResult);
          this.$cash('#modal-confirm').modal('hide');
          this.getDataLottoRoundTab(this.openTab);
          this.$cash('#modal-process-winner-lotto').modal('show');
          // this.successAlertWord(manageLottoResult.data.message);
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
    },

    //manage result หวยธกส
    async ManageResultLotteryBaac() {
      const url = `admin_manage_lotto/lotto_result/${this.lottery_round_ID}/${this.lottery_type_ID}`; //ManageResultReward
      const _data = {
        result : this.dataManageResultLotto.first_prize,
      }

      try {
        const manageLottoResult = await this.$axios.post(url,_data);
        if(manageLottoResult.status == 200) {
          this.$cash('#modal-confirm').modal('hide');
          this.getDataLottoRoundTab(this.openTab);
          this.$cash('#modal-process-winner-lotto').modal('show');
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
    },

    //search data bill tab 3
    filterSearchBill(data) {
      // console.log('data',data);
      this.search_type = data.search_type;
      this.search = data.search;
      this.getDataLottoRoundTab(3);
    },

    //ประมวลผล
    async processWinnerLotto() {
      this.$cash('#modal-process-winner-lotto').modal('hide');
      const loader = this.$loading.show({});
      const url = `admin_manage_lotto/process_reward/${this.lottery_round_ID}/${this.lottery_type_ID}`; //ProcessReward
      try {
        const processWinner = await this.$axios.post(url);
        if(processWinner.status == 200) {
          this.getLottoRoundByID();
          this.getDataLottoRoundTab(this.openTab);
          loader.hide();
          this.successAlertWord(processWinner.data.message);
        }
      } catch(err) {
        loader.hide();
        if(err.response.status == 400) {
          this.errorAlertStatusCode(err.response.data.errors);
        } else {
          this.errorAlertStatusCode(err);
        }
      }
    },

    // modal ประกาศผลผู้ถูกรางวัล
    async modalAnnouncementOfWinners() {
      // console.log('modalAnnouncementOfWinners');
      const url = `admin_manage_lotto/confirm_reward/${this.lottery_round_ID}/${this.lottery_type_ID}`; //GetConfirmReward

      try {
        const getDataConfirmReward = await this.$axios.get(url);
        // console.log('getDataConfirmReward',getDataConfirmReward);
        this.dataAnnouncmentResult = getDataConfirmReward.data.data;
        this.$cash('#modal-announcment-winner').modal('show');
        // console.log('getDataConfirmReward',getDataConfirmReward);
      } catch(err) {
        console.log(err);
      }
    },

    //confirm ประกาศผล
    confirmAnnouncment() {
      this.typeModalConfirmSubmit = 'confirmAnnouncmentResult';
      this.headerModalConfirm = 'ยืนยันการประกาศผล'
      this.$cash('#modal-announcment-winner').modal('hide');
      this.$cash('#modal-confirm').modal('show');
    },

    //ประกาศผลการออกรางวัล
    async announcmentResultLottery() {
      const url = `admin_manage_lotto/confirm_reward/${this.lottery_round_ID}/`; //ConfirmReward

      try {
        const announcmentResult = await this.$axios.post(url);
        if(announcmentResult.status == 200) {
          this.getLottoRoundByID();
          this.$cash('#modal-confirm').modal('hide');
          this.successAlertWord(announcmentResult.data.message);
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
    },

    closeModalAnnouncmentWinner() {
      this.$cash('#modal-announcment-winner').modal('hide');
    },
    
    async openModalShowDetailBillUser(bill_id) {
      this.bill_user_ID = bill_id;
      // console.log('bill_user_ID',this.bill_user_ID);
      await this.getDetailBill();
      this.$cash('#modal-show-detail-bill').modal('show');
    },

    //get bill detail
    async getDetailBill() {
      const url = `admin_manage_lotto/bills/${this.bill_user_ID}/`; //GetBillById
      const params = {
        bet_type_id : this.type_lotto_ID
      }
      try {
        const getDetailBill = await this.$axios.get(url,{params : params});
        // console.log('getDetailBill',getDetailBill);
        this.dataDetailBill = getDetailBill.data.data;
      } catch(err) {
        console.log(err);
      }
    },

    filterDetailBillByType(type_lotto_id) {
      this.type_lotto_ID = type_lotto_id;
      this.getDetailBill();
    },

    //modal show detail bill ที่ถูกรางวัล
    async modalShowDetailBillWon(bill_id) {
      // console.log('bill_id',bill_id);
      this.bill_user_ID = await bill_id;
      await this.getDataDetailBillWon();
      this.$cash('#modal-show-detail-bill-won').modal('show');
    },

    //get dat bill won
    async getDataDetailBillWon() {

      const url = `admin_manage_lotto/bill_wons/${this.bill_user_ID}/`; //GetBillWonById
      const params = {
        bet_type_id : this.type_lotto_ID
      }

      try {
        const getBillWonByID = await this.$axios.get(url,{params:params});
        this.dataBillWonByID = getBillWonByID.data.data;
        // console.log('dataBillWonByID',this.dataBillWonByID);

      } catch(err) {
        console.log(err);
      }
    },

    filterDetailBillWonByType(type_lotto_id) {
      this.type_lotto_ID = type_lotto_id;
      this.getDataDetailBillWon();
    },

    //search bill won
    filterBillWonByType(data_filter) {
      this.dataFilterBillWon = data_filter;
      // console.log('dataFilterBillWon',this.dataFilterBillWon);
      this.getDataLottoRoundTab(5);
    },

    modalConfirmCancelLottoRound() {
      this.$cash('#modal-create-lotto-draw').modal('hide');
      this.typeModalConfirmSubmit = 'cancelLottoRound'
      this.headerModalConfirm = 'ยืนยันยกเลิกงวดหวย'
      this.$cash('#modal-confirm').modal('show');
    },

    async cancelLottoRoundByID() {
      const url = `admin_manage_lotto/${this.lottery_type_ID}/lotto_rounds/${this.lottery_round_ID}`;
      try {
        const cancelLottoRound = await this.$axios.post(url);
        // console.log('cancelLottoRound',cancelLottoRound);
        if(cancelLottoRound.status == 200) {
          this.$cash('#modal-confirm').modal('hide');
          this.successAlertWord(cancelLottoRound.data.message);
          this.$router.push(`/Lottery/ManageLottery/${this.lottery_type_ID}`);
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
    },

    //confirm การยกเลิกบิล
    modalConfirmCancelBill() {
      this.typeModalConfirmSubmit = 'confirmCancelBill';
      this.headerModalConfirm = 'ยืนยันยกเลิกบิล'
      this.$cash('#modal-show-detail-bill').modal('hide');
      this.$cash('#modal-confirm').modal('show');
    },

    //ยกเลิกบิล
    async cancelBillUserBuyLotto() {
      // console.log('bill_user_IDxxx',this.bill_user_ID);
      const url = `admin_manage_lotto/cancel_bill/${this.bill_user_ID}/`; //CancelBill

      try {
        const cancelBill = await this.$axios.post(url);
        if(cancelBill.status == 200) {
          this.$cash('#modal-confirm').modal('hide');
          this.getDataLottoRoundTab(this.openTab);
          this.successAlertWord(cancelBill.data.message);
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
      
    },

    //modal ปิดงวดแทงหวยชั่วคราว
    modalEmergencyClose() {
      this.typeModalConfirmSubmit = 'emergencyCloseLottoRound';
      this.headerModalConfirm = 'ยืนยันปิดงวดแทงหวย'
      this.warningMassageModalConfirm = 'หลังจากปิดงวดแทงหวย ผู้ใช้งานระบบจะไม่สามารถซื้อหวยงวดนี้ได้ ยืนยันปิดงวดแทงหวย'
      this.$cash('#modal-confirm').modal('show');
    },

    //ปิดงวดแทงหวยชั่วคราว
    async emergencyCloseLottoRound() {
      const url = `admin_manage_lotto/emergency_close/${this.lottery_round_ID}`; //EmergencyClose

      try {
        const emergencyCloseLotto = await this.$axios.post(url);

        if(emergencyCloseLotto.status == 200) {
          // console.log('emergencyCloseLotto',emergencyCloseLotto);
          this.getLottoRoundByID();
          this.getDataLottoRoundTab(this.openTab);
          this.$cash('#modal-confirm').modal('hide');
          this.successAlertWord(emergencyCloseLotto.data.message);
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
    },

    // modal ยกเลิกการปิดงวดแทงหวย
    modalCancelEmergencyClose() {
      this.typeModalConfirmSubmit = 'cancelEmergencyCloseLottoRound';
      this.headerModalConfirm = 'ยืนยันยกเลิกการปิดงวดแทงหวย'
      this.$cash('#modal-confirm').modal('show');
    },

    //ยกเลิกการปิดงวดแทงหวย
    async cancelCloseEmergencyLottoRound() {
      const url = `admin_manage_lotto/emergency_cancel/${this.lottery_round_ID}`; //EmergencyCancel
      try {
        const cancelEmergencyCloseLottoRound = await this.$axios.post(url);

        if(cancelEmergencyCloseLottoRound.status == 200) {
          // console.log('cancelEmergencyCloseLottoRound',cancelEmergencyCloseLottoRound);
          this.getLottoRoundByID();
          this.getDataLottoRoundTab(this.openTab);
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
    },

    filterBillCancelType(data_filter) {
      this.dataFilterBillCancel = data_filter;
      this.getDataLottoRoundTab(6);
    },

    // go to report turnover bet
    goToReportTurnOverBetNum() {
      this.$router.push(
      { 
        path: "/Lottery/Report/ReportTurnOverBetNumber/",
        query : {
          lottery_type_ID: this.lottery_type_ID,
          lottery_round_ID: this.lottery_round_ID
      }});
    },

    //set form slark
    setFormSlark() {
      let createData = false;
      let slark = [
          { name : 'รางวัลที่ 1' , arraySlark : ['']},
          { name : 'รางวัลข้างเคียงรางวัลที่ 1' , arraySlark : ['','']},
          { name : 'รางวัลที่ 2' , arraySlark : ['','','','','']},
          { name : 'รางวัลที่ 3' , arraySlark : ['','','','','','','','','','']},
          { name : 'รางวัลที่ 4' , arraySlark : []},
          { name : 'รางวัลที่ 5' , arraySlark : []},
          { name : 'เลขหน้า 3 ตัว' , arraySlark : ['','']},
          { name : 'เลขท้าย 3 ตัว' , arraySlark : ['','']},
          { name : 'เลขท้าย 2 ตัว' , arraySlark : ['']},
      ]

      let validateNum = [
        {arrayVa : [ false ]},
        {arrayVa : [ false,false ]},
        {arrayVa : [ false,false,false,false,false ]},
        {arrayVa : [ false,false,false,false,false,false,false,false,false,false ]},
        {arrayVa : []},
        {arrayVa : []},
        {arrayVa : [false,false]},
        {arrayVa : [false,false]},
        {arrayVa : [false]},
      ]

      for(let i = 0; i < 50; i++) {
        slark[4].arraySlark.push('');
        validateNum[4].arrayVa.push(false);
      }

      for(let i = 0; i < 100; i++) {
        slark[5].arraySlark.push('');
        validateNum[5].arrayVa.push(false);
      }
      // console.log(validateNum);
      createData = true;
      if(createData == true) {
        this.formSlark = slark;
        this.validateNumberLottoSlark = validateNum;
      }

    },
    
    //ดึงข้อมูล result lottery หงส์ฟ้า (รัฐบาล)
    async getResultLotterySlark() {
      this.statusLoadingManageResult = true;
      const url = `admin_manage_lotto/result/lottos/blue_swan`; //ResultLottoBlueSwan

      const _data = {
        draw_date_at : this.dataLottoRoundByID ? this.dataLottoRoundByID.draw_date_at : ''
        // draw_date_at : '2021-09-16T15:00:00.000Z'
      }
      // console.log('_data',_data);

      try {
        const getResultLottoSlark = await this.$axios.post(url,_data);
        // console.log('getResultLottoSlark',getResultLottoSlark);
        this.statusLoadingManageResult = false;
        this.dataSlarkLotto = getResultLottoSlark.data.data;
        
      } catch(err) {
        console.log(err);
        this.statusLoadingManageResult = false;
        if(err.response.status == 400) {
          this.errorAlertStatusCode(err.response.data.errors);
        } else {
          this.errorAlertStatusCode(err);
        }
      }
    },

    //confirm manage ผลหวยหงส์ฟ้า(รัฐบาล)
    confirmManageResultLottoSlark(form) {
      this.form_slark = form;
      this.typeModalConfirmSubmit = 'confirmManageResultLottoSlark';
      this.headerModalConfirm = 'ยืนยันการประกาศผลหวย'
      this.$cash('#modal-manage-result-lottery-slark').modal('hide');
      this.$cash('#modal-confirm').modal('show');
    },

    async ManageResultLottoSlark() {
      const _data = {
        first_prize : this.form_slark[0].arraySlark[0],
        first_three_prize : this.form_slark[6].arraySlark,
        last_three_prize : this.form_slark[7].arraySlark,
        last_two_prize : this.form_slark[8].arraySlark[0],
        near_first_prize : this.form_slark[1].arraySlark,
        second_prize : this.form_slark[2].arraySlark,
        third_prize : this.form_slark[3].arraySlark,
        fourth_prize : this.form_slark[4].arraySlark,
        fifth_prize : this.form_slark[5].arraySlark
      }

      const url = `admin_manage_lotto/lotto_result/${this.lottery_round_ID}/${this.lottery_type_ID}`; //ManageResultReward

      try {
        const manageLottoResult = await this.$axios.post(url,_data);
        if(manageLottoResult.status == 200) {
          // console.log('manageLottoResult',manageLottoResult);
          this.$cash('#modal-confirm').modal('hide');
          this.getDataLottoRoundTab(this.openTab);
          this.$cash('#modal-process-winner-lotto').modal('show');
          // this.successAlertWord(manageLottoResult.data.message);
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
    },

    //ดึงผลหวยหวย
    getResultLottory() {
      if(this.lottery_type_ID == 1) {
        this.getResultLottoGlo();
      } else if(this.lottery_type_ID == 2) {
        this.getResultLottoGsb();
      } else if(this.lottery_type_ID == 3) {
        this.getResultLottoBaac();
      }
    },

    //ดึงข้อมูลผลหวยใต้ดิน
    async getResultLottoGlo() {
      // console.log(this.dataLottoRoundByID);
      this.statusLoadingManageResult = true;
      const url = `admin_manage_lotto/result/lottos/glo`; //ResultLottoGLO
      const _data = {
        draw_date_at : this.dataLottoRoundByID ? this.dataLottoRoundByID.draw_date_at : ''
      }

      try {
        const getResultLottoGlo = await this.$axios.post(url,_data);
        // console.log('getResultLottoGlo',getResultLottoGlo);
        this.result_lotto = getResultLottoGlo.data.data;
        this.statusLoadingManageResult = false;
        this.$toast.success('ดึงข้อมูลสำเร็จ');
      } catch(err) {
        console.log(err);
        this.statusLoadingManageResult = false;
        if(err.response.status == 400) {
          this.$toast.error(err.response.data.errors);
        } else {
          this.$toast.error('ดึงข้อมูลไม่สำเร็จ');
        }
      }
      
    },

    //ดึงผลหวยออมสิน
    async getResultLottoGsb() {
      this.statusLoadingManageResult = true;
      let draw_date_at = this.dataLottoRoundByID ? this.dataLottoRoundByID.draw_date_at : '';

      let dateTimeSplit1 = draw_date_at.split('T');
      let dateTimeCheck = dateTimeSplit1[0].split('-');
      
      if(dateTimeCheck[2] == '01') {
        //หวยออมสินวันที่ 1 เปนของ 5 ปี
        const url = `admin_manage_lotto/result/lottos/gsb-5y`; //ResultLottoGSB5y

        const _data = {
          draw_date_at : draw_date_at
        }

        try {
          const getResultLottoGsb = await this.$axios.post(url,_data);
          // console.log('getResultLottoGsb',getResultLottoGsb);
          this.result_lotto = getResultLottoGsb.data.data;
          this.statusLoadingManageResult = false;
          this.$toast.success('ดึงข้อมูลสำเร็จ');
        } catch(err) {
          console.log(err);
          this.statusLoadingManageResult = false;
          if(err.response.status == 400) {
            this.$toast.error(err.response.data.errors);
          } else {
            if(err.response.status == 400) {
              this.$toast.error(err.response.data.errors);
            } else {
              this.$toast.error('ดึงข้อมูลไม่สำเร็จ');
            }
          }
        }
      } else {
        // ออมสิน 3 ปี
        const url = `admin_manage_lotto/result/lottos/gsb-3y`; //ResultLottoGSB3y

        const _data = {
          draw_date_at : draw_date_at
        }

        try {
          const getResultLottoGsb = await this.$axios.post(url,_data);
          // console.log('getResultLottoGsb',getResultLottoGsb);
          this.result_lotto = getResultLottoGsb.data.data;
          this.statusLoadingManageResult = false;
          this.$toast.success('ดึงข้อมูลสำเร็จ');
        } catch(err) {
          console.log(err);
          this.statusLoadingManageResult = false;
          if(err.response.status == 400) {
            this.$toast.error(err.response.data.errors);
          } else {
            this.$toast.error('ดึงข้อมูลไม่สำเร็จ');
          }
        }
      }
    },

    //ดึงผลหวยธกส
    async getResultLottoBaac() {
      this.statusLoadingManageResult = true;
      const url = `admin_manage_lotto/result/lottos/baac`; //ResultLottoBAAC

      const _data = {
        draw_date_at : this.dataLottoRoundByID ? this.dataLottoRoundByID.draw_date_at : ''
      }

      try {
        const getResultLottoBaac = await this.$axios.post(url,_data);
        // console.log('getResultLottoBaac',getResultLottoBaac);
        this.result_lotto = getResultLottoBaac.data.data;
        this.statusLoadingManageResult = false;
        this.$toast.success('ดึงข้อมูลสำเร็จ');
      } catch(err) {
        console.log(err);
        this.statusLoadingManageResult = false;
        if(err.response.status == 400) {
          this.$toast.error(err.response.data.errors);
        } else {
          this.$toast.error('ดึงข้อมูลไม่สำเร็จ');
        }
      }
    },
    //ดึงผลหวย share blueswan
    async getResultLotteryShare() {
      this.statusLoadingManageResult = true;
      const url = `admin_manage_lotto/result/lottos/share_blue_swan`;

      try {
        const getResultLottoShare = await this.$axios.post(url);
        if(getResultLottoShare.status == 200) {
          this.statusLoadingManageResult = false;
          this.dataShareLotto= getResultLottoShare.data.data;
          this.$toast.success('ดึงข้อมูลสำเร็จ');
        }
        // console.log('dataShareLotto',this.dataShareLotto);
      } catch(err) {
        console.log(err);
        this.statusLoadingManageResult = false;
        if(err.response.status == 400) {
          this.$toast.error(err.response.data.errors);
        } else {
          this.$toast.error('ดึงข้อมูลไม่สำเร็จ');
        }
      }
    },
    confirmManageResultLottoShare(form_share) {
      this.form_share = form_share;
      this.typeModalConfirmSubmit = 'confirmManageResultLottoShare';
      this.headerModalConfirm = 'ยืนยันการประกาศผลหวย'
      this.$cash('#modal-manage-result-lottery-share-blueswan').modal('hide');
      this.$cash('#modal-confirm').modal('show');
      

    },
    //จัดการผลหวย share blueswan
    async ManageResultLottoShareBlueswan() {
      const _data = {
        first_prize : this.form_share
      }

      const url = `admin_manage_lotto/lotto_result/${this.lottery_round_ID}/${this.lottery_type_ID}`; //ManageResultReward

      try {
        const manageLottoResult = await this.$axios.post(url,_data);
        if(manageLottoResult.status == 200) {
          // console.log('manageLottoResult',manageLottoResult);
          this.$cash('#modal-confirm').modal('hide');
          this.getDataLottoRoundTab(this.openTab);
          this.$cash('#modal-process-winner-lotto').modal('show');
          // this.successAlertWord(manageLottoResult.data.message);
        }
      } catch(err) {
        this.$cash('#modal-confirm').modal('hide');
        if(err.response.status == 400) {
          this.errorAlertStatusCode(err.response.data.errors);
        } else {
          this.errorAlertStatusCode(err);
        }
      }
    },

    async getFilterLottoType() {
      // console.log(this.lottery_type_ID);
      const url = `data/bet_types/${this.lottery_type_ID}`;
      try {
        const getFilterLottoTypes = await this.$axios.get(url);
        // console.log('getFilterLottoTypes',getFilterLottoTypes);
        this.dropdownLottoType = getFilterLottoTypes.data.data;
        // console.log('dropdownLottoType',this.dropdownLottoType);
      } catch(err) {
        console.log(err);
      }
    },

    async getResultLottoryShareThai() {
      this.statusLoadingManageResult = true;
      const url = `admin_manage_lotto/result/lottos/share_thai`

      try {
        const getResult = await this.$axios.post(url);
        // console.log('getResult',getResult);
        this.statusLoadingManageResult = false;
        this.resultLottoShareThai = getResult.data.data;
      } catch(err) {
        this.statusLoadingManageResult = false;
        // console.log(err.response.data.errors);
        if(err.response.status == 400) {
          this.$toast.error(err.response.data.errors);
        } else {
          this.$toast.error('ดึงข้อมูลไม่สำเร็จ');
        }
        
      }
    },

    confirmManageResultLottoShareThai(form_share_thai) {
      this.form_share_thai = form_share_thai;
      this.typeModalConfirmSubmit = 'confirmManageResultLottoShareThai';
      this.headerModalConfirm = 'ยืนยันการประกาศผลหวย'
      this.$cash('#modal-manage-result-lottery-share-thai').modal('hide');
      this.$cash('#modal-confirm').modal('show');
    },

    async ManageResultLottoShareThai() {
      const url = `admin_manage_lotto/lotto_result/${this.lottery_round_ID}/${this.lottery_type_ID}`; //ManageResultReward
      const _data = {
        first_prize : this.form_share_thai.first_prize,
      }

      try {
        const manageLottoResult = await this.$axios.post(url,_data);
        if(manageLottoResult.status == 200) {
          this.$cash('#modal-confirm').modal('hide');
          this.getDataLottoRoundTab(this.openTab);
          this.$cash('#modal-process-winner-lotto').modal('show');
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
    },

    confirmManageResultLottoLao(data) {
      this.form_lotto_lao = data;
      this.typeModalConfirmSubmit = 'confirmManageLottoLao';
      this.headerModalConfirm = 'ยืนยันการประกาศผลหวย'
      this.$cash('#modal-manage-result-lottery-lao').modal('hide');
      this.$cash('#modal-confirm').modal('show');
    },

    async ManageResultLottoLao() {
      const url = `admin_manage_lotto/lotto_result/${this.lottery_round_ID}/${this.lottery_type_ID}`; //ManageResultReward
      const _data = {
        first_prize : this.form_lotto_lao.first_prize,
      }

      try {
        const manageLottoResult = await this.$axios.post(url,_data);
        if(manageLottoResult.status == 200) {
          this.$cash('#modal-confirm').modal('hide');
          this.getDataLottoRoundTab(this.openTab);
          this.$cash('#modal-process-winner-lotto').modal('show');
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

    },

    confirmManageResultLottoHanoi(data) {
      this.form_lotto_hanoi = data;
      this.typeModalConfirmSubmit = 'confirmManageLottoHanoi';
      this.headerModalConfirm = 'ยืนยันการประกาศผลหวย'
      this.$cash('#modal-manage-result-lottery-hanoi').modal('hide');
      this.$cash('#modal-confirm').modal('show');
    },

    async ManageResultLottoHanoi() {
      const url = `admin_manage_lotto/lotto_result/${this.lottery_round_ID}/${this.lottery_type_ID}`; //ManageResultReward
      const _data = {
        first_prize : this.form_lotto_hanoi.first_prize,
        last_two_prize : this.form_lotto_hanoi.last_two_prize,
      }

      try {
        const manageLottoResult = await this.$axios.post(url,_data);
        if(manageLottoResult.status == 200) {
          this.$cash('#modal-confirm').modal('hide');
          this.getDataLottoRoundTab(this.openTab);
          this.$cash('#modal-process-winner-lotto').modal('show');
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
    },

    async getResultLottoLao() {
      this.statusLoadingManageResult = true;
      const url = `admin_manage_lotto/result/lottos/lao` //ResultLottoLao

      try {
        const getResult = await this.$axios.post(url);
        // console.log('getResult',getResult);
        this.statusLoadingManageResult = false;
        this.resultLottoLao = getResult.data.data;
      } catch(err) {
        this.statusLoadingManageResult = false;
        // console.log(err.response.data.errors);
        if(err.response.status == 400) {
          this.$toast.error(err.response.data.errors);
        } else {
          this.$toast.error('ดึงข้อมูลไม่สำเร็จ');
        }
        
      }
    },

    async getResultLottoHanoi() {
      this.statusLoadingManageResult = true;
      const url = `admin_manage_lotto/result/lottos/hanoi` //ResultLottoHanoi

      try {
        const getResult = await this.$axios.post(url);
        // console.log('getResult',getResult);
        this.resultLottoHanoi = getResult.data.data;
        this.statusLoadingManageResult = false;
        // this.resultLottoLao = getResult.data.data;
      } catch(err) {
        this.statusLoadingManageResult = false;
        // console.log(err.response.data.errors);
        if(err.response.status == 400) {
          this.$toast.error(err.response.data.errors);
        } else {
          this.$toast.error('ดึงข้อมูลไม่สำเร็จ');
        }
        
      }
    }

  }
}
</script>]
