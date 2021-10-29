<template>
<!-- รายการเดินบัญชี -->
  <div>
    <div class="col-span-12 mt-8">
      <div class="intro-y flex items-center h-10">
        <div>
          <span class="lg:text-lg"><b>รายการเดินบัญชี</b></span>
        </div>
      </div>
    </div>
    <div class="col-span-12 lg:col-span-4">
      <div class="intro-y pr-1">
        <div class="box p-2">
          <div class="grid grid-cols-3 gap-4">
            <div>
              <p>บัญชีของระบบ</p>
              <select v-model="filter_bank_account" name="bank_account" id="bank_account" class="form-control mt-3">
                <option value="">บัญชีของระบบ</option>
                <option v-for="(bank,index) in companyBank" :key="index" :value="bank.id">
                  {{bank ? bank.bank_account_name : ''}}
                  {{bank ? bank.bank.name : ''}}
                </option>
                <!-- <option value="">
                  MYO MYO [ไทยพาณิชย์ xxx-xxx-xxxx]
                </option> -->
              </select>
            </div>
            <div>
              <p class="mb-3">เริ่มวันที่-ถึงวันที่</p>
              <MazPicker
                v-model="dateTimeFilter"
                placeholder="ค้นหาวันที่..."
                position="bottom right"
                class="mt-3"
                size="sm"
                range
                double
                no-time
                format="YYYY-MM-DD"
                formatted="YYYY-MM-DD"
              >
                <!-- <i
                  slot="icon-left"
                  class="material-icons"
                >
                </i> -->
              </MazPicker>
            </div>
            <div>
              <p>ค้นหาจำนวนเงิน</p>
              <input v-model="filterCredit" type="text" class="form-control w-2/3 mt-3" placeholder="ระบุจำนวนเงิน">
              <button class="btn bg-blue-500 text-white mt-3" @click="getDataStatement(openTab)">ค้นหา</button>
              <button class="btn bg-gray-200 text-black mt-3" @click="refreshFilter()">Refresh</button>
            </div>
          </div>
        </div>
        <div class="mt-4">
          <div class="box p-5 text-lg">
            <b>สรุปรายการเดินบัญชี</b>
            <div class="grid grid-cols-3 mt-4">
              <div class="border border-gray-300 py-3 px-3">โอนเงินเข้า</div>
              <div class="border border-gray-300 py-3 px-3">{{statementAll.deposit ? statementAll.deposit.count : ''}} รายการ</div>
              <div class="border border-gray-300 py-3 px-3">จำนวน {{statementAll.deposit ? statementAll.deposit.sum : ''}} บาท</div>
              <div class="border border-gray-300 py-3 px-3">โอนเงินออก</div>
              <div class="border border-gray-300 py-3 px-3">{{statementAll.whitdraw ? statementAll.whitdraw.count : ''}} รายการ</div>
              <div class="border border-gray-300 py-3 px-3">จำนวน {{statementAll.whitdraw ? statementAll.whitdraw.sum : ''}} บาท</div>
            </div>
          </div>
        </div>
        <div class="mt-4">
          <div class="box p-5">
            <div class="pos__tabs nav-tabs justify-center flex overscroll-x-scroll">
              <!-- เมนู แต่ละ status -->
              <!-- <a
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
                  @click="getDataStatement(index+1)"
                >{{ tab }} [{{countTabStatusDeposit[index]}}]
              </a> -->
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
                  @click="getDataStatement(index+1)"
                >{{ tab }} [{{countTabStatusDeposit[index]}}]
              </a>
          </div>
          </div>
        </div>
        <div class="mt-4">
          <div class="box p-5">
            <b>{{ openTab == 1 ? 'รายการโอนเข้า' : 'รายการโอนออก' }}</b>
             <div v-if="openTab == 1" class="mt-4">
               <!-- status รายการย่อย -->
              <div class="box p-5">
                <div class="pos__tabs nav-tabs justify-center flex overscroll-x-scroll w-auto lg:w-3/12">
                  <!-- เมนู แต่ละ status -->
                  <a
                    v-for="(tab,index) in statusTabMini" :key="index"
                      data-toggle="tab"
                      data-target="#showRoomWithStatus"
                      href="javascript:;"
                      class="flex-1 py-2 rounded-md text-center active"
                      style="border:none;"
                      :class="{
                          'bg-white-900': openTabMini !== tab.id,
                          'bg-blue-400 text-white mb-px': openTabMini === tab.id,
                          }"
                      @click="getDataStatementMini(tab.id)"
                    >{{ tab.status_detail }}
                  </a>
              </div>
              </div>
            </div>
            <client-only>
              <div class="relative overflow-y-hidden">
                <div>
                  <table class="table mt-5 mb-5 overflow-x-scroll">
                    <thead>
                      <!-- <tr>
                        <th v-for="(col,index) in columnShow" :key="index" class="border-b-2 dark:border-dark-5 whitespace-nowrap" :class="col.color">
                          <b>{{ col.label }}</b>
                        </th>
                      </tr> -->
                      <tr v-if="openTab == 1">
                        <th v-for="(col,index) in columnShow" :key="index" class="border-b-2 dark:border-dark-5 whitespace-nowrap" :class="col.color">
                          <b>{{ col.label }}</b>
                        </th>
                      </tr>
                      <tr v-if="openTab == 2">
                        <th v-for="(col,index) in tbStatement.columns2" :key="index" class="border-b-2 dark:border-dark-5 whitespace-nowrap" :class="col.color">
                          <b>{{ col.label }}</b>
                        </th>
                      </tr>
                    </thead>
                    <tbody v-if="tbStatement.rows.length > 0">
                      <tr v-for="(data,index) in tbStatement.rows" :key="index">
                        <td>{{ data.num }}</td>
                        <td>{{ data.date_time }}</td>
                        <td v-if="openTab == 1">
                          <div v-if="data.user_bank_accout && data.user_bank_accout.length > 0">
                            <p v-for="(bank,index2) in data.user_bank_accout" :key="index2">{{bank.bank_account_name}}</p>
                          </div>
                        </td>
                        <td><p>{{ data ? data.phone_number : ''}}</p></td>
                        <td v-if="openTab == 2">{{data.bank_account}}</td>
                        <td v-if="openTab == 2">{{data.bank_code}}</td>
                        <td>{{ openTab == 1 ? data.detail : data.detail_withdraw }}</td>
                        <td
                        :class="{
                          'text-green-600': openTab == 1,
                          'text-yellow-500' : openTab == 2
                        }">{{ data.credit }}</td>
                        <!-- โชว์แอดมินทำรายการ tab 1 -->
                        <td v-if="openTab == 1 && openTabMini == 3">{{ data.admin }} {{ data.time_admin_approve }}</td>
                        <td v-if="openTab == 1 && openTabMini == 1">
                          <button class="btn bg-green-500 text-white" 
                            @click="modalProffStatusWaitingToSuccess(data)">จัดการรายการฝาก</button>
                        </td>
                        <td v-if="openTab == 2">{{data.admin}} {{data.datetime_admin_submit}}</td>
                      </tr>
                    </tbody>
                </table>
                </div>
              </div>

              <div class="grid lg:grid-cols-3 gap-4">
                <t-pagination
                  v-if="openTab == 1"
                  v-model="currentPage"
                  :total-items="totalItem"
                  :per-page="itemPerPage"
                  :limit="7"
                  :disabled="false"
                  @input="handleTogglePage()"
                />

                <t-pagination
                  v-if="openTab == 2"
                  v-model="currentPageTransfer"
                  :total-items="totalItemTransfer"
                  :per-page="itemPerPageTransfer"
                  :limit="7"
                  :disabled="false"
                  @input="handleTogglePageTransfer()"
                />
              </div>
              <!-- @proffStatementDeposit="proffStatementDeposit" -->

              <ModalProffListTransferDeposit 
                :data-proff-statement="dataToShowProffStatementDeposit"
                :dropdown-descript-proof="dropdownDescriptProof"
                :data-user-by-phone="dataUserByPhone"
                :err-response-find-phone="errResponseFindPhone"
                @findPhoneNumber="findPhoneNumber" 
                @proffStatementDeposit="modalConfirmProofStatement" />

              <ModalConfirm
                :HeaderMassage="headerModalConfirm"
                :warning-massage="warningMassageModalConfirm"
                @submitConfirmModal="submitConfirm()"
                @cancelModal="cancelModal"
              />
            </client-only>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ModalProffListTransferDeposit from '@/components/Modal/finance/statement/ModalProffListTransferDeposit';
import moment from 'moment'
import alertMixins from "~/mixins/alertMixin";

import ModalConfirm from '@/components/Modal/ModalConfirm';

const WATING_STATUS = 1;
const SUCCESS_STATUS = 3;

export default {
  layout: 'dashboard',
  middleware : ['permission'],
  components : { 
    ModalProffListTransferDeposit,
    ModalConfirm
  },
  mixins: [alertMixins],
  data() {
    return {
      dateTimeFilter : null,
      tabStatus : ['รายการโอนเข้า','รายการโอนออก'],
      openTab : '',
      tbStatement: {
        page: 1,
        columns: [
          { label: "#"},
          { label: "วันที่"},
          { label: "ลูกค้า"},
          { label: "เบอร์โทร"},
          { label: "รายละเอียด"},
          { label: "โอนเข้า", color:'text-green-500'},
          { label: "ทำรายการโดย",  showTabStatus : [SUCCESS_STATUS]},
          { label : "ตัวเลือก",showTabStatus : [WATING_STATUS]}
        ],
        columns2: [
          { label: "#"},
          { label: "วันที่"},
          { label: "เบอร์โทร"},
          { label: "บัญชีธนาคาร"},
          { label: "bank_code"},
          { label: "รายละเอียด"},
          { label: "โอนออก", color:'text-yellow-500'},
          { label: "ทำรายการโดย"},
        ],
        rows: [],
      },
      currentPage: 1,
      totalItem: 0,
      itemPerPage: 20,
      currentPageApi: 0,
      dateTime : '',
      statementAll : '',
      companyBank : '',
      filter_bank_account : '',
      filterCredit : '',
      countBankAlls : [],
      statusTabMini : '',
      openTabMini : '',
      countTabStatusDeposit : [],
      dataToShowProffStatementDeposit : '',
      dropdownDescriptProof : '',
      dataUserByPhone : null,
      errResponseFindPhone : null,
      user_id : '',
      warningMassageModalConfirm : '',
      headerModalConfirm : '',
      typeModalConfirmSubmit : null,
      formProof : {
        remark : '',
        statement_id : ''
      },

    }
  },
  computed : {
    columnShow() {
      return this.tbStatement.columns.filter(
        (col) =>
          !col.showTabStatus || col.showTabStatus.includes(this.openTabMini)
      );
    },
    // columnShow() {
    //   return this.tbStatement.columns.filter(
    //     (col) =>
    //       !col.showTabStatus || col.showTabStatus.includes(this.openTab)
    //   );
    // },
  },
  watch : {
    openTab : 'setInitDataFilter',
    openTabMini : 'setInitDataFilterMini'
  },
  created() {
    this.getDataStatementAll();
    this.getDataStatement(1);
    this.getDataCompanyBank();
    this.countBankAll();
    this.getCountStatusAll();
    this.getDropdownDescriptionProofStatement();
  },
  methods : {
    async handleTogglePage() {
      this.currentPageApi = this.currentPage - 1;
      if(this.openTab == 1) {
        this.getStatementDeposit();
      } else {
        this.getStatementWithdraw();
      }
      
    },

    handleTogglePageTransfer() {
      this.currentPageApiTransfer = this.currentPageTransfer - 1;
      this.getStatementWithdraw();
    },

    setDataPaginationDeposit() {
      this.tbStatement.rows = [];
      // console.log(this.openTabMini);
      this.currentPage= 1;
      this.totalItem= 0;
      this.itemPerPage= 20;
      this.currentPageApi= 0;
      this.getStatementDeposit();
    },

    async getDataCompanyBank() {
      const url = `data/company_banks`; //DataCompanyBanks
      try {
        const dataCompanyBank = await this.$axios.get(url);
        this.companyBank = dataCompanyBank.data.data;
        // console.log('companyBank',this.companyBank);
      } catch(err) {
        console.log(err);
      }
    },

    //ดึงข้อมูล statement all
    async getDataStatementAll() {
      const url = `admin_manage_statement/statement_all`; //StatementAll
      try {
        const getStatementAll = await this.$axios.get(url);
        this.statementAll = getStatementAll.data.data;
        // console.log('statementAll',this.statementAll);
      } catch(err) {
        console.log(err);
      }
    },
    getDataStatement(status) {
      this.openTab = status;
      if(status == 1) {
        this.getTabStatusDeposit();
        // this.getDataStatementMini(1);
      } else {
        //ไปเช็คใน watch แล้ว
        // this.getStatementWithdraw();
      }
    },
    getDataStatementMini(status_sub) {
      this.openTabMini = status_sub;
      if(this.openTab == 1) {
        this.getStatementDeposit();
      }

    },
    //รายการเดินบัญชีโอนเข้า tab1
    async getStatementDeposit() {
      // this.tbStatement.rows = [];
      const url = `admin_manage_statement/bank_statement_deposits`; //BankStatementDeposits

      const params = {
        company_bank_id : this.filter_bank_account,
        start_date : this.dateTimeFilter  ? moment(this.dateTimeFilter.start).format("YYYY-MM-DD%HH:mm:ss") : '',
        end_date : this.dateTimeFilter ? moment(this.dateTimeFilter.end).format("YYYY-MM-DD%23:59:ss") : '',
        credit : this.filterCredit,
        page: this.currentPageApi,
        limit: this.itemPerPage,
        status_id : this.openTabMini
      }

      try {
        const depositStatement = await this.$axios.get(url,{params:params});
        // console.log('depositStatement',depositStatement);
        this.tbStatement.rows = depositStatement.data.data.bank_statements.map((item,index) => {
          // console.log(item);
          return {
            num : index+1,
            date_time : item ? moment(item.date_transfer).format("YYYY-MM-DD HH:mm") : '',
            detail : `รับโอนเงินจาก ${item.original_data
              && item.original_data.member_profile
              ? item.original_data.member_profile.member_bank_code : ''} ${item.original_data
              && item.original_data.member_profile

              ? item.original_data.member_profile.deposits : ''} บ. เวลา ${item.original_data
              && item.original_data.member_profile
              && item.original_data.member_profile.date_time ? item.original_data.member_profile.date_time : ''}`,
            credit : item ? item.credit : '',
            original_data : item ? item.original_data : '',
            phone_number : item.user ? item.user.phone_number : '',
            user_bank_accout : item.user ? item.user.user_bank_accounts : '',
            id : item ? item.id : '',
            admin : item.admin && item.admin.name_profile ? item.admin.name_profile : 'ระบบออโต้',
            time_admin_approve : item && item.time_admin_approve ? moment(item.time_admin_approve).format("YYYY-MM-DD HH:mm") : ''
            // phoneNumber : 
          }
        })
        this.totalItem = depositStatement.data.data.total;
      } catch(err) {
        console.log(err);
      }
    },
    //รายการเดินบัญชีโอนออก tab2
    async getStatementWithdraw() {
      const url = `admin_manage_statement/bank_statement_withdraws`; //BankStatementWithdraws
      const params = {
        company_bank_id : this.filter_bank_account,
        start_date : this.dateTimeFilter != null ? moment(this.dateTimeFilter.start).format() : '',
        end_date : this.dateTimeFilter != null ? moment(this.dateTimeFilter.end).format() : '',
        credit : this.filterCredit,
        page: this.currentPageApiTransfer,
        limit: this.itemPerPageTransfer,
      }

      try {
        const withdrawStatement = await this.$axios.get(url,{params:params});
        this.tbStatement.rows = withdrawStatement.data.data.bank_statements.map((item,index) => {
          // console.log(item);
          return {
            num : index+1,
            date_time : item ? moment(item.created_at).format("YYYY-MM-DD HH:mm") : '',
            detail_withdraw : item && item.status_id == 1 ? 'รอโอน' : item.remark,
            credit : item ? item.credit : '',
            bank_account : item.user_bank_account != null ? item.user_bank_account : item.agent_bank_account,
            bank_code : item ? item.user_bank_code : '',
            admin : item.admin ? item.admin.name_profile : '',
            datetime_admin_submit : item && item.date_transfer ? moment(item.date_transfer).format("YYYY-MM-DD HH:mm") : '',
            phone_number : item.user_number != null ? item.user_number : item.agent_number
          }
        })
        this.totalItemTransfer = withdrawStatement.data.data.total;
        // console.log('withdrawStatement',withdrawStatement);
      } catch(err) {
        console.log(err);
      }
    },
    setInitDataFilter() {
      this.tbStatement.rows = [];
      if(this.openTab == 1) {
        this.currentPage= 1;
        this.totalItem= 0;
        this.itemPerPage= 20;
        this.currentPageApi= 0;
        // this.getStatementDeposit();
        this.getDataStatementMini(1);
      } else {
        this.currentPageTransfer= 1
        this.totalItemTransfer= 0
        this.itemPerPageTransfer= 20
        this.currentPageApiTransfer= 0
        this.getStatementWithdraw();
      }
      
    },
    setInitDataFilterMini() {
      this.currentPage= 1;
      this.totalItem= 0;
      this.itemPerPage= 20;
      this.currentPageApi= 0;
      this.getStatementDeposit();
    },
    async countBankAll() {
      this.countBankAlls = [];
      await this.countBankStatementDeposit();
      await this.countBankStatementWithdraw();
    },
    async countBankStatementDeposit() {
      const url = `admin_manage_statement/status/bank_statement_deposits`; //CountBankStatementDeposits
      try {
        const countBankDeposit = await this.$axios.get(url);
        this.countBankAlls.push(countBankDeposit.data.data);
      } catch(err) {
        console.log(err);
      }
    },
    async countBankStatementWithdraw() {
      const url = `admin_manage_statement/status/bank_statement_withdraws`; //CountBankStatementWithdraws
      try {
        const countBankWithdraw = await this.$axios.get(url);
        this.countBankAlls.push(countBankWithdraw.data.data);
        // console.log('countBankWithdraw',countBankWithdraw);
      } catch(err) {
        console.log(err);
      }
    },
    refreshFilter() {
      this.dateTimeFilter = null;
      this.filter_bank_account = '';
      this.filterCredit = '';
      this.getDataStatement(this.openTab);
    },
    async getTabStatusDeposit() {
      const url = `data/bank_deposit_statuses` //DataBankDepositStatuses

      try {
        const getTabDeposit = await this.$axios.get(url);
        this.statusTabMini = getTabDeposit.data.data;
        // console.log('statusTabMini',this.statusTabMini);
      } catch(err) {
        console.log(err);
      }
    },
    // async getTabStatusWithdraw() {
    //   const url = `data/bank_withdraw_statuses` //DataBankWithdrawStatuses

    //   try {
    //     const getTabWithdraw = await this.$axios.get(url);
    //     // console.log('getTabWithdraw',getTabWithdraw);
    //     this.statusTabMini = getTabWithdraw.data.data;
    //   } catch(err) {
    //     console.log(err);
    //   }
    // },

    //modal proff status รอทำรายการ to success รายการฝาก
    modalProffStatusWaitingToSuccess(data) {
      this.dataUserByPhone = null;
      this.errResponseFindPhone = null;
      this.dataToShowProffStatementDeposit = data;
      this.$cash('#modal-proff-status-wait-to-success').modal('show');
    },

    //count ข้อมูล all
    async getCountStatusAll() {
      this.countTabStatusDeposit = [];
      const url = `admin_manage_statement/status/bank_statement_deposits`

      try {
        const countStatusDeposit = await this.$axios.get(url); //CountBankStatementDeposits
        this.countTabStatusDeposit.push(countStatusDeposit.data.data);
      } catch(err) {
        console.log(err);
      }

      const url2 = `admin_manage_statement/status/bank_statement_withdraws` //CountBankStatementWithdraws

      try {
        const countStatusWithdraw = await this.$axios.get(url2);
        this.countTabStatusDeposit.push(countStatusWithdraw.data.data);
      } catch(err) {
        console.log(err);
      }

    },
    
    async proffStatementDeposit() {
      const url = `admin_manage_statement/proof_statement/${this.formProof.statement_id}`

      const _data = {
        user_id : this.user_id,
        remark : this.formProof.remark
      }

      // console.log('data',_data);
      // console.log(this.formProof);
      try {
        const proffStatement = await this.$axios.post(url,_data);
        if(proffStatement.status == 200) {
          // console.log(proffStatement);
          this.getDataStatement(this.openTab);
          this.$cash('#modal-confirm').modal('hide');
          this.successAlertWord(proffStatement.data.message);
        }
      } catch(err) {
        // console.log(err);
        this.$cash('#modal-confirm').modal('hide');
        if(err.response.status == 400) {
          this.errorAlertStatusCode(err.response.data.errors);
        } else if(err.response.status == 404) {
          this.errorAlertStatusCode(err.response.data.errors);
        } else {
          this.errorAlertStatusCode(err);
        }
      }
     },

    async getDropdownDescriptionProofStatement() {
      const url = `data/proof_statement_descriptions`;
      try {
        const getDescProof = await this.$axios.get(url);
        // console.log('getDescProof',getDescProof);
        this.dropdownDescriptProof = getDescProof.data.data;
      } catch(err) {
        console.log(err);
      }
    },

    async findPhoneNumber(phone) {
      this.errResponseFindPhone = null;
      // console.log('phone',phone);
      
      const url = `admin_manage_statement/user/phone_number` //GetUserByIdPhoneNumber

      const _data = {
        phone_number : phone
      }

      try {
          const getUserByPhone = await this.$axios.post(url,_data);
          this.dataUserByPhone = getUserByPhone.data.data;
          // console.log('dataUserByPhone',this.dataUserByPhone);
          if(this.dataUserByPhone != null) {
              this.user_id = this.dataUserByPhone.id;
          }
      } catch(err) {
          this.dataUserByPhone = null;
          if(err.response.status == 404) {
            // console.log(err.response.data.errors);
            this.errResponseFindPhone = err.response.data.errors;
          } else {
            console.log(err);
          }
          
      }
    },

    cancelModal() {
      this.$cash('#modal-confirm').modal('hide');
      this.warningMassageModalConfirm = null;
    },
    
    modalConfirmProofStatement(form,data) {
      this.formProof.statement_id = data.id;
      this.formProof.remark = form.remark;
      this.warningMassageModalConfirm = 'กรุณาตรวจสอบข้อมูลก่อนกดบันทึก',
      this.headerModalConfirm = 'ยืนยันบันทึกข้อมูล',
      this.typeModalConfirmSubmit = 'proofStatementDepositList',
      this.$cash('#modal-proff-status-wait-to-success').modal('hide');
      this.$cash('#modal-confirm').modal('show');
    },

    submitConfirm() {
      if(this.typeModalConfirmSubmit == 'proofStatementDepositList') {
        this.proffStatementDeposit();
      }
    }
  }
}
</script>
