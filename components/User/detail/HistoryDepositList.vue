<template>
    <div>
        <b class="text-xl">ประวัติการฝากเงิน</b>
        <div class="box grid justify-self-center p-5 lg:px-5 mt-3 overflow-x-auto">
            <!-- <pre>{{dropdownStatusDeposit}}</pre> -->
            <div class="grid-cols-5 ml-auto">
                <select v-model="filterStatus" 
                    name="filterDepositList" id="filterDepositList" 
                    class="form-select box border border-gray-300"
                    @change="filterDepositList()">
                    <option value="">สถานะทั้งหมด</option>
                    <option v-for="(status,index) in dropdownStatusDeposit" :key="index" :value="status.id" 
                        >
                        {{status.status_detail}}
                    </option>
                </select>
            </div>
            <client-only>
                <table class="table mt-5 mb-5">
                    <thead>
                        <tr>
                            <th v-for="(col,index) in tbDepositList.columns" :key="index" class="border-b-2 dark:border-dark-5 whitespace-nowrap" :class="col.color">
                                <b>{{ col.label }}</b>
                            </th>
                        </tr>
                    </thead>
                    <tbody v-if="tbDepositList.rows.length > 0">
                        <tr v-for="(data,index) in tbDepositList.rows" :key="index">
                            <td>{{ index+1 }}</td>
                            <td>{{ data.created_at }}</td>
                            <td>{{ data.credit }}</td>
                            <td>{{ data.top_up_status }}</td>
                            <td>{{ data.bank_code }}</td>
                            <td>{{ data.admin }}</td>
                            <!-- <td>{{ data.phone }}</td>
                            <td>{{ data.bank_account }}</td> -->
                            <!-- <td>
                                <div v-if="data.bank_account.length > 0">
                                    <p v-for="(bank,index) in data.bank_account" :key="index">
                                        {{bank.bank_account_name}} [ {{bank.bank_account_number}} ({{bank.bank_code}}) ]
                                    </p>
                                </div>
                            </td>
                            <td>{{data.credit}}</td>
                            <td>{{data.remark}}</td>
                            <td>{{data.admin}}</td> -->
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
    props : ['dataDepositList','dropdownStatusDeposit','filterStatusDeposit'],
    data() {
        return {
            tbDepositList: {
                page: 1,
                columns: [
                    { label: "#"},
                    { label: "วันที่"},
                    { label: "จำนวนเงิน"},
                    { label: "สถานะเติมเงิน"},
                    { label: "bank_code"},
                    { label: "ผู้ดูแลระบบ"},
                    // { label: "เบอร์โทรศัพท์"},
                    // { label: "ชื่อบัญชีธนาคาร"},
                ],
                rows: [],
            },
            filterStatus : ''
        }
    },
    watch : {
        dataDepositList : 'setDataDeposit',
        filterStatusDeposit : 'setFilterDeposit'
    },
    methods : {
        setDataDeposit(data) {
            // console.log(data);
            this.tbDepositList.rows = data.top_ups.map((item) => {
                // console.log(item);
                return {
                    created_at : item.created_at ? moment(item.created_at).format("YYYY-MM-DD HH:mm") : '',
                    credit : item ? item.credit : '',
                    top_up_status : item.top_up_status ? item.top_up_status.status_detail : '',
                    bank_code : item ? item.user_bank_code : '',
                    phone : item.user ? item.user.phone_number : '',
                    bank_account : item.user ? item.user.user_bank_accounts : '',
                    admin : item.admin ? item.admin.name_profile : ''
                }
            })
        },
        setFilterDeposit(status_id) {
            this.filterStatus = status_id;
        },
        filterDepositList() {
            // console.log(this.filterStatusDeposit);
            this.$emit('filterStatusDeposit',this.filterStatus)
        }
    }
}
</script>