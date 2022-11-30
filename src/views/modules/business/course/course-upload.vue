<template>
  <el-dialog
    title="上传"
    :close-on-click-modal="false"
    @close="closeHandle"
    v-if="visible"
    :visible.sync="visible">
    <el-upload
      drag
      :action="url"
      :before-upload="beforeUploadHandle"
      :on-success="successHandle"
      multiple
      :file-list="fileList"
      style="text-align: center;">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">{{common.upload_tip}}<em>{{common.click_upload_tip}}</em></div>
      <!--<div class="el-upload__tip" slot="tip">只支持jpg、png、gif格式的图片！</div>-->
    </el-upload>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        url: '',
        num: 0,
        successNum: 0,
        fileList: []
      }
    },
    methods: {
      init (id) {
        this.visible = true
        this.$nextTick(() => {
          this.url = this.$http.adornUrl(`/sys/alibaba/oss/upload?token=${this.$cookie.get('token')}&uuid=`+id)
        })
      },
      // 上传之前
      beforeUploadHandle (file) {
        this.num++
      },
      // 上传成功
      successHandle (response, file, fileList) {
        this.fileList = fileList
        this.successNum++
        if (response && response.code === 0) {
          if (this.num === this.successNum) {
            this.$confirm(this.$t('message.oper_success_tip'), this.$t("message.tip"), {
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
      // 弹窗关闭时
      closeHandle () {
        this.fileList = []
        this.$emit('refreshDataList')
      }
    }
  }
</script>
