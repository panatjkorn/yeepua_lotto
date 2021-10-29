<template>
  <div>
    <b class="text-xl">บัญชีรับเงิน</b>
    <div
    v-if="form.agent_bank_account_id"
    class="box grid justify-self-center p-5 lg:px-24 mt-3">
      <div class="lg:grid md:grid-flow-col grid-cols-6 mt-3">
        <label for="" class="mt-2 mr-2 col-span-1">ธนาคาร :</label>
        <select
          v-model="form.bank_id"
          class="input input--sm border col-span-5"
        >
          <option v-for="bank in dataBanks" :key="bank.id" :value="bank.id">
            {{ bank.name }}
          </option>
        </select>
      </div>
      <div class="lg:grid md:grid-flow-col grid-cols-6 mt-3">
        <label for="" class="mt-5 mr-2 col-span-1">ชื่อบัญชี :</label>
        <input
          v-model="form.bank_name"
          class="form-control form-control-sm mt-2 col-span-5"
          type="text"
        />
      </div>
      <div class="lg:grid md:grid-flow-col grid-cols-6 mt-3">
        <label for="" class="mt-5 mr-2 col-span-1">เลขบัญชี :</label>
        <input
          v-model="form.bank_number"
          class="form-control form-control-sm mt-2 col-span-5"
          type="text"
        />
      </div>
      <button
        class="btn btn-dark w-24 mr-1 mt-5 justify-self-end"
        @click="editBankAgent(form)"
      >
        บันทึก
      </button>
    </div>
  </div>
</template>
<script>
export default {
  props: ["dataBankAccountAgent", "dataBanks"],
  data() {
    return {
      form: {
        agent_bank_account_id: "",
        bank_name: "",
        bank_number: "",
        bank_id: "",
      },
    };
  },
  watch: {
    dataBankAccountAgent: "setDataAgentBankAccount",
  },
  methods: {
    setDataAgentBankAccount(dataBank) {
      console.log(dataBank);
      this.form.bank_name = dataBank.bank_account_name;
      this.form.bank_number = dataBank.bank_account_number;
      this.form.bank_id = dataBank.bank.id;
      this.form.agent_bank_account_id = dataBank.id;
    },
    editBankAgent(formData) {
      this.$emit("editBankAgent", formData);
    },
  },
};
</script>
