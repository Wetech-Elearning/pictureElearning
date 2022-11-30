// 点击试卷后的缩略信息
<template>
  <div style="width: 100%">
    <div class="course-detail">
      <div class="course-introduction">
        <el-row>
          <el-col :span="10">
            <img :src="dataForm.courseCover" style="max-width: 500px;max-height: 200px">
          </el-col>
          <el-col :span="14">
            <el-card class="box-card" title="">
              <el-col :span="16">
                <el-row style="margin: 10px">
                  <el-col :span="6" class="label_class">
                    <label>课程老师：</label>
                  </el-col>
                  <el-col :span="16">
                    <div class="text item">
                      {{dataForm.creater}}
                    </div>
                  </el-col>
                </el-row>
                <el-row style="margin: 10px">
                  <el-col :span="6" class="label_class">
                    <label>总课时：</label>
                  </el-col>
                  <el-col :span="16">
                    <div class="text item">
                      {{formatterTimes}}分钟
                    </div>
                  </el-col>
                </el-row>
                <el-row style="margin: 10px">
                  <el-col :span="6" class="label_class">
                    <label>课程总数：</label>
                  </el-col>
                  <el-col :span="16">
                    <div class="text item">
                      {{totalCourse}} 课时
                    </div>
                  </el-col>
                </el-row>
                <el-row style="margin-top: 40px">
                  <el-col :span="5" class="label_class">
                    <el-button type="success" size="mini" class="el-icon-caret-right"  style="margin-bottom: 20px">已关注</el-button>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="8" class="rate">
                <el-row>
                  <el-col :span="12">{{$t('course.course_rate')}}</el-col>
                  <el-col :span="12">{{courseRate.count}} {{$t('course.course_people_num')}}</el-col>
                </el-row>
                <el-row class="font-red">
                  {{courseRate.rate}}
                </el-row>
                <el-row>
                  <el-rate v-model="courseRate.rate" show-text></el-rate>
                </el-row>
              </el-col>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <div class="course-detail">
        <el-tabs type="border-card">
          <el-tab-pane>
            <span slot="label"><svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-jianjie"></use>
            </svg> 课程简介</span>
            <div class="pane-content">
              {{dataForm.courseTypeIntroduction}}
            </div>
          </el-tab-pane>
          <el-tab-pane>
            <span slot="label">
              <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-kechengmuluguihua"></use>
            </svg>
              课程目录</span>
            <div class="pane-content">
              <courseTypeList ref="courseTypeList" @toExamMsg="toExamMsg"/>
            </div>
          </el-tab-pane>
          <el-tab-pane>
          <span slot="label">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-kaoshi"></use>
            </svg>
            {{$t('course.course_exam')}}
          </span>
            <div class="pane-content">
              <courseJoblist ref="courseJoblist" />
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div v-if="showPlay"style="width: 70%;height: 100%;float: left">
      <play v-if="showPlay" ref="play" />
    </div>
  </div>

</template>

<script>
import play from './play'
import courseTypeList from './courseTypeList'
import courseJoblist from '../job/course-joblist'
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
      dataList:[],
      coursetype:{},
      course:{},
      examData: {},
      topic: {},
      dataForm:{
        examPaperList:[]
      },
      totalTime:0,
      formatterTimes:"",
      showPlay:false,
      totalCourse:0,
      courseRate:{
        count:0,
        rate:0
      }
    }
  },
  components:{
    play,
    courseTypeList,
    courseJoblist
  },
  mounted() {
    this.initExamPaper()
    this.init()
    this.getCourseRate()
  },
  methods: {
    getCourseRate() {
      let uuid = this.$route.query.uuid
      this.$http({
        url: this.$http.adornUrl(`/generator/courserate/info/`+uuid),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.courseRate.count = data.data.num
          this.courseRate.rate = data.data.rate
        }
      })
    },
    initExamPaper(){
      let uuid = this.$route.query.uuid
      this.$http({
        url: this.$http.adornUrl(`/generator/coursetype/courseDetail`),
        method: 'get',
        params: this.$http.adornParams({
          'courseId': uuid,
          'userId': this.$store.state.user.relateUserId
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.dataForm.examPaperList = data.data.examPaperList
          console.log(this.dataForm.examPaperList)
          this.$refs.courseJoblist.initdata(this.dataForm.examPaperList)
        }
      })
    },
    toExamMsg(uuid){
      console.log(uuid)
      this.showPlay = true;
      this.$nextTick(() => {
        this.$refs.play.init(uuid)
      })
    },
    // 初始化页面数据
    init() {
      // 获取路由传递过来的试卷编号
      let uuid = this.$route.query.uuid
      this.course.relatedCourseTypeId = uuid

      this.$http({
        url: this.$http.adornUrl(`/generator/coursetype/info/`+this.course.relatedCourseTypeId),
        method: 'get',
        params: this.$http.adornParams({
          'relatedCourseTypeId': this.course.relatedCourseTypeId
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.coursetype =  data.courseType;
        }
      })
      this.$http({
        url: this.$http.adornUrl(`/generator/coursetype/listByStudentCourseType`),
        method: 'get',
        params: this.$http.adornParams({
          'relatedCourseTypeId': this.course.relatedCourseTypeId,
          'studentId': this.$store.state.user.id
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.dataList =  data.data;
          this.dataForm = data.data;
          var parentdata  =  data.data;
          parentdata.children = this.formatterTypeNode(parentdata);

          this.$refs.courseTypeList.initdata(parentdata);
        }
      })
    },
    formatterTypeNode(data){
      var childrennodes = [];
      for(var i =0;i<data.childrenCourseTypeEntity.length;i++){
        var node = data.childrenCourseTypeEntity[i];
        var tmp_node = this.formatterCourseNode(node,'coursetype');
        tmp_node.children = this.formatterTypeNode(node);
        childrennodes.push(tmp_node)
      }
      for(var j =0;j<data.listCourseEntity.length;j++){
        childrennodes.push(this.formatterCourseNode(data.listCourseEntity[j],'course'))
      }
      return childrennodes;
    },
    formatterCourseNode(data,type){
      var node={}
      if("coursetype" == type) {
        node.id = data.uuid
        node.type = 'coursetype'
        node.name = data.courseTypeName
        node.readtime = ''
        node.totalTime = ''
        node.isFinished = ''
        node.fileType = ''
      }  else {
        console.log(data)
        node.id = data.uuid
        node.type = 'course'
        node.name = data.courseName
        node.readtime = this.timeFormatss(data.onlineTime)
        if(data.totalTime != null && data.totalTime != undefined && data.totalTime.length>0){
          if(data.fileType=='video'){
            node.totalTime = this.timeFormatss(data.totalTime)
          } else {
            if(data.totalTime==null || data.totalTime=='NaN:NaN'|| data.totalTime==''){
              node.totalTime =''
            } else if(data.totalTime.indexOf(":")>0){
              node.totalTime = data.totalTime
            } else {
              node.totalTime = this.timeFormatss(data.totalTime<60?data.totalTime*60:data.totalTime)
            }

          }
        }
        node.isFinished = data.isFinished
        node.fileType = data.fileType
        this.totalTime += this.timeFormat(data.totalTime);
        this.formatterTimes = this.timeFormatss(this.totalTime)
        this.totalCourse++;
      }
      return node;
    },
    toAnswer(id) {
      this.$router.push({path:"/answer",query:{examCode: id}})
    },
    timeFormat(time) {
      var t = time.split(":");
      var times = 0;
      if(t.length ==3){
        times = t[0]*60*60 +t[1]*60+t[2];
      }
      if(t.length ==2){
        times = t[0]*60 +t[1];
      }
      if(t.length ==1){
        times = t[0]*60;
      }
      return times
    },
    timeFormatss(time) {
      var tmptime = ""+time;
      if(tmptime.indexOf(':')>0){
        return tmptime;
      }
      var hour = Math.floor(time / 3600)
      var minute = Math.floor((time % 3600) / 60)
      var second = Math.floor(time % 60)
      hour = hour < 10 ? "0"+hour:hour
      minute = minute < 10 ? "0" + minute : minute
      second = second < 10 ? "0" + second : second
      return hour+":"+minute+":"+second
    },

  }
}
</script>

<style lang="scss" scoped>
.label_class{
  color:gray;
  text-align: right;
  padding-right: 10px;
}
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
  width: 20%;
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
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
.rate {
  background-color: #6699CC;
  padding: 10px;
}
</style>
