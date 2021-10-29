<template>
  <div>
    <div class="grid grid-cols-12 gap-6 mt-5">
      <div class="col-span-12 lg:col-span-4 p-3 grid">
        <!-- <div class="w-36 h-36 image-fit justify-self-center">
          <img
            alt="profile-image"
            class="rounded-full"
            :src="dataNormalAgent ? dataNormalAgent.image_url : ''"
          />
        </div> -->
        <div class="justify-self-center mt-24">
          <span class="mt-3 lg:mt-2 text-xl grid justify-center">
            <b v-if="dataNormalAgent.agent_detail"
              >{{ dataNormalAgent.agent_detail.first_name }}
              {{ dataNormalAgent.agent_detail.last_name }}</b
            >
          </span>
          <div class="p-5 border-t border-gray-200 dark:border-dark-5">
            <a
              class="flex items-center py-2 rounded-md text-center p-3"
              href="javascript:;"
              :class="{
                'bg-white-900': openTab !== 1,
                'menu-background text-white mb-px': openTab === 1,
              }"
              @click="getDataAllTab(1)"
            >
              <ActivityIcon class="w-4 h-4 mr-2" /> ข้อมูลส่วนตัว
            </a>
            <a
              class="flex items-center mt-5 py-2 rounded-md text-center p-3"
              href="javascript:;"
              :class="{
                'bg-white-900': openTab !== 2,
                'menu-background text-white mb-px': openTab === 2,
              }"
              @click="getDataAllTab(2)"
            >
              <BoxIcon class="w-4 h-4 mr-2" /> บัญชีรับเงิน
            </a>
            <a
              class="flex items-center mt-5 py-2 rounded-md text-center p-3"
              href="javascript:;"
              :class="{
                'bg-white-900': openTab !== 3,
                'menu-background text-white mb-px': openTab === 3,
              }"
              @click="getDataAllTab(3)"
            >
              <LockIcon class="w-4 h-4 mr-2" /> สมาชิกที่แนะนำ
            </a>
            <a
              class="flex items-center mt-5 py-2 rounded-md text-center p-3"
              href="javascript:;"
              :class="{
                'bg-white-900': openTab !== 4,
                'menu-background text-white mb-px': openTab === 4,
              }"
              @click="getDataAllTab(4)"
            >
              <SettingsIcon class="w-4 h-4 mr-2" /> รายได้
            </a>
            <a
              class="flex items-center mt-5 py-2 rounded-md text-center p-3"
              href="javascript:;"
              :class="{
                'bg-white-900': openTab !== 5,
                'menu-background text-white mb-px': openTab === 5,
              }"
              @click="getDataAllTab(5)"
            >
              <SettingsIcon class="w-4 h-4 mr-2" /> ประวัติถอนเงิน
            </a>
          </div>
        </div>
      </div>
      <!-- ข้อมูลส่วนตัว -->
      <div class="col-span-12 lg:col-span-8 p-3 lg:mt-3">
        <AgentDetail
          v-if="openTab === 1"
          :data-personal-agent="dataPersonalAgent"
          @editDetailAgent="editDetailAgent"
        />

        <AgentBankAccount
          v-if="openTab === 2"
          :data-banks="dataBanks"
          :data-bank-account-agent="dataBankAccountAgent"
          @editBankAgent="editBankAgent"
        />

        <RecommendedMember
          v-if="openTab === 3"
        />

        <AgentIncome
          v-if="openTab === 4"
        />

        <AgentWithdraw
          v-if="openTab === 5"
          @data-agent-withdraw="dataAgentWithdraw"
        />
      </div>


    </div>
  </div>
</template>
<script>
import AgentDetail from "@/components/Agent/detail/AgentDetail";
import AgentBankAccount from "@/components/Agent/detail/AgentBankAccount";
import RecommendedMember from "@/components/Agent/detail/RecommendedMember";
import AgentIncome from "@/components/Agent/detail/AgentIncome";
import AgentWithdraw from "@/components/Agent/detail/AgentWithdraw";
import alertMixins from "~/mixins/alertMixin";

export default {
  layout: "dashboard",
  components: {
    AgentDetail,
    AgentBankAccount,
    RecommendedMember,
    AgentIncome,
    AgentWithdraw
  },
  mixins: [alertMixins],
  data() {
    return {
      agentId: "",
      openTab: "",
      dataNormalAgent: "",
      dataPersonalAgent: "",
      dataBankAccountAgent: "",
      dataBanks: "",
      dataAgentWithdraw: ""
    };
  },
  created() {
    this.agentId = this.$route.params.id;
    this.getDataAllTab(1);
    this.getDataDetailAgent();
    this.getBankAll();
  },
  methods: {
    async getDataDetailAgent() {
      const url = `admin_manage_agent/agents/${this.agentId}`;
      try {
        const detailAgent = await this.$axios.get(url);
        this.dataNormalAgent = detailAgent.data.data;
      } catch (err) {
        console.log("err", err);
      }
    },
    getDataAllTab(status) {
      this.openTab = status;
      if (this.openTab == 1) {
        this.getDataPersonalAgent();
      } else if (this.openTab == 2) {
        this.getDataBankAgent();
      }
    },
    async getDataPersonalAgent() {
      const url = `admin_manage_agent/agents/${this.agentId}/detail`;

      try {
        const dataPersonal = await this.$axios.get(url);
        this.dataPersonalAgent = dataPersonal.data.data;
      } catch (err) {
        console.log(err);
      }
    },
    async getDataBankAgent() {
      const url = `admin_manage_agent/agents/${this.agentId}/bank_account`;
      try {
        const dataBankAccount = await this.$axios.get(url);
        this.dataBankAccountAgent = dataBankAccount.data.data;
      } catch (err) {
        console.log(err);
      }
    },
    async getBankAll() {
      const url = `data/banks`;

      try {
        const dataBank = await this.$axios.get(url);
        this.dataBanks = dataBank.data.data;
      } catch (err) {
        console.log(err);
      }
    },
    async editDetailAgent(data) {
      const url = `admin_manage_agent/agents/${this.agentId}/detail`;

      const _data = {
        first_name: data.first_name,
        last_name: data.last_name,
      };

      try {
        const editDetail = await this.$axios.put(url, _data);
        if (editDetail.status == 200) {
          this.successAlertWord(editDetail.data.message);
          this.getDataPersonalAgent(1);
          this.getDataDetailAgent();
        }
      } catch (err) {
        if(err.response.status == 400) {
          this.errorAlertStatusCode(err.response.data.errors);
        } else {
          this.errorAlertStatusCode(err);
        }
      }
    },
    async editBankAgent(data) {
      const url = `admin_manage_agent/agents/${this.agentId}/bank_account`;

      const _data = {
        agent_bank_account_id: data.agent_bank_account_id,
        bank_id: data.bank_id,
        bank_account_number: data.bank_number,
        bank_account_name: data.bank_name,
      };
      try {
        const editBank = await this.$axios.put(url, _data);

        if (editBank.status == 200) {
          this.successAlertWord(editBank.data.message);
          this.getDataBankAgent(2);
        }
      } catch (err) {
        this.$toast.error(err.response.data.message);
      }
    },
  },
};
</script>
<style>
.menu-background {
  background-color: #f44056;
  border: none !important;
}
</style>
