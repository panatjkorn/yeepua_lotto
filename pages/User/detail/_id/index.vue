<template>
  <div>
    <div class="grid grid-cols-12 gap-6 mt-5">
      <div class="col-span-12 lg:col-span-4 p-3 grid">
        <!-- <div class="w-36 h-36 image-fit justify-self-center">
          <img
            alt="profile-image"
            class="rounded-full"
            :src="dataNormalUser ? dataNormalUser.image_url : ''"
          />
        </div> -->
        <div class="justify-self-center">
          <!-- <div class="w-36 h-36 image-fit ml-auto mr-auto">
            <img
            alt="profile-image"
            class="rounded-full"
            :src="dataNormalUser ? dataNormalUser.image_url : ''"
          />
          </div> -->
          
          <span class="mt-3 lg:mt-2 text-xl grid justify-center">
            <b v-if="dataNormalUser.user_detail">{{ dataNormalUser.user_detail.first_name }} {{ dataNormalUser.user_detail.last_name }}</b>
          </span>
          <div class="p-5 border-t border-gray-200 dark:border-dark-5 items-center">
            <a
              class="flex items-center py-2 rounded-md text-center p-3"
              href="javascript:;"
              :class="{
                'bg-white-900': openTab !== 1,
                'menu-background text-white mb-px': openTab === 1,
              }"
              @click="getDataAllTab(1)"
              >
              <ActivityIcon class="w-4 h-4 mr-2" /> ข้อมูลส่วนตัว
            </a>
            <!-- ******* -->
            <a
              class="flex items-center mt-5 py-2 rounded-md text-center p-3"
              href="javascript:;"
              :class="{
              'bg-white-900': openTab !== 2,
              'menu-background text-white mb-px': openTab === 2,
            }"
            @click="getDataAllTab(2)">
              <BoxIcon class="w-4 h-4 mr-2" /> บัญชีรับเงินรางวัล
            </a>
            <a
              class="flex items-center mt-5 py-2 rounded-md text-center p-3"
              href="javascript:;"
              :class="{
              'bg-white-900': openTab !== 3,
              'menu-background text-white mb-px': openTab === 3,
            }"
            @click="getDataAllTab(3)"
            >
              <LockIcon class="w-4 h-4 mr-2" /> ประวัติการซื้อ
            </a>
            <a class="flex items-center mt-5 py-2 rounded-md text-center p-3"
              href="javascript:;"
              :class="{
              'bg-white-900': openTab !== 4,
              'menu-background text-white mb-px': openTab === 4,
            }"
            @click="getDataAllTab(4)">
            <SettingsIcon class="w-4 h-4 mr-2" /> ประวัติการถูกรางวัล
            </a>
            <a class="flex items-center mt-5 py-2 rounded-md text-center p-3"
              href="javascript:;"
              :class="{
              'bg-white-900': openTab !== 5,
              'menu-background text-white mb-px': openTab === 5,
            }"
            @click="getDataAllTab(5)">
            <Minimize2Icon class="w-4 h-4 mr-2" /> ประวัติการฝากเงิน
            </a>
            <a class="flex items-center mt-5 py-2 rounded-md text-center p-3"
              href="javascript:;"
              :class="{
              'bg-white-900': openTab !== 6,
              'menu-background text-white mb-px': openTab === 6,
            }"
            @click="getDataAllTab(6)">
              <Maximize2Icon class="w-4 h-4 mr-2" /> ประวัติการถอนเงิน
            </a>
            <a class="flex items-center mt-5 py-2 rounded-md text-center p-3"
              href="javascript:;"
              :class="{
              'bg-white-900': openTab !== 7,
              'menu-background text-white mb-px': openTab === 7,
            }"
            @click="getDataAllTab(7)">
              <AwardIcon class="w-4 h-4 mr-2" /> ประวัติการได้รับ point
            </a>
            <a class="flex items-center mt-5 py-2 rounded-md text-center p-3"
              href="javascript:;"
              :class="{
              'bg-white-900': openTab !== 8,
              'menu-background text-white mb-px': openTab === 8,
            }"
            @click="getDataAllTab(8)">
              <ClipboardIcon class="w-4 h-4 mr-2" /> ประวัติการได้รับโบนัส
            </a>
          </div>
        </div>
        <!-- <div class="justify-self-center">
          <span class="mt-3 lg:mt-2 text-xl grid justify-center">
            <b v-if="dataNormalUser.user_detail">{{ dataNormalUser.user_detail.first_name }} {{ dataNormalUser.user_detail.last_name }}</b>
          </span>
          <div class="p-5 border-t border-gray-200 dark:border-dark-5">
            <a
              class="flex items-center py-2 rounded-md text-center p-3"
              href="javascript:;"
              :class="{
                'bg-white-900': openTab !== 1,
                'menu-background text-white mb-px': openTab === 1,
              }"
              @click="getDataAllTab(1)"
              >
              <ActivityIcon class="w-4 h-4 mr-2" /> ข้อมูลส่วนตัว
            </a>

            <a
              class="flex items-center mt-5 py-2 rounded-md text-center p-3"
              href="javascript:;"
              :class="{
              'bg-white-900': openTab !== 2,
              'menu-background text-white mb-px': openTab === 2,
            }"
            @click="getDataAllTab(2)">
              <BoxIcon class="w-4 h-4 mr-2" /> บัญชีรับเงินรางวัล
            </a>
            <a
              class="flex items-center mt-5 py-2 rounded-md text-center p-3"
              href="javascript:;"
              :class="{
              'bg-white-900': openTab !== 3,
              'menu-background text-white mb-px': openTab === 3,
            }"
            @click="getDataAllTab(3)"
            >
              <LockIcon class="w-4 h-4 mr-2" /> ประวัติการซื้อ
            </a>
            <a class="flex items-center mt-5 py-2 rounded-md text-center p-3"
              href="javascript:;"
              :class="{
              'bg-white-900': openTab !== 4,
              'menu-background text-white mb-px': openTab === 4,
            }"
            @click="getDataAllTab(4)">
            <SettingsIcon class="w-4 h-4 mr-2" /> ประวัติการถูกรางวัล
            </a>
          </div>
        </div> -->
      </div>
      <!-- ข้อมูลส่วนตัว -->
      <div class="col-span-12 lg:col-span-8 p-3 lg:mt-3">
        <PersonalInformation
          v-if="openTab == 1"
          :data-personal-user="dataPersonalUser"
          @editDetailUser="editDetailUser" />

        <UserBankAccount
          v-if="openTab == 2"
          :data-banks="dataBanks"
          :data-bank-account-user="dataBankAccountUser"
          @editBankUser="editBankUser"
          @modalAddUserBookBank="modalAddUserBookBank"
          />

        <HistoryBillsUser
          v-if="openTab == 3"
          :data-bills-user="dataBillsUser"
          :dropdown-lotto-type="dd_lottoType"
          :dropdown-lotto-round="dd_lotto_round"
          @showDetailBillUser="showDetailBillUser"
          @getDataDropdownLottoRoundFilter="getDataDropdownLottoRoundFilter"
          @filterHistoryUserBuyLotto="filterHistoryUserBuyLotto"
        />

        <HistoryUserWonLotto
          v-if="openTab == 4"
          :data-show-bills-won="dataShowBillWon"
          :dropdown-lotto-type="dd_lottoType"
          :dropdown-lotto-round="dd_lotto_round"
          @modalShowLottoWon="modalShowLottoWon"
          @getDataDropdownLottoRoundFilter="getDataDropdownLottoRoundFilter"
          @filterHistoryWonLotto="filterHistoryWonLotto"
        />

        <HistoryDepositList 
          v-if="openTab == 5"
          :data-deposit-list="dataDepositList"
          :dropdown-status-deposit="ddFilterDepositList"
          :filter-status-deposit="filterStatusDeposit"
          @filterStatusDeposit="getDepositList"
        />
        
        <HistoryWithdrawList 
          v-if="openTab == 6"
          :data-withdraw-list="dataWithdrawList"
          :dropdown-status-withdraw="ddFilterWithdrawList"
          :filter-status-withdraw="filterStatusWithdraw"
          @filterWithdrawList="getWithdrawList"
        />

        <HistoryUserReceivePoint 
          v-if="openTab == 7"
          :history-receive-point="dataHistoryReceivePoint"
        />

        <HistoryUserReceiveBonus 
          v-if="openTab == 8"
          :data-user-receive-bonus="dataUserReceiveBonus"
        />

        <div class="grid lg:grid-cols-3 gap-4 mt-3">
          <t-pagination
            v-if="openTab == 3"
            v-model="currentPageBills"
            :total-items="totalItemBills"
            :per-page="itemPerPageBills"
            :limit="7"
            :disabled="false"
            @input="handleTogglePageBills()"
          />

          <t-pagination
            v-if="openTab == 4"
            v-model="currentPageBillsWon"
            :total-items="totalItemBillsWon"
            :per-page="itemPerPageBillsWon"
            :limit="7"
            :disabled="false"
            @input="handleTogglePageBillsWon()"
          />

          <t-pagination
            v-if="openTab == 5"
            v-model="currentPageDeposit"
            :total-items="totalItemDeposit"
            :per-page="itemPerPageDeposit"
            :limit="7"
            :disabled="false"
            @input="handleTogglePageDeposit()"
          />

          <t-pagination
            v-if="openTab == 6"
            v-model="currentPageWithdraw"
            :total-items="totalItemWithdraw"
            :per-page="itemPerPageWithdraw"
            :limit="7"
            :disabled="false"
            @input="handleTogglePageWithdraw()"
          />

          <t-pagination
            v-if="openTab == 7"
            v-model="currentPageReceivePoint"
            :total-items="totalItemReceivePoint"
            :per-page="itemPerPageReceivePoint"
            :limit="7"
            :disabled="false"
            @input="handleTogglePageReceivePoint()"
          />

          <t-pagination
            v-if="openTab == 8"
            v-model="currentPageReceiveBonus"
            :total-items="totalItemReceiveBonus"
            :per-page="itemPerPageReceiveBonus"
            :limit="7"
            :disabled="false"
            @input="handleTogglePageReceiveBonus()"
          />
        </div>
      </div>

      <!-- modal show bill user -->
      <ModalShowBillUser
      :lotto-type-id="bill_lotto_type_id"
      :data-bill-user-by-id="dataBillUserByID" />

      <!-- modal show รางวัลที่ถูก tab4 -->
      <ModalShowLottoWon
        :lottery-type-id="lottery_type_id" 
        :data-bill-won-by-id="dataBillWonById"
      />

      <!-- modal add user book bank -->
      <ModalAddUserBookBank 
        :data-banks="dataBanks"
        @confirmAddBookbank="confirmAddBookbank"
      />

      <ModalConfirm
        :HeaderMassage="headerModalConfirm"
        :warning-massage="warningMassageModalConfirm"
        @submitConfirmModal="submitConfirm()"
        @cancelModal="cancelModal"
      />

    </div>
  </div>
</template>
<script>
import PersonalInformation from '@/components/User/detail/PersonalInformation';
import UserBankAccount from '@/components/User/detail/UserBankAccount';
import HistoryBillsUser from '@/components/User/detail/HistoryBillsUser';
import HistoryUserWonLotto from '@/components/User/detail/HistoryUserWonLotto';
import HistoryDepositList from '@/components/User/detail/HistoryDepositList';
import HistoryWithdrawList from '@/components/User/detail/HistoryWithdrawList';
import HistoryUserReceivePoint from '@/components/User/detail/HistoryUserReceivePoint';
import HistoryUserReceiveBonus from '@/components/User/detail/HistoryUserReceiveBonus';

import ModalShowLottoWon from '@/components/Modal/User/ModalShowLottoWon';
import ModalShowBillUser from '@/components/Modal/User/ModalShowBillUser';
import ModalAddUserBookBank from '@/components/Modal/User/ModalAddUserBookBank';
import ModalConfirm from '@/components/Modal/ModalConfirm';

// import { editBankAccountUser } from '@/api/admin_manage_user'
// import { getDataBank } from '@/api/data'

import alertMixins from '~/mixins/alertMixin'
export default {
  layout: 'dashboard',
  components : {
    PersonalInformation,
    UserBankAccount,
    HistoryBillsUser,
    HistoryUserWonLotto,
    ModalShowLottoWon,
    ModalShowBillUser,
    ModalAddUserBookBank,
    ModalConfirm,
    HistoryDepositList,
    HistoryWithdrawList,
    HistoryUserReceivePoint,
    HistoryUserReceiveBonus
  },
  mixins: [ alertMixins ],
  data() {
    return {
      user_ID : '',
      openTab : '',
      dataNormalUser : '',
      dataBankUser : '',
      dataPersonalUser : '',
      dataBankAccountUser : '',
      dataBanks : '',
      dataBillsUser : '', // ข้อมูล บิล user
      currentPageBills : 1,
      totalItemBills : 0,
      itemPerPageBills : 20,
      currentPageApiBills : 0,
      dataBillUserByID : '',
      currentPageBillsWon : 1,
      totalItemBillsWon : 0,
      itemPerPageBillsWon : 20,
      currentPageApiBillsWon : 0,
      dataShowBillWon : '',
      dataBillWonById : '',
      dd_lottoType : '',
      dd_lotto_round : '',
      filterLottoRound : '',
      warningMassageModalConfirm : '',
      headerModalConfirm : '',
      typeModalConfirmSubmit : null,
      formAddBookbank : '',
      bill_lotto_type_id : '',
      lottery_type_id : '',
      dataDepositList : '',
      currentPageDeposit : 1,
      totalItemDeposit : 0,
      itemPerPageDeposit : 20,
      currentPageApiDeposit : 0,
      ddFilterDepositList : '',
      filterStatusDeposit : '',
      dataWithdrawList : '',
      ddFilterWithdrawList : '',
      filterStatusWithdraw : '',
      currentPageWithdraw : 1,
      totalItemWithdraw : 0,
      itemPerPageWithdraw : 20,
      currentPageApiWithdraw : 0,
      currentPageReceivePoint : 1,
      totalItemReceivePoint : 0,
      itemPerPageReceivePoint : 20,
      currentPageApiReceivePoint : 0,
      dataHistoryReceivePoint : '',
      dataUserReceiveBonus : '',
      currentPageReceiveBonus : 1,
      totalItemReceiveBonus : 0,
      itemPerPageReceiveBonus : 20,
      currentPageApiReceiveBonus : 0,
    }
  },
  created() {
    this.user_ID = this.$route.params.id;
    this.getDataAllTab(1);
    this.getDataDetailUser();
    // this.getDataPersonalUser(1);
    this.getBankAll();
  },
  // watch : {
  //   openTab : 'clearPageWhenSwitchTabStatus'
  // },
  methods : {
    
    handleTogglePageBills() {
      this.currentPageApiBills = this.currentPageBills - 1;
      this.getDataHistoryUserBuyLotto();
    },

    submitConfirm() {
      if(this.typeModalConfirmSubmit == 'submitAddUserBookbank') {
        this.addUserBookbank();
      }
    },

    cancelModal() {
      this.$cash('#modal-confirm').modal('hide');
      this.warningMassageModalConfirm = null;
    },

    //paging ผู้ถูกรางวัล
    handleTogglePageBillsWon() {
      this.currentPageApiBillsWon = this.currentPageBillsWon - 1;
      this.getDataHistoryBillWonLotto();
    },

    handleTogglePageDeposit() {
      this.currentPageApiBillsWon = this.currentPageBillsWon - 1;
      this.getDepositList();
    },

    handleTogglePageWithdraw() {
      this.currentPageApiWithdraw = this.currentPageWithdraw - 1;
      this.getWithdrawList();
    },
    
    handleTogglePageReceivePoint() {
      this.currentPageApiReceivePoint = this.currentPageReceivePoint - 1;
      this.getUserReceivePoint();
    },

    handleTogglePageReceiveBonus() {
      this.currentPageApiReceiveBonus = this.currentPageReceiveBonus - 1;
      this.getUserReceiveBonus();
    },

    async getDataDetailUser() {
      const url = `admin_manage_user/users/${this.user_ID}`; //UserbyId
      try {
        // const detailUser = await getDetailUserByID(this.user_ID);
        const detailUser = await this.$axios.get(url);
        // console.log('detailUser',detailUser);
        this.dataNormalUser = detailUser.data.data;
      } catch(err) {
        console.log('err',err);
      }
    },

    getDataAllTab(status) {
      this.clearDataPagination();
      // this.clearPageWhenSwitchTabStatus();
      this.openTab = status;
      if(this.openTab == 1) {
        this.getDataPersonalUser();
      } else if(this.openTab == 2) {
        this.getDataBankUser();
      } else if(this.openTab == 3) {
        this.getDataHistoryUserBuyLotto();
      } else if(this.openTab == 4) {
        this.getDataHistoryBillWonLotto();
      } else if(this.openTab == 5) {
        this.filterStatusDeposit = '';
        this.getFilterDepositStatus();
        this.getDepositList();
      } else if(this.openTab == 6) {
        this.filterStatusWithdraw = ''
        this.getFilterWithdrawStatus();
        this.getWithdrawList();
      } else if(this.openTab == 7) {
        this.getUserReceivePoint();
      } else if(this.openTab == 8) {
        this.getUserReceiveBonus();
      }
    },

    //get data personal user tab 1
    async getDataPersonalUser() {
      const url = `admin_manage_user/users/${this.user_ID}/detail`; //GetUserDetail

      try {
        const dataPersonal = await this.$axios.get(url);
        this.dataPersonalUser = dataPersonal.data.data;
      } catch(err) {
        console.log(err);
      }

    },

    //get data bank account user tab2
    async getDataBankUser() {
      const url = `admin_manage_user/users/${this.user_ID}/bank_account`
      try {
        const dataBankAccount = await this.$axios.get(url);
        // console.log('dataBankAccount',dataBankAccount);
        this.dataBankAccountUser = dataBankAccount.data.data;
      } catch(err) {
        console.log(err);
      }

    },

    //get data history user buy lotto tab3
    async getDataHistoryUserBuyLotto() {
      this.getDropdownLottoRoundListAll();
      const url = `admin_manage_user/users/${this.user_ID}/bills`; //GetBills
      const params = {
        page : parseInt(this.currentPageApiBills),
        limit : parseInt(this.itemPerPageBills),
        round_id : this.filterLottoRound != '' ? parseInt(this.filterLottoRound) : ''
      }
      try {
        const getBillsUser = await this.$axios.get(url,{params:params});
        // console.log('getBillsUser',getBillsUser);
        this.dataBillsUser = getBillsUser.data.data;
        this.totalItemBills = getBillsUser.data.data.total;
      } catch(err) {
        console.log(err);
      }
    },
    
    //get data history user win lotto tab4
    async getDataHistoryBillWonLotto() {
      this.getDropdownLottoRoundListAll();
      const url = `admin_manage_user/users/${this.user_ID}/bill_wons`;
      const params = {
        page : parseInt(this.currentPageApiBillsWon),
        limit : parseInt(this.itemPerPageBillsWon),
        round_id : this.filterLottoRound != '' ? parseInt(this.filterLottoRound) : ''
      }

      try {
        const historyBillWon = await this.$axios.get(url,{params:params});
        this.dataShowBillWon = historyBillWon.data.data;
        this.totalItemBillsWon = historyBillWon.data.data.total;
        // console.log('historyBillWon',historyBillWon.data.data);
      } catch(err) {
        console.log(err);
      }
    },

    //get deposit list tab 5
    async getDepositList(filter_status) {
      const url = `admin_manage_user/users/${this.user_ID}/topups`; //GetUserTopUps

      const params = {
        page : parseInt(this.currentPageApiBillsWon),
        limit : parseInt(this.itemPerPageBillsWon),
        status_id : filter_status
      }

      try {
        const getDepositList = await this.$axios.get(url,{params:params});
        // console.log('getDepositList',getDepositList);
        this.totalItemDeposit = getDepositList.data.data.total;
        this.dataDepositList = getDepositList.data.data;
      } catch(err) {
        console.log(err);
      }
    },

    //get filter deposit status tab5
    async getFilterDepositStatus() {
      const url = `data/top_up_statuses` //DataTopUpStatuses

      try {
        const getFilterDeposit = await this.$axios.get(url);
        this.ddFilterDepositList = getFilterDeposit.data.data;
        // console.log('getFilterDeposit',getFilterDeposit);
      } catch(err) {
        console.log(err);
      }
    },

    //get withdraw list tab 6
    async getWithdrawList(status_id) {
      const url = `admin_manage_user/users/${this.user_ID}/withdraws`; //GetUserWithdraws

      const params = {
        page : parseInt(this.currentPageApiWithdraw),
        limit : parseInt(this.itemPerPageWithdraw),
        status_id : status_id
      }

      try {
        const getWithdraw = await this.$axios.get(url,{params:params});
        // console.log('getWithdraw',getWithdraw);
        this.totalItemWithdraw = getWithdraw.data.data.total
        this.dataWithdrawList = getWithdraw.data.data;
      } catch(err) {
        console.log(err);
      }


    },

    //get filter withdraw status tab6
    async getFilterWithdrawStatus() {
      const url = `data/user_withdraw_statuses` //DataUserWithdrawStatuses

      try {
        const getDropdownWithdrawStatus = await this.$axios.get(url);
        // console.log('getDropdownWithdrawStatus',getDropdownWithdrawStatus);
        this.ddFilterWithdrawList = getDropdownWithdrawStatus.data.data;
      } catch(err) {
        console.log(err);
      }
    },

    //get ประวัติการได้รับพ้อย user tab 7
    async getUserReceivePoint() {
      const url = `admin_manage_user/users/${this.user_ID}/receive_points`
      const params = {
        page : parseInt(this.currentPageApiReceivePoint),
        limit : parseInt(this.itemPerPageReceivePoint),
      }

      try {
        const getReceivePoint = await this.$axios.get(url,{params:params});
        // console.log('getReceivePoint',getReceivePoint);
        this.totalItemReceivePoint = getReceivePoint.data.data.total;
        this.dataHistoryReceivePoint = getReceivePoint.data.data;
      } catch(err) {
        console.log(err);
      }
    },
    
    //get ประวัติการได้รับโบนัส user tab 8
    async getUserReceiveBonus() {
      const url = `admin_manage_user/users/${this.user_ID}/bonus`

      const params = {
        page : parseInt(this.currentPageApiReceiveBonus),
        limit : parseInt(this.itemPerPageReceiveBonus),
      }

      try {
        const getUserBonus = await this.$axios.get(url,{params:params});
        // console.log('getUserBonus',getUserBonus);
        this.totalItemReceiveBonus = getUserBonus.data.data.total;
        this.dataUserReceiveBonus = getUserBonus.data.data;
      } catch(err) {
        console.log(err);
      }
    },

    async getBankAll() {
      const url = `data/banks`; //DataBanks

      try {
        // const dataBank = await getDataBank();
        const dataBank = await this.$axios.get(url);
        this.dataBanks = dataBank.data.data;
      } catch(err) {
        console.log(err);
      }
    },
    //แก้ไขข้อมูล user tab1
    async editDetailUser(data) {
      const url = `admin_manage_user/users/${this.user_ID}/detail`; //EditUserDetail

      const _data = {
        first_name : data.firstname,
        last_name : data.lastname,
        facebook : data.facebook,
        line_id : data.line
      }

      try {
        const editDetail = await this.$axios.put(url,_data);
        if(editDetail.status == 200) {
          this.successAlertWord(editDetail.data.message);
          this.getDataPersonalUser(1);
          this.getDataDetailUser();
        }
      } catch(err) {
        console.log(err);
        if(err.response.status == 400) {
          this.errorAlertStatusCode(err.response.data.errors);
        } else {
          this.errorAlertStatusCode(err);
        }
      }
    },
    //แก้ไขข้อมูลธนาคาร
    async editBankUser(data) {

      const _data = {
        bank_id : data.bank_id,
        bank_account_number : data.bank_number,
        bank_account_name : data.bank_name,
        user_bank_account_id : data.user_bank_account_id
      }

      const url = `admin_manage_user/users/${this.user_ID}/bank_account` //EditUserBankAccount
      try {
        const editBank = await this.$axios.put(url,_data);
        if(editBank.status == 200) {
          this.successAlertWord(editBank.data.message);
          this.getDataBankUser(2);
        }
      } catch(err) {
        console.log(err);
        this.$toast.error(err.response.data.message)
      }
    },
    // โชว์เลขหวยที่ถูกรางวัล
    async modalShowLottoWon(data) {
      this.lottery_type_id = data.lotto_type_id;
      const url = `admin_manage_user/users/${this.user_ID}/bill_wons/${data.bill_id}`; //GetBillWonsById
      try {
        const getDataLottoWon = await this.$axios.get(url);
        this.dataBillWonById = getDataLottoWon.data.data;
        // console.log('dataBillWonById',this.dataBillWonById);
        this.$cash('#modal-show-lotto-won').modal('show');
      } catch(err) {
        console.log(err);
      }
      
    },
    //show detail bill user tab3
    async showDetailBillUser(data) {
      const bill_id = data.bill_id;
      this.bill_lotto_type_id = data.lotto_type_id
      // console.log(this.bill_lotto_type_id);
      const url = `admin_manage_user/users/${this.user_ID}/bills/${bill_id}`; //GetBillById

      try {
        const getBillByID = await this.$axios.get(url);
        // console.log('getBillByID',getBillByID);
        this.dataBillUserByID = getBillByID.data.data;
        this.$cash('#modal-show-bill-user').modal('show');
      } catch(err) {
        console.log(err);
      }

    },
    //ดึงข้อมูล dropdown filter งวดหวย
    async getDropdownLottoRoundListAll() {
      const url = `data/lottos`; //DataLottos
      
      try {
        const getLottoRoundAll = await this.$axios.get(url);
        this.dd_lottoType = getLottoRoundAll.data.data;
        // console.log('dd_lottoType',this.dd_lottoType);
      } catch(err) {
        console.log(err);
      }
    },
    //get data dropdown lotto round filter
    async getDataDropdownLottoRoundFilter(lotto_type_id) {
      const url = `data/lotto_rounds/${lotto_type_id}`;
      try {
        const getDropdownLottoRound = await this.$axios.get(url);
        this.dd_lotto_round = getDropdownLottoRound.data.data;
        // console.log('dd_lotto_round',this.dd_lotto_round);
      } catch(err) {
        console.log(err);
      }
    },
    filterHistoryWonLotto(lotto_round_id) {
      // console.log('filter',lotto_round_id);
      this.filterLottoRound = lotto_round_id;
      this.getDataHistoryBillWonLotto();
    },
    //filter history user buy lotto
    filterHistoryUserBuyLotto(lotto_round_id) {
      this.filterLottoRound = lotto_round_id;
      this.getDataHistoryUserBuyLotto();
    },
    //modal add user book bank
    modalAddUserBookBank() {
      this.$cash('#modal-add-user-book-bank').modal('show');
    },
    confirmAddBookbank(form) {
      this.formAddBookbank = form;
      this.headerModalConfirm = 'ยืนยันบันทึกข้อมูลบัญชีธนาคาร',
      this.typeModalConfirmSubmit = 'submitAddUserBookbank'
      this.$cash('#modal-add-user-book-bank').modal('hide');
      this.$cash('#modal-confirm').modal('show');
    },

    async addUserBookbank() {
      // console.log(this.formAddBookbank);

      const url = `admin_manage_user/users/${this.user_ID}/bank_account` //AddUserBankAccount

      const _data = {
        bank_id : this.formAddBookbank.bank_id,
        bank_account_number : this.formAddBookbank.bank_number,
        bank_account_name : this.formAddBookbank.bank_name
      }

      try {
        const addUserBookbank = await this.$axios.post(url,_data);
        // console.log('addUserBookbank',addUserBookbank);
        if(addUserBookbank.status == 201) {
          this.getDataAllTab(this.openTab);
          this.$cash('#modal-confirm').modal('hide');
          this.successAlertWord(addUserBookbank.data.message);
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
    clearDataPagination() {
      this.currentPageBills = 1,
      this.totalItemBills = 0,
      this.itemPerPageBills = 20,
      this.currentPageApiBills = 0,
      this.dataBillUserByID = '',
      this.currentPageBillsWon = 1,
      this.totalItemBillsWon = 0,
      this.itemPerPageBillsWon = 20,
      this.currentPageApiBillsWon = 0,
      this.currentPageDeposit = 1,
      this.totalItemDeposit = 0,
      this.itemPerPageDeposit = 20,
      this.currentPageApiDeposit = 0,
      this.currentPageWithdraw = 1,
      this.totalItemWithdraw = 0,
      this.itemPerPageWithdraw = 20,
      this.currentPageApiWithdraw = 0,
      this.currentPageReceivePoint = 1,
      this.totalItemReceivePoint = 0,
      this.itemPerPageReceivePoint = 20,
      this.currentPageApiReceivePoint = 0
      this.currentPageReceiveBonus = 1,
      this.totalItemReceiveBonus = 0,
      this.itemPerPageReceiveBonus = 20,
      this.currentPageApiReceiveBonus = 0
    },
  }
}
</script>
<style>
  .menu-background {
    background-color: #f44056;
    border: none !important;
  }
</style>
