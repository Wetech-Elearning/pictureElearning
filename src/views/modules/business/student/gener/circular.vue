<template>
  <div class="test2" style="width:100%;height:150px;text-align: center">
    <el-row style="margin-bottom: 5px">
      {{$t('overview.study')}}
    </el-row>
    <el-progress type="circle" :percentage="percentage" :stroke-width="strokewidth"></el-progress>
  </div>
</template>

<script>

export default {
  data() {
    return {
      myChart: '',
      percentage:0,
      strokewidth:15
    }
  },
  mounted() {
    this.$http({
      url: this.$http.adornUrl('/genernal/genertotal/cirClueTotalinfosOrder'),
      method: 'get',
      params: this.$http.adornParams({
        'userId': this.$store.state.user.id
      })
    }).then(({data}) => {
      if (data && data.code === 0) {
        this.percentage = Math.round(data.data.totalOnlineTime /data.data.totalCourselineTime * 10000)/100 >= 100 ? 100 : Math.round(data.data.totalOnlineTime /data.data.totalCourselineTime * 10000)/100
      } else {
      }
    })
  },
  beforeDestroy() {
  },
  methods: {

  }
}
</script>
