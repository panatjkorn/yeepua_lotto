<template>
    <div>
        <div
            id="modal-add-bonus"
            class="modal"
            tabindex="-1"
            aria-hidden="true"
            data-backdrop="static"
      >
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header text-xl">
                        <b>เพิ่มโบนัส</b>
                        <!-- <pre>{{dataUser}}</pre> -->
                    </div>
                        <div class="modal-body py-5 px-24 overflow-y-auto h-auto">
                            <div class="flex">
                                <div class="flex-grow">
                                    <input v-model="phone_number" type="text" class="form-control"
                                        placeholder="ค้นหาเบอร์โทร..."
                                        @input="checkValidatePhonenumber()" 
                                        @keyup.enter="findPhoneNumberUser()">
                                    <div v-if="submitCreateStatus == 'ERROR' && !$v.phone_number.required || validatePhoneNumber == true" class="text-red-500 text-xs mt-1">
                                        กรุณากรอกหมายเลขโทรศัพท์ให้ถูกต้อง
                                    </div>
                                    <div v-if="errResponseFindPhone" class="text-red-500 text-xs mt-1">{{errResponseFindPhone}}</div>
                                    
                                </div>
                                <div class="flex-none w-16 ml-2">
                                    <button class="btn bg-blue-500 text-white" @click="findPhoneNumberUser()">ค้นหา</button>
                                </div>  
                            
                            </div>

                            <div v-if="dataUser != null">
                                <div class="grid grid-cols-3 gap-4 mt-5">
                                    <div><b>ชื่อผู้ใช้งาน : </b></div>
                                    <div>
                                        {{dataUser.user_bank_accounts && dataUser.user_bank_accounts[0] ? 
                                        dataUser.user_bank_accounts[0].bank_account_name : ''}}
                                    </div>
                                </div>

                                <div class="grid grid-cols-3 gap-4 mt-5">
                                    <div><b>เบอร์โทร : </b></div>
                                    <div>{{ dataUser ? dataUser.phone_number : '' }}</div>
                                </div>

                                <div class="grid grid-cols-3 gap-4 mt-5">
                                    <div><b>เลขบัญชีธนาคาร : </b></div>
                                    <div v-if="dataUser != null && dataUser.user_bank_accounts && dataUser.user_bank_accounts.length > 0" class="col-span-2">
                                        <p v-for="(bank,index) in dataUser.user_bank_accounts" :key="index">
                                            {{bank.bank_account_name}} [ {{bank.bank_account_number}} {{bank.bank_code}} ]
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div v-if="dataUser != null" class="grid grid-flow-col grid-cols-2 gap-4 mt-3">
                                <div>
                                    <input v-model="formAddBonus.credit" type="number" class="form-control" placeholder="จำนวนโบนัส" min="0">
                                    <div v-if="submitAddBonusStatus == 'ERROR' && !$v.formAddBonus.credit.required" class="text-red-500 text-xs mt-1">
                                        กรุณากรอกจำนวนโบนัส
                                    </div>
                                </div>
                                <div>
                                    <select v-model="formAddBonus.remark" name="" id="" class="form-select">
                                        <option value="">หมายเหตุ</option>
                                        <option v-for="(descript,index) in descriptAddBonus" :key="index" :value="descript.name">
                                            {{descript.name}}
                                        </option>
                                    </select>
                                    <div v-if="submitAddBonusStatus == 'ERROR' && !$v.formAddBonus.remark.required" class="text-red-500 text-xs mt-1">
                                        กรุณาเลือกหมายเหตุ
                                    </div>
                                </div>
                            </div>
                        </div>
                    <div class="modal-footer px-24">
                            <button class="btn btn-secondary w-24 mr-1 mb-2" data-dismiss="modal" @click="refreshForm()">
                                ยกเลิก
                            </button>
                            <button class="btn bg-blue-500 text-white" @click="modalConfirmAddBonus()">เพิ่มโบนัส</button>
                            <!-- <button class="btn bg-blue-500 text-white" @click="confirmCreateTemplate()">บันทึก</button> -->
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { required } from "vuelidate/lib/validators";
export default {
    props : ['dataUserByPhone','descriptAddBonus','formAddBonus','errResponseFindPhone'],
    data() {
        return {
            phone_number : '',
            dataUser : null,
            submitCreateStatus : '',
            submitAddBonusStatus : '',
            validatePhoneNumber : false
        }
    },
    validations : {
        formAddBonus : {
            remark : {required},
            credit : {required},
        },
        phone_number : {required},
    },
    watch : {
        dataUserByPhone : 'setDataUser'
    },
    created() {
        this.$on('modalConfirmAddBonus', (callback) => {

            if(callback) {
                this.refreshForm();
            }
            
        })
    },
    methods : {
        findPhoneNumberUser() {
            if(this.$v.phone_number.$invalid == false && this.validatePhoneNumber == false) {
                this.$emit('findPhoneNumber',this.phone_number)
            } else {
                this.submitCreateStatus = 'ERROR';
                this.dataUser = null;
            }
            
        },

        checkValidatePhonenumber() {
            // console.log(this.phone_number);
            if(this.phone_number.length > 10) {
                this.validatePhoneNumber = true;
            } else {
                this.validatePhoneNumber = false;
            }
        },
        
        setDataUser(data) {
            this.dataUser = data;
        },
        refreshForm() {
            this.phone_number = '';
            this.dataUser = null;
            this.submitCreateStatus = '';
            this.submitAddBonusStatus = '';
        },
        modalConfirmAddBonus() {
            if(this.dataUser != null) {
                if(
                    this.$v.formAddBonus.remark.$invalid == false &&
                    this.$v.formAddBonus.credit.$invalid == false
                ) {
                    this.$emit('modalConfirmAddBonus',this.formAddBonus)
                } else {
                    this.submitAddBonusStatus = 'ERROR';
                }
            }
        }
    }
}
</script>