<template>
    <div>
        <b class="text-xl">ประวัติการได้รับ Point</b>
        <div class="box grid justify-self-center p-5 lg:px-5 mt-3 overflow-x-auto">
            <!-- <p>เลือกงวด</p> -->
            <!-- <div class="flex mt-2">
                <div class="flex-initial">
                    <select v-model="filterLottoType" name="" id="" class="form-select box lg:w-auto w-auto mt-5 lg:mt-0 mr-auto">
                    <option value="">เลือกประเภทหวย</option>
                    <option v-for="(type,index) in dd_lotto_type" :key="index" :value="type.id">{{type.name}}</option>
                    </select>
                </div>
                <div class="flex-initial ml-2">
                    <select v-model="filterLottoRound" name="" id="" 
                    class="form-select box lg:w-auto w-auto mt-5 lg:mt-0 mr-auto">
                    <option value="">ทุกงวด</option>
                    <option v-for="(ddRound,index) in dd_lotto_round" :key="index" :value="ddRound.id">
                        {{ ddRound.round_name }}
                    </option>
                    </select>
                </div>
                <p class="ml-auto">จำนวนรายการ {{ dataShowBillsWon.bills && dataShowBillsWon.bills.length > 0 
                    ? dataShowBillsWon.bills.length : 0 }} รายการ</p>
            </div> -->
            <table class="table">
                <thead>
                    <tr>
                    <th v-for="(col,index) in tbShowHistoryReceivePoint.columns" :key="index" class="border-b-2 dark:border-dark-5 whitespace-nowrap">
                        <b>{{ col.label }}</b>
                    </th>
                    </tr>
                </thead>
                <tbody v-if="tbShowHistoryReceivePoint.rows.length > 0">
                    <tr v-for="(data,index) in tbShowHistoryReceivePoint.rows" :key="index" :class="{'bg-gray-200 dark:bg-dark-1' : index%2 == 0}">
                        <td>{{ data.lotto_round }}</td>
                        <td>{{ data.created_at }}</td>
                        <td>{{ data.lotto_type }}</td>
                        <td>{{ data.bill_turnover }}</td>
                        <td>{{ data.point }}</td>
                    </tr>
                </tbody>
            </table>
      </div>
    </div>
</template>
<script>
import moment from "moment";
export default {
    props : ['historyReceivePoint'],
    data() {
        return {
            tbShowHistoryReceivePoint: {
                page: 1,
                columns: [
                    { label: "งวดออกรางวัล"},
                    { label: "วันที่ซื้อ"},
                    { label : "ประเภทหวย"},
                    { label: "จำนวนที่ซื้อ(บาท)"},
                    { label: "Point"},
                ],
                rows: [],
            },
        }
    },
    watch : {
        historyReceivePoint : 'setDataReceivePoint'
    },
    methods : {
        setDataReceivePoint(data) {
            // console.log(data.user_receive_points);
            this.tbShowHistoryReceivePoint.rows = data.user_receive_points.map((item) => {
                // console.log(item);
                return {
                    lotto_round : item.lotto_round && item.lotto_round.lotto ? item.lotto_round.round_name : '',
                    created_at : item ? moment(item.created_at).format("YYYY-MM-DD HH:mm") : '',
                    lotto_type : item.lotto_round && item.lotto_round.lotto ? item.lotto_round.lotto.name : '',
                    bill_turnover : item.bill ? item.bill.turnover : 0,
                    point : item ? item.points : 0
                }
            })
        }
    }
}
</script>