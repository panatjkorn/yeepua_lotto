<template>
  <div>
    <!-- เลขบัญชีธนาคาร -->
      <!-- <div v-if="openTab == 2" class="col-span-12 lg:col-span-8 p-3 lg:mt-3"> -->
        <div class="flex">
          <b class="text-xl">ข้อมูลส่วนตัว</b>
          <button class="ml-auto btn bg-blue-500 text-white" @click="modalAddUserBookBank()">เพิ่มบัญชีธนาคาร</button>
        </div>
        <div v-if="form2.length > 0" class="p-5">
          <div v-for="(bank,index) in form2" :key="index" class="box grid justify-self-center p-5 lg:px-24 mt-3">
            <div>
              <div class="lg:grid md:grid-flow-col grid-cols-6 mt-3">
                <label for="" class="mt-2 mr-2 col-span-1">ธนาคาร :</label>
                <select v-model="form2[index].bank_id" class="input input--sm border col-span-5">
                  <option v-for="bank in dataBanks" :key="bank.id" :value="bank.id">{{ bank.name }}</option>
                </select>
              </div>
              <div class="lg:grid md:grid-flow-col grid-cols-6 mt-3">
                <label for="" class="mt-5 mr-2 col-span-1">ชื่อบัญชี :</label>
                <input v-model="form2[index].bank_name" class="form-control form-control-sm mt-2 col-span-5" type="text">
              </div>
              <div class="lg:grid md:grid-flow-col grid-cols-6 mt-3">
                <label for="" class="mt-5 mr-2 col-span-1">เลขบัญชี :</label>
                <input v-model="form2[index].bank_number" class="form-control form-control-sm mt-2 col-span-5" type="text">
              </div>
            </div>
            <button class="btn btn-dark w-24 mr-1 mt-5 justify-self-end" @click="editBankUser(form2[index])">บันทึก</button>
          </div>
        </div>
      <!-- </div> -->
  </div>
</template>
<script>
export default {
  props : ['dataBankAccountUser','dataBanks'],
  data() {
    return {
      form2 : [],
    }
  },
  watch : {
    dataBankAccountUser : 'setDataUserBankAccount'
  },
  methods : {
    setDataUserBankAccount(dataBank) {
      this.form2 = [];
      dataBank.forEach((item) => {
        // console.log(item);
        const _data = {
          bank_name : item ? item.bank_account_name : '',
          bank_number : item ? item.bank_account_number : '',
          bank_id : item.bank ? item.bank.id : '',
          user_bank_account_id : item ? item.id : ''
        }
        this.form2.push(_data);
      })
      // console.log(this.form2);
    },
    //edit bank user
    editBankUser(formData) {
      this.$emit('editBankUser',formData)
    },
    modalAddUserBookBank() {
      this.$emit('modalAddUserBookBank');
    }
  }
}
</script>
