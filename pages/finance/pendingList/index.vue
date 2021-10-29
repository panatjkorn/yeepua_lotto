<template>
    <div>
        <div class="col-span-12 mt-8">
            <div class="intro-y flex items-center h-10">
                <div>
                    <span class="lg:text-lg"><b>รายการรอชำระเงิน</b></span>
                </div>
                <div class="ml-auto flex">
                    <div class="mr-2">
                        <input v-model="phone" type="text" class="form-control" placeholder="เบอร์โทร" @keyup.enter="getPendingList()">
                    </div>
                    <!-- <div>
                        <input v-model="count_money" type="text" class="form-control" placeholder="จำนวนเงิน" @keyup.enter="getPendingList()">
                    </div> -->
                </div>
            </div>
        </div>
        <div class="col-span-12 mt-2">
            <div class="box p-5 relative overflow-y-hidden">
                <div class="mt-3">
                    <table class="table">
                        <thead>
                            <tr>
                            <th v-for="(col,index) in tbShowPendingList.columns" :key="index" class="border-b-2 dark:border-dark-5 whitespace-nowrap">
                                <b>{{ col.label }}</b>
                            </th>
                            </tr>
                        </thead>
                        <tbody v-if="tbShowPendingList.rows.length > 0">
                            <tr v-for="(data,index) in tbShowPendingList.rows" :key="index" class="border-b dark:border-dark-5">
                                <td>{{index+1}}</td>
                                <td>{{data.created_at}}</td>
                                <td>{{data.phone_number}}</td>
                                <td>
                                    <div v-if="data.user_bank_accounts.length > 0">
                                        <p v-for="(banks,index2) in data.user_bank_accounts" :key="index2">
                                            {{banks.bank_account_name}}
                                            [ {{banks.bank_account_number}} ]
                                        </p>
                                    </div>
                                </td>
                                <td>{{data.credit}}</td>
                                <td>{{data.expire_date_transfer}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <client-only>
            <div class="grid lg:grid-cols-3 gap-4 mt-4">
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
</template>
<script>
import moment from "moment";
export default {
    layout : 'dashboard',
    middleware : ['permission'],
    data() {
        return {
            tbShowPendingList: {
                page: 1,
                columns: [
                  { label: "#"},
                  { label: "วันที่สร้างรายการฝาก"},
                  { label: "โทรศัพท์"},
                  { label: "บัญชีธนาคาร"},
                //   { label: "bank_code"},
                  { label: "จำนวนเงิน"},
                  { label: "วันที่หมดเวลาโอนเงิน"},
                ],
                rows: [],
            },
            count_money : '',
            phone : '',
            currentPage: 1,
            totalItem: 0,
            itemPerPage: 20,
            currentPageApi: 0,
        }
    },
    created() {
        this.getPendingList();
    },
    methods : {
        handleTogglePage() {
            this.currentPageApi = this.currentPage - 1;
            this.getPendingList();
        },

        async getPendingList() {
            const url = `admin_manage_statement/top_up/wait_paymants`;

            const params = {
                phone_number : this.phone,
                credit : this.count_money,
                page: this.currentPageApi,
                limit: this.itemPerPage,
            }


            try {
                const getPendingList = await this.$axios.get(url,{params:params});
                // console.log('getPendingList',getPendingList);
                this.totalItem = getPendingList.data.data.total;
                if(getPendingList.data.data.users && getPendingList.data.data.users.length > 0) {
                    this.tbShowPendingList.rows = getPendingList.data.data.users.map((item) => {
                        // console.log(item);
                        return {
                            created_at: item ? moment(item.created_at).format("YYYY-MM-DD HH:mm") : '',
                            credit: item ? item.credit : '',
                            expire_date_transfer : item ? moment(item.expire_date_transfer).format("YYYY-MM-DD HH:mm") : '',
                            phone_number : item.user ? item.user.phone_number : '',
                            user_bank_accounts : item.user ? item.user.user_bank_accounts : '',
                            user_bank_code : item.user ? item.user.user_bank_accounts : '',
                        }
                    })
                } else {
                    this.tbShowPendingList.rows = []
                }
            } catch(err) {
                console.log(err);
            }
        }
    }
}
</script>