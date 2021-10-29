<template>
    <div>
        <div class="col-span-12 mt-5">
            <div class="box p-5 relative overflow-y-hidden">
                <div class="py-3">
                    <div class="flex">
                        <span class="lg:text-lg"><b>รายการฝากเงินที่ไม่สำเร็จ</b></span>
                        <div class="ml-auto">
                            <div class="flex">
                                <select v-model="search_type" name="" id="" 
                                    class="form-select box lg:w-auto w-auto mt-5 lg:mt-0 mr-auto mr-2">
                                    <option value="">ทั้งหมด</option>
                                    <option value="1">เบอร์โทร</option>
                                    <option value="2">จำนวนเงิน</option>
                                </select>
                                <input 
                                    v-if="search_type == 1" 
                                    v-model="search_phone" type="text" 
                                    placeholder="ค้นหาเบอร์โทรศัพท์" 
                                    class="border-gray-400 form-control" 
                                    @keyup.enter="getDataUserWithdrawFaild()"
                                >
                                <input 
                                    v-else-if="search_type == 2" 
                                    v-model="search_credit" type="text" 
                                    placeholder="ค้นหาจำนวนเงิน" 
                                    class="border-gray-400 form-control" 
                                    @keyup.enter="getDataUserWithdrawFaild()"
                                >
                            </div>
                        </div>
                    </div>
                    <table class="table mt-5">
                        <thead>
                        <tr>
                            <th v-for="(col,index) in tbUserDopositFaild.columns" :key="index" class="border-b-2 dark:border-dark-5 whitespace-nowrap">
                                <b>{{ col.label }}</b>
                            </th>
                        </tr>
                        </thead>
                        <tbody v-if="tbUserDopositFaild.rows.length > 0">
                            <tr v-for="(data,index) in tbUserDopositFaild.rows" :key="index" :class="{'bg-gray-200 dark:bg-dark-1' : index%2 == 0}">
                                <td>{{ data.num }}</td>
                                <td>{{ data.create_at }}</td>
                                <td>{{ data.phone }}</td>
                                <td>
                                    <div v-if="data.bank_account.length > 0">
                                        <p v-for="(bank,index) in data.bank_account" :key="index">
                                            {{ bank ? bank.bank_account_name : '' }}
                                            [
                                                {{ bank ? bank.bank_account_number : '' }}
                                                {{ bank ? bank.bank_code : '' }}
                                            ]
                                        </p>
                                    </div>
                                </td>
                                <td>{{ data.credit }}</td>
                                <td>{{ data.expire_date_transfer }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <client-only>
                <div class="grid lg:grid-cols-3 gap-4 mt-3">
                    <t-pagination
                        v-model="currentPage"
                        :total-items="totalItem"
                        :per-page="itemPerPage"
                        :limit="7"
                        :disabled="false"
                        @input="handleTogglePage()"
                    />
                </div>
            </client-only>
        </div>
    </div>
</template>
<script>
import moment from "moment";
export default {
    layout : 'dashboard',
    middleware : ['permission'],
    data() {
        return {
            tbUserDopositFaild: {
                page: 1,
                columns: [
                    { label: "#"},
                    { label: "วันที่สร้างรายการฝาก"},
                    { label: "โทรศัพท์"},
                    { label: "บัญชีธนาคาร"},
                    { label: "จำนวนเงิน"},
                    { label: "วันที่หมดเวลาโอนเงิน"},
                ],
                rows: [],
            },
            search_type : '',
            search_phone : '',
            search_credit : '',
            currentPage: 1,
            totalItem: 0,
            itemPerPage: 20,
            currentPageApi: 0,
        }
    },
    created() {
        this.getDataUserWithdrawFaild();
    },
    watch : {
        search_type : 'setFormFilter'
    },
    methods : {
        async handleTogglePage() {
            this.currentPageApi = this.currentPage - 1;
            this.getDataUserWithdrawFaild();
        },
        async getDataUserWithdrawFaild() {
            const url = `admin_manage_statement/top_up/fails`

            const params = {
                page: this.currentPageApi,
                limit: this.itemPerPage,
                phone_number : this.search_phone,
                credit : this.search_credit,
            }

            try {
                const getUserWithdrawFaild = await this.$axios.get(url,{params:params});
                // console.log('getUserWithdrawFaild',getUserWithdrawFaild);
                this.totalItem = getUserWithdrawFaild.data.data.total;
                this.tbUserDopositFaild.rows = getUserWithdrawFaild.data.data.users.map((item,index) => {
                    // console.log(item);
                    return {
                        num : index+1,
                        create_at : item ? moment(item.created_at).format("YYYY-MM-DD HH:mm") : '',
                        phone : item.user ? item.user.phone_number : '',
                        bank_account : item.user ? item.user.user_bank_accounts : '',
                        credit : item ? item.credit : '',
                        expire_date_transfer : item ? moment(item.expire_date_transfer).format("YYYY-MM-DD HH:mm") : '',
                    }
                })
            } catch(err) {
                console.log(err);
            }
        },
        setFormFilter() {
            this.search_phone = ''
            this.search_credit = ''
            this.getDataUserWithdrawFaild();
        }
    }
}
</script>