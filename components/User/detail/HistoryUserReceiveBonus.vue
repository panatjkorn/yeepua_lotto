<template>
    <div>
        <b class="text-xl">ประวัติการได้รับโบนัส</b>
        <div class="box grid justify-self-center p-5 lg:px-5 mt-3 overflow-x-auto">
            <table class="table">
                <thead>
                    <tr>
                    <th v-for="(col,index) in tbShowHistoryReceiveBonus.columns" :key="index" class="border-b-2 dark:border-dark-5 whitespace-nowrap">
                        <b>{{ col.label }}</b>
                    </th>
                    </tr>
                </thead>
                <tbody v-if="tbShowHistoryReceiveBonus.rows.length > 0">
                    <tr v-for="(data,index) in tbShowHistoryReceiveBonus.rows" :key="index" :class="{'bg-gray-200 dark:bg-dark-1' : index%2 == 0}">
                        <td>{{ data.created_at }}</td>
                        <td>{{ data.credit }}</td>
                        <td>{{ data.remark }}</td>
                        <td>{{ data.admin }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script>
import moment from "moment";
export default {
    props : ['dataUserReceiveBonus'],
    data() {
        return {
            tbShowHistoryReceiveBonus: {
                page: 1,
                columns: [
                    { label: "วันที่"},
                    { label: "จำนวนโบนัส"},
                    { label : "เหตุผล"},
                    { label: "ผู้ดูแลระบบ"},
                ],
                rows: [],
            },
        }
    },
    watch : {
        dataUserReceiveBonus : 'setDataUserReceiveBonus'
    },
    methods : {
        setDataUserReceiveBonus(data) {
            // console.log(data);
            this.tbShowHistoryReceiveBonus.rows = data.bonus.map((item) => {
                // console.log(item);
                return {
                    admin: item.admin ? item.admin.name_profile : '',
                    created_at: item ? moment(item.created_at).format("YYYY-MM-DD HH:mm") : '',
                    credit: item ? item.credit : '',
                    id : item ? item.id : '',
                    remark: item ? item.remark : ''
                }
            })
        }
    }
}
</script>