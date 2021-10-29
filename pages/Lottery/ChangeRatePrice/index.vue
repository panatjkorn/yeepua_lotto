<template>
  <div>
    <div class="col-span-12 lg:col-span-4 pt-5 pb-5">
      <div class="grid grid-flow-col grid-cols-2">
        <div class="grid-rows-2">
          <div><b>จัดการงวดแทงหวย > งวดประจำวันที่ {{ dataLottoRoundByID.round_name }} > ปรับราคาจ่าย {{ lotto_type }}</b></div>
          <div>[เวลาเปิด - ปิด แทงหวย : {{ dataLottoRoundByID ? convertDataTime(dataLottoRoundByID.open_time) : '' }} -
            {{ dataLottoRoundByID ? convertDataTime(dataLottoRoundByID.close_time) : '' }}]</div>
        </div>
        <div class="flex ml-auto">
          <button class="btn bg-blue-500 text-white mr-2" @click="managePriceRateStepMultiple()">ปรับราคาจ่ายแบบหลายตัวเลข</button>
          <button class="btn border-gray-700 text-gray-700 w-24" @click="$router.push(`/Lottery/ManageLottery/${lottery_type_ID}/${lottery_round_ID}?tab=${tabToBack}`)">กลับ</button>
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
                  class="flex-1 py-2 rounded-md text-center max-w-xs active"
                  style="border:none;"
                  :class="{
                      'bg-white-900': openTab !== index,
                      'bg-blue-400 text-white mb-px': openTab === index,
                      }"
                  @click="getLottetyList(index)"
                >{{ tab }}
              </a>
          </div>
        </div>
      </div>
    </div>
    <div class="col-span-12 lg:col-span-4 text-left mt-5 box py-4 px-4">
      <div class="grid lg:grid-cols-2">
        <div class="flex flex-grow"><b>ปรับราคาจ่าย {{ lotto_type }}</b></div>
        <!-- <p><b>ปรับราคาจ่าย {{ lotto_type }}</b></p> -->
        <div class="ml-auto flex flex-wrap md:flex-nowrap mt-3 md:mt-0">
          <select v-model="filterTypeLotto" name="" id="" class="sm:ml-auto mt-3 sm:mt-0 sm:w-auto form-select border-gray-400 box mr-1" @change="getLottetyList(openTab)">
            <option value="">รูปแบบจ่ายทั้งหมด</option>
            <option value="0">รูปแบบจ่ายแบบขั้นบรรได</option>
            <option value="1">รูปแบบจ่ายเต็ม</option>
          </select>
          <input v-model="search" type="text" class="form-control dark:bg-dark-1 border-gray-400 placeholder-theme-8 mr-1" placeholder="ค้นหาตัวเลข..."
            @keyup.enter="getLottetyList(openTab)">
          <button class="btn bg-yellow-500 text-white w-auto" @click="getLottetyList(openTab)">ค้นหา</button>
        </div>
      </div>
      <div class="grid md:grid-cols-3 lg:grid-cols-5 gap-4 mt-5 overflow-x-auto">
        <div v-for="(lotto,index) in dataLottery" :key="index" class="border border-gray-500 h-auto py-4 px-4"
        :class="{
          'bg-red-200': lotto.status == false,
          'bg-transparent' : lotto.is_fixed == false && lotto.status == true,
          'bg-yellow-100' : lotto.is_fixed == true && lotto.status == true}"
          >
          <!-- <pre>{{ lotto }}</pre> -->
          <div class="grid md:grid-cols-2 gap-4 text-center items-center">
            <div><b>{{ lotto.number }}</b></div>
            <div><button class="btn bg-blue-500 text-white" @click="modalManageRateToPay(lotto)">ปรับราคาจ่าย</button></div>
          </div>
          <div class="grid grid-cols-1 gap-4 text-center mt-2">
            <span v-if="lotto.is_fixed == false">จ่ายแบบ : ลำดับขั้น [{{ lotto.count_step }} ขั้น]</span>
            <span v-else>จ่ายเต็ม [{{ lotto.pay_ratio }}]</span>
          </div>
        </div>
      </div>
      <client-only>
        <!-- จัดการเรทราคาแบบขั้นบรรได -->
        <ModalChangeRateNumberToPay
          :data-number="dataNumberByID"
          :dropdown-template="ddTemplate"
          @cancelStepNumber="modalConfirmCancelStepNumber"
          @changeStatusOfSaleNumber="changeStatusOfSaleNumber"
          @modalConfirmEditRateNumber="modalConfirmEditRateNumber" />
        <!-- จัดการเรทราคาแบบขั้นบรรไดหลายๆตัว -->
        <ModalChangeRateNumberToPayMultiple 
          :data-multi-round-pay-ratio="dataMultiRoundPayRatio"
          :dropdown-template="ddTemplate"
          :data-number-lotto-all="lottoNumberListAll" 
          @modalConfirmEditRateMultiNumber="modalConfirmEditRateMultiNumber" />

        <ModalConfirm
          :HeaderMassage="modalConfirmHeader"
          @submitConfirmModal="submitConfirmModal()"
          @cancelModal="cancelModal"/>

      </client-only>
    </div>
  </div>
</template>
<script>
import ModalChangeRateNumberToPay from '@/components/Modal/Lottery/ModalChangeRateNumberToPay';
import ModalChangeRateNumberToPayMultiple from '@/components/Modal/Lottery/ModalChangeRateNumberToPayMultiple';

import ModalConfirm from '@/components/Modal/ModalConfirm';
import moment from 'moment'
import alertMixins from '~/mixins/alertMixin'
export default {
  layout: 'dashboard',
  components : { ModalChangeRateNumberToPay,ModalChangeRateNumberToPayMultiple,ModalConfirm },
  mixins : [alertMixins],
  data() {
    return {
      openTab : '',
      dataLottery : [],
      lottery_type_ID : '',
      lottery_round_ID : '',
      round_pay_ratio_ID : '',
      dataNumberByID : '',
      dataLottoRoundByID : '',
      lotto_type : '',
      modalConfirmHeader : '',
      dataEditRateToPayLottoNumber : '',
      round_number_ID : '', // id ของเลขหวยในรอบ
      search : '',
      filterTypeLotto : '',
      dataMultiRoundPayRatio : '',
      typeModalConfirmSubmit : '',
      formEditRatePayNumberMulti : '',
      checkTypeOfLottery : null,
      tabToBack : '',
      bet_type_id : '',
      lottoNumberListAll : '',
      ddTemplate : ''
    }
  },
  created() {
    this.tabToBack = this.$route.query.tab;
    this.lottery_type_ID = this.$route.query.lottety_type_id;
    this.lottery_round_ID = this.$route.query.lottery_round_id;
    this.round_pay_ratio_ID = this.$route.query.round_pay_ratio_id;
    this.lotto_type = this.$route.query.lotto_type;
    this.bet_type_id = this.$route.query.bet_type_id;
    this.checkTypeOfLottery = this.$route.query.lotto_type.substring(0,1);
    this.getLottetyList(0);
    this.getLottoRoundByID();
    this.getLottoListAll();
    this.getDropdownTemplate();
    // console.log('lotto_typexxxxxxxx',this.lotto_type.substring(0,1));
  },
  computed: {
    tabStatus() {
      if(this.checkTypeOfLottery == 3) {
        return ['000','100','200','300','400','500','600','700','800','900']
      } else {
        return ['00']
      }
    }
  },
  methods : {
    submitConfirmModal() {
      if(this.typeModalConfirmSubmit == 'editRateNumber') {
        this.editRateToPayLottoNumber();
      } else if(this.typeModalConfirmSubmit == 'editRatePayMulti') {
        this.editRateToPayLottoNumberMulti();
      } else if(this.typeModalConfirmSubmit == 'cancelRoundNumber') {
        this.cancelRoundNumber();
      }
    },
    convertDataTime(dataTime) {
      return moment(dataTime).format("YYYY-MM-DD HH:mm");
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
    // get list เลข
    async getLottetyList(tab) {
      // this.dataLottery = [];
      this.openTab = tab;

      // GetLottoRoundNumbers
      const url = `admin_manage_lotto/${this.round_pay_ratio_ID}/round_number`;
      const params = {
        page : parseInt(this.openTab),
        limit : 100,
        search : this.search.length > 0 ? this.search : '',
        is_fixed : this.filterTypeLotto.length > 0 ? parseInt(this.filterTypeLotto) : ''
      }
      try {
        const getLottoNumber = await this.$axios.get(url,{params:params});
        // console.log('getLottoNumber',getLottoNumber);
        await getLottoNumber.data.data.round_numbers.sort(function(a, b){return a.number-b.number});
        this.dataLottery = getLottoNumber.data.data.round_numbers.map((item) => {
          return {
            id: item ? item.id : '',
            is_fixed: item ? item.is_fixed : '',
            number: item ? item.number : '',
            status: item ? item.status : '',
            count_step : item ? item.amount_step : '',
            pay_ratio : item ? item.pay_ratio : ''
          }
        })
      } catch(err) {
        console.log(err);
      }
    },
    
    //get lotto list all for manage multi
    async getLottoListAll() {
      const url = `admin_manage_lotto/${this.round_pay_ratio_ID}/round_number`;
      const params = {
        page : 0,
        limit : 1000,
      }

      try {
        const getLottoNumberAll = await this.$axios.get(url,{params:params});
        // console.log('getLottoNumberAll',getLottoNumberAll);
        this.lottoNumberListAll = getLottoNumberAll;
      } catch(err) {
        console.log(err);
      }
    },

    async modalManageRateToPay(data) {
      this.round_number_ID = data.id;
      const url = `admin_manage_lotto/round_number/${data.id}/`;

      try {
        const getDataNumberByID = await this.$axios.get(url);
        // console.log('getDataNumberByID',getDataNumberByID);
        if(getDataNumberByID.status == 200){
          this.dataNumberByID = getDataNumberByID.data.data;
          this.$cash('#modal-change-rate-to-pay').modal('show');
        }
      } catch(err) {
        console.log(err);
      }
    },
    //จัดการเรทราตาแบบหลายๆเลข
    async managePriceRateStepMultiple() {
      const  url = `admin_manage_lotto/round_number/multi/${this.round_pay_ratio_ID}`;
      try {
        const getMultiRoundPayRatio = await this.$axios.get(url);
        this.dataMultiRoundPayRatio = await getMultiRoundPayRatio.data.data;
        // console.log('getMultiRoundPayRatio',getMultiRoundPayRatio);
        this.$cash('#modal-change-rate-to-pay-multiple').modal('show');
      } catch(err) {
        console.log(err);
      }

    },
    modalConfirmEditRateNumber(data) {
      this.typeModalConfirmSubmit = 'editRateNumber'
      this.round_number_ID = data.id;
      this.modalConfirmHeader = 'ยืนยันบันทึกข้อมูล'
      this.dataEditRateToPayLottoNumber = data;
      this.$cash('#modal-change-rate-to-pay').modal('hide');
      this.$cash('#modal-confirm').modal('show');
    },
    //แก้ไขอัตราการจ่ายแต่ละเลข
    async editRateToPayLottoNumber() {
      const url = `admin_manage_lotto/round_number/${this.round_number_ID}`;

      const _data = {
        is_fixed : this.dataEditRateToPayLottoNumber.is_fixed == false ? 0 : 1,
        step_limit : this.dataEditRateToPayLottoNumber.step_limit,
        pay_ratio : this.dataEditRateToPayLottoNumber.pay_ratio,
        status : this.dataEditRateToPayLottoNumber.status == false ? 0 : 1,
        max_bet : this.dataEditRateToPayLottoNumber.max_bet,
        max_bet_per_bill_number : this.dataEditRateToPayLottoNumber.max_bet_per_bill_number
      }

      // console.log('_data',_data);

      try {
        const editRate = await this.$axios.put(url,_data);
        if(editRate.status == 200) {
          this.getLottetyList(this.openTab);
          this.$cash('#modal-confirm').modal('hide');
          this.successAlertWord(editRate.data.message);
        }
      } catch(err) {
        console.log(err);
        this.getLottetyList(this.openTab);
        if(err.response.status == 400) {
          this.errorAlertStatusCode(err.response.data.errors);
        } else {
          this.errorAlertStatusCode(err);
        }
      }
    },
    cancelModal() {
      this.$cash('#modal-confirm').modal('hide');
    },
    modalConfirmEditRateMultiNumber(data) {
      // console.log('dataaaaaaa',data);
      this.formEditRatePayNumberMulti = data;
      this.modalConfirmHeader = 'ยืนยันบันทึกข้อมูล';
      this.typeModalConfirmSubmit = 'editRatePayMulti';
      this.$cash('#modal-change-rate-to-pay-multiple').modal('hide');
      this.$cash('#modal-confirm').modal('show');
    },
    async editRateToPayLottoNumberMulti() {
      console.log('formEditRatePayNumberMulti',this.formEditRatePayNumberMulti);
      const url = `admin_manage_lotto/round_number/multi/${this.formEditRatePayNumberMulti.round_pay_ratio_id}`; //EditMultiLottoRoundNumberById

      try {
        const editRateToPayMulti = await this.$axios.put(url,this.formEditRatePayNumberMulti);
        // console.log('editRateToPayMulti',editRateToPayMulti);
        if(editRateToPayMulti.status == 200) {
          this.getLottetyList(this.openTab);
          this.$cash('#modal-confirm').modal('hide');
          this.successAlertWord(editRateToPayMulti.data.message);
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
    //change status of sale number
    async changeStatusOfSaleNumber(data) {
      // console.log('dataaaaaaaaa',data);
      const url = `admin_manage_lotto/round_number/status/${data.round_number_ID}`; //EditLottoRoundNumberStatusById
      const _data = {
        status : data.status == false ? 0 : 1
      }
      try {
        const changeStatusSaleNumber = await this.$axios.put(url,_data);
        // console.log('changeStatusSaleNumber',changeStatusSaleNumber);
        if(changeStatusSaleNumber.status == 200) {
          this.getLottetyList(this.openTab);
          this.$cash('#modal-change-rate-to-pay').modal('hide');
          this.successAlertWord(changeStatusSaleNumber.data.message);
        }
      } catch(err) {
        console.log(err);
        this.$cash('#modal-change-rate-to-pay').modal('hide');
        if(err.response.status == 400) {
          this.errorAlertStatusCode(err.response.data.errors);
        } else {
          this.errorAlertStatusCode(err);
        }
      }
    },
    modalConfirmCancelStepNumber() {
      this.typeModalConfirmSubmit = 'cancelRoundNumber'
      this.modalConfirmHeader = 'ยืนยันยกเลิกเลขหวย'
      this.$cash('#modal-change-rate-to-pay').modal('hide');
      this.$cash('#modal-confirm').modal('show');
    },
    // ยกเลิกเลขหวย
    async cancelRoundNumber() {
      const url = `admin_manage_lotto/round_number/${this.round_number_ID}`; //CancelStabNumber

      const _data = {
        bet_number : this.dataNumberByID ? this.dataNumberByID.number : '',
        bet_type_id : this.bet_type_id,
        round_id : this.lottery_round_ID
      }
      try {
        const cancelRoundNumber = await this.$axios.post(url,_data);
        // console.log('cancelRoundNumber',cancelRoundNumber);
        if(cancelRoundNumber.status == 200 ){
          this.getLottetyList(this.openTab);
          this.$cash('#modal-confirm').modal('hide');
          this.successAlertWord(cancelRoundNumber.data.message);
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
    async getDropdownTemplate() {
      const url = `data/template_use_ratios`;
      const params = {
        bet_type_id : this.bet_type_id
      }

      try {
        const getDDTemplate = await this.$axios.get(url,{params:params});
        // console.log('getDDTemplate',getDDTemplate);
        this.ddTemplate = getDDTemplate.data.data;
      } catch(err) {
        console.log(err);
      }
    }
  }
}
</script>
