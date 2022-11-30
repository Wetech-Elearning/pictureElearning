<template>
  <div>
    <video v-if="this.dataForm.fileType=='video'" ref="myvideo"
           controls  @canplay="getTotal" @play="play" @pause="pause" @timeupdate="timeupdate"
           @durationchange="durationchange" style="width: 100%;">
      <source :src="dataForm.fileUrl" type="video/mp4"/>
    </video>
    <div v-if="dataForm.fileType!='video'">
      <div style="height: 30px;width: 100%;text-align: right">
        <el-button size="mini" @click="makeBigPannel" v-if="isbigPannel == false">放大</el-button>
        <el-button size="mini" @click="makeSmallPannel" v-if="isbigPannel == true">缩小</el-button>
      </div>
      <iframe :src="iframeUrl" style="width: 100%;height: 650px;border: none;"></iframe>
    </div>
    <div>
      <leaveMessage  ref="leaveMessage"/>
    </div>
  </div>
</template>

<script>
import { videoPlayer } from "vue-video-player";
import "video.js/dist/video-js.css";
import "vue-video-player/src/custom-theme.css";
import leaveMessage from './leaveMessage'
let Base64 = require('js-base64').Base64;
export default {
  name: "showVideo",
  components: {
    videoPlayer,
    leaveMessage
  },
  data() {
    return {
      visible: false,
      isbigPannel:false,
      playTime:'',
      current:'',
      totalTime:'',
      currentTime:'',
      isFinished:0,
      iframeUrl:'',
      startTime:'',
      hisOnlineTime:0,
      dataForm:{
        uuid: 0,
        courseName: '',
        courseIntroduction: '',
        relatedCourseType: '',
        serial: '',
        fileType: '',
        fileId:'',
        fileUrl: '',
        totalTime: '',
        examPaperId: '',
        status: '',
        creater: '',
        createDate: '',
        updater: '',
        updateDate: '',
        remark: '',
        deleteFlag: '0',
      },
      setintervalss:null,
      playerOptions : {
        playbackRates : [ 0.5, 1.0, 1.5, 2.0 ], //可选择的播放速度
        autoplay : false, //如果true,浏览器准备好时开始回放。
        muted : false, // 默认情况下将会消除任何音频。
        loop : false, // 视频一结束就重新开始。
        preload : 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language : 'zh-CN',
        aspectRatio : '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid : true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources : [ {
          type : "",
          src : ''//url地址
        } ],
        poster : "", //你的封面地址
        // width: document.documentElement.clientWidth,
        notSupportedMessage : '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar : {
          timeDivider : true,//当前时间和持续时间的分隔符
          durationDisplay : true,//显示持续时间
          remainingTimeDisplay : false,//是否显示剩余时间功能
          fullscreenToggle : true  //全屏按钮
        }
      }
    };
  },
  mounted() {
    this.init()
  },
  methods: {
    makeBigPannel(){
      this.$emit('bigpannel')
      this.isbigPannel = true

    },
    makeSmallPannel(){
      this.$emit('smallpannel')

      this.isbigPannel = false

    },
    play(){
      this.$nextTick(() => {
        this.setintervalss = setInterval(() => {
          this.saveRecordTime()
        },5000);
      })
    },
    pause(){
      clearInterval(this.setintervalss)
      this.setintervalss=null
    },
    timeFormat(time) {
      let minute = Math.floor((time % 3600) / 60)
      let second = Math.floor(time % 60)
      minute = minute < 10 ? "0" + minute : minute
      second = second < 10 ? "0" + second : second
      return `${minute}:${second}`
    },
    initNoVideoListener(){
      this.$nextTick(() => {
        if(this.setintervalss ==null){
          this.setintervalss = setInterval(() => {
            this.saveRecordTimeByNoVideo()
          },5000);
        }
      })


    },
    durationchange(time){
      this.$nextTick(() => {
        this.$refs.myvideo.currentTime=time
      })
    },
    getTotal() {
      this.totalTime = this.timeFormat(this.$refs.myvideo.duration)
    },
    timeupdate() {
      this.currentTime = this.timeFormat(this.$refs.myvideo.currentTime)
    },
    closeDialog (){
      clearInterval(this.setintervalss)
      Object.assign(this.$data, this.$options.data())
    },
    init (id,courseType) {
      if(id == null ||id == undefined){
        id = this.$route.query.uuid
      }
      this.dataForm.uuid = id || 0
      this.visible = true
      this.$refs.leaveMessage.init(this.dataForm.uuid,courseType);
      this.$nextTick(() => {
        if (this.dataForm.uuid) {
          this.$http({
            url: this.$http.adornUrl(`/generator/course/infos/${this.dataForm.uuid}`),
            method: 'get',
            params: this.$http.adornParams({
              "studentId":this.$store.state.user.id
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.dataForm.courseName = data.course.courseName
              this.dataForm.courseIntroduction = data.course.courseIntroduction
              this.dataForm.relatedCourseType = data.course.relatedCourseType
              this.dataForm.serial = data.course.serial
              this.dataForm.fileType = data.course.fileType
              this.dataForm.fileId = data.course.fileId
              this.dataForm.fileUrl = data.course.fileUrl
              this.dataForm.totalTime = data.course.totalTime
              this.dataForm.examPaperId = data.course.examPaperId
              this.dataForm.status = data.course.status
              this.dataForm.creater = data.course.creater
              this.dataForm.createDate = data.course.createDate
              this.dataForm.updater = data.course.updater
              this.dataForm.updateDate = data.course.updateDate
              this.dataForm.remark = data.course.remark
              this.dataForm.deleteFlag = data.course.deleteFlag
              this.hisOnlineTime = parseFloat(data.course.onlineTime==null?0:data.course.onlineTime)
              if(this.dataForm.fileType=='video'){
                // this.$refs.myvideo.src=data.course.fileUrl;
                this.startTime = new Date().getTime()
                this.durationchange(data.course.readTime)
              } else {
                this.iframeUrl = window.SITE_CONFIG.preViewsurl+encodeURIComponent(Base64.encode(this.dataForm.fileUrl))
                this.startTime = new Date().getTime()
                if(data.course.totalTime==''||data.course.totalTime==null||data.course.totalTime.indexOf(":")>0){
                  data.course.totalTime=5
                }
                if(data.course.totalTime<60){
                  data.course.totalTime = data.course.totalTime*60
                }
                // data.course.totalTime=10
                data.course.totalTime = data.course.totalTime
                this.dataForm.totalTime = data.course.totalTime
                this.totalTime = data.course.totalTime
                this.initNoVideoListener();
              }
            }
          })
        }
      })
    },
    saveRecordTime(){
      var leantime = this.$refs.myvideo.currentTime
      if(this.$refs.myvideo.duration - this.$refs.myvideo.currentTime < 60){
        this.isFinished = 1
      }
      this.totalTime = this.$refs.myvideo.duration
      var times = new Date().getTime();
      var currenttiem = (times-this.startTime)/1000 + this.hisOnlineTime;
      this.currentTime = this.timeFormat(currenttiem)
      if(currenttiem < this.totalTime){
        if(this.totalTime - currenttiem > 60){
          this.currentTime = currenttiem
          this.isFinished = 0
        } else {
          this.isFinished = 1
          this.currentTime = currenttiem
        }
      } else {
        this.isFinished = 1
        this.currentTime = this.totalTime
      }
      this.$http({
        url: this.$http.adornUrl(`/generator/studentstudyrecord/save`),
        method: 'post',
        data: this.$http.adornData({
          "uuid":undefined,
          "userId":this.$store.state.user.id,
          "courseId":this.dataForm.uuid,
          "learnTime":leantime,
          "onlineTime":this.currentTime,
          "courseTotalTime":this.totalTime,
          "isFinished":this.isFinished,
          "deleteFlag":0
        })
      }).then(({data}) => {

      })
    },
    saveRecordTimeByNoVideo(){
      this.totalTime = this.dataForm.totalTime
      var times = new Date().getTime();
      var currenttiem = (times-this.startTime)/1000;
      this.currentTime = currenttiem
      if(currenttiem < (this.totalTime)){
        if((this.totalTime - currenttiem )>60){
          this.isFinished = 0
        } else {
          this.isFinished = 1
        }
      } else {
        this.isFinished = 1
      }
	  var onlinetime = (times-this.startTime)/1000 + this.hisOnlineTime;
      if(currenttiem < (this.totalTime)){
        this.currentTime = currenttiem
      } else {
        this.currentTime = this.totalTime
      }
      this.$http({
        url: this.$http.adornUrl(`/generator/studentstudyrecord/save`),
        method: 'post',
        data: this.$http.adornData({
          "uuid":undefined,
          "userId":this.$store.state.user.id,
          "courseId":this.dataForm.uuid,
          "learnTime":this.currentTime,
		  "onlineTime":onlinetime,
          "courseTotalTime":this.totalTime,
          "isFinished":this.isFinished,
          "deleteFlag":0
        })
      }).then(({data}) => {

      })
    },
    clearObj(){
      Object.assign(this.$data, this.$options.data.call(this));
    }
  },
  beforeDestroy () {
    clearInterval(this.setintervalss)
    this.setintervalss =null
  }
};
</script>

<style scoped>

</style>
