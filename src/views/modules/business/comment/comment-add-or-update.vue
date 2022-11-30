<template>
  <el-dialog
    :title="$t('comment.comment_reply')"
    :close-on-click-modal="false"
    @close="closeDialog"
    v-if="visible"
    :visible.sync="visible">
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px">
        <el-form-item prop="replyContent">
          <el-input v-model="dataForm.replyContent" type="text" :placeholder="$t('comment.reply_content')"/>
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
        visible: false,
        dataForm: {
          createrId: '',
          content: '',
          courseId: '',
          createDate: '',
          replyContent: '',
          creater: ''
        },
        dataRule: {
          replyContent: [
            { required: true, message: this.$t('comment.not_null_reply_content'), trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.uuid = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.uuid) {
            this.$http({
              url: this.$http.adornUrl(`/generator/leavemessage/info/${this.dataForm.uuid}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.createrId = data.data.createrId
                this.dataForm.content = data.data.content
                this.dataForm.courseId = data.data.courseId
                this.dataForm.createDate = data.data.createDate
                this.dataForm.creater = data.data.creater
              }
            })
          }else{
            this.dataForm.createDate = getNowTime()
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/generator/leavemessage/reply`),
              method: 'post',
              data: this.$http.adornData({
                'createrId': this.$store.state.user.id,
                'content': this.dataForm.replyContent,
                'courseId': this.dataForm.courseId,
                'createTime': getNowTime(),
                'creater': this.$store.state.user.name,
                'parentUuid': this.dataForm.uuid
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: this.$t('message.success'),
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.closeDialog()
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
      // 关闭Dialog
      closeDialog () {
        this.$refs['dataForm'].resetFields()
        this.visible = false
      }
    }
  }
</script>
