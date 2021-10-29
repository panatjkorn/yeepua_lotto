<template>
    <div>
        <!-- หวยรัฐบาล -->
        <div
            id="modal-manage-result-lottery-slark"
            class="modal"
            tabindex="-1"
            aria-hidden="true"
            data-backdrop="static"
        >
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header text-lg">
                        <b>จัดการผลรางวัล</b>
                        <div class="flex">
                            <svg v-if="statusLoading == true" width="20" viewBox="0 0 57 57" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 ml-2">
                                <g fill="none" fill-rule="evenodd"><g transform="translate(1 1)"><circle cx="5" cy="50" r="5" fill="#2d3748">
                                <animate attributeName="cy" begin="0s" dur="2.2s" values="50;5;50;50" calcMode="linear" repeatCount="indefinite">
                                </animate><animate attributeName="cx" begin="0s" dur="2.2s" values="5;27;49;5" calcMode="linear" repeatCount="indefinite"></animate>
                                </circle><circle cx="27" cy="5" r="5" fill="#2d3748"><animate attributeName="cy" begin="0s" dur="2.2s" from="5" to="5" values="5;50;50;5" calcMode="linear" repeatCount="indefinite">
                                    </animate><animate attributeName="cx" begin="0s" dur="2.2s" from="27" to="27" values="27;49;5;27" calcMode="linear" repeatCount="indefinite">
                                    </animate></circle><circle cx="49" cy="50" r="5" fill="#2d3748"><animate attributeName="cy" begin="0s" dur="2.2s" values="50;50;5;50" calcMode="linear" repeatCount="indefinite">
                                    </animate><animate attributeName="cx" from="49" to="49" begin="0s" dur="2.2s" values="49;5;27;49" calcMode="linear" repeatCount="indefinite"></animate></circle></g></g>
                            </svg>
                        </div>
                    </div>
                    <div class="modal-body py-5 px-10 overflow-y-auto h-auto">
                        <!-- หวยรัฐบาล -->
                        <div v-if="formSlark.length > 0">
                            <div v-for="(slark,index) in formSlark" :key="index" class="mt-2">
                                <label for="" >
                                    <b>{{slark ? slark.name : ''}} : </b>
                                </label>
                                <div 
                                    class="grid grid-flow-row auto-rows-max  grid-cols-4 md:grid-cols-8 mt-2">
                                        <div v-for="(form,index2) in slark.arraySlark" :key="index2" class="mr-2 mt-2">
                                            <input
                                                :class="{'border-red-500': validateNumberLotto[index].arrayVa[index2] == true}"
                                                v-model="dataFormSlark[index].arraySlark[index2]" 
                                                type="text" 
                                                @input="checkValidateLottoSlark(index,index2)"
                                                class="form-control border focus:outline-none"
                                            >
                                        </div>
                                </div>
                            </div>
                        </div>
                    </div>
                <div class="modal-footer">
                    <button class="btn bg-green-500 text-white mr-1" @click="getResultLotterySlark()">ดึงข้อมูลหวย</button>
                    <button class="btn btn-secondary w-24 mr-1 mb-2" data-dismiss="modal">
                    ปิด
                    </button>
                    <button class="btn bg-blue-500 text-white w-24 mr-1 mb-2" @click="confirmManageResultLottoSlark()">
                    บันทึก
                    </button>
                </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props : ['formSlark','dataSlark','statusLoading','validateNumberLotto'],
    data() {
        return {
            dataFormSlark : '',
            submitCreateStatus : [],
        }
    },
    watch : {
        formSlark : 'setFormSlark',
        dataSlark : 'setDataSlark'
    },
    methods : {
        setFormSlark(form) {
            this.dataFormSlark = form;
            // console.log('dataFormSlark',this.dataFormSlark);
        },
        confirmManageResultLottoSlark() {
            let checkNumLottoValidate = [];
            
            for(let i = 0; i < this.dataFormSlark.length; i++) {
                
                for(let i2 = 0; i2 < this.dataFormSlark[i].arraySlark.length; i2++) {

                    if(!this.dataFormSlark[i].arraySlark[i2].length > 0) {

                        this.validateNumberLotto[i].arrayVa.splice(i2,1,true);

                    }
                }
            }
            
            for(let i = 0; i < this.validateNumberLotto.length; i++) {

                for(let i2 = 0; i2 < this.validateNumberLotto[i].arrayVa.length; i2++) {
                    checkNumLottoValidate.push(this.validateNumberLotto[i].arrayVa[i2]);
                }
            }
            // console.log('checkNumLottoValidate',checkNumLottoValidate);
             if(checkNumLottoValidate.includes(true)) {
                    // console.log('not ok');
                    
                } else {
                    // console.log('ok');
                    // console.log('xxxxxxxx',checkNumLottoValidate.includes(true));
                    this.$emit('confirmManageResultLottoSlark',this.dataFormSlark)
                }  

            
            
        },
        getResultLotterySlark() {
            this.$emit('getResultLotterySlark');
        },
        setDataSlark(data) {
            let setDataSlark = false;
            // รางวัลที่ 1
            this.dataFormSlark[0].arraySlark.splice(0,1,data.first[0]);

            for(let i = 0; i < data.near1.length; i++) {
                this.dataFormSlark[1].arraySlark.splice(i,1,data.near1[i]);
            }
            
            for(let i = 0; i < data.second.length; i++) {
                this.dataFormSlark[2].arraySlark.splice(i,1,data.second[i]);
            }

            for(let i = 0; i < data.third.length; i++) {
                this.dataFormSlark[3].arraySlark.splice(i,1,data.third[i]);
            }
            
            for(let i = 0; i < data.fourth.length; i++) {
                this.dataFormSlark[4].arraySlark.splice(i,1,data.fourth[i]);
            }

            for(let i = 0; i < data.fifth.length; i++) {
                this.dataFormSlark[5].arraySlark.splice(i,1,data.fifth[i]);
            }

            for(let i = 0; i < data.last3f.length; i++) {
                this.dataFormSlark[6].arraySlark.splice(i,1,data.last3f[i]);
            }

            for(let i = 0; i < data.last3b.length; i++) {
                this.dataFormSlark[7].arraySlark.splice(i,1,data.last3b[i]);
            }

            for(let i = 0; i < data.last2.length; i++) {
                this.dataFormSlark[8].arraySlark.splice(i,1,data.last2[i]);
            }
            
            setDataSlark = true;
            if(setDataSlark == true) {
                //เช็ค validate ตอน set data
                for(let i = 0; i < this.dataFormSlark.length; i++) {
                    
                    for(let i2 = 0; i2 < this.dataFormSlark[i].arraySlark.length; i2++) {

                        if(!this.dataFormSlark[i].arraySlark[i2].length > 0) {

                            this.validateNumberLotto[i].arrayVa.splice(i2,1,true);

                        } else {
                            this.validateNumberLotto[i].arrayVa.splice(i2,1,false);
                        }
                    }
                }
            }
            

        },
        checkValidateLottoSlark(index,index2) {
            // console.log(index);
            // console.log(this.dataFormSlark);
            let firstPrize = this.dataFormSlark && this.dataFormSlark[0] ? 
                this.dataFormSlark[0].arraySlark : '';

            let near1 = this.dataFormSlark && this.dataFormSlark[1] ? 
                this.dataFormSlark[1].arraySlark : '';

            let secound = this.dataFormSlark && this.dataFormSlark[2] ? 
                this.dataFormSlark[2].arraySlark : '';

            let third = this.dataFormSlark && this.dataFormSlark[3] ? 
                this.dataFormSlark[3].arraySlark : '';

            let fourth = this.dataFormSlark && this.dataFormSlark[4] ? 
                this.dataFormSlark[4].arraySlark : '';
            
            let fifth = this.dataFormSlark && this.dataFormSlark[5] ? 
                this.dataFormSlark[5].arraySlark : '';

            let first_three_prize = this.dataFormSlark && this.dataFormSlark[6] ? 
                this.dataFormSlark[6].arraySlark : '';

            let last_three_prize = this.dataFormSlark && this.dataFormSlark[7] ? 
                this.dataFormSlark[7].arraySlark : '';

            let last_two_prize = this.dataFormSlark && this.dataFormSlark[8] ? 
                this.dataFormSlark[8].arraySlark : '';

            if(index == 0) {
                if(firstPrize[index2].length != 6) {
                    this.validateNumberLotto[index].arrayVa[index2] = true;
                } else {
                    this.validateNumberLotto[index].arrayVa[index2] = false;
                }
            }
            
            if(index == 1) {
                for(let i = 0; i < near1.length; i++) {
                    if(near1[index2].length != 6) {
                        this.validateNumberLotto[index].arrayVa[index2] = true;
                    } else {
                        this.validateNumberLotto[index].arrayVa[index2] = false;
                    }
                }
            }

            if(index == 2) {
                for(let i = 0; i < secound.length; i++) {
                    if(secound[index2].length != 6) {
                        this.validateNumberLotto[index].arrayVa[index2] = true;
                    } else {
                        this.validateNumberLotto[index].arrayVa[index2] = false;
                    }
                }
            }

            if(index == 3) { 
                for(let i = 0; i < third.length; i++) {
                    if(third[index2].length != 6) {
                        this.validateNumberLotto[index].arrayVa[index2] = true;
                    } else {
                        this.validateNumberLotto[index].arrayVa[index2] = false;
                    }
                }
            }

            if(index == 4) {
                for(let i = 0; i < fourth.length; i++) {
                    if(fourth[index2].length != 6) {
                        this.validateNumberLotto[index].arrayVa[index2] = true;
                    } else {
                        this.validateNumberLotto[index].arrayVa[index2] = false;
                    }
                }
            }
            
            if(index == 5) {
                for(let i = 0; i < fifth.length; i++) {
                    if(fifth[index2].length != 6) {
                        this.validateNumberLotto[index].arrayVa[index2] = true;
                    } else {
                        this.validateNumberLotto[index].arrayVa[index2] = false;
                    }
                }
            } 
            
            if(index == 6) {
                for(let i = 0; i < first_three_prize.length; i++) {
                    if(first_three_prize[index2].length != 3) {
                        this.validateNumberLotto[index].arrayVa[index2] = true;
                    } else {
                        this.validateNumberLotto[index].arrayVa[index2] = false;
                    }
                }
            }
            
            if(index == 7) {
                for(let i = 0; i < last_three_prize.length; i++) {
                    if(last_three_prize[index2].length != 3) {
                        this.validateNumberLotto[index].arrayVa[index2] = true;
                    } else {
                        this.validateNumberLotto[index].arrayVa[index2] = false;
                    }
                }
            }
            
            if(index == 8) {
                for(let i = 0; i < last_two_prize.length; i++) {
                    if(last_two_prize[index2].length != 2) {
                        this.validateNumberLotto[index].arrayVa[index2] = true;
                    } else {
                        this.validateNumberLotto[index].arrayVa[index2] = false;
                    }
                }
            } 
        }
    }
}
</script>