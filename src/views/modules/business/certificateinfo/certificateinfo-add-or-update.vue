<template>
  <el-dialog
    :title="!dataForm.uuid ? $t('button.add') : $t('button.update')"
    :close-on-click-modal="false"
    @close="closeDialog"
    v-if="visible"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px">
      <el-form-item :label="$t('certificateinfo.certificateinfo_name')" prop="certificateName">
        <el-input v-model="dataForm.certificateName" maxlength="20" show-word-limit :placeholder="$t('certificateinfo.certificateinfo_name')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('common.remark')" prop="remark">
        <el-input v-model="dataForm.remark" :placeholder="$t('common.remark')"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog()">{{$t('button.cancle')}}</el-button>
      <el-button type="primary" @click="dataFormSubmit()">{{$t('button.confirm')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { getNowTime } from '@/utils'
  export default {
    data () {
      return {
        url: '',
        dialogImageUrl:'',
        dialogVisible:false,
        visible: false,
        dataForm: {
          uuid: 0,
          certificateName: '',
          certificateCover:'',
          creater: '',
          createDate: '',
          updater: '',
          updateDate: '',
          remark: '',
          deleteFlag:'0'
        },
        dataRule: {
          certificateName: [
            { required: true, message: this.$t('certificateinfo.not_null_certificateinfo_name'), trigger: 'blur' }
          ]
        },
        courseOptions: []
      }
    },
    computed: {
      userName: {
        get () { return this.$store.state.user.name }
      },
      userId: {
        get () { return this.$store.state.user.id }
      }
    },
    methods: {
      init (id) {
        //初始化上传url
        this.url = this.$http.adornUrl(`/sys/alibaba/oss/upload?token=${this.$cookie.get('token')}&uuid=`+id)
        this.dataForm.uuid = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.uuid) {
            this.$http({
              url: this.$http.adornUrl(`/generator/certificateinfo/info/${this.dataForm.uuid}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.certificateName = data.certificateInfo.certificateName
                this.dataForm.certificateCover = data.certificateInfo.certificateCover
                this.dataForm.creater = data.certificateInfo.creater
                this.dataForm.createDate = data.certificateInfo.createDate
                this.dataForm.updater = data.certificateInfo.updater
                this.dataForm.updateDate = data.certificateInfo.updateDate
                this.dataForm.remark = data.certificateInfo.remark
                this.dataForm.deleteFlag = data.certificateInfo.deleteFlag
              }
            })
          }else{
            this.dataForm.creater = this.userId
            this.dataForm.createDate = getNowTime()
            this.dataForm.updater = this.userId
            this.dataForm.updateDate = getNowTime()
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/generator/certificateinfo/${!this.dataForm.uuid ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'uuid': this.dataForm.uuid || undefined,
                'certificateName': this.dataForm.certificateName,
                'certificateCover': this.dataForm.certificateCover,
                'creater': this.dataForm.creater,
                'createDate': this.dataForm.createDate,
                'updater': this.dataForm.updater,
                'updateDate': this.dataForm.updateDate,
                'remark': this.dataForm.remark,
                'deleteFlag': this.dataForm.deleteFlag
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: this.$t('message.success'),
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.closeDialog()
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      //上传成功回调
      successHandle(url){
        this.dataForm.certificateCover = url
      },
      // 移除
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      // 预览
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      // 关闭
      closeDialog() {
        this.$refs['dataForm'].resetFields()
        this.visible = false
      }
    }
  }
</script>
