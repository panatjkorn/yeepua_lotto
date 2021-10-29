<template>
    <div>
        <div
            id="modal-edit-profile"
            class="modal"
            tabindex="-1"
            aria-hidden="true"
            data-backdrop="static"
      >
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header text-xl">
                        <b>แก้ไขข้อมูลส่วนตัว</b>
                    </div>
                        <div class="modal-body py-5 px-24  h-auto">
                            <div class="grid grid-cols-2 gap-2">
                                <div>
                                    <label for=""><b>ชื่อ Profile</b></label>
                                    <input v-model="form.name_profile"  type="text" class="form-control">
                                </div>

                                <div>
                                    <label for=""><b>เบอร์โทร</b></label>
                                    <input v-model="form.phone_number" type="text" class="form-control">
                                </div>

                                <!-- <div>
                                    <label for=""><b>อีเมลล์</b></label>
                                    <input v-model="form.email" type="text" class="form-control">
                                </div> -->

                                <div>
                                    <label for=""><b>Username</b></label>
                                    <input v-model="form.username" type="text" class="form-control">
                                    <div v-if="submitCreateStatus == 'ERROR' && !$v.form.username.required" class="text-red-500 text-xs mt-1">
                                        กรุณากรอก Username
                                    </div>
                                </div>

                                <div>
                                    <label for=""><b>เพศ</b></label>
                                    <select v-model="form.gender_id" name="select-gender-admin" id="select-gender-admin" class="form-select">
                                        <option value="">เลือกเพศ</option>
                                        <option v-for="(gender,index) in genderAdmin" :key="index" :value="gender.id">
                                            {{gender.gender_detail}}
                                        </option>
                                    </select>
                                </div>
                     
                            </div>
                            

                            <!-- <div class="grid grid-cols-2 gap-4 mt-3">

                                <div>
                                    <label for=""><b>Username</b></label>
                                    <input v-model="form.username" type="text" class="form-control">
                                    <div v-if="submitCreateStatus == 'ERROR' && !$v.form.username.required" class="text-red-500 text-xs mt-1">
                                        กรุณากรอก Username
                                    </div>
                                </div>

                                <div>
                                    <label for=""><b>ตำแหน่ง</b></label>
                                    <select v-model="form.position" name="position_admin" id="position_admin" class="form-select">
                                        <option value="">ตำแหน่ง</option>
                                        <option v-for="(position,index) in dataPosition" :key="index" :value="position.id">
                                            {{position.name}}
                                        </option>
                                    </select>
                                    <div v-if="submitCreateStatus == 'ERROR' && !$v.form.position.required" class="text-red-500 text-xs mt-1">
                                        กรุณาระบุตำแหน่ง
                                    </div>
                                </div>
                            </div> -->

                            <div class=" mt-3 inline-flex">
                                <input v-model="isChangePassword" type="checkbox" class="form-check mr-1" 
                                    @input="isChangePasswordStatus()">
                                <label for=""><b>เปลี่ยนพาสเวิร์ด</b></label>
                            </div>
                            
                            <div v-if="isChangePassword" class="grid grid-cols-1 gap-4 mt-3">
                                <div>
                                    <label for=""><b>Password เดิม</b></label>
                                    <div class="input-group">
                                        <input v-model="form.oldpassword" :type="typeOldPassword" class="form-control">
                                        <div id="input-group-email" class="input-group-text cursor-pointer" @click="isShowOldPassword()">
                                            <EyeIcon v-if="showOldPassword == false" class="w-4 h-4" />
                                            <EyeOffIcon v-if="showOldPassword" class="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-if="isChangePassword" class="grid grid-cols-2 gap-4 mt-3">
                                <div>
                                    <label for=""><b>Password</b></label>
                                    <div class="input-group">
                                        <input v-model="form.password1" :type="typePassword1" class="form-control">
                                        <div id="input-group-email" class="input-group-text cursor-pointer" @click="isShowPassword1()">
                                            <EyeIcon v-if="showPassword1 == false" class="w-4 h-4" />
                                            <EyeOffIcon v-if="showPassword1" class="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label for=""><b>Confirm Password</b></label>
                                    <div class="input-group">
                                        <input v-model="form.password2" :type="typePassword2" class="form-control">
                                        <div id="input-group-email" class="input-group-text cursor-pointer" @click="isShowPassword2()">
                                            <EyeIcon v-if="showPassword2 == false" class="w-4 h-4" />
                                            <EyeOffIcon v-if="showPassword2" class="w-4 h-4" />
                                        </div>
                                    </div>
                                    <div v-if="!$v.form.password2.sameAsPassword" class="text-red-500 text-xs">รหัสผ่านไม่ถูกต้อง</div>
                                </div>
                            </div>
                        
                        </div>
                    <div class="modal-footer px-24">
                        <button class="btn btn-secondary w-24 mr-1 mb-2" data-dismiss="modal" @click="refreshForm()">
                            ยกเลิก
                        </button>
                        <button class="btn bg-blue-500 text-white" @click="modalConfirmEditProfileAdmin()">แก้ไขข้อมูลส่วนตัว</button>
                        <!-- <button class="btn bg-blue-500 text-white" @click="confirmCreateTemplate()">บันทึก</button> -->
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { required,sameAs } from "vuelidate/lib/validators";
export default {
    props : ['genderAdmin','dataProfileAdmin'],
    data() {
        return {
            showOldPassword : false,
            showPassword1 : false,
            showPassword2 : false,
            typeOldPassword : 'password',
            typePassword1 : 'password',
            typePassword2 : 'password',
            optionsMultiple: [],
            form : {
                username : '',
                oldpassword : '',
                password1 : '',
                password2 : '',
                name_profile : '',
                phone_number : '',
                email : '',
                gender_id : '',
                admin_id : ''
            },
            isChangePassword : false,
            submitCreateStatus : '',
        }
    },
    validations : {
        form : {
            username : {required},
            password2 : {sameAsPassword: sameAs('password1')},
        },
    },
    watch : {
        dataProfileAdmin : 'setDataProfileAdmin',
    },
    created() {
        this.$on('modalConfirmEditProfileAdmin', (callback) => {

            if(callback) {
                this.refreshForm();
            }
            
        })
    },
    methods : {
        isShowPassword1() {
            this.showPassword1 = !this.showPassword1;
            this.showPassword1 == false ? this.typePassword1 = 'password' : this.typePassword1 = 'text'
        },

        isShowPassword2() {
            this.showPassword2 = !this.showPassword2;
            this.showPassword2 == false ? this.typePassword2 = 'password' : this.typePassword2 = 'text'
        },

        isShowOldPassword() {
            this.showOldPassword = !this.showOldPassword;
            this.showOldPassword == false ? this.typeOldPassword = 'password' : this.typeOldPassword = 'text'
        },

        modalConfirmEditProfileAdmin() {
            // console.log(this.$v.form.password2);

            if(
                this.$v.form.username.$invalid == false
            ) {
                if(this.$v.form.password2.sameAsPassword) {

                    const _data = {
                        name_profile : this.form.name_profile,
                        phone_number : this.form.phone_number,
                        email : this.form.email,
                        gender_id : this.form.gender_id,
                        username : this.form.username,
                        old_password : this.form.oldpassword.length > 0 ? this.form.oldpassword : null,
                        new_password : this.form.password1.length > 0 ? this.form.password1 : null
                    }

                    // console.log('_data',_data);
                    this.$emit('modalConfirmEditProfileAdmin',_data);
                }
                
            } else {
                this.submitCreateStatus = 'ERROR';
            }
            
            
        },

        refreshForm() {
            this.form.username = ''
            this.form.password1 = ''
            this.form.password2 = ''
            this.form.name_profile = ''
            this.form.phone_number = ''
            this.form.email = ''
            this.form.gender_id = ''
            this.form.admin_id = ''
            this.isChangePassword = false
            this.submitCreateStatus = ''
            this.showPassword1 = false
            this.showPassword2 = false
            this.showOldPassword = false
            this.typePassword1 = 'password'
            this.typePassword2 = 'password'
            this.typeOldPassword = 'password'
        },

        setDataProfileAdmin(data) {
            // console.log('data',data);
            this.form.username = data.username,
            this.form.oldpassword = '';
            this.form.password1 = '',
            this.form.password2 = '',
            this.form.name_profile = data.name_profile,
            this.form.phone_number = data.phone_number,
            // this.form.email = data.email,
            this.form.gender_id = data.gender_id
            this.form.admin_id = data.id
        },

        isChangePasswordStatus() {
            this.isChangePassword = !this.isChangePassword; 
        }

        // setFormAdminProfile(data) {
        //     this.form.username = data.username,
        //     this.form.password1 = data.password1,
        //     this.form.password2 = data.password2,
        //     this.form.arrayPermission = data.arrayPermission,
        //     this.form.position = data.position,
        //     this.form.name_profile = data.name_profile,
        //     this.form.phone_number = data.phone_number,
        //     this.form.email = data.email,
        //     this.form.gender_id = data.gender_id
        // }
        
    }
}
</script>