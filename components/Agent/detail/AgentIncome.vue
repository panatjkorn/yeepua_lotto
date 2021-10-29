<template>
  <div>
     <div class="col-span-12 mt-8">
      <div class="intro-y flex items-center h-10">
        <div>
          <span class="lg:text-lg"><b>รายได้</b></span>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-10">
      <div class="box grid p-16 lg:px-5 mt-3 text-center">
        <span class="text-lg"><b>รายได้ทั้งหมด (บาท)</b></span>
        <span class="text-lg"
          ><b>{{ total_income }}</b></span
        >
      </div>
      <div class="box grid p-16 lg:px-5 mt-3 text-center">
        <span class="text-lg"><b>ยอดเงินคงเหลือ (บาท)</b></span>
        <span class="text-lg"
          ><b>{{ credit }}</b></span
        >
      </div>
    </div>
   <div class="col-span-12 mt-2">
      <div class="box p-5 relative overflow-y-hidden">
        <div class="intro-y flex items-center h-10">
          <div class="flex-initial">
            <select v-model="filterLottoType" name="" id=""
              class="form-select box lg:w-auto w-auto mt-5 lg:mt-0 mr-auto mr-2">
              <option value="">เลือกประเภทหวย</option>
              <option v-for="(type,index) in dd_lotto_type" :key="index" :value="type.id">{{type.name}}</option>
            </select>
          </div>
          <div class="flex-initial">
            <select 
              v-model="filterLottoRound" name="" id=""
              :disabled="filterLottoType == ''"
              class="form-select box lg:w-auto w-auto mt-5 lg:mt-0 mr-auto"
              @change="getDataAgentIncome()">
              <option value="">ทุกงวด</option>
              <option v-for="(type,index) in dd_lotto_round" :key="index" :value="type.id">{{type.round_name}}</option>
            </select>
          </div>
          <div class="ml-auto">
            <span class="lg:text-lg">ทั้งหมด {{ count_bill }} รายการ</span>
          </div>
        </div>
        <div class="py-3">
           <table class="table">
            <thead>
              <tr>
                <th
                  v-for="(col, index) in tbShowreAgentIncome.columns"
                  :key="index"
                  class="border-b-2 dark:border-dark-5 whitespace-nowrap"
                >
                  <b>{{ col.label }}</b>
                </th>
              </tr>
            </thead>
            <tbody v-if="tbShowreAgentIncome.rows.length > 0">
              <tr
                v-for="(data, index) in tbShowreAgentIncome.rows"
                :key="index"
                :class="{ 'bg-gray-200 dark:bg-dark-1': index % 2 == 0 }"
              >
                <td>{{ data.num }}</td>
                <td>{{ data.register_date }}</td>
                <td>{{ data.name }}</td>
                <td>{{ data.phone }}</td>
                <td :class="{ 'text-yellow-500': data.type === 2}">
                  {{ data.amount_number }}
                  </td>
                <td  :class="{ 'text-yellow-500': data.type === 2}">
                  {{ data.income }}
                  </td>
              </tr>
            </tbody>
          </table>
        </div>
        <client-only>
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
  </div>
</template>
<script>
import moment from "moment";
export default {
  data() {
    return {
      agentId: "",
      tbShowreAgentIncome: {
        page: 1,
        columns: [
          { label: "#" },
          { label: "วันที่สมาชิกซื้อ" },
          { label: "ชื่อ" },
          { label: "เบอร์โทร" },
          { label: "จำนวนที่ซื้อ (ใบ)" },
          { label: "รายได้ (บาท)" },
        ],
        rows: [],
      },
      currentPage: 1,
      totalItem: 0,
      itemPerPage: 20,
      currentPageApi: 0,
      count_bill: "",
      total_income: "",
      credit: "",
      search: "",
      dd_lotto_type : '',
      filterLottoType : '',
      dd_lotto_round : '',
      filterLottoRound : ''
    };
  },
  created() {
    this.agentId = this.$route.params.id;
    this.getDataAgentIncome();
    this.getDropdownLottoRoundListAll();
  },
  watch : {
    filterLottoType : 'getDataFilterLottoRound'
  },
  methods: {
    async handleTogglePage() {
      this.currentPageApi = this.currentPage - 1;
      this.getDataAgentIncome();
    },
    async getDataAgentIncome() {
      const url = `admin_manage_agent/agents/${this.agentId}/incomes`;
      const params = {
        page: this.currentPageApi,
        limit: this.itemPerPage,
        search: this.search,
        round_id : this.filterLottoRound
      };

      try {
        const response = await this.$axios.get(url, { params: params });

        this.count_bill = response.data.data ? response.data.data.total : 0;
        this.total_income = response.data.data
          ? response.data.data.agent_credit.total_income
          : 0;
        this.credit = response.data.data
          ? response.data.data.agent_credit.credit
          : 0;
        this.tbShowreAgentIncome.rows = response.data.data.agent_incomes.map(
          (item, index) => {
            return {
              num: index + 1,
              register_date: item ?  moment(item.created_at).format("YYYY-MM-DD HH:mm") : "-",
              name: item.user.user_bank_accounts.length > 0
                ? item.user.user_bank_accounts[0].bank_account_name
                : "-",
              phone: item ? item.user.phone_number : "-",
              amount_number: item ? item.agent_income_type ? item.agent_income_type.id === 1 ? item.amount_number : item.amount_won : '-' : '-',
              income: item ? item.income : "-",
              type: item ? item.agent_income_type ? item.agent_income_type.id : 0 : 0
            };
          }
        );

        this.totalItem = response.data.data.total;
      } catch (err) {
        console.log(err);
      }
    },
    async getDropdownLottoRoundListAll() {
      const url = `data/lottos`; //DataLottos

      try {
        const getLottoRoundAll = await this.$axios.get(url);
        this.dd_lotto_type = getLottoRoundAll.data.data;
        // console.log('dd_lotto_type',this.dd_lotto_type);
      } catch(err) {
        console.log(err);
      }
    },
    async getDataFilterLottoRound() {
      
      if(this.filterLottoType != '') {
        this.filterLottoRound = '';
        const url = `data/lotto_rounds/${this.filterLottoType}`; //DataLottoRounds

        try {
          const getLottoRound = await this.$axios.get(url);
          // console.log('getLottoRound',getLottoRound);
          this.dd_lotto_round = getLottoRound.data.data;
        } catch(err) {
          console.log(err);
        }
      } else {
        // console.log('ไม่ได้เลือก'); 
        this.dd_lotto_round = '';
        this.filterLottoRound = '';
      }

      this.getDataAgentIncome();
      
    }
  },
};
</script>
