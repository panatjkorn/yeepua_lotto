<template>
  <div>
    <div class="col-span-12 lg:col-span-4 text-left mt-5 box py-4 px-4 overflow-x-auto">
      <b>รายการอัตราคูณ</b>
      <table class="table mt-5">
        <thead>
          <tr>
            <th v-for="(col,index) in tbPriceRateLottery.columns" :key="index" class="border-b-2 dark:border-dark-5 whitespace-nowrap">
                <b>{{ col.label }}</b>
            </th>
          </tr>
        </thead>
        <tbody v-if="tbPriceRateLottery.rows.length > 0">
          <tr v-for="(data,index) in tbPriceRateLottery.rows" :key="index">
            <td>{{ data.lotto_type }}</td>
            <td>{{ data.default_price_to_pay }}</td>
            <td>{{ data.default_limit_number_per_bill }}</td>
            <td>
              <div v-if="data.default_type_to_pay.type == false" class="w-24 bg-yellow-200 text-black p-2 rounded-3xl text-center">{{ data.default_type_to_pay.name }}</div>
              <div v-else class="w-24 bg-red-200 text-black p-2 rounded-3xl text-center">{{ data.default_type_to_pay.name }}</div>
            </td>
            <td>
              <button class="btn bg-blue-500 text-white" @click="changeRatePriceTopay(data)">ปรับราคาจ่าย</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
export default {
  props : [ 'dataRoundPayRatio' ],
  data() {
    return {
      tbPriceRateLottery: {
        page: 1,
        columns: [
          { label: "ประเภท"},
          { label: "Default ราคาจ่าย (บาทละ)"},
          { label: "Default ลิมิตต่อเลข/บิล"},
          { label: "Default รูปแบบการจ่าย"},
          { label: "ตัวเลือก"},
        ],
        rows: [],
      }
    }
  },
  watch : {
    dataRoundPayRatio : 'setDataRoundPay'
  },
  methods : {
    changeRatePriceTopay(data) {
      //ปรับราคาแบบขั้นบรรได
      this.$emit('goToChangeRate',data);
      // if(data.default_type_to_pay == 1) {
      //   this.$router.push('/Lottery/ChangeRatePrice')
      // }
    },
    setDataRoundPay(data) {
      this.tbPriceRateLottery.rows = data.map((item) => {
        return {
          lotto_type : item.bet_type ? item.bet_type.name : '',
          default_price_to_pay : item ? item.pay_ratio : '',
          default_limit_number_per_bill : item ? item.max_bet_per_bill_number : '',
          default_type_to_pay : {
            type : item ? item.is_fixed : '',
            name :  item && item.is_fixed == false ? 'ลำดับขั้น' : 'จ่ายเต็ม'
          },
          id : item ? item.id : '',
          bet_type_id : item.bet_type ? item.bet_type.id : ''
        }
      })
    }
  }
}
</script>
