<template>
  <div>
    <h1 class="title mt-3">Dashboard</h1>
    <!-- รายงานสมาชิก -->
    <div class="box intro-x mt-4 p-4">
      <p class="font-extrabold">รายงานสมาชิก หงส์ฟ้าพารวย</p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
        <div class="box bg-blue-400 bg-opacity-20 p-4">
          <div class="flex justify-between">
            <div>
              <p class="font-semibold">สมาชิกทั้งหมด</p>
            </div>
            <div class="text-right">
              <UsersIcon class="w-5 h-5" />
            </div>
          </div>
          <p
            class="text-2xl mt-2 text-blue-800"
          >
            {{ countAllUsers ? countAllUsers : 0 }}
          </p>
        </div>
        <div class="box bg-blue-400 bg-opacity-20 p-4">
          <div class="flex justify-between">
            <div>
              <p class="font-semibold">
                สมาชิก Login / ทำธุรกรรม
                <!-- <span class="text-theme-22">ธุรกรรม</span> -->
              </p>
            </div>
            <div class="text-right">
              <UserIcon class="w-5 h-5" />
            </div>
          </div>
          <p
            class="text-2xl mt-2 text-blue-800"
          >
            <span
              class="text-theme-22">
              {{ userActiveToday ? userActiveToday.login_today : 0 }} /
              {{ userActiveToday ? userActiveToday.active : 0 }}
            </span
            >
          </p>
        </div>
        <div class="box bg-blue-400 bg-opacity-20 p-4">
          <div class="flex justify-between">
            <div>
              <p class="font-semibold">สมาชิกใหม่</p>
            </div>
            <div class="text-right">
              <UserPlusIcon class="w-5 h-5" />
            </div>
          </div>
          <p
            class="text-2xl mt-2 text-blue-800"
          >
            {{ newUserToday ? newUserToday : 0 }}
          </p>
        </div>
      </div>
    </div>
    <!-- รายงานการเงิน -->
    <div class="box intro-x mt-4 p-4">
      <p class="font-extrabold">รายงานการเงิน</p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
        <div class="flex flex-col gap-y-2">
          <NuxtLink to="/finance/Statement" target="_blank">
            <div
              class="box bg-blue-400 bg-opacity-20 p-4"
            >
              <p class="font-semibold">ยอดฝาก</p>
              <p
                class="text-2xl my-4 text-blue-800"
              >
                {{ statementDepositToday ? statementDepositToday.total : 0 }}
              </p>
              <ul class="list-disc list-inside">
                <li class="flex">
                  <p class="flex-grow">จำนวนค้างทำรายการ</p>
                  <p>
                    {{ statementDepositToday ? statementDepositToday.deposit_wait : 0 }}
                  </p>
                </li>
                <li class="flex">
                  <p class="flex-grow">จำนวนทำรายการสำเร็จ</p>
                  <p>
                    {{ statementDepositToday ? statementDepositToday.deposit_success : 0 }}
                  </p>
                </li>
              </ul>
            </div>
          </NuxtLink>
          
          <NuxtLink to="/finance/withdrawMoneyList">
            <div
              class="box bg-blue-400 bg-opacity-20 p-4"
            >
              <p class="font-semibold">ยอดถอน</p>
              <p
                class="text-2xl my-4 text-blue-800"
              >
                {{ statementWithdrawToday ? statementWithdrawToday.total : 0 }}
              </p>
              <ul class="list-disc list-inside">
                <li class="flex">
                  <p class="flex-grow">จำนวนค้างทำรายการ</p>
                  <p>
                    {{ statementWithdrawToday ? statementWithdrawToday.withdraw_wait : 0 }}
                  </p>
                </li>
                <li class="flex">
                  <p class="flex-grow">จำนวนทำรายการสำเร็จ</p>
                  <p>
                    {{ statementWithdrawToday ? statementWithdrawToday.withdraw_success : 0 }}
                  </p>
                </li>
              </ul>
            </div>
          </NuxtLink>
          

          <div
            class="box bg-blue-400 bg-opacity-20 p-4"
          >
            <p class="font-semibold">ยอดรวมที่ทำรายการสำเร็จ</p>
            <p
              class="text-2xl my-4 text-blue-800"
            >
              <!-- {{ statementWithdrawToday ? statementWithdrawToday.total : 0 }} -->
            </p>
            <ul class="list-disc list-inside">
              <li class="flex">
                <p class="flex-grow">ฝากสำเร็จ</p>
                <p>
                  {{ statementSuccess ? statementSuccess.deposit : 0 }}
                </p>
              </li>
              <li class="flex">
                <p class="flex-grow">ถอนสำเร็จ</p>
                <p>
                  {{ statementSuccess ? statementSuccess.withdraw : 0 }}
                </p>
              </li>
            </ul>
          </div>
        </div>
        <div class="box bg-blue-400 bg-opacity-20 p-4">
          <div class="flex flex-col gap-7 justify-between">
            <div class="flex-1">
              <p class="font-semibold">ยอดเงินคงเหลือในระบบ</p>
              <p class="text-2xl my-2 text-blue-800">
                {{ balaceCredit ? balaceCredit.user_credit : 0 }}
              </p>
            </div>
            <div class="flex-1">
              <p class="font-semibold">จำนวน user ที่มีเงินในระบบ</p>
              <p class="text-2xl my-2 text-blue-800">
                {{ balaceCredit ? balaceCredit.amount_user : 0 }}
              </p>
            </div>
            <div class="flex-1">
              <p class="font-semibold">ยอดเงินคงเหลือตัวแทน</p>
              <p class="text-2xl my-2 text-blue-800">
                {{ balaceCredit ? balaceCredit.agent_credit : 0 }}
              </p>
            </div>
            <div class="flex-1">
              <p class="font-semibold">จำนวนตัวแทนที่มีเงินในระบบ</p>
              <p class="text-2xl my-2 text-blue-800">
                {{ balaceCredit ? balaceCredit.amount_agent : 0 }}
              </p>
            </div>
          </div>
        </div>
        <div class="box bg-blue-400 bg-opacity-20 p-4">
          <p class="font-semibold">มูลค่าการซื้อขายประจำวัน</p>
          <p class="text-2xl my-4 text-blue-800">
            {{ turnOverToday ? turnOverToday.total_turnover : 0 }}
          </p>
          <div class="grid grid-cols-3 gap-4 mb-3">
            <div class="text-left">
              <b>ข้อมูล</b>
            </div>
            <div class="text-center">
              <b>Cash</b>
            </div>
            <div class="text-center">
              <b>Point</b>
            </div>
          </div>

          <div v-for="(lotto,index) in turnOverToday.lottos" :key="index" class="grid grid-cols-3 gap-4 mb-2">
             <div class="text-left">
              {{ lotto ? lotto.name : 0 }}
            </div>
            <div class="text-center">
              {{ lotto ? lotto.sum_turnover : 0 }} / 
              {{lotto.lotto_rounds && lotto.lotto_rounds[0] ? lotto.lotto_rounds[0].sum_turnover : '' }} 
            </div>
            <div class="text-center">
              {{ lotto ? lotto.sum_turnover_points : 0 }} / 
              {{lotto.lotto_rounds && lotto.lotto_rounds[0] ? lotto.lotto_rounds[0].sum_turnover_points : '' }} 
            </div>
          </div>
          
          <!-- <div class="gap-y-3 flex flex-col">
            <div v-for="(lotto,index) in turnOverToday.lottos" :key="index" class="flex">
              <p class="flex-grow">{{ lotto ? lotto.name : 0 }}</p>
              <p>
                {{ lotto ? lotto.sum_turnover : 0 }}
              </p>
            </div>
          </div> -->
        </div>
        <div class="box bg-blue-400 bg-opacity-20 p-4">
          <div class="flex flex-col gap-7 justify-between">
            <div class="flex-1">
              <p class="font-semibold">จำนวน user ที่มี point ในระบบ</p>
              <p class="text-2xl my-2 text-blue-800">
                {{ balaceCredit ? balaceCredit.amount_user_points : 0 }}
              </p>
            </div>
            <div class="flex-1">
              <p class="font-semibold">จำนวน point ในระบบ</p>
              <p class="text-2xl my-2 text-blue-800">
                {{ balaceCredit ? balaceCredit.user_points : 0.00 }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- กราฟ -->
      <div class="my-4 pb-24">
        <div class="grid grid-flow-col grid-cols-1 lg:grid-cols-2 gap-4">
          <!-- class="overflow-auto" -->
          <div>
            <client-only>
              <!-- <div class="grid grid-cols-2 gap-4">
                <div class="...">1</div>
                <div class="...">2</div>
              </div> -->
              <NewUserGroupDay
                v-if="isChartLoaded"
                :chart-data="chartDataNewUserGroupDay"
                :chartOption="lineChartOptions"
                :height="300"
              />
              <!-- <my-line
                :chartData="lineChartData"
                :chartOption="lineChartOptions"
                :height="150"
              /> -->
            </client-only>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NewUserGroupDay from '@/components/Report/Dashboard/NewUserGroupday';
export default {
  name: 'Wowowo',
  layout: 'dashboard',
  middleware : ['permission'],
  components : {
    NewUserGroupDay
  },
  data() {
    return {
      countAllUsers : '',
      userActiveToday : '',
      newUserToday : '',
      statementDepositToday : '',
      statementWithdrawToday : '',
      balaceCredit : '',
      statementSuccess : '',
      turnOverToday : '',
      chartDataNewUserGroupDay : {
        labels : [],
        datasets: [
          {
            label: 'จำนวน New User',
            borderColor: '#064E3B',
            data: [],
          },
          // {
          //   label: 'จำนวนรายการฝากเงินครั้งแรก',
          //   borderColor: '#F78B00',
          //   data: [],
          // },
        ]
      },
      isChartLoaded: false,
      lineChartOptions: {
        responsive: true,
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: '',
        },
        // scales: {
        //   yAxes: [
        //     {
        //       ticks: {
        //         beginAtZero: false,
        //       },
        //     },
        //   ],
        // },
      }
    }
  },
  created() {
    this.getDataAll();
  },
  methods : {
    getDataAll() {
      this.getCountAllUser();
      this.getUserActiveToday();
      this.getNewUserToday();
      this.getStatementDepositToday();
      this.getStatementWithdrawToday();
      this.getBalaceCredit();
      this.getStatementSuccess();
      this.getTurnoverToday();

      this.getGraphNewUserGroupDay();
    },
    // user ทั้งหมด
    async getCountAllUser() {
      const url = `admin_dashboard/count_all_user` //CountAllUsers

      try {
        const countUserAll = await this.$axios.get(url);
        this.countAllUsers = countUserAll.data.data;
      } catch(err) {
        console.log(err);
      }
    },
    //user login & active
    async getUserActiveToday() {
      const url = `admin_dashboard/user_active/today` //UserActiveToday

      try {
        const getUserActive = await this.$axios.get(url);
        this.userActiveToday = getUserActive.data.data;
      } catch(err) {
        console.log(err);
      }
    },
    //สมาชิกใหม่
    async getNewUserToday() {
      const url = `admin_dashboard/new_user/today` //NewUserToday

      try {
        const getNewUserToday = await this.$axios.get(url);
        this.newUserToday = getNewUserToday.data.data;
      } catch(err) {
        console.log(err);
      }
    },
    //ยอดฝากประจำวัน
    async getStatementDepositToday() {
      const url = `admin_dashboard/statement_deposit/today` //StatementDepositToday

      try {
        const getStatementDeposit = await this.$axios.get(url);
        this.statementDepositToday = getStatementDeposit.data.data;
      } catch(err) {
        console.log(err);
      }
    },
    //ยอดถอนประจำวัน
    async getStatementWithdrawToday() {
      const url = `admin_dashboard/statement_withdraw/today` //StatementWithdrawToday

      try {
        const getStatementWithdraw = await this.$axios.get(url);
        this.statementWithdrawToday = getStatementWithdraw.data.data;
      } catch(err) {
        console.log(err);
      }
    },
    //ยอดเงินที่เหลือ
    async getBalaceCredit() {
      const url = `admin_dashboard/balance_credit` //BalanceCredit

      try {
        const getBalanceCredit = await this.$axios.get(url);
        this.balaceCredit = getBalanceCredit.data.data;
      } catch(err) {
        console.log(err);
      }
    },
    //จำนวนที่ทำรายการสำเร็จ
    async getStatementSuccess() {
      const url = `admin_dashboard/statement_success/today` //StatementSuccessToday

      try {
        const getStatementSuccess = await this.$axios.get(url);
        this.statementSuccess = getStatementSuccess.data.data;
      } catch(err) {
        console.log(err);
      }
    },
    //มูลค่าการซื้อขายทั้งหมด
    async getTurnoverToday() {
      const url = `admin_dashboard/turnover/all_lotto/today` //TurnoverAllLottoToday

      try {
        const getTurnOverToday = await this.$axios.get(url);
        this.turnOverToday = getTurnOverToday.data.data;
        // console.log('turnOverToday',this.turnOverToday);
      } catch(err) {
        console.log(err);
      }
    },
    //กราฟ new user group day
    async getGraphNewUserGroupDay() {
      this.chartDataNewUserGroupDay.labels = [];
      this.chartDataNewUserGroupDay.datasets[0].data = [];
      const url = `admin_dashboard/new_user/group/days` //NewUserGroupDays

      try {
        const getNewUserGroupDay = await this.$axios.get(url);
        getNewUserGroupDay.data.data.forEach((item) => {
          this.chartDataNewUserGroupDay.labels.push(item.date);
          this.chartDataNewUserGroupDay.datasets[0].data.push(item.count)
        })
        this.isChartLoaded = true;
        // console.log('chartDataNewUserGroupDay',this.chartDataNewUserGroupDay);
      } catch(err) {
        console.log(err);
      }
    }
  }
}
</script>
