<template>
  <div>
    <b class="text-xl">ข้อมูลส่วนตัว</b>
    <div class="box grid justify-self-center p-5 lg:px-24 mt-3">
      <div class="lg:grid md:grid-flow-col grid-cols-6">
        <label for="" class="mt-3 mr-2 col-span-1">รหัสตัวแทน :</label>
        <input
          v-model="form.agent_code"
          class="form-control form-control-sm mt-2 col-span-5"
          type="text"
          disabled
        />
      </div>
      <div class="lg:grid md:grid-flow-col grid-cols-6 mt-3">
        <label for="" class="mt-5 mr-2 col-span-1">วันที่สมัคร :</label>
        <input
          v-model="form.date_regis"
          class="form-control form-control-sm mt-2 col-span-5"
          type="text"
          disabled
        />
      </div>
      <div class="lg:grid md:grid-flow-col grid-cols-6 mt-3">
        <label for="" class="mt-5 mr-2 col-span-1">*ชื่อ :</label>
        <input
          v-model="form.first_name"
          class="form-control form-control-sm mt-2 col-span-5"
          type="text"
        />
      </div>
      <div class="lg:grid md:grid-flow-col grid-cols-6 mt-3">
        <label for="" class="mt-5 mr-2 col-span-1">*นามสกุล :</label>
        <input
          v-model="form.last_name"
          class="form-control form-control-sm mt-2 col-span-5"
          type="text"
        />
      </div>
      <div class="lg:grid md:grid-flow-col grid-cols-6 mt-3">
        <label for="" class="mt-5 mr-2 col-span-1">*เบอร์โทร :</label>
        <input
          v-model="form.phone"
          class="form-control form-control-sm mt-2 col-span-5"
          type="text"
          disabled
        />
      </div>
      <div class="lg:grid md:grid-flow-col grid-cols-6 mt-3">
        <label for="" class="mt-5 mr-2 col-span-1">ลิงค์ตัวแทน :</label>
        <input
          v-model="form.agent_link"
          class="form-control form-control-sm mt-2 col-span-5"
          type="text"
          disabled
        />
      </div>
      <button
        class="btn btn-dark w-24 mr-1 mt-5 justify-self-end"
        @click="editDetailAgent()"
      >
        บันทึก
      </button>
    </div>
  </div>
</template>
<script>
import moment from "moment";
export default {
  props: ["dataPersonalAgent"],
  data() {
    return {
      form: {
        agent_code: "",
        date_regis: "",
        first_name: "",
        last_name: "",
        phone: "",
        agent_link: "",
        agent_id: "",
      },
    };
  },
  watch: {
    dataPersonalAgent: "setDataDetail",
  },
  methods: {
    setDataDetail(dataPersonal) {
      this.form.agent_code = dataPersonal ? dataPersonal.agent_code : "";
       this.form.date_regis = dataPersonal
        ? moment(dataPersonal.created_at).format("YYYY-MM-DD HH:mm")
        : "";
      this.form.first_name = dataPersonal ? dataPersonal.agent_detail.first_name : "";
      this.form.last_name = dataPersonal ? dataPersonal.agent_detail.last_name : "";
      this.form.phone = dataPersonal ? dataPersonal.phone_number : "";
      this.form.agent_link = dataPersonal ? dataPersonal.agent_link : "";
      this.form.agent_id = dataPersonal ? dataPersonal.id : "";
    },
    editDetailAgent() {
      this.$emit("editDetailAgent", this.form);
    },
  },
};
</script>
