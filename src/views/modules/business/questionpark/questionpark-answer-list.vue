// 点击试卷后的缩略信息
<template>
  <div style="width: 70%;margin-left: auto;margin-right: auto">
    <div id="msg" style="float: left">
      <div class="wrapper">
        <ul class="top">
          <li class="example">
            <div>{{ this.QuestionParkContent.title }}</div>
          </li>
        </ul>
        <div class="top">
          <div>{{this.QuestionParkContent.content}}</div>
        </div>
        <ul class="info" v-loading="dataListLoading">
          <li @click="toExamMsg(item.uuid)" class="item" v-for="(item,index) in dataList" :key="index" style="width: 100%;height: 50px;border-bottom: 1px solid #c6bfbf;cursor: pointer;" >
            <div style="width: 30%;height: 30px;float:left;line-height: 50px">{{item.content}}</div>
          </li>
        </ul>
      </div>
    </div>
    <div>
      <questionparkanswer ref="questionparkanswer"/>
    </div>
  </div>

</template>

<script>
import questionparkanswer from './questionpark-answer'
export default {
  data() {
    return {
      dialogVisible: false,
      // 默认打开序号
      activeName: '0',
      dataListLoading:false,
      // 每种类型题目的总数
      topicCount: [1,2,3],
      // 每种类型分数的总数
      score: [1,2],
      QuestionParkContent:{},
      dataList:[],
      coursetype:{},
      course:{},
      examData: {},
      topic: {},
      showPlay:false,
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
    }
  },
  components:{
    questionparkanswer
  },
  mounted() {
    this.init()
  },
  methods: {
    toExamMsg(uuid){
      this.showPlay = true;

    },
    // 初始化页面数据
    init() {
      // 获取路由传递过来的试卷编号
      let uuid = this.$route.query.uuid
      this.course.uuid = uuid
      this.$refs.questionparkanswer.init(uuid)
      this.$http({
        url: this.$http.adornUrl(`/generator/questionpark/info/`+uuid),
        method: 'get',
        params: this.$http.adornParams({
          'page': this.pageIndex,
          'limit': this.pageSize,
          'uuid': this.course.uuid
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.QuestionParkContent =  data.lecturer;
        }
      })
      this.$http({
        url: this.$http.adornUrl(`/generator/questionpark/list`),
        method: 'get',
        params: this.$http.adornParams({
          'page': this.pageIndex,
          'limit': this.pageSize,
          'parentUuid': this.course.uuid
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.dataList =  data.page.list;
          this.totalPage = data.page.totalCount
        }
      })
    },

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
  margin-left: 40px;
  color: #9a9a9a;
  font-size: 14px;
}
.content .inner .title {
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
  margin: 10px;
}
#msg .title {
  margin: 20px;
}
#msg .wrapper {
  background-color: #fff;
  padding: 10px;
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
