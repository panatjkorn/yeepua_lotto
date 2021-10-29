<template>
  <div>
    <div class="col-span-12 mt-8">
      <div class="intro-y flex items-center h-10">
        <div>
          <span class="lg:text-lg"><b>จัดการข้อมูลตัวแทน</b></span>
        </div>
        <div class="ml-auto">
          <input
            v-model="search"
            type="text"
            class="form-control border"
            placeholder="ค้นหาเบอร์โทร"
            @keyup.enter="getDataAgentAll()"
          />
        </div>
      </div>
    </div>
    <div class="col-span-12 mt-2">
      <div class="box p-5 relative overflow-y-hidden">
        <div class="intro-y flex items-center h-10">
          <div>
            <span class="lg:text-lg"><b>รายการตัวแทน</b></span>
          </div>
          <hr />
          <div class="ml-auto">
            <span class="lg:text-lg">ทั้งหมด {{ total_agent }} คน</span>
          </div>
        </div>
        <div class="py-3">
          <table class="table">
            <thead>
              <tr>
                <th
                  v-for="(col, index) in tbShowAgents.columns"
                  :key="index"
                  class="border-b-2 dark:border-dark-5 whitespace-nowrap"
                >
                  {{ col.label }}
                </th>
              </tr>
            </thead>
            <tbody v-if="tbShowAgents.rows.length > 0">
              <tr
                v-for="(data, index) in tbShowAgents.rows"
                :key="index"
                :class="{ 'bg-gray-200 dark:bg-dark-1': index % 2 == 0 }"
              >
                <td>{{ data.num }}</td>
                <td>{{ data.agent_code }}</td>
                <!-- <td>{{ data.agent_name }}</td> -->
                <td>{{ data.phone }}</td>
                <td>{{ data.count_member }}</td>
                <td>{{ data.agent_credit }}</td>
                <td>{{ data.create_at }}</td>
                <td>
                  <button
                    class="btn btn-dark w-24 mr-1 mb-2"
                    @click="$router.push('/agent/detail/' + data.id)"
                  >
                    ดูข้อมูล
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <client-only>
          <div class="grid lg:grid-cols-3 gap-4 mt-5">
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
  layout: "dashboard",
  middleware : ['permission'],
  data() {
    return {
      tbShowAgents: {
        page: 1,
        columns: [
          { label: "#" },
          { label: "รหัสตัวแทน" },
          // { label: "ชื่อ" },
          { label: "เบอร์โทร" },
          { label: "จำนวนสมาชิก(คน)" },
          { label: "ยอดเงินคงเหลือ(บาท)" },
          { label: "วันที่สมัคร" },
          { label: "ตัวเลือก" },
        ],
        rows: [],
      },
      currentPage: 1,
      totalItem: 0,
      itemPerPage: 20,
      currentPageApi: 0,
      total_agent: 0,
      search: "",
    };
  },
  created() {
    this.getDataAgentAll();
  },
  methods: {
    async handleTogglePage() {
      this.currentPageApi = this.currentPage - 1;
      this.getDataAgentAll();
    },

    async getDataAgentAll() {
      const url = `admin_manage_agent/agents/`;
      const params = {
        page: this.currentPageApi,
        limit: this.itemPerPage,
        search: this.search,
      };

      try {
        const dataAgent = await this.$axios(url, { params: params });

        this.total_agent = dataAgent.data.data.total_agent || 0
        this.tbShowAgents.rows = dataAgent.data.data.agents.map((item, index) => {
          // console.log(item);
          return {
            num: index + 1,
            agent_code: item.agent_code,
            // agent_name: `${item.agent_detail.first_name} ${item.agent_detail.last_name}`,
            phone: item.phone_number,
            count_member: item.count_member,
            agent_credit: item.agent_credit.credit,
            create_at : item && item.created_at ? moment(item.created_at).format("YYYY-MM-DD HH:mm") : '',
            id: item.id
          };
        });
        this.totalItem = dataAgent.data.data.total_agent;
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>
