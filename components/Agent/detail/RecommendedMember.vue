<template>
  <div>
    <div class="col-span-12 mt-8">
      <div class="intro-y flex items-center h-10">
        <div>
          <span class="lg:text-lg"><b>จัดการข้อมูลสมาชิก</b></span>
        </div>
      </div>
    </div>
    <div class="col-span-12 mt-2">
      <div class="box p-5 relative overflow-y-hidden">
        <div class="intro-y flex items-center h-10">
          <div class="search hidden sm:block">
            <input
              v-model="search"
              type="text"
              class="
                form-control
                dark:bg-dark-1
                border-transparent
                placeholder-theme-8
              "
              placeholder="ค้นหาเบอร์โทร"
              @keyup.enter="getDataRecomMember()"
            />
            <SearchIcon class="search__icon dark:text-gray-300" />
          </div>
          <div class="ml-auto">
            <!-- <select class="sm:ml-auto mt-3 sm:mt-0 sm:w-auto form-select box">
              <option value="">100</option>
            </select> -->
            <span class="lg:text-lg">ทั้งหมด {{ count_member }} คน</span>
          </div>
        </div>
        <div class="py-3">
          <table class="table">
            <thead>
              <tr>
                <th
                  v-for="(col, index) in tbShowrecommendedMember.columns"
                  :key="index"
                  class="border-b-2 dark:border-dark-5 whitespace-nowrap"
                >
                  {{ col.label }}
                </th>
              </tr>
            </thead>
            <tbody v-if="tbShowrecommendedMember.rows.length > 0">
              <tr
                v-for="(data, index) in tbShowrecommendedMember.rows"
                :key="index"
                :class="{ 'bg-gray-200 dark:bg-dark-1': index % 2 == 0 }"
              >
                <td>{{ data.num }}</td>
                <td>{{ data.register_date }}</td>
                <td>{{ data.name }}</td>
                <td>{{ data.phone }}</td>

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
import moment from 'moment';
export default {
  props: ["dataBillsUser"],
  data() {
    return {
      agentId: "",
      tbShowrecommendedMember: {
        page: 1,
        columns: [
          { label: "#" },
          { label: "วันที่สมัคร" },
          { label: "ชื่อบัญชี" },
          { label: "เบอร์โทร" },
        ],
        rows: [],
      },
      currentPage: 1,
      totalItem: 0,
      itemPerPage: 20,
      currentPageApi: 0,
      count_member: "",
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
      const url = `admin_manage_agent/agents/${this.agentId}/members`;
      const params = {
        page: this.currentPageApi,
        limit: this.itemPerPage,
        search: this.search,
      };

      try {
        const response = await this.$axios.get(url, { params: params });

        this.count_member = response.data.data
          ? response.data.data.total_member
          : 0;
        this.tbShowrecommendedMember.rows = response.data.data.members.map((item, index) => {
          return {
            num: index + 1,
            register_date: item ? moment(item.created_at).format("YYYY-MM-DD HH:mm") : "-",
            name: item.user_bank_accounts.length > 0 ? item.user_bank_accounts[0].bank_account_name : "-",
            phone: item ? item.phone_number : "-",
          };
        });

        this.totalItem = response.data.data.total_member;
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>
