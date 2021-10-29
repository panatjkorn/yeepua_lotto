import Vue from 'vue'
import { Bar, Line, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins;

Vue.component('my-bar', {
  extends: Bar,
  props: ['chartDatazz', 'chartOptionzz'],
  mounted () {
    this.RerenderChart()
  }
})

// Vue.component('MyLine', {
//   extends: Line,
//   mixins: [reactiveProp],
//   props: ['chartData', 'chartOption'],
//   // props: {
//   //   options: {
//   //     type: Object,
//   //     default() {
//   //       return {};
//   //     }
//   //   }
//   // },
//   mounted() {
//     this.renderChart(this.chartData, this.options);
//   }
// })
Vue.component('MyLine', {
  extends: Line,
  props: ['chartData', 'chartOption'],
  mounted () {
    this.renderLineChart()
  },
  watch: {
    chartData() {
      console.log('chartData: ', chartData);
      this.$nextTick(() => {
        this.renderLineChart();
    })
    }
  },
  methods: {
    renderLineChart() {
      // console.log('renderLineChart: ', this.chartData);
      console.log('renderLineChart: ', this.chartData);
      console.log('option: ', this.chartOption);
      this.renderChart(this.chartData, this.chartOption)
    }
  }
})
