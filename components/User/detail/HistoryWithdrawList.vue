<template>
    <div>
        <b class="text-xl">ประวัติการถอนเงิน</b>
        <div class="box grid justify-self-center p-5 lg:px-5 mt-3 overflow-x-auto">
            <div class="grid-cols-5 ml-auto">
                <select v-model="filterStatus" 
                    name="filterWithdrawList" id="filterWithdrawList" 
                    class="form-select box border border-gray-300"
                    @change="filterWithdrawList()">
                    <option value="">สถานะทั้งหมด</option>
                    <option v-for="(status,index) in dropdownStatusWithdraw" :key="index" :value="status.id" 
                        >
                        {{status.status_detail}}
                    </option>
                </select>
            </div>
            <client-only>
                <table class="table mt-5 mb-5">
                    <thead>
                        <tr>
                            <th v-for="(col,index) in tbWithdrawList.columns" :key="index" class="border-b-2 dark:border-dark-5 whitespace-nowrap" :class="col.color">
                                <b>{{ col.label }}</b>
                            </th>
                        </tr>
                    </thead>
                    <tbody v-if="tbWithdrawList.rows.length > 0">
                        <tr v-for="(data,index) in tbWithdrawList.rows" :key="index">
                            <td>{{ index+1 }}</td>
                            <td>{{ data.created_at }}</td>
                            <td>{{ data.credit }}</td>
                            <td>{{ data.status_withdraw }}</td>
                            <td>{{ data.phone }}</td>
                            <td>
                                <!-- {{ data.bank_account }} -->
                                <div v-if="data.bank_account">
                                        {{data.bank_account.bank_account_name}} [ {{data.bank_account.bank_account_number}} {{data.bank_account.bank_code}} ]
                                </div>
                            </td>
                            <td>{{ data.admin }}</td>
                        </tr>
                    </tbody>
                </table>
            </client-only>
        </div>
    </div>
</template>
<script>
import moment from "moment";
export default {
    props : ['dataWithdrawList','dropdownStatusWithdraw','filterStatusWithdraw'],
    data() {
        return {
            tbWithdrawList: {
                page: 1,
                columns: [
                    { label: "#"},
                    { label: "วันที่"},
                    { label: "จำนวนเงิน"},
                    { label: "สถานะถอนเงิน"},
                    { label: "เบอร์โทร"},
                    { label: "บัญชีธนาคาร"},
                    { label: "ผู้ดูแลระบบ"},
                ],
                rows: [],
            },
            filterStatus : ''
        }
    },
    watch : {
        dataWithdrawList : 'setDataWithdrawList',
        filterStatusWithdraw : 'setDataFilter'
    },
    methods : {
        setDataWithdrawList(data) {
            // console.log('data',data);
            this.tbWithdrawList.rows = data.user_withdraws.map((item) => {
                // console.log(item.user_bank_account);
                return {
                    created_at : item.created_at ? moment(item.created_at).format("YYYY-MM-DD HH:mm") : '',
                    credit : item.credit,
                    status_withdraw : item.user_withdraw_status ? item.user_withdraw_status.status_detail : '',
                    phone : item.user ? item.user.phone_number : '',
                    bank_account : item.user_bank_account ? item.user_bank_account : '',
                    admin : item.admin ? item.admin.name_profile : ''
                }
            })
        },
        setDataFilter(status_id) {
            this.filterStatus = status_id;
        },
        filterWithdrawList() {
            this.$emit('filterWithdrawList',this.filterStatus)
        }
    }
}
</script>