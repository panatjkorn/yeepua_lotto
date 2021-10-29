<template>
    <div>
        <div
            id="modal-create-admin"
            class="modal"
            tabindex="-1"
            aria-hidden="true"
            data-backdrop="static"
      >
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header text-xl">
                        <b>เพิ่มผู้ดูแลระบบ</b>
                    </div>
                        <div class="modal-body py-5 px-24  h-auto">
                            <div class="grid grid-cols-1 gap-4">
                                <div>
                                    <label for=""><b>Username</b></label>
                                    <input v-model="form.username" type="text" class="form-control">
                                    <div v-if="submitCreateStatus == 'ERROR' && !$v.form.username.required" class="text-red-500 text-xs mt-1">
                                        กรุณากรอก Username
                                    </div>
                                </div>
                            </div>
                            <div class="grid grid-cols-2 gap-4 mt-3">
                                <div>
                                    <label for=""><b>Password</b></label>
                                    <div class="input-group">
                                        <input v-model="form.password1" :type="typePassword1" class="form-control">
                                        <div id="input-group-email" class="input-group-text cursor-pointer" @click="isShowPassword1()">
                                            <EyeIcon v-if="showPassword1 == false" class="w-4 h-4" />
                                            <EyeOffIcon v-if="showPassword1" class="w-4 h-4" />
                                        </div>
                                    </div>
                                    <div v-if="submitCreateStatus == 'ERROR' && !$v.form.password1.required" class="text-red-500 text-xs mt-1">
                                        กรุณากรอก Password
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
                                    <div v-if="submitCreateStatus == 'ERROR' && !$v.form.password2.required" class="text-red-500 text-xs mt-1">
                                        กรุณากรอก Password
                                    </div>
                                    <div v-if="!$v.form.password2.sameAsPassword" class="text-red-500 text-xs">รหัสผ่านไม่ถูกต้อง</div>
                                </div>
                            </div>
                            <div class="grid grid-cols-1 gap-4 mt-3">
                                <div>
                                    <label for=""><b>สิทธิ์การใช้งานระบบ</b></label>
                                    <MazSelect
                                        v-model="form.arrayPermission"
                                        :options="optionsMultiple"
                                        multiple
                                        clearable
                                        search
                                        search-placeholder="สิทธิ์การใช้งาน"
                                        size="sm"
                                        color="primary"
                                    >
                                        <i
                                        slot="icon-left"
                                        class="material-icons"
                                        >
                                        add_circle_outline
                                        </i>
                                    </MazSelect>
                                    <div v-if="submitCreateStatus == 'ERROR' && !$v.form.arrayPermission.required" class="text-red-500 text-xs mt-1">
                                        กรุณาระบุสิทธิ์การใช้งาน
                                    </div>
                                    <!-- <select name="" id="" class="form-select">
                                        <option value="">สิทธิ์การใช้งานระบบ</option>
                                        <option v-for="(permission,index) in dataPermission" :key="index" :value="permission.id">
                                            {{permission.detail}}
                                        </option>
                                    </select> -->
                                </div>
                            </div>
                            <div class="grid grid-cols-1 gap-4 mt-3">
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
                            </div>
                        </div>
                    <div class="modal-footer px-24">
                        <button class="btn btn-secondary w-24 mr-1 mb-2" data-dismiss="modal" @click="refreshForm()">
                            ยกเลิก
                        </button>
                        <button class="btn bg-blue-500 text-white" @click="modalConfirmCreateAdmin()">เพิ่มผู้ดูแลระบบ</button>
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
    props : ['dataPermission','dataPosition','modalCreateType'],
    data() {
        return {
            showPassword1 : false,
            showPassword2 : false,
            typePassword1 : 'password',
            typePassword2 : 'password',
            optionsMultiple: [],
            form : {
                username : '',
                password1 : '',
                password2 : '',
                arrayPermission : [],
                position : ''
            },
            submitCreateStatus : '',
        }
    },
    validations : {
        form : {
            username : {required},
            password1 : {required},
            password2 : {required,sameAsPassword: sameAs('password1')},
            arrayPermission : {required},
            position : {required},
        },
    },
    watch : {
        dataPermission : 'setDataDropdownPermission'
    },
    created() {
        this.$on('modalComfirmCreateAdmin', (callback) => {

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

        setDataDropdownPermission(permission) {
            this.optionsMultiple = []
            if(permission.length > 0) {
                for(let i = 0; i < permission.length; i++) {

                    const _data = {
                        label: permission[i].detail , value: permission[i].id
                    }
                    this.optionsMultiple.push(_data);
                }
            }
        },

        modalConfirmCreateAdmin() {
            // console.log(this.$v.form.password2);
            if(this.modalCreateType == 'create') {
                if(
                    this.$v.form.username.$invalid == false && 
                    this.$v.form.password1.$invalid == false && 
                    this.$v.form.password2.$invalid == false && 
                    this.$v.form.arrayPermission.$invalid == false && 
                    this.$v.form.position.$invalid == false
                ) {
                    if(this.$v.form.password2.sameAsPassword) {

                        const _data = {
                            username : this.form.username,
                            password : this.form.password1,
                            permissions : this.form.arrayPermission,
                            position_id : this.form.position
                        }

                        // console.log('_data',_data);
                        this.$emit('modalComfirmCreateAdmin',_data);
                    }
                    
                } else {
                    this.submitCreateStatus = 'ERROR';
                }
            }
            
        },

        refreshForm() {
            this.form.username = ''
            this.form.password1 = ''
            this.form.password2 = ''
            this.form.arrayPermission = []
            this.form.position = ''
            this.submitCreateStatus = ''
            this.showPassword1 = false
            this.showPassword2 = false
            this.typePassword1 = 'password'
            this.typePassword2 = 'password'
        }
        
    }
}
</script>