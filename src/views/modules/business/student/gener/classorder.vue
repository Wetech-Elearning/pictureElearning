<template>
  <div>
    <el-table
      :data="dataList"
      style="width: 100%;">
      <el-table-column
        prop="courseName"
        header-align="center"
        align="center"
        :label="$t('course.course_name')">
      </el-table-column>
      <el-table-column
        prop="times"
        header-align="center"
        align="center"
        :label="$t('course.course_study_time')">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "classorder",
  data(){
    return {
      dataList:[]
    }
  },
  methods:{
    init(){
      this.$http({
        url: this.$http.adornUrl('/genernal/genertotal/lineByWeekinfosOrder'),
        method: 'get',
        params: this.$http.adornParams({
          'userId': this.$store.state.user.id,
          'time': 7
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.dataList = data.data
          for(var i=0;i<this.dataList.length;i++){
            this.dataList[i].times = this.timeFormatss(this.dataList[i].learnTime)
          }
        } else {
        }
      })
    },
    timeFormatss(time) {
      var tmptime = ""+time;
      if(tmptime.indexOf(':')>0){
        return tmptime;
      }
      var minute = Math.floor((time % 3600) / 60)
      var second = Math.floor(time % 60)
      minute = minute < 10 ? "0" + minute : minute
      second = second < 10 ? "0" + second : second
      return minute+":"+second
    }

  },
  mounted() {
    this.init()
  }
}
</script>

<style scoped>

</style>
