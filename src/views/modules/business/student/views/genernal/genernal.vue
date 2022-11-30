<template>
  <div>
    <el-row>
      <el-col :span="12">
        <div class="grid-content bg-purple border">
          <div class="container-context">
            <student-detail ref="studentDetail"/>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content bg-purple border">
          <div class="contianer-header">
             {{$t('overview.job')}}
          </div>
          <div class="container-context">
            <job-detail  ref="jobdetail"/>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <div class="grid-content bg-purple border">
          <div class="contianer-header">
            {{$t('overview.certificateinfo')}}
          </div>
          <div class="container-context">
            <cerificatinf0  ref="cerificatinf0"/>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content bg-purple border">
          <div class="contianer-header">
            {{$t('overview.classes')}}
          </div>
          <div class="container-context">
          <class-info  ref="classInfo"/>
        </div>
      </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import studentDetail from '../student-detail'
import classInfo from '../class/classes-info'
import cerificatinf0 from '../certificateinfo/certificateinfo'
import jobDetail from '../job/job-detail'
export default {
  name: "genernal",
  data(){
    return {

    }
  },
  components:{
    studentDetail,
    cerificatinf0,
    jobDetail,
    classInfo
  },
  methods:{
    init(){
      this.$refs.studentDetail.init(this.user)
      this.$refs.classInfo.init(this.user)
      this.$refs.cerificatinf0.getDataList ()
      this.$refs.jobdetail.getDataList ()
    },
    request(){

    }
  },
  mounted() {

  }
}
</script>

<style scoped>
.border{
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  height: 400px;
  padding: 10px;
  margin: 10px;
}
.container-context{
  width: 100%;

}
.contianer-header{
  margin:10px;
  padding:10px;
  font-size: 14px;
  color: #705757;

}
</style>
