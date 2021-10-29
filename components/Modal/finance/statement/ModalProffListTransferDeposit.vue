<template>
    <div>
        <!-- จัดการรายการโอนเงิน statement ฝาก จากรอทำรายการเป็นสำเร็จ -->
        <div
        id="modal-proff-status-wait-to-success"
        class="modal"
        tabindex="-1"
        aria-hidden="true"
        data-backdrop="static"
      >
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                <div class="modal-header text-xl">
                    <b>จัดการรายการฝาก</b>
                </div>
                <div class="modal-body p-8 text-left">
                    <h2 class="text-xl"><b>รายละเอียด</b></h2>
                    <div class="lg:grid md:grid-flow-col grid-cols-6">
                        <p class="mt-4"><b>วันที่ส่งคำขอ</b></p>
                        <div class="col-span-5 mt-4">{{dataProffStatement.date_time 
                            ? convertDateTime(dataProffStatement.date_time) : ''}}
                        </div>
                    </div>

                    <div class="lg:grid md:grid-flow-col grid-cols-6">
                        <p class="mt-4"><b>จำนวนเงิน</b></p>
                        <div class="col-span-5 mt-4">
                            {{ dataProffStatement ? dataProffStatement.credit : ''}}
                        </div>
                    </div>

                    <div class="lg:grid md:grid-flow-col grid-cols-6">
                        <p class="mt-4"><b>รายละเอียด</b></p>
                        <div class="col-span-5 mt-4">
                            {{ dataProffStatement ? dataProffStatement.detail : ''}}
                        </div>
                    </div>

                    <div class="lg:grid md:grid-flow-col grid-cols-6">
                        <p class="mt-5"><b>เบอร์โทร</b></p>
                        <div class="col-span-3">
                            
                                <input 
                                    v-model="form.phone" 
                                    type="text" 
                                    class="mt-4 form-control" 
                                    placeholder="กรอกเบอร์โทรลูกค้า"
                                    @input="checkValidatePhonenumber()"
                                    @keyup.enter="findPhoneNumber()"
                                >
                            
                            <!-- <div v-if="statusValidateFindPhone == 'ERROR' && !$v.form.phone.required" class="text-red-500 text-xs mt-1">
                                กรุณากรอกหมายเลขโทรศัพท์
                            </div> -->

                            <div v-if="
                            submitCreateStatus == 'ERROR' && !$v.form.phone.required || 
                            validatePhoneNumber == true" 
                                class="text-red-500 text-xs mt-1">
                                กรุณากรอกหมายเลขโทรศัพท์ให้ถูกต้อง
                            </div>

                            <div v-if="errResponseFindPhone != null" class="text-red-500 text-xs mt-1">
                                {{errResponseFindPhone}}
                            </div>
                        </div>
                        <button class="btn bg-green-500 text-white mt-4 w-14 ml-2" @click="findPhoneNumber()">ค้นหา</button>
                    </div>

                    <div v-if="dataUser != null" class="box px-5 py-3 ml-4 flex-1 zoom-in m-5 bg-blue-200 border border-black w-2/3">
                        <div class="grid grid-cols-6 gap-4">
                            <div class="col-span-2"><b>ชื่อผู้ใช้งาน </b></div>
                            <div class="col-span-4">
                                {{dataUser.user_bank_accounts && dataUser.user_bank_accounts[0] ? 
                                dataUser.user_bank_accounts[0].bank_account_name : ''}}
                            </div>
                        </div>

                        <div class="grid grid-cols-6 gap-4 mt-5">
                            <div class="col-span-2"><b>เบอร์โทร </b></div>
                            <div class="col-span-4">{{ dataUser ? dataUser.phone_number : '' }}</div>
                        </div>

                        <div class="grid grid-cols-6 gap-4 mt-5">
                            <div class="col-span-2"><b>เลขบัญชีธนาคาร </b></div>
                            <div v-if="dataUser != null && dataUser.user_bank_accounts && dataUser.user_bank_accounts.length > 0" class="col-span-4">
                                <p v-for="(bank,index) in dataUser.user_bank_accounts" :key="index">
                                    {{bank.bank_account_name}} [ {{bank.bank_account_number}} {{bank.bank_code}} ]
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="lg:grid md:grid-flow-col grid-cols-6">
                        <p class="mt-5"><b>หมายเหตุ</b></p>
                        <div class="col-span-3">
                            <!-- <input v-model="form.remark" type="text" class="mt-4 form-control" placeholder="กรอกหมายเหตุ"> -->
                            <select v-model="form.remark" name="descProofStatement" id="descProofStatement" class="form-select p-2 mt-4 border-gray-300">
                                <option value="">หมายเหตุ</option>
                                <option v-for="(desc,index) in dropdownDescriptProof" 
                                :key="index" 
                                :value="desc.name"
                                >
                                    {{desc.name}}
                                </option>
                            </select>

                            <div v-if="submitCreateStatus == 'ERROR' && !$v.form.remark.required" class="text-red-500 text-xs mt-1">
                                กรุณากรอกหมายเหตุ
                            </div>
                        </div>
                    </div>
                    <p class="text-red-500 text-xs mt-2">*กรุณาค้นหาเบอร์โทรก่อนยืนยันอนุมัติ</p>
                </div>
                <div class="modal-footer text-center">
                    <button class="btn btn-secondary w-24 mr-1 mb-2" data-dismiss="modal" @click="refreshForm()">ปิด</button>
                    <button
                        :class="{
                            'bg-green-500 text-white' : dataUser != null,
                            'bg-gray-300 text-black' : dataUser == null
                        }"
                        :disabled="dataUser == null" 
                        class="btn" 
                        @click="proffStatementDeposit()"
                    >
                        ยืนยันอนุมัติ
                    </button>
                </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>

import moment from 'moment'
import { required } from "vuelidate/lib/validators";

const initForm = () => {
  return {
      phone : '',
      remark : ''
  }
};
export default {
    props : ['dataProffStatement','dropdownDescriptProof','dataUserByPhone','errResponseFindPhone'],
    data() {
        return {
            form : initForm(),
            submitCreateStatus : '',
            statusValidateFindPhone : '',
            dataUser : null,
            validatePhoneNumber : false
        }
    },
    validations : {
        form : {
            phone : {required},
            remark : {required}
        }
    },
    mounted() {
        this.$on('proffStatementDeposit', (callback) => {

            if(callback) {
                this.refreshForm();
            }
            
        })
    },
    watch : {
        dataUserByPhone : 'setDataUser'
    },
    methods : {
        convertDateTime(date) {
            return moment(date).format("YYYY-MM-DD HH:mm:ss")
        },

        proffStatementDeposit() {
            if(
                this.$v.form.phone.$invalid == false && this.$v.form.remark.$invalid == false) {
                    this.$emit('proffStatementDeposit',this.form,this.dataProffStatement)
                } else {
                    this.submitCreateStatus = 'ERROR';
                }
            
        },

        setDataUser(data) {
            this.dataUser = data;
        },

        refreshForm() {
            this.form = initForm();   
            this.submitCreateStatus = '';
        },

        findPhoneNumber() {
            if(this.$v.form.phone.$invalid == false && this.validatePhoneNumber == false) {
                // console.log(this.form.phone);
                this.$emit('findPhoneNumber',this.form.phone)
            } else {
                this.validatePhoneNumber = true;
                this.dataUser = null;
                // this.submitCreateStatus = 'ERROR';
            }
            
        },

        checkValidatePhonenumber() {
            // console.log(this.phone_number);
            if(this.form.phone.length > 10) {
                this.validatePhoneNumber = true;
            } else {
                this.validatePhoneNumber = false;
            }
        },
    }
}
</script>