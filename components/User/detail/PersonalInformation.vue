<template>
  <div>
    <b class="text-xl">ข้อมูลส่วนตัว</b>
    <div class="box grid justify-self-center p-5 lg:px-24 mt-3">
      <div class="lg:grid md:grid-flow-col grid-cols-6">
        <label for="" class="mt-3 mr-2 col-span-1">วันที่รับสมัคร :</label>
        <input v-model="form.date_regis" class="form-control form-control-sm mt-2 col-span-5" type="text" disabled>
      </div>
      <div class="lg:grid md:grid-flow-col grid-cols-6 mt-3">
        <label for="" class="mt-5 mr-2 col-span-1">*เบอร์โทร :</label>
        <input v-model="form.phone" class="form-control form-control-sm mt-2 col-span-5" type="text" disabled>
      </div>
      <div class="lg:grid md:grid-flow-col grid-cols-6 mt-3">
        <label for="" class="mt-5 mr-2 col-span-1">เฟสบุค :</label>
        <input v-model="form.facebook" class="form-control form-control-sm mt-2 col-span-5" type="text">
      </div>
      <div class="lg:grid md:grid-flow-col grid-cols-6 mt-3">
        <label for="" class="mt-5 mr-2 col-span-1">ไลน์ :</label>
        <input v-model="form.line" class="form-control form-control-sm mt-2 col-span-5" type="text">
      </div>
      <div class="lg:grid md:grid-flow-col grid-cols-6 mt-3">
        <label for="" class="mt-5 mr-2 col-span-1">สมัครผ่านตัวแทน :</label>
        <input v-model="form.regis_from_agent" class="form-control form-control-sm mt-2 col-span-5" type="text" disabled>
      </div>
      <button class="btn btn-dark w-24 mr-1 mt-5 justify-self-end" @click="editDetailUser()">บันทึก</button>
    </div>
  </div>
</template>
<script>
import moment from "moment";
export default {
  props : ['dataPersonalUser'],
  data() {
    return {
      form : {
        date_regis : '',
        phone : '',
        facebook : '',
        line : '',
        regis_from_agent : '',
        dataBanks : '',
        user_id : ''
      },
    }
  },
  watch : {
    dataPersonalUser : 'setDataPersonalInformation'
  },
  methods : {
    setDataPersonalInformation(dataPersonal) {
      // console.log('dataPersonal',dataPersonal);
      this.form.date_regis =  dataPersonal ? moment(dataPersonal.created_at).format("YYYY-MM-DD HH:mm") : '';
      // this.form.firstname = dataPersonal && dataPersonal.user_detail ? dataPersonal.user_detail.first_name : '';
      // this.form.lastname = dataPersonal && dataPersonal.user_detail ? dataPersonal.user_detail.last_name : '';
      this.form.phone = dataPersonal ?  dataPersonal.phone_number : '';
      this.form.facebook = dataPersonal && dataPersonal.user_detail ? dataPersonal.user_detail.facebook : '';
      this.form.line = dataPersonal && dataPersonal.user_detail ? dataPersonal.user_detail.line_id : '';
      this.form.user_id = dataPersonal ? dataPersonal.id : ''
      this.form.regis_from_agent = dataPersonal.agent ? dataPersonal.agent.agent_code : '';
    },
    editDetailUser() {
      this.$emit('editDetailUser',this.form)
    }
  }
}
</script>
