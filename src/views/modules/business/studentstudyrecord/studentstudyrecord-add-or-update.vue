<template>
  <el-dialog
    :title="!dataForm.uuid ? $t('button.add') : $t('button.update')"
    :close-on-click-modal="false"
    @close="closeDialog"
    v-if="visible"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px">
    <el-form-item label="学员id" prop="userId">
      <el-input v-model="dataForm.userId" placeholder="学员id"></el-input>
    </el-form-item>
    <el-form-item label="班级id" prop="classId">
      <el-input v-model="dataForm.classId" placeholder="班级id"></el-input>
    </el-form-item>
    <el-form-item label="课程id" prop="courseId">
      <el-input v-model="dataForm.courseId" placeholder="课程id"></el-input>
    </el-form-item>
    <el-form-item label="学习时长" prop="learnTime">
      <el-input v-model="dataForm.learnTime" placeholder="学习时长"></el-input>
    </el-form-item>
    <el-form-item label="课程总时长" prop="courseTotalTime">
      <el-input v-model="dataForm.courseTotalTime" placeholder="课程总时长"></el-input>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog()">{{$t('button.cancle')}}</el-button>
      <el-button type="primary" @click="dataFormSubmit()">{{$t('button.confirm')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          uuid: 0,
          userId: '',
          classId: '',
          courseId: '',
          learnTime: '',
          courseTotalTime: '',
          deleteFlag: '0'
        },
        dataRule: {
          userId: [
            { required: true, message: '学员id不能为空', trigger: 'blur' }
          ],
          classId: [
            { required: true, message: '班级id不能为空', trigger: 'blur' }
          ],
          courseId: [
            { required: true, message: '课程id不能为空', trigger: 'blur' }
          ],
          learnTime: [
            { required: true, message: '学习时长不能为空', trigger: 'blur' }
          ],
          courseTotalTime: [
            { required: true, message: '课程总时长不能为空', trigger: 'blur' }
          ],
          deleteFlag: [
            { required: true, message: '删除标识不能为空', trigger: 'blur' }
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
              url: this.$http.adornUrl(`/generator/studentstudyrecord/info/${this.dataForm.uuid}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.userId = data.studentStudyRecord.userId
                this.dataForm.classId = data.studentStudyRecord.classId
                this.dataForm.courseId = data.studentStudyRecord.courseId
                this.dataForm.learnTime = data.studentStudyRecord.learnTime
                this.dataForm.courseTotalTime = data.studentStudyRecord.courseTotalTime
                this.dataForm.deleteFlag = data.studentStudyRecord.deleteFlag
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/generator/studentstudyrecord/${!this.dataForm.uuid ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'uuid': this.dataForm.uuid || undefined,
                'userId': this.dataForm.userId,
                'classId': this.dataForm.classId,
                'courseId': this.dataForm.courseId,
                'learnTime': this.dataForm.learnTime,
                'courseTotalTime': this.dataForm.courseTotalTime,
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
