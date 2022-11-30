<template>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
    @close="closeHandle"
    v-if="visible"
    :visible.sync="visible">
    <el-upload
      drag
      :headers="headers"
      :action="url"
      :before-upload="beforeUploadHandle"
      :on-success="successHandle"
      multiple
      :file-list="fileList"
      style="text-align: center;">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">{{$t('common.upload_tip')}}<em>{{$t('common.click_upload_tip')}}</em></div>
      <!--<div class="el-upload__tip" slot="tip">只支持jpg、png、gif格式的图片！</div>-->
    </el-upload>
    <el-dialog
      width="40%"
      title="错误:"
      v-if="code != '' && code != undefined"
      :visible.sync="innerVisible"
      append-to-body>
      <el-row v-for="(item ,index) in error" :key="index">
        <el-col :span="4">{{item['序号']}}</el-col>
        <el-col :span="20">{{item['校验失败']}}</el-col>
      </el-row>
    </el-dialog>
  </el-dialog>
</template>

<script>
  import Vue from 'vue'

  export default {
    props:{
      url: {
        type: String,
        default: '',
        headers:{}
      },
    },
    data () {
      return {
        visible: false,
        innerVisible: false,
        url: '',
        num: 0,
        successNum: 0,
        fileList: [],
        type: '',
        title: '',
        code: '',
        error: []
      }
    },
    methods: {
      init (id,type,title,code) {
        this.visible = true
        this.type = type
        this.code = code
        this.title = this.$t('common.upload') + title
        this.$nextTick(() => {
          this.headers = {
            tenantId : Vue.cookie.get('tenantId')
          }
          if(code == '学员导入'){
            this.url = this.$http.adornUrl(`/generator/student/importExcel?token=${this.$cookie.get('token')}&uuid=`+id+'&objType='+code)
          }else if(code == '讲师导入'){
            this.url = this.$http.adornUrl(`/generator/lecturer/importExcel?token=${this.$cookie.get('token')}&uuid=`+id+'&objType='+code)
          }else if(code == '企业管理员导入'){
            this.url = this.$http.adornUrl(`/generator/administrators/importExcel?token=${this.$cookie.get('token')}&uuid=`+id+'&objType='+code)
          }else{
            this.url = this.$http.adornUrl(`/sys/aws/oss/upload?token=${this.$cookie.get('token')}&uuid=`+id+'&objType=11111111111')
          }
          console.log('code=========',code)
        })
      },
      // 上传之前
      beforeUploadHandle (file) {
        //校验文件格式
        let extensionList = [];
        if(this.type == 'video'){
          extensionList = ['mp4','flv']
        }else if(this.type == 'word'){
          extensionList = ['docx']
        }else if(this.type == 'excel'){
          extensionList = ['xls','xlsx']
        }else if(this.type == 'ppt'){
          extensionList = ['pptx','ppt']
        }else if(this.type == 'image'){
          extensionList = ['png','jpg','jpeg']
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
        console.log('response=====',response)
        if(response.code == 0){
          this.$message.info('上传成功')
        }else{
          if(this.code == '学员导入' || this.code == '讲师导入' || this.code == '企业管理员导入'){
            this.innerVisible = true
            this.error = response.data
          }else{
            // this.$message.error(response.msg)
            console.log('上传:' + response.msg)
          }
        }

      },
      // 弹窗关闭时
      closeHandle () {
        this.fileList = []
        this.$emit('refreshDataList')
      }
    }
  }
</script>
