<template>
  <div id="msg">
    <div class="wrapper">
      <i class="el-icon-arrow-left back" @click="goBack"></i>
      <ul class="top">
        <li class="example">
          {{coursereportData.courseReportTitle}}
        </li>
      </ul>
      <div>
        <el-form ref="form" :model="dataForm" label-width="80px">
          <el-form-item label="标题">
            <el-input type="textarea" v-model="dataForm.studentCourseReportTitle"></el-input>
          </el-form-item>
          <el-form-item label="内容要求">
            <el-input type="textarea" v-model="coursereportData.courseReportContent"></el-input>
          </el-form-item>
          <el-form-item label="正文">
            <el-input type="textarea" v-model="dataForm.content"></el-input>
          </el-form-item>
          <el-form-item label="附件">
            <el-upload
              class="upload-demo"
              :action="url"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              :on-success="successHandle"
              multiple
              :limit="3"
              :on-exceed="handleExceed"
              :file-list="fileList">
              <el-button size="small" type="primary">点击上传</el-button>
              <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="commit">提交报告</el-button>
            <el-button @click="cancle">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

  </div>
</template>

<script>
import { getNowTime } from '@/utils'
export default {
  data() {
    return {
      coursereportData:null,
      dialogVisible: false,
      dataForm: {
        uuid: 0,
        courseReportId: '',
        studentCourseReportTitle: '',
        studentId: '',
        content: '',
        comment: '',
        score: '',
        status: 0,
        file: [],
        creater: '',
        createDate: '',
        updateDate: '',
        remark: ''
      },
      url: '',
      fileList: []
    }
  },
  created() {
    this.init()
  },
  methods: {
    // 初始化页面数据
    init() {
      this.coursereportData = this.$route.query.coursereport
      this.url = this.$http.adornUrl(`/sys/aws/oss/upload?token=${this.$cookie.get('token')}&uuid=`+this.coursereportData.uuid + '&creater='+ this.$store.state.user.id +'&objType=课程报告')
      console.log('coursereportData',this.coursereportData)
    },
    commit() {
      this.$http({
        url: this.$http.adornUrl(`/generator/coursereportrecord/save`),
        method: 'post',
        data: this.$http.adornData({
          'courseReportId': this.coursereportData.uuid,
          'studentCourseReportTitle': this.dataForm.studentCourseReportTitle,
          'studentId': this.$store.state.user.id,
          'content': this.dataForm.content,
          'status': this.dataForm.status,
          'createDate': getNowTime(),
          'updateDate': getNowTime()
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.$router.go(-1)
            }
          })
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    cancle() {
      this.goBack()
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    // 上传成功
    successHandle (response, file, fileList) {
      console.log('response=====',response)
      this.$message.info('上传成功')
      this.dataForm.file.push(response)
    },
    // 返回上一页
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.bottom {
  .right{
    .el-button{
      color: #409EFF;
      border-color: #c6e2ff;
      background-color: #ecf5ff;
    }
  }
}
.right {
  margin-left: auto;
}
.inner .contenti .question {
  margin-left: -5px;
  color: #9a9a9a;
  font-size: 14px;
  list-style-type:none;
}
.content .inner .titlei {
  margin-left: 20px;
  font-size: 16px;
  color: #88949b;
  font-weight: bold;
}
.content .title .time {
  font-size: 16px;
  margin-left: 420px;
  color: #999;
}
.content .stitle {
  background-color: #0195ff;
}
.content .title span {
  margin-right: 10px;
}
#msg .content .title {
  font-size: 20px;
  margin: 0px;
  display: flex;
  align-items: center;
}
.content {
  margin-top: 20px;
  background-color: #fff;
  padding: 20px;
}
.content .header {
  padding: 10px 30px;
}
.wrapper .info {
  margin: 20px 0px 0px 20px;
  border-top: 1px solid #eee;
  padding: 20px 0px 10px 0px;
}
.wrapper .info a {
  color: #88949b;
  font-size: 14px;
}
.wrapper .info a:hover {
  color: #0195ff;
}
.wrapper .bottom .btn {
  cursor: pointer;
  padding: 5px 10px;
  border: 1px solid #88949b;
  border-radius: 4px;
}
.wrapper .bottom {
  display: flex;
  margin-left: 20px;
  color: #999;
  font-size: 14px;
  align-items: center;
}
.wrapper .bottom li {
  margin-right: 14px;
}
#msg {
  background-color: #eee;
  width: 100%;
  margin: 0 auto;
}
#msg .title {
  margin: 20px;
}
#msg .wrapper {
  background-color: #fff;
  padding: 10px;
}
.wrapper .back {
  color: #007aff;
  font-size: 22px;
  font-weight: 700;
}
.wrapper .top {
  display: flex;
  margin: 20px;
  align-items: center;
}
.wrapper .top .right {
  margin-left: auto;
}
.wrapper .top .example {
  color: #333;
  font-size: 22px;
  font-weight: 700;
}
.wrapper .top li i {
  margin-left: 20px;
  color: #88949b;
}
.wrapper .right .count {
  margin-right: 60px;
  color: #fff;
  padding: 4px 10px;
  background-color: #88949b;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  border: 1px solid #88949b;
}
.wrapper .right .score {
  position: absolute;
  left: 53px;
  top: -5px;
  padding: 1px 12px;
  font-size: 20px;
  color: #88949b;
  border: 1px dashed #88949b;
  border-left: none;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  font-weight: bold;
}
.wrapper .right div {
  position: relative;
}
.wrapper * {
  list-style: none;
}
</style>
