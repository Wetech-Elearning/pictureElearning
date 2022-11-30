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
    <el-form-item label="课程id" prop="courseId">
      <el-input v-model="dataForm.courseId" placeholder="课程id"></el-input>
    </el-form-item>
    <el-form-item label="试卷id" prop="examPaperId">
      <el-input v-model="dataForm.examPaperId" placeholder="试卷id"></el-input>
    </el-form-item>
    <el-form-item label="分数" prop="score">
      <el-input v-model="dataForm.score" placeholder="分数"></el-input>
    </el-form-item>
    <el-form-item label="考试开始时间" prop="createDate">
      <el-date-picker
        v-model="dataForm.startDate"
        type="datetime"
        placeholder="考试开始时间"
        value-format="yyyy-MM-dd HH:mm:ss"
        format="yyyy-MM-dd HH:mm:ss"
        default-time="12:00:00">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="考试结束时间" prop="updateDate">
      <el-date-picker
        v-model="dataForm.endDate"
        type="datetime"
        placeholder="考试结束时间"
        value-format="yyyy-MM-dd HH:mm:ss"
        format="yyyy-MM-dd HH:mm:ss"
        default-time="12:00:00">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="考试是否合格" prop="isPass">
      <el-input v-model="dataForm.isPass" placeholder="考试是否合格"></el-input>
    </el-form-item>
    <el-form-item label="是否考试" prop="isExam">
      <el-input v-model="dataForm.isExam" placeholder="是否考试"></el-input>
    </el-form-item>
    <el-form-item label="考试次数" prop="examNum">
      <el-input v-model="dataForm.examNum" placeholder="考试次数"></el-input>
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
          courseId: '',
          examPaperId: '',
          score: '',
          startDate: '',
          endDate: '',
          isPass: '',
          isExam: '',
          examNum: ''
        },
        dataRule: {
          userId: [
            { required: true, message: '学员id不能为空', trigger: 'blur' }
          ],
          courseId: [
            { required: true, message: '课程id不能为空', trigger: 'blur' }
          ],
          examPaperId: [
            { required: true, message: '试卷id不能为空', trigger: 'blur' }
          ],
          score: [
            { required: true, message: '分数不能为空', trigger: 'blur' }
          ],
          startDate: [
            { required: true, message: '考试开始时间不能为空', trigger: 'blur' }
          ],
          endDate: [
            { required: true, message: '考试结束时间不能为空', trigger: 'blur' }
          ],
          isPass: [
            { required: true, message: '考试是否合格不能为空', trigger: 'blur' }
          ],
          isExam: [
            { required: true, message: '是否考试不能为空', trigger: 'blur' }
          ],
          examNum: [
            { required: true, message: '考试次数不能为空', trigger: 'blur' }
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
              url: this.$http.adornUrl(`/generator/userexaminfo/info/${this.dataForm.uuid}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.userId = data.userExamInfo.userId
                this.dataForm.courseId = data.userExamInfo.courseId
                this.dataForm.examPaperId = data.userExamInfo.examPaperId
                this.dataForm.score = data.userExamInfo.score
                this.dataForm.startDate = data.userExamInfo.startDate
                this.dataForm.endDate = data.userExamInfo.endDate
                this.dataForm.isPass = data.userExamInfo.isPass
                this.dataForm.isExam = data.userExamInfo.isExam
                this.dataForm.examNum = data.userExamInfo.examNum
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
              url: this.$http.adornUrl(`/generator/userexaminfo/${!this.dataForm.uuid ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'uuid': this.dataForm.uuid || undefined,
                'userId': this.dataForm.userId,
                'courseId': this.dataForm.courseId,
                'examPaperId': this.dataForm.examPaperId,
                'score': this.dataForm.score,
                'startDate': this.dataForm.startDate,
                'endDate': this.dataForm.endDate,
                'isPass': this.dataForm.isPass,
                'isExam': this.dataForm.isExam,
                'examNum': this.dataForm.examNum
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
