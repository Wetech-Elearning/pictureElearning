<template>
  <div id="msg">
    <div class="wrapper">
      <i class="el-icon-arrow-left back" @click="goBack"></i>
      <ul class="top">
        <li class="example">
          {{coursereportData.courseReportTitle}}
        </li>
        <li class="right">
          <div>
            <span class="count">{{$t('paper.paper_total_score')}}</span>
            <span class="score">{{coursereportData.score}}</span>
          </div>
        </li>
      </ul>
      <ul class="bottom">
        <li>{{$t('paper.paper_create_time')}}{{coursereportData.createDate}}</li>
        <li>{{$t('coursereport.deadlineDate')}}{{coursereportData.deadlineDate}}</li>
        <li>{{$t('paper.paper_create_from')}} {{coursereportData.creater}}</li>
      </ul>
      <ul class="info">
        <li @click="dialogVisible = true"><a href="javascript:;"><i class="iconfont icon-info"></i>{{$t('coursereport.content')}}</a></li>
      </ul>
    </div>
    <div class="content">
      <el-card class="box-card" style="height: 300px;">
        <div style="font-size: 20px;">
          {{coursereportData.courseReportContent}}
        </div>
      </el-card>
      <el-card style="margin-top: 20px;background-color: #ecf1cb;padding:10px;">
        <div>
          <el-form :model="dataForm">
            <el-form-item label="是否私聊:" prop="isPrivate" style="margin-bottom: 0">
              <el-radio v-model="dataForm.isPrivate" label="0">否</el-radio>
              <el-radio v-model="dataForm.isPrivate" label="1">是</el-radio>
            </el-form-item>
            <el-form-item label="内容:" prop="content">
              <el-input type="textarea" maxlength="100" show-word-limit v-model="dataForm.content" placeholder="内容"/>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer" style="float: right">
          <el-button type="primary" @click="submitMessage()">提交</el-button>
        </span>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      dataForm:{
        rate:0,
        uuid:'',
        courseId:"",
        isPrivate:"0",
        content:"",
        creater:"",
        createrId:"",
        createTime:"",
        deleteFlag:""
      },
      // 试卷信息
      coursereportData: {
        uuid: 0,
        courseTypeId: '',
        courseReportTitle: '',
        courseReportContent: '',
        status: '',
        submitNums: '',
        score: '',
        creater: '',
        createDate: '',
        updateDate: '',
        deadlineDate: '',
        remark: ''
      },

    }
  },
  mounted() {
    this.init()
  },
  methods: {
    // 初始化页面数据
    init() {
      this.coursereportData = this.$route.query.coursereport
      console.log('coursereportData',this.coursereportData)
    },
    submitMessage() {
      this.$http({
        url: this.$http.adornUrl(`/generator/leavemessage/save`),
        method: 'post',
        data: this.$http.adornData({
          'uuid': this.dataForm.uuid || undefined,
          'courseTypeId': this.coursereportData.courseTypeId,
          'courseId': 0,
          'isPrivate': this.dataForm.isPrivate,
          'content': this.dataForm.content,
          'creater': this.$store.state.user.name,
          'createrId': this.$store.state.user.id,
          'deleteFlag': 0
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.$message({
            message: this.$t('message.success'),
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.refresh();
            }
          })
        } else {
          this.$message.error(data.msg)
        }
      })
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
