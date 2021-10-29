<template>
  <div>
    <div class="col-span-12 mt-8">
      <div class="intro-y flex items-center h-10">
        <div>
          <span class="lg:text-lg"><b>ประวัติถอนเงิน</b></span>
        </div>
      </div>
    </div>
    <div class="col-span-12 mt-2">
      <div class="box p-5 relative overflow-y-hidden">
        <div class="intro-y flex items-center h-10">
          <div class="ml-auto">
            <span class="lg:text-lg">ทั้งหมด {{ count_bill }} รายการ</span>
          </div>
        </div>
        <div class="py-3">
          <table class="table">
            <thead>
              <tr>
                <th
                  v-for="(col, index) in tbShowAgentWithdraws.columns"
                  :key="index"
                  class="border-b-2 dark:border-dark-5 whitespace-nowrap"
                >
                  {{ col.label }}
                </th>
              </tr>
            </thead>
            <tbody v-if="tbShowAgentWithdraws.rows.length > 0">
              <tr
                v-for="(data, index) in tbShowAgentWithdraws.rows"
                :key="index"
                :class="{ 'bg-gray-200 dark:bg-dark-1': index % 2 == 0 }"
              >
                <td>{{ data.num }}</td>
                <td>{{ data.withdraw_date }}</td>
                <td>{{ data.credit }}</td>
                <td>
                  <div
                  :class="{
                    'bg-gray-600' : data.status_detail.status_id == 1, //รอตรวจสอบ
                    'bg-yellow-300' : data.status_detail.status_id == 2, //รอโอนเงิน
                    'bg-yellow-500' : data.status_detail.status_id == 3, //ไม่สำเร็จ
                    'bg-green-500' : data.status_detail.status_id == 4, //สำเร็จ
                    'bg-red-500' : data.status_detail.status_id == 5, //ถูกปฏิเสธ
                  }"
                  class="p-2 rounded-3xl text-white w-2/3 text-center"
                  >{{ data.status_detail.status_detail }}</div>
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
  props: ["dataAgentWithdraw"],
  data() {
    return {
      agentId: "",
      tbShowAgentWithdraws: {
        page: 1,
        columns: [
          { label: "#" },
          { label: "วันที่ถอน" },
          { label: "ยอดที่ถอน (บาท)" },
          { label: "สถานะ" },
        ],
        rows: [],
      },
      currentPage: 1,
      totalItem: 0,
      itemPerPage: 20,
      currentPageApi: 0,
      count_bill: "",
      search: "",
    };
  },
  created() {
    this.agentId = this.$route.params.id;
    this.getDataRecomMember();
  },
  methods: {
    async handleTogglePage() {
      this.currentPageApi = this.currentPage - 1;
      this.getDataRecomMember();
    },
    async getDataRecomMember() {
      const url = `admin_manage_agent/agents/${this.agentId}/withdraws`;
      const params = {
        page: this.currentPageApi,
        limit: this.itemPerPage,
        search: this.search,
      };

      try {
        const response = await this.$axios.get(url, { params: params });

        this.count_bill = response.data.data ? response.data.data.total : 0;
        this.tbShowAgentWithdraws.rows =
          response.data.data.agent_withdraws.map((item, index) => {
            console.log(item);
            return {
              num: index + 1,
              withdraw_date: item
                ? moment(item.created_at).format("YYYY-MM-DD HH:mm")
                : "",
              credit: item ? item.credit : "-",
              status_detail: {
                status_detail : item
                ? item.agent_withdraw_status.status_detail
                : "-",
                status_id : item
                ? item.agent_withdraw_status.id
                : "-"
              },
            };
          });

        this.totalItem = response.data.data.total;
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>
