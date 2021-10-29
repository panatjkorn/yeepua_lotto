<template>
  <div>
    <div class="col-span-12 mt-8">
      <div class="intro-y flex items-center h-10">
        <div>
          <span class="lg:text-lg"><b>รายการถอนเงินตัวแทน</b></span>
        </div>
      </div>
    </div>
    <div class="col-span-12 lg:col-span-4">
      <div class="intro-y pr-1">
        <div class="box p-2 ">
          <div class="pos__tabs nav-tabs justify-center flex overscroll-x-scroll">
              <!-- เมนู แต่ละ status -->
              <a
                v-for="(tab,index) in countAgentTab" :key="index"
                  data-toggle="tab"
                  data-target="#showRoomWithStatus"
                  href="javascript:;"
                  class="flex-1 py-2 rounded-md text-center active"
                  style="border:none;"
                  :class="{
                      'bg-white-900': openTab !== index+1,
                      'bg-blue-400 text-white mb-px': openTab === index+1,
                      }"
                  @click="getDataWithdrawAgentStatus(index+1)"
                >{{ tab.status_detail }} [{{tab.count}}]
              </a>
          </div>
        </div>
      </div>
    </div>
    <div class="col-span-12 lg:col-span-4 box mt-5 p-5 overflow-x-auto">
      <div class="flex">
        <b>รายการรอตรวจสอบ</b>
        <div class="ml-auto">
          <input type="text" class="form-control" placeholder="ค้นหาเบอร์โทรผู้ซื้อ">
        </div>
      </div>
      <table class="table mt-5">
        <thead>
          <tr>
            <th v-for="(col,index) in columnShow" :key="index" class="border-b-2 dark:border-dark-5 whitespace-nowrap">
              <b>{{ col.label }}</b>
            </th>
          </tr>
        </thead>
        <tbody v-if="tbAgentWithdraw.rows.length > 0">
          <tr v-for="(data,index) in tbAgentWithdraw.rows" :key="index" :class="{'bg-gray-200 dark:bg-dark-1' : index%2 == 0}">
            <td>{{ data.num }}</td>
            <td>{{ data.date_time_withdraw }}</td>
            <td>{{ data.phone }}</td>
            <td>
              {{ data.account_name ? data.account_name : '' }}
              <!-- <p v-for="(account_name,index) in data.account_name" :key="index">{{ account_name.bank_account_name }}</p> -->
            </td>
            <td>
              {{ data.bank ? data.bank : '' }}
              <!-- <p v-for="(account_num,index) in data.account_number" :key="index">{{ account_num.bank_account_number }}</p> -->
            </td>
            <td>
              {{ data.account_number ? data.account_number : '' }}
              <!-- <p v-for="(account_bank,index) in data.bank" :key="index">{{ account_bank.agent_bank ? account_bank.agent_bank.name :'' }}</p> -->
            </td>
            <td>{{ data.amount_withdraw }}</td>
            <td v-if="openTab == 4">{{ data.admin ? data.admin.name_profile : '' }} {{data ? data.time_transfer : ''}}</td>
            <td v-if="openTab == 5">{{ data.admin ? data.admin.name_profile : '' }} {{data ? data.datetime_cancel : ''}}</td>
            <td v-if="openTab == 3 || openTab == 5">{{data.remark}}</td>
            <td v-if="openTab != 5">
              <!-- <pre>{{data}}</pre> -->
              <button v-if="openTab == 1" class="btn bg-blue-500 text-white w-auto mr-1 mb-2" @click="isModalCheckWithdrawList(data)">ตรวจสอบ</button>
              <button v-if="openTab == 2 || openTab == 3" class="btn bg-black text-white w-auto mr-1 mb-2" @click="modalTransferAuto(data.id)">โอน Auto</button>
              <button v-if="openTab == 2" class="btn bg-gray-400 text-black w-auto mr-1 mb-2" @click="modalTransferManual(data.id)">โอน Manual</button>
              <button v-if="openTab == 2" class="btn border-black text-black w-auto mr-1 mb-2" @click="modalConfirmCancelWithdrawTab2(data.id)">ยกเลิกรายการ</button>
              <button v-if="openTab == 4 && data.agent_withdraw_type && data.agent_withdraw_type.id == 2" class="btn bg-black text-white w-auto mr-1 mb-2" 
              @click="modalUploadImageBillManualTransfer(data.id)">อัพโหลดรูปสลิป</button>
              <button v-if="openTab == 4 && data.agent_withdraw_type && data.agent_withdraw_type.id == 2" class="btn bg-black text-white w-auto mr-1 mb-2" 
              @click="modalDetailSlipUserSuccess(data.id)">ดู Slip</button>
            </td>
          </tr>
        </tbody>
      </table>
      <client-only>
        <!-- <ModalCheckAgentWithdraw /> -->
        <ModalCheckWithdrawList 
          v-if="openTab == 1"
          :data-withdraw-list="dataWithdrawList"
          :type-withdraw="2"
          @modalConfirmCancelWithdraw="modalConfirmCancelWithdraw"
          @modalConfirmSubmitWithdraw="modalConfirmSubmitWithdraw"
        />
        <ModalConfirmCancelWithdraw 
          @cancelWithdraw="cancelAgentWithdraw" />

        <ModalConfirmSubmitWithdraw 
          @submitTransfer="submitTransferWithStatus"
        />
        <!-- modal โอนเงิน auto -->
        <ModalTransferMoneyAuto 
          :data-transfer-auto="dataManageTransferAuto"
          :data-company-bank="companyBank"
          :type-withdraw="2"
          :data-balance="dataBalance"
          :loading-show="loadingShow"
          @getDataBalanceCompanyBank="getDataBalanceCompanyBank"
          @modalConfirmTransferAuto="modalConfirmTransferAuto"
        />

        <!-- modal confirm submit transfer auto -->
        <ModalConfirmSubmitTransferAuto 
          :data-transfer-auto="formTransferAuto"
          @submitTransferAuto="submitTransferAuto" />

        <ModalShowMoneyBankCompany 
          :data-balance="dataBalance"
        />

        <!-- modal โอนเงิน manual -->
        <ModalTransferMoneyManual 
          :data-transfer-manual="dataManageTransferManual"
          :type-withdraw="2"
          :data-company-bank="companyBank"
          :data-balance="dataBalance"
          :loading-show="loadingShow"
          @getDataBalanceCompanyBank="getDataBalanceCompanyBank"
          @modalConfirmTransferManual="transferManual"
        />

        <!-- upload รูปสลิปโอน manual -->
        <ModalUploadImageTransferManual @uploadImageTransferManual="uploadImageTransferManual" />

        <!-- ดู สลิป -->
        <ModalSlipTransferSuccess :slip-image-withdraw="slipImageWithdraw" />

        <div class="grid lg:grid-cols-3 gap-4">
          <t-pagination
            v-model="currentPage"
            :total-items="totalItem"
            :per-page="itemPerPage"
            :limit="7"
            :disabled="false"
            @input="handleTogglePage()"
          />
        </div>
      </client-only>
    </div>
  </div>
</template>
<script>
// import ModalCheckAgentWithdraw from '@/components/Modal/finance/agentWithdraw/ModalCheckAgentWithdraw';
import ModalCheckWithdrawList from '@/components/Modal/finance/withdraw/ModalCheckWithdrawList';
import ModalConfirmCancelWithdraw from '@/components/Modal/finance/withdraw/ModalConfirmCancelWithdraw'; //modal confirm cancel withdraw
import ModalConfirmSubmitWithdraw from '@/components/Modal/finance/withdraw/ModalConfirmSubmitWithdraw'; //modal confirm submit withdraw
import ModalTransferMoneyAuto from '@/components/Modal/finance/withdraw/ModalTransferMoneyAuto'; //modal โอนเงิน auto
import ModalUploadImageTransferManual from '@/components/Modal/finance/withdraw/ModalUploadImageTransferManual'; //upload slip manual

import ModalConfirmSubmitTransferAuto from '@/components/Modal/finance/withdraw/ModalConfirmSubmitTransferAuto'; //modal confirm transfer auto
import ModalShowMoneyBankCompany from '@/components/Modal/finance/withdraw/ModalShowMoneyBankCompany'; //modal โชว์เงินเหลือหลังจากโอน
import ModalTransferMoneyManual from '@/components/Modal/finance/withdraw/ModalTransferMoneyManual'; //modal โอนเงิน manual
import ModalSlipTransferSuccess from '@/components/Modal/finance/withdraw/ModalSlipTransferSuccess'; //modal ดู slip

import moment from "moment";
import alertMixins from "~/mixins/alertMixin";

const PENDING_CHECKING = 1;
const PENDING_TRANSFER_MONEY = 2;
const FAILD_STATUS = 3;
const SUCCESS_STATUS = 4;
const REJECT_STATUS = 5;

export default {
  layout: 'dashboard',
  mixins : [alertMixins],
  middleware : ['permission'],
  components : { 
    ModalCheckWithdrawList,
    ModalConfirmCancelWithdraw,
    ModalConfirmSubmitWithdraw,
    ModalTransferMoneyAuto,
    ModalConfirmSubmitTransferAuto,
    ModalShowMoneyBankCompany,
    ModalTransferMoneyManual,
    ModalSlipTransferSuccess,
    ModalUploadImageTransferManual
  },
  data() {
    return {
      tabStatus : ['รอตรวจสอบ','รอโอนเงิน','สำเร็จ','ถูกปฏิเสธ'],
      openTab : '',
      tbAgentWithdraw: {
        page: 1,
        columns: [
          { label: "#"},
          { label: "วันที่ส่งคำขอ"},
          { label: "เบอร์โทร"},
          { label: "ชื่อบัญชี"},
          { label: "เลขบัญชี"},
          { label: "ธนาคาร"},
          { label: "ยอดถอน", showTabStatus: [PENDING_CHECKING]},
          { label: "ยอดที่ต้องโอน", showTabStatus: [PENDING_TRANSFER_MONEY]},
          { label: "ยอดที่โอน", showTabStatus: [SUCCESS_STATUS,FAILD_STATUS,REJECT_STATUS]},
          { label: "โอนเงินโดย", showTabStatus: [SUCCESS_STATUS]},
          { label: "ปฏิเสธโดย", showTabStatus: [REJECT_STATUS]},
          { label: "เหตุผล", showTabStatus: [REJECT_STATUS,FAILD_STATUS]},
          { label: "ตัวเลือก", showTabStatus: [PENDING_CHECKING,PENDING_TRANSFER_MONEY,SUCCESS_STATUS,FAILD_STATUS]},
        ],
        rows: [
          // {
          //   num : '1',
          //   date_time_withdraw : 'sadsadsasadasd',
          //   phone : 'dsadasd',
          //   account_name : 'sadsadsa',
          //   account_number : 'asdasdas',
          //   bank : 'sadasdasd',
          //   amount_withdraw : 'dsadsd',
          //   id : 'dsads'
          // }
        ],
      },
      companyBank : '',
      dataManageTransferManual : '',
      search : '',
      countAgentTab : '',
      agent_withdraws_id : '',
      dataWithdrawList : '',
      currentPage: 1,
      totalItem: 0,
      itemPerPage: 20,
      currentPageApi: 0,
      dataManageTransferAuto : '',
      formTransferAuto : '',
      slipImageWithdraw : '',
      company_bank_Id : '',
      loadingShow : false,
      dataBalance : ''
    }
  },
  computed : {
    columnShow() {
    //   this.tbAgentWithdraw.columns.filter((col) => console.log(col));
      return this.tbAgentWithdraw.columns.filter(
        (col) =>
          !col.showTabStatus || col.showTabStatus.includes(this.openTab)
      );
    },
  },
  created() {
    this.getDataWithdrawAgentStatus(1);
    this.getCountStatusAgentWithdraw();
    this.getDataCompanyBank();
  },
  watch : {
    openTab : 'clearDataPagination'
  },
  methods : {
    async handleTogglePage() {
      this.currentPageApi = this.currentPage - 1;
      this.getDataWithdrawAgentStatus(this.openTab);
    },
    clearDataPagination() {
      this.currentPage = 1;
      this.totalItem = 0;
      this.itemPerPage = 20;
      this.currentPageApi = 0;
      this.search = '';
      // this.getDataWithdrawList(this.openTab);
    },
    async getDataCompanyBank() {
      const url = `data/company_banks`; //DataCompanyBanks
      try {
        const dataCompanyBank = await this.$axios.get(url);
        this.companyBank = dataCompanyBank.data.data;
      } catch(err) {
        console.log(err);
      }
    },
    async getDataWithdrawAgentStatus(status) {
        this.openTab = status;
        const url = `admin_manage_statement/agent_withdraws/`; //AgentWithdraws
        const params = {
          status_id : status,
          search : this.search,
          page: this.currentPageApi,
          limit: this.itemPerPage,
        }

        try {
            const getAgentWithdraw = await this.$axios.get(url,{params : params});
            // console.log('getAgentWithdraw',getAgentWithdraw);
            this.tbAgentWithdraw.rows = getAgentWithdraw.data.data.agent_withdraws.map((item,index) => {
              // console.log(item);
                return {
                  num : index+1,
                  date_time_withdraw : item ? moment(item.created_at).format("YYYY-MM-DD HH:mm") : '',
                  phone : item.agent ? item.agent.phone_number : '',
                  account_name : item.agent &&  item.agent.agent_bank_account
                    ? item.agent.agent_bank_account.bank_account_name : '',
                  account_number : item.agent &&  item.agent.agent_bank_account
                    ? item.agent.agent_bank_account.bank_account_number : '',
                  bank : item.agent &&  item.agent.agent_bank_account
                    ? item.agent.agent_bank_account.bank.name : '',
                  amount_withdraw : item ? item.credit : '',
                  id : item ? item.id : '',
                  agent_withdraw_type : item ? item.agent_withdraw_type : '',
                  admin : item ? item.admin : '',
                  time_transfer : item ? moment(item.time_transfer).format("YYYY-MM-DD HH:mm") : '', //เวลาของ status สำเร็จ
                  datetime_cancel : item ? moment(item.updated_at).format("YYYY-MM-DD HH:mm") : '', //เวลาของ status ถูกปฏิเสธ
                  remark : item ? item.remark : ''
                }
            })
            this.totalItem = getAgentWithdraw.data.data.total;
        } catch(err) {
            console.log(err);
        }
    },
    async getCountStatusAgentWithdraw() {
        const url = `admin_manage_statement/status/agent_withdraws`; //CountAgentWithdrawStatus
        
        try {
            const countStatusAgentWithdraw = await this.$axios.get(url);
            this.countAgentTab = countStatusAgentWithdraw.data.data;
            // console.log('countAgentTab',this.countAgentTab);
        } catch(err) {
            console.log(err);
        }
    },
    async isModalCheckWithdrawList(data) {
        this.dataBalance = null;
        this.agent_withdraws_id = data.id;
        const url = `admin_manage_statement/agent_withdraws/${this.agent_withdraws_id}` //AgentWithdrawById
        try {
        const getAgentWithdrawList = await this.$axios.get(url);
        // console.log('getAgentWithdrawList',getAgentWithdrawList);
        this.dataWithdrawList = getAgentWithdrawList.data.data;
        this.$cash('#modal-check-withdraw-list').modal('show');
      } catch(err) {
        console.log(err);
      }
    },
    //modal ยกเลิกการถอน tab1
    modalConfirmCancelWithdraw() {
      this.$cash('#modal-check-withdraw-list').modal('hide');
      this.$cash('#modal-confirm-cancel-withdraw').modal('show');
    },
    //modal submit การถอน tab1
    modalConfirmSubmitWithdraw() {
      this.$cash('#modal-check-withdraw-list').modal('hide');
      this.$cash('#modal-confirm-submit-withdraw').modal('show');
    },
    //modal โอนเงินตาม status
    submitTransferWithStatus(transfer_status) {
      // transfer_status = 1 โอนเงิน auto
      // transfer_status = 2 โอนเงิน manual
      // transfer_status = 3 ไว้ภายหลัง

      this.$cash('#modal-confirm-submit-withdraw').modal('hide');
      if(transfer_status == 1) {
        this.modalTransferAuto(this.agent_withdraws_id);
      } else if(transfer_status == 2) {
        this.modalTransferManual(this.agent_withdraws_id);
      } else if(transfer_status == 3) {
        this.transferLater(this.agent_withdraws_id);
      }
    },
    async modalTransferAuto(id) {
      const agent_withdraws_id = id;
      this.agent_withdraws_id = id;
      const url = `admin_manage_statement/agent_withdraws/${agent_withdraws_id}` //AgentWithdrawById
      
      try {
        const getDataTransferAuto = await this.$axios.get(url);
        this.dataManageTransferAuto = getDataTransferAuto.data.data;
        this.$cash('#modal-transfer-money-auto').modal('show');
      } catch(err) {
        console.log(err);
      }

    },
    //modal confirm transfer auto
    modalConfirmTransferAuto(form) {
      // console.log('formTransferAuto',form);
      this.formTransferAuto = form;
      this.$cash('#modal-transfer-money-auto').modal('hide');
      this.$cash('#modal-confirm-submit-transfer-auto').modal('show');
    },
    //โอนเงิน auto
    async submitTransferAuto() {
      this.$cash('#modal-confirm-submit-transfer-auto').modal('hide');
      const loader = this.$loading.show({});
      const url = `admin_manage_statement/auto_transfer/agent/${this.agent_withdraws_id}`; //AutoTransferMoneyToAgent 

      const _data = {
        company_bank_id : this.formTransferAuto.company_bank
      }

      // console.log('_data',_data);

      try {
        const transferAuto = await this.$axios.post(url,_data);
        if(transferAuto.status == 200) {
          loader.hide();
          this.getDataWithdrawAgentStatus(this.openTab);
          this.getCountStatusAgentWithdraw();
          this.getDataBalanceCompanyBank(this.company_bank_Id);
          this.$cash('#modal-show-money-bank-company').modal('show');
        }
      } catch(err) {
        loader.hide();
        this.getDataWithdrawAgentStatus(this.openTab);
        this.getCountStatusAgentWithdraw();
        if(err.response.status == 400) {
          this.errorAlertStatusCode(err.response.data.errors);
        } else {
          this.errorAlertStatusCode(err);
        }
        console.log(err);
      }
    },
    //modal โอนเงิน agent manual
    async modalTransferManual(id) {
      const agent_withdraws_id = id;
      this.agent_withdraws_id = id;
      const url = `admin_manage_statement/agent_withdraws/${agent_withdraws_id}` //AgentWithdrawById
      
      try {
        const getDataTransferManual = await this.$axios.get(url);
        this.dataManageTransferManual = getDataTransferManual.data.data;
        this.$cash('#modal-transfer-money-manual').modal('show');
      } catch(err) {
        console.log(err);
      }
    },
    //โอนเงิน manual
    async transferManual(form_manual) {
      this.$cash('#modal-transfer-money-manual').modal('hide');
      const loader = this.$loading.show({});
      const url = `admin_manage_statement/manual_transfer/agent/${this.agent_withdraws_id}`; //ManualTransferMoneyToAgent

      let formData = new FormData();
      formData.append('company_bank_id', form_manual.company_bank);
      formData.append('image', form_manual ? form_manual.image : '');

      try {
        const transferManual = await this.$axios.post(url,formData);
        if(transferManual.status == 200) {
          this.getDataWithdrawAgentStatus(this.openTab);
          this.getCountStatusAgentWithdraw();
          this.getDataBalanceCompanyBank(this.company_bank_Id);
          loader.hide();
          this.$cash('#modal-show-money-bank-company').modal('show');
        }
      } catch(err) {
        loader.hide();
        this.getDataWithdrawAgentStatus(this.openTab);
        this.getCountStatusAgentWithdraw();
        if(err.response.status == 400) {
          this.errorAlertStatusCode(err.response.data.errors);
        } else {
          this.errorAlertStatusCode(err);
        }
        console.log(err);
      }
    },
    // ยกเลิกการถอน agent tab1
    async cancelAgentWithdraw(note) {
      const url = `admin_manage_statement/cancel_transfer/agent/${this.agent_withdraws_id}`; //CancelTransferMoneyToAgent
      const _data = {
        remark : note
      }
      try {
        const cancelWithdrawAgent = await this.$axios.post(url,_data);
        
        if(cancelWithdrawAgent.status == 200) {
          // console.log('cancelWithdrawAgent',cancelWithdrawAgent);
          this.getDataWithdrawAgentStatus(this.openTab);
          this.getCountStatusAgentWithdraw();
          this.$cash('#modal-confirm-cancel-withdraw').modal('hide');
          this.successAlertWord(cancelWithdrawAgent.data.message);
        }
      } catch(err) {
        if(err.response.status == 400) {
          this.errorAlertStatusCode(err.response.data.errors);
        } else {
          this.errorAlertStatusCode(err);
        }
        console.log(err);
      }
    },
    //ดูสลิป tab4
    async modalDetailSlipUserSuccess(id) {
      const agent_withdraws_id = id;
      const url = `admin_manage_statement/slip_transfer/agent/${agent_withdraws_id}` //SlipTransferMoneyToAgent

      try {
        const getSlip = await this.$axios.get(url);
        this.slipImageWithdraw = getSlip.data.data ? getSlip.data.data.image_url : ''
        // console.log('slipImageWithdraw',this.slipImageWithdraw);
        this.$cash('#modal-show-slip-withdraw').modal('show');
        
      } catch(err) {
        console.log(err);
      }
    },
    //ไว้ภายหลัง tab1
    async transferLater(id) {
      const agent_withdraws_id = id;
      const url = `admin_manage_statement/confirm_transfer/agent/${agent_withdraws_id}` //ConfirmTransferMoneyToAgent
      const loader = this.$loading.show({});
      try {
        const transferMoneyLater = await this.$axios.post(url);
        if(transferMoneyLater.status == 200) {
          this.getDataWithdrawAgentStatus(this.openTab);
          this.getCountStatusAgentWithdraw();
          loader.hide();
          this.successAlertWord(transferMoneyLater.data.message);
        }
        // console.log('transferMoneyLater',transferMoneyLater);
      } catch(err) {
        loader.hide();
        this.getDataWithdrawAgentStatus(this.openTab);
        this.getCountStatusAgentWithdraw();
        if(err.response.status == 400) {
          this.errorAlertStatusCode(err.response.data.errors);
        } else {
          this.errorAlertStatusCode(err);
        }
        console.log(err);
      }
    },
    modalConfirmCancelWithdrawTab2(id) {
      this.agent_withdraws_id = id;
      this.$cash('#modal-check-withdraw-list').modal('hide');
      this.$cash('#modal-confirm-cancel-withdraw').modal('show');
    },
    //modal upload รูป manual
    modalUploadImageBillManualTransfer(agent_withdraws_id) {
      this.agent_withdraws_id = agent_withdraws_id;
      this.$cash('#modal-upload-image-transfer-manual').modal('show');
    },
    // อัพโหลดสลิปโอนเงิน
    async uploadImageTransferManual(slip_manual) {
      this.$cash('#modal-upload-image-transfer-manual').modal('hide');
      const loader = this.$loading.show({});
      const url = `admin_manage_statement/manual_transfer/agent/${this.agent_withdraws_id}` //AddSlipManualTransferMoneyToAgent

      let formData = new FormData();
      formData.append('image', slip_manual ? slip_manual : '');

      try {
        const uploadImage = await this.$axios.post(url,formData);
        if(uploadImage.status == 200) {
          loader.hide();
          this.getDataWithdrawAgentStatus(this.openTab);
          this.successAlertWord(uploadImage.data.message);
        }
      } catch(err) {
        console.log(err);
        loader.hide();
        this.getDataWithdrawAgentStatus(this.openTab);
        if(err.response.status == 400) {
          this.errorAlertStatusCode(err.response.data.errors);
        } else {
          this.errorAlertStatusCode(err);
        }
      }
    },
    async getDataBalanceCompanyBank(company_bank) {
      this.loadingShow = true;
      this.company_bank_Id = company_bank;
      const url = `admin_manage_statement/balance/company_bank/${this.company_bank_Id}`

      try {
        const getBalance = await this.$axios.post(url);
        this.dataBalance = getBalance.data.data;
        this.loadingShow = false;
      } catch(err) {
        console.log(err);
        this.loadingShow = false;
        this.dataBalance = null;
      }
    },
  }
}
</script>

