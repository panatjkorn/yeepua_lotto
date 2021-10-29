<template>
  <div>
    <div class="col-span-12 mt-8">
      <div class="intro-y flex items-center h-10">
        <div>
          <span class="lg:text-lg"><b>รายการถอนเงินลูกค้า</b></span>
        </div>
      </div>
    </div>
    <div class="col-span-12 lg:col-span-4">
      <div class="intro-y pr-1">
        <div class="box p-2 ">
          <div class="pos__tabs nav-tabs justify-center flex overscroll-x-scroll">
              <!-- เมนู แต่ละ status -->
              <a
                v-for="(tab,index) in dataStatusTab" :key="index"
                  data-toggle="tab"
                  data-target="#showRoomWithStatus"
                  href="javascript:;"
                  class="flex-1 py-2 rounded-md text-center active"
                  style="border:none;"
                  :class="{
                      'bg-white-900': openTab !== index+1,
                      'bg-blue-400 text-white mb-px': openTab === index+1,
                      }"
                  @click="getDataWithdrawList(index+1)"
                >{{ tab.status_detail }} [{{ tab.count }}]
              </a>
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
                  @click="getDataWithdrawList(index+1)"
                >{{ tab }} []
              </a> -->
          </div>
        </div>
      </div>
    </div>
    <div class="col-span-12 lg:col-span-4 box mt-5 p-5 overflow-x-auto">
      <div class="flex">
        <b>รายการรอตรวจสอบ</b>
        <div class="ml-auto">
          <input v-model="search" type="text" class="form-control" placeholder="ค้นหาเบอร์โทรผู้ซื้อ"
            @keyup.enter="getDataWithdrawList(openTab)">
        </div>
      </div>
      <table class="table mt-5">
        <thead>
          <tr>
            <th v-for="(col,index) in columnShow" :key="index" class="border-b-2 dark:border-dark-5 whitespace-nowrap">
              <b>{{ col.label }}</b>
            </th>
            <!-- <th v-for="(col,index) in tbWithdrawMoneyList.columns[openTab-1]" :key="index" class="border-b-2 dark:border-dark-5 whitespace-nowrap">
                <b>{{ col.label }}</b>
            </th> -->
          </tr>
        </thead>
        <tbody v-if="tbWithdrawMoneyList.rows.length > 0">
          <tr v-for="(data,index) in tbWithdrawMoneyList.rows" :key="index" :class="{'bg-gray-200 dark:bg-dark-1' : index%2 == 0}">
            <td>{{ data.num }}</td>
            <td>{{ data.date_time_withdraw }}</td>
            <td>{{ data.phone }}</td>
            <td>
              <p>{{ data.account_name ? data.account_name.bank_account_name : '' }}</p>
              <!-- <p v-for="(account,index) in data.account_name" :key="index">{{ account }}</p> -->
            </td>
            <td>
              <p>{{ data.account_number ? data.account_number.bank_account_number : '' }}</p>
              <!-- <p v-for="(account_num,index) in data.account_number" :key="index">{{ account_num }}</p> -->
            </td>
            <td>
              <p>{{ data.bank && data.bank.bank ? data.bank.bank.name : '' }}</p>
              <!-- <p v-for="(account_bank,index) in data.bank" :key="index">{{ account_bank.user_bank ? account_bank.user_bank.name :'' }}</p> -->
            </td>
            <td>{{ data.amount_withdraw }}</td>
            <td v-if="openTab == 4">{{ data.admin ? data.admin.name_profile : '' }} {{data ? data.time_transfer : ''}}</td>
            <td v-if="openTab == 5">{{ data.admin ? data.admin.name_profile : '' }} {{data ? data.datetime_cancel : ''}}</td>
            <td v-if="openTab == 3 || openTab == 5">{{data.remark}}</td>
            <td v-if="openTab != 5">
              <button v-if="openTab == 1" class="btn bg-blue-500 text-white w-auto mr-1 mb-2" @click="isModalCheckWithdrawList(data)">ตรวจสอบ</button>
              <button v-if="openTab == 2 || openTab == 3" class="btn bg-black text-white w-auto mr-1 mb-2" @click="modalTransferAuto(data.id)">โอน Auto</button>
              <button v-if="openTab == 2" class="btn bg-gray-400 text-black w-auto mr-1 mb-2" @click="modalTransferManual(data.id)">โอน Manual</button>
              <button v-if="openTab == 2" class="btn border-black text-black w-auto mr-1 mb-2" @click="modalConfirmCancelWithdrawTab2(data.id)">ยกเลิกรายการ</button>
              <button v-if="openTab == 4 && data.user_withdraw_type.id == 2" class="btn bg-black text-white w-auto mr-1 mb-2" 
              @click="modalUploadImageBillManualTransfer(data.id)">อัพโหลดรูปบิล</button>
              <button v-if="openTab == 4 && data.user_withdraw_type.id == 2" class="btn bg-black text-white w-auto mr-1 mb-2" 
              @click="modalDetailSlipUserSuccess(data.id)">ดู Slip</button>
            </td>
          </tr>
        </tbody>
      </table>
      <client-only>
        <ModalCheckWithdrawList v-if="openTab == 1"
          :data-withdraw-list="dataWithdrawList"
          :type-withdraw="1"
          @modalConfirmCancelWithdraw="modalConfirmCancelWithdraw"
          @modalConfirmSubmitWithdraw="modalConfirmSubmitWithdraw" 
          />

        <ModalConfirmCancelWithdraw @cancelWithdraw="cancelWithdraw" />
        <ModalConfirmSubmitWithdraw @submitTransfer="submitTransferWithStatus" />

        <ModalTransferMoneyAuto 
          :data-transfer-auto="dataManageTransferAuto"
          :data-company-bank="companyBank"
          :type-withdraw="1"
          :data-balance="dataBalance"
          :loading-show="loadingShow"
          @getDataBalanceCompanyBank="getDataBalanceCompanyBank"
          @modalConfirmTransferAuto="modalConfirmTransferAuto"
           />
        <ModalTransferMoneyManual 
          :data-transfer-manual="dataManageTransferManual"
          :type-withdraw="1"
          :data-company-bank="companyBank"
          :data-balance="dataBalance"
          :loading-show="loadingShow"
          @getDataBalanceCompanyBank="getDataBalanceCompanyBank"
          @modalConfirmTransferManual="transferManual"
        />
        
        <!-- modal confirm submit transfer auto -->
        <ModalConfirmSubmitTransferAuto 
          :data-transfer-auto="formTransferAuto"
          @submitTransferAuto="submitTransferAuto" />

        <ModalShowMoneyBankCompany 
          :data-balance="dataBalance"
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
import ModalCheckWithdrawList from '@/components/Modal/finance/withdraw/ModalCheckWithdrawList';


import ModalConfirmCancelWithdraw from '@/components/Modal/finance/withdraw/ModalConfirmCancelWithdraw'; //modal confirm cancel withdraw
import ModalConfirmSubmitWithdraw from '@/components/Modal/finance/withdraw/ModalConfirmSubmitWithdraw'; //modal confirm submit withdraw
import ModalTransferMoneyAuto from '@/components/Modal/finance/withdraw/ModalTransferMoneyAuto'; //modal โอนเงิน auto
import ModalTransferMoneyManual from '@/components/Modal/finance/withdraw/ModalTransferMoneyManual'; //modal โอนเงิน manual
import ModalSlipTransferSuccess from '@/components/Modal/finance/withdraw/ModalSlipTransferSuccess'; //modal ดู slip
import ModalUploadImageTransferManual from '@/components/Modal/finance/withdraw/ModalUploadImageTransferManual'; //upload slip manual

import ModalConfirmSubmitTransferAuto from '@/components/Modal/finance/withdraw/ModalConfirmSubmitTransferAuto'; //modal confirm transfer auto
import ModalShowMoneyBankCompany from '@/components/Modal/finance/withdraw/ModalShowMoneyBankCompany'; //modal โชว์เงินเหลือหลังจากโอน

import moment from "moment";
import alertMixins from "~/mixins/alertMixin";

const PENDING_CHECKING = 1;
const PENDING_TRANSFER_MONEY = 2;
const FAILD_STATUS = 3;
const SUCCESS_STATUS = 4;
const REJECT_STATUS = 5;

export default {
  layout: 'dashboard',
  middleware : ['permission'],
  mixins: [alertMixins],
  components : { 
    ModalCheckWithdrawList,
    ModalTransferMoneyAuto,
    ModalTransferMoneyManual,
    ModalConfirmCancelWithdraw,
    ModalConfirmSubmitWithdraw,
    ModalConfirmSubmitTransferAuto,
    ModalShowMoneyBankCompany,
    ModalSlipTransferSuccess,
    ModalUploadImageTransferManual
  },
  data() {
    return {
      tabStatus : ['รอตรวจสอบ','รอโอนเงิน','สำเร็จ','ถูกปฏิเสธ'],
      openTab : '',
      tbWithdrawMoneyList: {
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
        rows: [],
      },
      dataStatusTab : '',
      modalConfirmType : null,
      user_withdraw_Id : '',
      dataWithdrawList : '',
      dataManageTransferAuto : '',
      companyBank : '',
      dataManageTransferManual : '',
      formTransferAuto : '',
      currentPage: 1,
      totalItem: 0,
      itemPerPage: 20,
      currentPageApi: 0,
      search : '',
      slipImageWithdraw : '',
      company_bank_Id : '',
      dataBalance : '',
      loadingShow : false
    }
  },
  computed : {
    columnShow() {
      // this.tbWithdrawMoneyList.columns.filter((col) => console.log(col));
      return this.tbWithdrawMoneyList.columns.filter(
        (col) =>
          !col.showTabStatus || col.showTabStatus.includes(this.openTab)
      );
    },
  },
  created() {
    this.getDataWithdrawList(1);
    this.getCountUserWithdrawStatus();
    this.getDataCompanyBank();
  },
  watch : {
    openTab : 'clearDataPagination'
  },
  methods : {
    async handleTogglePage() {
      this.currentPageApi = this.currentPage - 1;
      this.getDataWithdrawList(this.openTab);
    },
    clearDataPagination() {
      this.currentPage = 1;
      this.totalItem = 0;
      this.itemPerPage = 20;
      this.currentPageApi = 0;
      this.search = '';
      // this.getDataWithdrawList(this.openTab);
    },
    async getCountUserWithdrawStatus() {
      const url = `admin_manage_statement/status/user_withdraws` //CountUserWithdrawStatus
      try {
        const getWithdrawList = await this.$axios.get(url);
        this.dataStatusTab = getWithdrawList.data.data;
        // console.log('dataStatusTab',this.dataStatusTab);
      } catch(err) {
        console.log(err);
      }
    },
    //get data withdraw list with tab
    async getDataWithdrawList(status) {
      this.tbWithdrawMoneyList.rows = [];
      this.openTab = status;
      const url = `admin_manage_statement/user_withdraws` //UserWithdraws
      const params = {
        status_id : this.openTab,
        page: this.currentPageApi,
        limit: this.itemPerPage,
        search : this.search
      }
      
      try {
        const dataWithdraw = await this.$axios.get(url,{params:params});
        this.tbWithdrawMoneyList.rows = dataWithdraw.data.data.user_withdraws.map((item,index) => {
          // console.log(item);
          return {
            num : index+1,
            date_time_withdraw : item ? moment(item.created_at).format("YYYY-MM-DD HH:mm") : '',
            phone : item.user ? item.user.phone_number : '',
            account_name : item.user ? item.user_bank_account : '',
            account_number : item.user ? item.user_bank_account : '',
            bank : item.user ? item.user_bank_account : '',
            amount_withdraw : item ? item.credit : '',
            id : item ? item.id : '',
            user_withdraw_type : item ? item.user_withdraw_type : '',
            admin : item ? item.admin : '',
            time_transfer : item ? moment(item.time_transfer).format("YYYY-MM-DD HH:mm") : '', //เวลาของ status สำเร็จ
            datetime_cancel : item ? moment(item.updated_at).format("YYYY-MM-DD HH:mm") : '', //เวลาของ status ถูกปฏิเสธ
            remark : item ? item.remark : ''
          }
        })
        this.totalItem = dataWithdraw.data.data.total;
      } catch(err) {
        console.log(err);
      }
    },
    //modal check withdraw list
    async isModalCheckWithdrawList(data) {
      this.dataBalance = null;
      this.user_withdraw_Id = data.id;
      const url = `admin_manage_statement/user_withdraws/${this.user_withdraw_Id}` //UserWithdrawById

      try {
        const getDetaiWithdrawList = await this.$axios.get(url);
        this.dataWithdrawList = getDetaiWithdrawList.data.data;
        this.$cash('#modal-check-withdraw-list').modal('show');
        // console.log('dataWithdrawList',this.dataWithdrawList);
      } catch(err) {
        console.log(err);
      }

    },
    //modal โอนเงิน auto
    async modalTransferAuto(id) {
      const user_withdraw_id = id;
      this.user_withdraw_Id = id;
      // console.log('user_withdraw_id',user_withdraw_id);
      const url = `admin_manage_statement/user_withdraws/${user_withdraw_id}`
      
      try {
        const getDataTransferAuto = await this.$axios.get(url);
        this.dataManageTransferAuto = getDataTransferAuto.data.data;
        this.$cash('#modal-transfer-money-auto').modal('show');
      } catch(err) {
        console.log(err);
      }

    },
    //modal ยกเลิกการถอน tab1
    modalConfirmCancelWithdraw() {
      this.$cash('#modal-check-withdraw-list').modal('hide');
      this.$cash('#modal-confirm-cancel-withdraw').modal('show');
    },
    modalConfirmCancelWithdrawTab2(id) {
      this.user_withdraw_Id = id;
      this.$cash('#modal-check-withdraw-list').modal('hide');
      this.$cash('#modal-confirm-cancel-withdraw').modal('show');
    },
    //modal submit การถอน tab1
    modalConfirmSubmitWithdraw() {
      this.$cash('#modal-check-withdraw-list').modal('hide');
      this.$cash('#modal-confirm-submit-withdraw').modal('show');
    },
    // ยกเลิกการถอน tab1
    async cancelWithdraw(node) {
      const url = `admin_manage_statement/cancel_transfer/user/${this.user_withdraw_Id}`; //CancelTransferMoneyToUser
      const _data = {
        remark : node
      }

      try {
        const cancelWithdraw = await this.$axios.post(url,_data);
        
        if(cancelWithdraw.status == 200) {
          // console.log('cancelWithdraw',cancelWithdraw);
          this.getDataWithdrawList(this.openTab);
          this.getCountUserWithdrawStatus();
          this.$cash('#modal-confirm-cancel-withdraw').modal('hide');
          this.successAlertWord(cancelWithdraw.data.message);
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
    //modal โอนเงินตาม status
    submitTransferWithStatus(transfer_status) {
      // transfer_status = 1 โอนเงิน auto
      // transfer_status = 2 โอนเงิน manual
      // transfer_status = 3 ไว้ภายหลัง

      this.$cash('#modal-confirm-submit-withdraw').modal('hide');
      if(transfer_status == 1) {
        this.modalTransferAuto(this.user_withdraw_Id);
      } else if(transfer_status == 2) {
        this.modalTransferManual(this.user_withdraw_Id);
      } else if(transfer_status == 3) {
        this.transferLater(this.user_withdraw_Id);
      }
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
      const url = `admin_manage_statement/auto_transfer/user/${this.user_withdraw_Id}`; //AutoTransferMoneyToUser 

      const _data = {
        company_bank_id : this.formTransferAuto.company_bank
      }

      try {
        const transferAuto = await this.$axios.post(url,_data);
        // console.log('transferAuto',transferAuto);
        if(transferAuto.status == 200) {
          loader.hide();
          this.getDataBalanceCompanyBank(this.company_bank_Id);
          this.getDataWithdrawList(this.openTab);
          this.getCountUserWithdrawStatus();
          this.$cash('#modal-show-money-bank-company').modal('show');
        }
      } catch(err) {
        loader.hide();
        this.getDataWithdrawList(this.openTab);
        this.getCountUserWithdrawStatus();
        if(err.response.status == 400) {
          this.errorAlertStatusCode(err.response.data.errors);
        } else {
          this.errorAlertStatusCode(err);
        }
        console.log(err);
      }
      
    },
    //modal โอนเงิน manual
    async modalTransferManual(id) {
      const user_withdraw_id = id;
      this.user_withdraw_Id = id;
      const url = `admin_manage_statement/user_withdraws/${user_withdraw_id}`
      
      try {
        const getDataTransferManual = await this.$axios.get(url);
        // console.log('getDataTransferManual',getDataTransferManual);
        this.dataManageTransferManual = getDataTransferManual.data.data;
        this.$cash('#modal-transfer-money-manual').modal('show');
      } catch(err) {
        console.log(err);
      }
    },
    //โอนเงิน manual
    async transferManual(form_manual) {
      // console.log('form_manual',form_manual);
      this.$cash('#modal-transfer-money-manual').modal('hide');
      const loader = this.$loading.show({});
      const url = `admin_manage_statement/manual_transfer/user/${this.user_withdraw_Id}`;
      
      let formData = new FormData();
      
      formData.append('company_bank_id', form_manual.company_bank);
      formData.append('image', form_manual ? form_manual.image : '');

      try {
        const transferManual = await this.$axios.post(url,formData);
        if(transferManual.status == 200) {
          this.getCountUserWithdrawStatus();
          this.getDataWithdrawList(this.openTab);
          this.getDataBalanceCompanyBank(this.company_bank_Id);
          loader.hide();
          this.$cash('#modal-show-money-bank-company').modal('show');
        }
      } catch(err) {
        loader.hide();
        this.getCountUserWithdrawStatus();
        this.getDataWithdrawList(this.openTab);
        if(err.response.status == 400) {
          this.errorAlertStatusCode(err.response.data.errors);
        } else {
          this.errorAlertStatusCode(err);
        }
        console.log(err);
      }
      this.$cash('#modal-transfer-money-manual').modal('hide');
      this.$cash('#modal-show-money-bank-company').modal('show');
    },
    //ไว้ภายหลัง tab1
    async transferLater(id) {
      const user_withdraw_id = id;
      const url = `admin_manage_statement/confirm_transfer/user/${user_withdraw_id}` //ConfirmTransferMoneyToUser
      const loader = this.$loading.show({});
      try {
        const transferMoneyLater = await this.$axios.post(url);
        if(transferMoneyLater.status == 200) {
          this.getDataWithdrawList(this.openTab);
          this.getCountUserWithdrawStatus();
          loader.hide();
          this.successAlertWord(transferMoneyLater.data.message);
        }
        // console.log('transferMoneyLater',transferMoneyLater);
      } catch(err) {
        loader.hide();
        this.getDataWithdrawList(this.openTab);
        this.getCountUserWithdrawStatus();
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
      const user_withdraw_id = id;
      const url = `admin_manage_statement/slip_transfer/user/${user_withdraw_id}` //SlipTransferMoneyToUser

      try {
        const getSlip = await this.$axios.get(url);
        // console.log('getSlip',getSlip);
        this.slipImageWithdraw = getSlip.data.data ? getSlip.data.data.image_url : ''
        // console.log('slipImageWithdraw',this.slipImageWithdraw);
        this.$cash('#modal-show-slip-withdraw').modal('show');
        
      } catch(err) {
        console.log(err);
      }
    },
    //modal upload รูป manual
    modalUploadImageBillManualTransfer(user_withdraw_id) {
      this.user_withdraw_Id = user_withdraw_id;
      this.$cash('#modal-upload-image-transfer-manual').modal('show');
    },
    // อัพโหลดสลิปโอนเงิน
    async uploadImageTransferManual(slip_manual) {
      this.$cash('#modal-upload-image-transfer-manual').modal('hide');
      const loader = this.$loading.show({});
      const url = `admin_manage_statement/add_slip/manual_transfer/user/${this.user_withdraw_Id}` //AddSlipManualTransferMoneyToUser

      let formData = new FormData();
      formData.append('image', slip_manual ? slip_manual : '');

      try {
        const uploadImage = await this.$axios.post(url,formData);
        if(uploadImage.status == 200) {
          loader.hide();
          this.getDataWithdrawList(this.openTab);
          this.successAlertWord(uploadImage.data.message);
        }
      } catch(err) {
        console.log(err);
        loader.hide();
        if(err.response.status == 400) {
          this.errorAlertStatusCode(err.response.data.errors);
        } else {
          this.errorAlertStatusCode(err);
        }
      }
    },
    async getDataBalanceCompanyBank(company_bank) {
      // const loader = this.$loading.show({});
      this.loadingShow = true;
      this.company_bank_Id = company_bank;
      const url = `admin_manage_statement/balance/company_bank/${this.company_bank_Id}`

      try {
        const getBalance = await this.$axios.post(url);
        // console.log('getBalance',getBalance);
        this.dataBalance = getBalance.data.data;
        // loader.hide();
        this.loadingShow = false;
      } catch(err) {
        console.log(err);
        // loader.hide();
        this.loadingShow = false;
        this.dataBalance = null;
      }
    }
  }
}
</script>

