<template>
  <div>
    <div>
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="dataForm.title" placeholder="标题"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="dataForm.content" placeholder="内容"></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align: center">
        <span slot="footer" class="dialog-footer">
          <el-button @click="visible = false">{{$t('button.cancle')}}</el-button>
          <el-button type="primary" @click="dataFormSubmit()">发布</el-button>
         </span>
      </div>

    </div>

  </div>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          uuid: 0,
          title: '',
          parentUuid: '',
          createrId: '',
          creater: '',
          content: '',
          createTime: '',
          deleteFlag: 0
        },
        dataRule: {
          title: [
            { required: true, message: '标题不能为空', trigger: 'blur' }
          ],
          content: [
            { required: true, message: '内容不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.parentUuid = id || 0
        this.visible = true
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/generator/questionpark/save'}`),
              method: 'post',
              data: this.$http.adornData({
                'uuid': this.dataForm.uuid || undefined,
                'parentUuid': this.dataForm.parentUuid,
                'title': this.dataForm.title,
                'createrId': this.$store.state.user.id,
                'creater': this.$store.state.user.name,
                'content': this.dataForm.content,
                'createTime': this.dataForm.createTime,
                'deleteFlag': this.dataForm.deleteFlag
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
          }
        })
      }
    }
  }
</script>
