<template>
  <div class="course-detail">
    <div class="course-introduction">
      <el-row>
        <el-col :span="10">
          <img :src="dataForm.courseCover">
        </el-col>
        <el-col :span="14">
          <el-card class="box-card">
            <el-row>
              <el-col :span="16">
                <!--<div class="text item">
                  公司：xxxxxxx公司
                </div>-->
                <div class="text item">
                  {{$t('course.course_leader')}}：{{dataForm.creater}}
                </div>
                <div class="text item">
                  {{$t('course.course_total_class_hour')}}：{{dataForm.classHour}}{{$t('course.course_class_hour')}}
                </div>
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
                  <el-rate v-model="courseRate.rate" show-text @change="rateChange"></el-rate>
                </el-row>
              </el-col>
            </el-row>
            <el-row :gutter="30">
              <!--<el-col :span="3">
                <el-button type="primary">开始学习</el-button>
              </el-col>-->
              <el-col :span="2">
                <el-button type="success" @click="collect" :disabled="dataForm.collectFlag">
                  {{collectBtn}}
                </el-button>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div class="course-detail">
      <el-tabs type="border-card">
        <el-tab-pane>
          <span slot="label">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-jianjie"></use>
            </svg>
            {{$t('course.course_introduction')}}
          </span>
          <div class="pane-content">
            {{dataForm.courseTypeIntroduction}}
          </div>
        </el-tab-pane>
        <el-tab-pane>
          <span slot="label">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-kechengmuluguihua"></use>
            </svg>
            {{$t('course.course_catalogue')}}
          </span>
          <div class="pane-content">
            <courseTypeList ref="courseTypeList"/>
<!--            <template>-->
<!--              <el-row v-for="(item,index) in dataForm.courseList" :key="index">-->
<!--                <el-col :span="1">-->
<!--                  <span v-if="item.fileType == 'excel'" class="iconfont icon-ex" style="color:green;"></span>-->
<!--                  <span v-if="item.fileType == 'ppt'" class="iconfont icon-ppt" style="color:orangered;"></span>-->
<!--                  <span v-if="item.fileType == 'word'" class="iconfont icon-word" style="color:blue;"></span>-->
<!--                  <span v-if="item.fileType == 'video'" class="iconfont icon-shipin" style="color:gray;"></span>-->
<!--                </el-col>-->
<!--                <el-col :span="9">-->
<!--                  <span>{{item.courseName}}</span>-->
<!--                </el-col>-->
<!--                <el-col :span="9">-->
<!--                  <el-button type="primary" size="mini" @click="play(item)">{{$t('course.course_study')}}</el-button>-->
<!--                </el-col>-->
<!--              </el-row>-->
<!--            </template>-->
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
            <el-row v-for="(item,index) in dataForm.examPaperList" :key="index">
              <el-col :span="1">
                <svg class="icon" aria-hidden="true" v-if="dataForm.examPaperList.length > 0">
                  <use xlink:href="#icon-shijuan"></use>
                </svg>
              </el-col>
              <el-col :span="9">
                <span>{{item.examPaperName}}</span>
              </el-col>
              <el-col :span="9">
                <el-button type="primary" size="mini" @click="toAnswer(item.uuid,item.subject)">{{$t('course.course_examing')}}</el-button>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>
        <el-tab-pane>
          <span slot="label">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-kaoshi"></use>
            </svg>
            {{$t('course.course_report')}}
          </span>
          <div class="pane-content">
            <el-table
              :data="courseReportList"
              style="width: 100%">
              <el-table-column
                prop="courseReportTitle"
                label="标题"
                width="100">
              </el-table-column>
              <el-table-column
                prop="score"
                label="分值"
                width="100">
              </el-table-column>
              <el-table-column
                prop="submitNums"
                label="可提交次数"
                width="100">
                <template slot-scope="scope">
                  <span v-if="scope.row.submitNums == 0">无限制</span>
                  <span v-if="scope.row.submitNums != 0">{{scope.row.submitNums}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="deadlineDate"
                label="截止时间"
                width="150">
              </el-table-column>
              <el-table-column
                label="操作">
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" @click="commitHandle(scope.row)">上传报告</el-button>
                  <el-button type="primary" size="mini" @click="detailHandle(scope.row)">查看报告</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <player v-if="showPlay" ref="play" @refreshDataList="init"></player>
  </div>
</template>
<script>
  import { getNowTime } from '@/utils'
  import player from '@/components/play'
  import courseTypeList from '../modules/business/student/views/course/courseTypeList'
export default {
  data() {
    return {
      showPlay: false,
      activeNames: 1,
      id: '',
      course:{
        relatedCourseTypeId:''
      },
      courseRate: {
        rate: 0,
        count: 0,
        courseId: ''
      },
      collectBtn:'',
      dataForm:{
        uuid: 0,
        courseCover: '',
        courseTypeName: '',
        level: '',
        courseTypeIntroduction: '',
        certificateId:'',
        certificateName:'',
        creater: '',
        createDate: '',
        updater: '',
        updateDate: '',
        remark: '',
        deleteFlag: '0',
        collectFlag: false,
        classHour: '0',
        courseList: [],
        examPaperList: []
      },
      courseReportList:[]
    };
  },
  computed: {
    userName: {
      get () { return this.$store.state.user.name }
    },
    userId: {
      get () { return this.$store.state.user.relateUserId }
    }
  },
  created () {
    this.id = this.$route.query.id
    this.init()
    this.initpageinfos()
    this.getCourseRate()
    this.initCourseReport()
  },
  components: {
    player,
    courseTypeList
  },
  methods: {
    initCourseReport(){
      this.$http({
        url: this.$http.adornUrl(`/generator/coursereport/listCourseReport`),
        method: 'get',
        params: this.$http.adornParams({
          'relatedCourseTypeId': this.course.relatedCourseTypeId,
          'studentId': this.$store.state.user.id
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.courseReportList = data.data
        }
      })
    },
    // 初始化课程信息
    initpageinfos() {
      // 获取路由传递过来的试卷编号
      let uuid = this.$route.query.id
      this.course.relatedCourseTypeId = uuid
      this.$http({
        url: this.$http.adornUrl(`/generator/coursetype/listByStudentCourseType`),
        method: 'get',
        params: this.$http.adornParams({
          'relatedCourseTypeId': this.course.relatedCourseTypeId,
          'studentId': this.$store.state.user.id
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          var parentdata  =  data.data;
          parentdata.children = this.formatterTypeNode(parentdata);
          console.log('parentdata',parentdata)
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
	timeFormatNoss(time) {
      var tmptime = ""+time;
      if(tmptime.indexOf(':')>0){
        return tmptime;
      }
      var minute = Math.floor((time % 3600) / 60)
      var second = Math.floor(time % 60)
      minute = minute < 10 ? "0" + minute : minute
      second = second < 10 ? "0" + second : second
      return minute+":"+second
    },
    timeFormatss(time) {
      var tmptime = ""+time;
      if(tmptime.indexOf(':')>0){
        return tmptime;
      }
      if(time<60){
        time = time *60
      }
      var minute = Math.floor((time % 3600) / 60)
      var second = Math.floor(time % 60)
      minute = minute < 10 ? "0" + minute : minute
      second = second < 10 ? "0" + second : second
      return minute+":"+second
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
        node.id = data.uuid
        node.type = 'course'
        node.name = data.courseName
        node.readtime = this.timeFormatNoss(data.onlineTime)
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
    init(){
      this.$http({
        url: this.$http.adornUrl(`/generator/coursetype/courseDetail/`),
        method: 'get',
        params: this.$http.adornParams({
          'courseId':this.id,
          'userId':this.$cookie.get('userId')
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.dataForm.courseTypeName = data.data.courseTypeName
          this.dataForm.courseCover = data.data.courseType.courseCover
          this.dataForm.level = data.data.courseType.level
          this.dataForm.courseTypeIntroduction = data.data.courseType.courseTypeIntroduction
          this.dataForm.creater = data.data.courseType.creater
          this.dataForm.createDate = data.data.courseType.createDate
          this.dataForm.updater = data.data.courseType.updater
          this.dataForm.updateDate = data.data.courseType.updateDate
          this.dataForm.remark = data.data.courseType.remark
          this.dataForm.deleteFlag = data.data.courseType.deleteFlag
          this.dataForm.collectFlag = data.data.courseType.collectFlag
          this.dataForm.courseList = data.data.courseList
          this.dataForm.classHour = data.data.courseList.length
          this.dataForm.examPaperList = data.data.examPaperList
          if(this.dataForm.collectFlag){
            this.collectBtn = this.$t('course.course_collected')
          }else{
            this.collectBtn = this.$t('course.course_collect')
          }
        }
      })
    },
    // {{$t('button.search')}}课程评分
    getCourseRate() {
      this.$http({
        url: this.$http.adornUrl(`/generator/courserate/info/`+this.id),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.courseRate.count = data.data.num
          this.courseRate.rate = data.data.rate
        }
      })
    },
    // 收藏
    collect(){
      this.$http({
        url: this.$http.adornUrl(`/generator/collectioninfo/save`),
        method: 'post',
        data: this.$http.adornData({
          'userId': this.userId,
          'userName': this.userName,
          'courseId': this.id,
          'courseName': this.dataForm.courseTypeName,
          'creater': this.$store.state.user.name,
          'createDate': getNowTime(),
          'updater': '',
          'updateDate': '',
          'remark': ''
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.dataForm.collectFlag = true
          this.collectBtn = this.$t('course.course_collected')
          this.$message({
            message: this.$t('message.success'),
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.visible = false
              this.$emit('refreshDataList')
            }
          })
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 评分
    rateChange (val) {
      this.courseRate.rate = val
      this.$http({
        url: this.$http.adornUrl(`/generator/courserate/save`),
        method: 'post',
        data: this.$http.adornData({
          'rate': this.courseRate.rate,
          'courseId': this.id,
          'creater': this.dataForm.creater,
          'createDate': this.dataForm.createDate,
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.$message({
            message: this.$t('message.success'),
            type: 'success',
            duration: 1500
          })
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 学习
    play(value){
      if(value.fileType == 'video'){
        this.showPlay = true;
        this.$nextTick(() => {
          this.$refs.play.init(value.uuid,value.name)
        })
      }else{
        window.open(window.SITE_CONFIG.preViewsurl + encodeURIComponent(Base64.encode(value.fileUrl)));
      }

    },
    // 提交
    commitHandle(row){
      this.$http({
        url: this.$http.adornUrl(`/generator/coursereportrecord/getSubmitNums`),
        method: 'get',
        params: this.$http.adornParams({
          'courseReportId': row.uuid,
          'studentId': this.$store.state.user.id
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          if(row.submitNums == 1){
            if(data.submitNums >= 1){
              this.$message.error('已达到最大提交次数')
            }else{
              this.$router.push({path: '/coursereport-answer', query: {coursereport : row }})
            }
          }else{
            this.$router.push({path: '/coursereport-answer', query: {coursereport : row }})
          }
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    //预览
    detailHandle(row){
      this.$http({
        url: this.$http.adornUrl(`/generator/coursereportrecord/getByCourseReportIdAndStudentId`),
        method: 'get',
        params: this.$http.adornParams({
          'courseReportId': row.uuid,
          'studentId': this.$store.state.user.id
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          let courseReport = {
            studentCourseReportTitle : data.courseReportRecord.studentCourseReportTitle,
            content : data.courseReportRecord.content,
            score : data.courseReportRecord.score,
            comment : data.courseReportRecord.comment
          }
          this.$router.push({name: 'coursereport-detail', params: {courseReportId : row.courseReportId,courseReport:courseReport, studentId: row.studentId }})
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 考试
    toAnswer(uuid,subject) {
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
            this.$router.push({path: '/exampaper-detail', query: {uuid: uuid,subject:subject}})
          }else{
            this.$message.error(this.$t('message.max_num'))
          }
        }
      })
    }
  }
};
</script>
<style scoped>
  .course-introduction{
    height: 250px;
  }
  .course-detail{
    margin-top: 5px;
  }
  img{
    width: 95%;
    height: 250px;
  }
  .pane-content{
    height: 370px;
  }
  .text {
    font-size: 14px;
  }
  .item {
    margin-bottom: 15px;
  }
  .el-row {
    margin-bottom: 15px;
  }
  .score {
    height: 200px;
  }
  .font-red {
    color: red;
    font-size: 20px;
  }
  .rate {
    background-color: #6699CC;
    padding: 10px;
  }
  .icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
</style>
