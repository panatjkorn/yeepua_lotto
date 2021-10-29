<template>
  <div>
    <div class="col-span-12 mt-8">
      <div class="intro-y flex items-center h-10">
        <div>
          <span class="lg:text-lg">จัดการข้อมูลสมาชิก</span>
        </div>
        <div class="ml-auto">
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
              @keyup.enter="getDataUserAll()"
            />
            <SearchIcon class="search__icon dark:text-gray-300" />
          </div>
        </div>
      </div>
    </div>
    <div class="col-span-12 mt-2">
      <div class="box p-5 relative overflow-y-hidden">
        <div class="intro-y flex items-center h-10">
          <div>
            <span class="lg:text-lg"><b>รายการสมาชิก</b></span>
          </div>
          <div class="ml-auto">
            <!-- <select class="sm:ml-auto mt-3 sm:mt-0 sm:w-auto form-select box">
              <option value="">100</option>
            </select> -->
            <span class="lg:text-lg">ทั้งหมด {{ count_user }} คน</span>
          </div>
        </div>
        <div class="py-3">
          <table class="table">
            <thead>
              <tr>
                <th
                  v-for="(col, index) in tbShowUsers.columns"
                  :key="index"
                  class="border-b-2 dark:border-dark-5 whitespace-nowrap"
                >
                  {{ col.label }}
                </th>
              </tr>
            </thead>
            <tbody v-if="tbShowUsers.rows.length > 0">
              <tr
                v-for="(data, index) in tbShowUsers.rows"
                :key="index"
                :class="{ 'bg-gray-200 dark:bg-dark-1': index % 2 == 0 }"
              >
                <td>{{ data.num }}</td>
                <td>{{ data.phone }}</td>
                <td>
                  <p
                    v-for="(bank, index) in data.bank_account_name"
                    :key="index"
                  >
                    {{ bank.bank_account_name }}
                  </p>
                </td>
                <td>{{ data.amount_purchase }}</td>
                <td>{{ data.profit }}</td>
                <td>{{ data.balance_credit }}</td>
                <td>{{ data.balance_points }}</td>
                <td>{{ data.create_at }}</td>
                <td>
                  {{ data.agent_regis ? data.agent_regis.agent_code : "" }}
                </td>
                <td>
                  {{ data ? data.count_topup_fail : "" }}
                </td>
                <td>
                  <button
                    class="btn btn-dark"
                    @click="$router.push('/user/detail/' + data.id)"
                  >
                    ดูข้อมูล
                  </button>
                  <button
                    v-if="data.count_topup_fail > 4"
                    class="btn bg-green-500 text-white"
                    @click="confirmCancelBanTopUp(data.id)"
                  >
                    ปลดแบนเติมเงิน
                  </button>
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
</template>
<script>
import moment from "moment";
import alertMixins from "~/mixins/alertMixin";

import ModalConfirm from '@/components/Modal/ModalConfirm';
// import { getDataUser } from '@/api/admin_manage_user'
export default {
  layout: "dashboard",
  mixins: [alertMixins],
  middleware : ['permission'],
  components : {
    ModalConfirm
  },
  data() {
    return {
      tbShowUsers: {
        page: 1,
        columns: [
          { label: "#" },
          { label: "เบอร์โทร" },
          { label: "ชื่อบัญชี" },
          { label: "ยอดซื้อ" },
          { label: "ยอดถูกรางวัล" },
          { label: "จำนวนเงินของ user" },
          { label: "จำนวน point ของ user" },
          { label: "วันที่สมัคร" },
          { label: "สมัครผ่านตัวแทน" },
          { label: "เติมเงินไม่สำเร็จ (ครั้ง)" },
          { label: "ตัวเลือก" },
        ],
        rows: [],
      },
      currentPage: 1,
      totalItem: 0,
      itemPerPage: 20,
      currentPageApi: 0,
      count_user: "",
      search: "",
      headerModalConfirm : '',
      warningMassageModalConfirm : '',
      user_Id : '',
      typeModalConfirmSubmit : ''
    };
  },
  created() {
    this.getDataUserAll();
  },
  methods: {
    async handleTogglePage() {
      this.currentPageApi = this.currentPage - 1;
      this.getDataUserAll();
    },
    async getDataUserAll() {
      const url = `admin_manage_user/users/`; //Users
      const params = {
        page: this.currentPageApi,
        limit: this.itemPerPage,
        search: this.search,
      };

      try {
        const dataUser = await this.$axios(url, { params: params });
        this.count_user = dataUser.data.data
          ? dataUser.data.data.total_user
          : "";
        this.tbShowUsers.rows = dataUser.data.data.users.map((item, index) => {
          // console.log(item);
          return {
            num: index + 1,
            // user_name : item.user_detail && item.user_detail.first_name != null || item.user_detail.last_name != null
            //   ? `${item.user_detail.first_name} ${item.user_detail.last_name}` : '',
            phone: item ? item.phone_number : "",
            bank_account_name: item ? item.user_bank_accounts : "",
            amount_purchase: item ? item.sum_turnover : "",
            profit: item ? item.sum_profit : 0,
            create_at:
              item && item.created_at
                ? moment(item.created_at).format("YYYY-MM-DD HH:mm")
                : "",
            agent_regis: item ? item.agent : "",
            id: item ? item.id : "",
            count_topup_fail : item ? item.count_topup_fail : 0,
            balance_credit : item && item.balance_credit > 0 ? item.balance_credit : 0,
            balance_points : item && item.balance_points > 0 ? item.balance_points : 0,
            count_topup_fail : item && item.count_topup_fail > 0 ? item.count_topup_fail : 0
          };
        });
        this.totalItem = dataUser.data.data.total_user;
      } catch (err) {
        console.log(err);
      }
    },

    async cancelBanTopUp() {
      const url = `admin_manage_user/users/${this.user_Id}/cancel_topup`; //Users

      try {
        const response = await this.$axios.put(url);
        if (response.status == 200) {
          this.$cash('#modal-confirm').modal('hide');
          this.successAlertWord(response.data.message);
        }
      } catch (err) {
        this.$cash("#modal-confirm").modal("hide");
        if (err.response.status == 400) {
          
          this.errorAlertStatusCode(err.response.data.errors);
        } else {

          this.errorAlertStatusCode(err);
        }
      }
    },
    confirmCancelBanTopUp(user_id) {
      this.user_Id = user_id
      this.headerModalConfirm = 'ยืนยันปลดแบน',
      this.typeModalConfirmSubmit = 'submitCancelBan'
      this.$cash('#modal-confirm').modal('show');
    },
    cancelModal() {
      this.$cash('#modal-confirm').modal('hide');
      this.warningMassageModalConfirm = null;
    },
    submitConfirm() {
      if(this.typeModalConfirmSubmit == 'submitCancelBan') {
        this.cancelBanTopUp();
      }
    }
  },
};
</script>
