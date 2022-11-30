<template>
  <div>
    <el-row>
      <el-col :span="12">
        <el-row>
          <circular/>
        </el-row>
        <el-row>
          <genernal/>
        </el-row>
      </el-col>
      <el-col :span="12">
        <classorder/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import genernal from "../gener/line";
import circular from "../gener/circular";
import classorder from "../gener/classorder";
export default {
  name: "student-detail",
  components:{
    genernal,
    circular,
    classorder
  },
  data(){
    return {
      userId:"",
      dataForm:{
        uuid: 0,
        userName: '',
        userMobile: '',
        userEmail: '',
        relatedCompany: '',
        relatedDepartment: '',
        relatedOffice: '',
        sex: '0',
        age: '',
        creater: '',
        createDate: '',
        updater: '',
        updateDate: '',
        remark: '',
        deleteFlag: '0'
      },
      userimage:''
    }
  },
  methods:{
    init(){
      this.userId  =this.$store.state.user.id;
      this.$http({
        url: this.$http.adornUrl(`/generator/student/info/`+this.userId ),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.dataForm.userName = data.student.userName
          this.dataForm.userMobile = data.student.userMobile
          this.dataForm.userEmail = data.student.userEmail
          this.dataForm.relatedCompany = data.student.relatedCompany
          this.dataForm.relatedDepartment = data.student.relatedDepartment
          this.dataForm.relatedOffice = data.student.relatedOffice
          this.dataForm.sex = data.student.sex
          this.dataForm.age = data.student.age
          this.dataForm.creater = data.student.creater
          this.dataForm.createDate = data.student.createDate
          this.dataForm.updater = data.student.updater
          this.dataForm.updateDate = data.student.updateDate
          this.dataForm.remark = data.student.remark
          this.dataForm.deleteFlag = data.student.deleteFlag
        }
      })
    }
  },
  mounted() {
    this.init()
  }
}
</script>

<style scoped>
.ul-class{
  list-style: none
}
.ul-class li{
  margin: 15px;
  height: 20px;
  line-height: 20px;
}
.ul-class li label{
  float: left;
  font-size: 14px;
  width: 20%;
  text-align: right;
  color: #6c757d;
}
.ul-class li div{
  float: left;
  width: 80%;
  padding-left: 10px;
  font-size: 18px;
  font: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "\5FAE\8F6F\96C5\9ED1", Arial, sans-serif;
}
</style>
