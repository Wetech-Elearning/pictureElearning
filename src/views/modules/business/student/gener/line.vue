<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
// import resize from './resize'

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '150px'
    },
    autoResize: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      chart: null,
      chartData:{
        expectedData: [],
        actualData: []
      }
    }
  },
  mounted() {
    this.$http({
      url: this.$http.adornUrl('/genernal/genertotal/lineByWeekinfos'),
      method: 'get',
      params: this.$http.adornParams({
        'userId': this.$store.state.user.id,
        'time': 7
      })
    }).then(({data}) => {
      if (data && data.code === 0) {
        this.dataList = data.data
        for(var i =0;i<data.data.length;i++){
          this.chartData.expectedData.push((data.data[i].learn_time/60).toFixed(2))
          this.chartData.actualData.push(data.data[i].days.slice(5))
        }
        this.$nextTick(() => {
          this.initChart()
        })
      } else {
      }
    })

  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    },
    setOptions({ expectedData, actualData } = {}) {
      this.chart.setOption({
        xAxis: {
          data: this.chartData.actualData,
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 20,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: ['学习时长(分)']
        },
        series: [{
          name: '学习时长(分)', itemStyle: {
            normal: {
              color: '#6dec95',
              lineStyle: {
                color: '#6dec95',
                width: 2
              }
            }
          },
          smooth: true,
          type: 'line',
          data: expectedData,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        }]
      })
    }
  }
}
</script>
