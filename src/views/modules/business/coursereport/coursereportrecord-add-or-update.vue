<template>
  <el-dialog
    :title="!dataForm.uuid ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <!--<el-form-item label="课程报告id" prop="courseReportId">
        <el-input v-model="dataForm.courseReportId" placeholder="课程报告id"></el-input>
      </el-form-item>-->
      <el-form-item label="学员课程报告标题" prop="studentCourseReportTitle">
        <el-input v-model="dataForm.studentCourseReportTitle" placeholder="学员课程报告标题"></el-input>
      </el-form-item>
      <el-form-item label="学员id" prop="studentId">
        <el-input v-model="dataForm.studentId" placeholder="学员id"></el-input>
      </el-form-item>
      <el-form-item label="课程报告内容" prop="content">
        <el-input v-model="dataForm.content" placeholder="课程报告内容"></el-input>
      </el-form-item>
      <el-form-item label="评语" prop="comment">
        <el-input v-model="dataForm.comment" placeholder="评语"></el-input>
      </el-form-item>
      <el-form-item label="评分" prop="score">
        <el-input type="number" v-model="dataForm.score" placeholder="评分"></el-input>
      </el-form-item>
      <el-form-item label="阅读状态" prop="status">
        <el-select v-model="dataForm.status" placeholder="阅读状态" style="width: 100%;">
          <el-option label="未批注" value="0"></el-option>
          <el-option label="已批注" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
      </el-form-item>
      <el-form-item label="附件" prop="file">
        <el-input v-model="dataForm.file" placeholder="附件"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
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
          uuid: 0,
          courseReportId: '',
          studentCourseReportTitle: '',
          studentId: '',
          content: '',
          comment: '',
          score: '',
          status: '',
          file: '',
          creater: '',
          createDate: '',
          updateDate: '',
          remark: ''
        },
        dataRule: {
          courseReportId: [
            { required: true, message: '课程报告id不能为空', trigger: 'blur' }
          ],
          studentCourseReportTitle: [
            { required: true, message: '学员课程报告标题不能为空', trigger: 'blur' }
          ],
          studentId: [
            { required: true, message: '学员id不能为空', trigger: 'blur' }
          ],
          content: [
            { required: true, message: '课程报告内容不能为空', trigger: 'blur' }
          ],
          comment: [
            { required: true, message: '评语不能为空', trigger: 'blur' }
          ],
          score: [
            { required: true, message: '评分不能为空', trigger: 'blur' }
          ],
          status: [
            { required: true, message: '阅读状态不能为空', trigger: 'blur' }
          ]
        }
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
        this.dataForm.uuid = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.uuid) {
            this.$http({
              url: this.$http.adornUrl(`/generator/coursereportrecord/info/${this.dataForm.uuid}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.courseReportId = data.courseReportRecord.courseReportId
                this.dataForm.studentCourseReportTitle = data.courseReportRecord.studentCourseReportTitle
                this.dataForm.studentId = data.courseReportRecord.studentId
                this.dataForm.content = data.courseReportRecord.content
                this.dataForm.comment = data.courseReportRecord.comment
                this.dataForm.score = data.courseReportRecord.score
                this.dataForm.status = data.courseReportRecord.status
                this.dataForm.file = data.courseReportRecord.file
                this.dataForm.createDate = data.courseReportRecord.createDate
                this.dataForm.updateDate = data.courseReportRecord.updateDate
                this.dataForm.remark = data.courseReportRecord.remark
              }
            })
          }else{
            this.dataForm.creater = this.userId
            this.dataForm.createDate = getNowTime()
            this.dataForm.updateDate = getNowTime()
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if(!this.dataForm.uuid){
              this.dataForm.createDate = getNowTime()
              this.dataForm.updateDate = getNowTime()
            }else{
              this.dataForm.updateDate = getNowTime()
            }
            this.$http({
              url: this.$http.adornUrl(`/generator/coursereportrecord/${!this.dataForm.uuid ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'uuid': this.dataForm.uuid || undefined,
                'courseReportId': this.dataForm.courseReportId,
                'studentCourseReportTitle': this.dataForm.studentCourseReportTitle,
                'studentId': this.dataForm.studentId,
                'content': this.dataForm.content,
                'comment': this.dataForm.comment,
                'score': this.dataForm.score,
                'status': this.dataForm.status,
                'file': this.dataForm.file,
                'creater': this.dataForm.creater,
                'createDate': this.dataForm.createDate,
                'updateDate': this.dataForm.updateDate,
                'remark': this.dataForm.remark
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
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
