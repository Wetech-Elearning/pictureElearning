<template>
  <div>
    <el-row>
      <el-col :span="12"><div class="grid-content bg-purple border">
        <div class="contianer-header">
          {{$t('classes.class_detail_info')}}
        </div>
        <div class="container-context">
          <BaseClassinfo ref="baseinfo"/>
        </div>
      </div></el-col>
      <el-col :span="12"><div class="grid-content bg-purple border">
        <div class="contianer-header">
          {{$t('classes.course')}}
        </div>
        <div class="container-context">
          <classcourseinfo ref="classcourseinfo"/>
        </div>
      </div></el-col>
    </el-row>
    <el-row>
      <el-col :span="12"><div class="grid-content bg-purple border">
        <div class="contianer-header">
          {{$t('classes.exam_job')}}
        </div>
        <div class="container-context">
          <jobs ref="jobs"/>
        </div>
      </div></el-col>
      <el-col :span="12"><div class="grid-content bg-purple border">
        <div class="contianer-header">
          {{$t('classes.student')}}
        </div>
        <div class="container-context">
          <students ref="students"/>
        </div>
      </div></el-col>
    </el-row>
  </div>
</template>

<script>
import  classcourseinfo from './classpannel/course-infos'
import BaseClassinfo from "./classpannel/baseinfo";
import jobs from './classpannel/job'
import students from './classpannel/student'
export default {
  name: "class-detail",
  data(){
    return {

    }
  },
  components:{
    BaseClassinfo,
    classcourseinfo,
    jobs,
    students
  },
  methods:{
  },
  mounted() {
    let uuid = this.$route.query.uuid
    this.$refs.baseinfo.init(uuid)
    this.$refs.classcourseinfo.init (uuid)
    this.$refs.jobs.getDataList (uuid)
    this.$refs.students.init (uuid)
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
  padding:10px

}
</style>
