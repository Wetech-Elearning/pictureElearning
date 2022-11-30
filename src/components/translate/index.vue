<template>
  <el-dialog
    style="width: 100%;height: 500px;"
    :title="title"
    :close-on-click-modal="false"
    @close="closeHandle"
    :visible.sync="visible">
    <el-row v-if="flag">
      <el-col :span="3">
        <el-button type="success" @click="add">新增</el-button>
      </el-col>
      <el-col :span="3">
        <el-button type="primary" @click="save">保存</el-button>
      </el-col>
      <!--<el-col :span="4">
        <el-button type="info">模板下载</el-button>
      </el-col>
      <el-col :span="6">
        <upload-file-list
          :fileList.sync="fileList"
          :limit="1"
          :action="'/sys/oss/upload'"
          :fileType="['.xls','.xlsx']"
          :fileSize="1024*1024*30"
          :tips='tips'
        ></upload-file-list>
      </el-col>-->
    </el-row>
    <div class="add" v-if="flag">
      <el-row v-for="(item,index) in translateData" :gutter="10" :key="index">
        <el-col :span="10">
          <el-input placeholder="中文" type="text" style="width: 100%;" v-model="item.chinese"></el-input>
        </el-col>
        <el-col :span="10">
          <el-input placeholder="日文" type="text" style="width: 100%;" v-model="item.japanese"></el-input>
        </el-col>
        <el-col :span="4">
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <svg class="icon" aria-hidden="true" @click="deleteHandler(index,item)">
              <use xlink:href="#icon-shanchu"></use>
            </svg>
          </el-tooltip>
        </el-col>
      </el-row>
    </div>
    <div class="player" v-if="!flag">
      <el-carousel :autoplay="false" height="200px" :loop="false" arrow="always">
        <el-carousel-item v-for="item in translateData" :key="item" >
          <h3>中文:{{ item.chinese }}</h3>
          <h3>日文:{{ item.japanese }}</h3>
        </el-carousel-item>
      </el-carousel>
    </div>
  </el-dialog>
</template>

<script>
  import { getNowTime } from '@/utils'
  export default {
    data () {
      return {
        flag: false,
        relatedCourseId: '',
        tips: '',
        visible: false,
        url: '',
        num: 0,
        successNum: 0,
        fileList: [],
        type: '',
        title: '',
        translateData: [],
        startTime: null,
        endTime: null,
        courseId: '',
        isFinished: '0'
      }
    },
    computed: {
      userName: {
        get () { return this.$store.state.user.name }
      },
      userId: {
        get () { return this.$store.state.user.relateUserId }
      }
    },
    methods: {
      init (id,type,title,flag) {
        this.startTime = new Date().getTime()
        this.courseId = id
        this.flag = flag
        this.relatedCourseId = id
        this.visible = true
        this.type = type
        this.title = title
        this.$nextTick(() => {
          this.$http({
            url: this.$http.adornUrl('/generator/translate/list'),
            method: 'get',
            params: this.$http.adornParams({
              'page': this.pageIndex,
              'limit': this.pageSize,
              'relatedCourseId': this.relatedCourseId,
              'creater': this.flag?this.userName:null
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.translateData = data.page.list
            } else {
              this.translateData = []
            }
          })
        })
      },
      // 上传之前
      beforeUploadHandle (file) {
        //校验文件格式
        let extensionList = [];
        if(this.type == 'video'){
          extensionList = ['mp4']
        }else if(this.type == 'word'){
          extensionList = ['docx']
        }else if(this.type == 'excel'){
          extensionList = ['xls','xlsx']
        }else if(this.type == 'ppt'){
          extensionList = ['pptx']
        }else if(this.type == 'image'){
          extensionList = ['png','jpg','jpge']
        }
        let extension = file.name.split(".")[1];
        if (extensionList.indexOf(extension) < 0) {
          this.$message.warning("文件格式错误，请重新选择文件");
          return false;
        }
        this.num++
      },
      // 上传成功
      successHandle (response, file, fileList) {
        this.fileList = fileList
        this.successNum++
        if (response && response.code === 0) {
          if (this.num === this.successNum) {
            this.$confirm('操作成功, 是否继续操作?', '提示', {
              confirmButtonText: this.$t('message.confirm'),
              cancelButtonText: this.$t('message.cancle'),
              type: 'warning'
            }).catch(() => {
              this.visible = false
            })
          }
        } else {
          this.$message.error(response.msg)
        }
      },
      // 新增
      add () {
        this.translateData.push(
          {
            'chinese': '',
            'japanese': '',
            'relatedCourseId': this.relatedCourseId,
            'createDate': getNowTime(),
            'updateDate': getNowTime(),
            'creater': this.userName,
            'updater': this.userName,
            'deleteFlag': 0,
            'remark': ''
          }
        )
      },
      // 删除
      deleteHandler (index,item) {
        this.translateData.splice(index,1)
        this.$confirm(`确定对该条记录进行['删除']操作?`, '提示', {
          confirmButtonText: this.$t('message.confirm'),
          cancelButtonText: this.$t('message.cancle'),
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/generator/translate/delete'),
            method: 'post',
            data: this.$http.adornData([item.uuid], false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: this.$t('message.success'),
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      },
      //保存
      save () {
        let flag = false
        this.translateData.map((item)=>{
          if(item.chinese == '' || item.japanese == ''){
            flag = true
          }
        });
        if(!flag){
          this.$http({
            url: this.$http.adornUrl(`/generator/translate/save`),
            method: 'post',
            data: this.$http.adornData({
              'translateEntityList': this.translateData,
              'relatedCourseId': this.relatedCourseId
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
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
        }else{
          this.$message.error('请填写数据')
        }
      },
      // 弹窗关闭时
      closeHandle () {
        this.fileList = []
        this.$emit('refreshDataList')
        //记录学习时间
        this.endTime = new Date().getTime()
        console.log('this.endTime',this.endTime)
        console.log('this.startTime',this.startTime)
        let second = parseInt(this.endTime / 1000) - parseInt(this.startTime / 1000)
        this.$http({
          url: this.$http.adornUrl(`/generator/studentstudyrecord/save`),
          method: 'post',
          data: this.$http.adornData({
            "uuid":undefined,
            "userId":this.$store.state.user.id,
            "courseId":this.courseId,
            "learnTime":second,
            "onlineTime":second,
            "courseTotalTime":this.translateData.length * 5,
            "isFinished":this.isFinished,
            "deleteFlag":0
          })
        }).then(({data}) => {

        })
      }
    }
  }
</script>
<style lang="scss">
  .el-row {
    margin-bottom: 20px;
  }
  .el-carousel__item h3 {
    color: #475669;
    font-size: 18px;
    opacity: 0.75;
    line-height: 100px;
    margin: 0;
    margin-left: 80px;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
</style>
