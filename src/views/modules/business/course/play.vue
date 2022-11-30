<template>
  <div>
    <el-dialog
      :fullscreen="true"
      :title="dataForm.courseName"
      :close-on-click-modal="false"
      v-if="visible"
      @close='closeDialog'
      :visible.sync="visible">
      <video v-if="dataForm.fileType=='video'" ref="myvideo" controlslist="nodownload"  controls  @canplay="getTotal" @timeupdate="timeupdate" @durationchange="durationchange" style="width: 100%;">
        <source :src="dataForm.fileUrl" type="video/mp4"/>
      </video>
      <div v-if="dataForm.fileType!='video'">
        <iframe :src="iframeUrl" style="width: 100%;height: 600px;border: none;"></iframe>
      </div>
      <leaveMessage ref="leaveMessage"/>
    </el-dialog>
  </div>
</template>
<script>
  let Base64 = require('js-base64').Base64
  import leaveMessage from './leaveMessage'
export default {
  name: "showVideo",
  components: {
    // videoPlayer
    leaveMessage
  },
  data() {
    return {
      visible: false,
      playTime:'',
      current:'',
      myvideo:null,
      currentTime:0,
      totalTime:0,
      isFirst:true,
      iframeUrl:'',
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
        deleteFlag: '0'
      }
    };
  },
  mounted() {
    setInterval(() => {
      if(Date.now() - this.startTime > 5000) {
        this.isShow = false
      }
    },1000);
  },
  methods: {
    timeFormat(time) {
      let minute = Math.floor((time % 3600) / 60)
      let second = Math.floor(time % 60)
      minute = minute < 10 ? "0" + minute : minute
      second = second < 10 ? "0" + second : second
      return `${minute}:${second}`
    },
    durationchange(){
      console.log(this.timeFormat(this.$refs.myvideo.duration))
      if(this.isFirst){
        this.$refs.myvideo.currentTime=0;
        this.isFirst = false;
      }
    },
    getTotal() {
      console.log(this.$refs.myvideo.duration)
      console.log(this.$refs.myvideo)
      this.totalTime = this.timeFormat(this.$refs.myvideo.duration)
    },
    timeupdate() {
      this.currentTime = this.timeFormat(this.$refs.myvideo.currentTime)
    },
    closeDialog (){
      Object.assign(this.$data, this.$options.data())
      if(this.dataForm.fileType == 'video'){
        this.$refs.myvideo.src = null
      }
    },
    init (id) {
      this.dataForm.uuid = id || 0
      this.visible = true
      this.$nextTick(() => {
        if (this.dataForm.uuid) {
          this.$refs.leaveMessage.init(this.dataForm.uuid);
          this.$http({
            url: this.$http.adornUrl(`/generator/course/info/${this.dataForm.uuid}`),
            method: 'get',
            params: this.$http.adornParams()
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
              console.log("this.dataForm.fileType====="+this.dataForm.fileType)
              if(this.dataForm.fileType=='video'){
              } else {
                console.log(this.dataForm.fileUrl)
                console.log('预览地址：', window.SITE_CONFIG.preViewsurl)
                this.iframeUrl = window.SITE_CONFIG.preViewsurl+encodeURIComponent(Base64.encode(this.dataForm.fileUrl))
              }
            }
          })
        }
      })
    }
  }
};
</script>

<style scoped>

</style>
