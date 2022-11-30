<template>
<div>
  <el-row v-for="(item,index) in examPaperList" :key="index" style="margin: 10px 0;line-height: 30px">
    <el-col :span="1">
      <svg class="icon" aria-hidden="true" v-if="examPaperList.length > 0">
        <use xlink:href="#icon-shijuan"></use>
      </svg>
    </el-col>
    <el-col :span="9" >
      <span>{{item.examPaperName}}</span>
    </el-col>
    <el-col :span="9">
      <el-button type="primary" size="mini" @click="toAnswer(item.uuid)">{{$t('course.course_examing')}}</el-button>
    </el-col>
  </el-row>
</div>
</template>

<script>
export default {
  name: 'course-joblist',
  data(){
    return {
      examPaperList:[]
    }
  },
  methods: {
    initdata(data){
      this.examPaperList = data
    },
    toAnswer(uuid) {
      // 判断是否超过考试的最大次数，超过的不允许考试
      this.$http({
        url: this.$http.adornUrl(`/generator/userexaminfo/isMaxNum`),
        method: 'get',
        params: this.$http.adornParams({
            'uuid': uuid,
            'userId': this.$store.state.user.id
          }
        )
      }).then(({data}) => {
        if (data && data.code === 0) {
          if(!data.data){
            this.$router.push({path: '/exampaper-detail', query: {uuid: uuid}})
          }else{
            this.$message.error(this.$t('message.max_num'))
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
