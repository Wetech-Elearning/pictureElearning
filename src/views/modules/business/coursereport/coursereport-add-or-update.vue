<template>
  <el-dialog
    :title="!dataForm.uuid ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="二级课程包名称" prop="courseTypeId">
      <custom-select
        style="width:100%;"
        :action="'/generator/coursetype/listTwoLevelCourseType'"
        :props="{label: 'courseTypeName', value: 'uuid'}"
        :placeHolder="$t('course.course_name')"
        :value.sync="dataForm.courseTypeId"
        :label.sync="dataForm.courseTypeName"
      ></custom-select>
    </el-form-item>
    <el-form-item label="课程报告题目" prop="courseReportTitle">
      <el-input v-model="dataForm.courseReportTitle" placeholder="课程报告题目"></el-input>
    </el-form-item>
    <el-form-item label="内容要求" prop="courseReportContent">
      <el-input type="textarea" v-model="dataForm.courseReportContent" placeholder="内容要求"></el-input>
    </el-form-item>
    <el-form-item label="发布状态" prop="status">
      <el-select v-model="dataForm.status" :placeholder="$t('paper.paper_status')" style="width: 100%;" :disabled="!dataForm.uuid ? true : false">
        <el-option :label="$t('common.unrelease')" value="0"></el-option>
        <el-option :label="$t('common.release')" value="1"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="提交次数" prop="submitNums">
      <el-select v-model="dataForm.submitNums" style="width: 100%;">
        <el-option label="1次" value="1"></el-option>
        <el-option label="无限制" value="0"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="分数" prop="score">
      <el-input type="number" v-model="dataForm.score" placeholder="分数"></el-input>
    </el-form-item>
    <el-form-item label="截止时间" prop="deadlineDate">
      <el-date-picker
        v-model="dataForm.deadlineDate"
        type="datetime"
        placeholder="截止时间"
        value-format="yyyy-MM-dd HH:mm:ss"
        format="yyyy-MM-dd HH:mm:ss"
        default-time="12:00:00"
        style="width: 100%;">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="备注" prop="remark">
      <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
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
          courseTypeId: '',
          courseReportTitle: '',
          courseReportContent: '',
          status: '0',
          submitNums: '',
          score: '',
          creater: '',
          createDate: '',
          updateDate: '',
          deadlineDate: '',
          remark: ''
        },
        dataRule: {
          courseTypeId: [
            { required: true, message: '二级课程包不能为空', trigger: 'blur' }
          ],
          courseReportTitle: [
            { required: true, message: '课程报告标题不能为空', trigger: 'blur' }
          ],
          courseReportContent: [
            { required: true, message: '课程报告题目不能为空', trigger: 'blur' }
          ],
          status: [
            { required: true, message: '发布状态不能为空', trigger: 'blur' }
          ],
          submitNums: [
            { required: true, message: '提交次数不能为空', trigger: 'blur' }
          ],
          score: [
            { required: true, message: '分数不能为空', trigger: 'blur' }
          ],
          deadlineDate: [
            { required: true, message: '截止时间不能为空', trigger: 'blur' }
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
              url: this.$http.adornUrl(`/generator/coursereport/info/${this.dataForm.uuid}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.courseTypeId = data.courseReport.courseTypeId
                this.dataForm.courseReportTitle = data.courseReport.courseReportTitle
                this.dataForm.courseReportContent = data.courseReport.courseReportContent
                this.dataForm.status = data.courseReport.status
                this.dataForm.submitNums = data.courseReport.submitNums
                this.dataForm.score = data.courseReport.score
                this.dataForm.createDate = data.courseReport.createDate
                this.dataForm.updateDate = data.courseReport.updateDate
                this.dataForm.deadlineDate = data.courseReport.deadlineDate
                this.dataForm.remark = data.courseReport.remark
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
        if(this.dataForm.status === '1'){
          this.$message.error('课程报告已发布，不允许修改')
          return
        }
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/generator/coursereport/${!this.dataForm.uuid ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'uuid': this.dataForm.uuid || undefined,
                'courseTypeId': this.dataForm.courseTypeId,
                'courseReportTitle': this.dataForm.courseReportTitle,
                'courseReportContent': this.dataForm.courseReportContent,
                'status': this.dataForm.status,
                'submitNums': this.dataForm.submitNums,
                'score': this.dataForm.score,
                'creater': this.dataForm.creater,
                'deadlineDate': this.dataForm.deadlineDate,
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
