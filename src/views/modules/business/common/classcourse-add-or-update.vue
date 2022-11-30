<template>
  <el-dialog
    :title="!dataForm.classId ? $t('button.add') : $t('button.update')"
    :close-on-click-modal="false"
    @close="closeDialog"
    v-if="visible"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px">
    <el-form-item label="课程id" prop="courseId">
      <el-input v-model="dataForm.courseId" placeholder="课程id"></el-input>
    </el-form-item>
    <el-form-item label="课程开始时间" prop="createDate">
      <el-date-picker
        v-model="dataForm.startDate"
        type="datetime"
        placeholder="课程开始时间"
        value-format="yyyy-MM-dd HH:mm:ss"
        format="yyyy-MM-dd HH:mm:ss"
        default-time="12:00:00">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="课程结束时间" prop="updateDate">
      <el-date-picker
        v-model="dataForm.endDate"
        type="datetime"
        placeholder="课程结束时间"
        value-format="yyyy-MM-dd HH:mm:ss"
        format="yyyy-MM-dd HH:mm:ss"
        default-time="12:00:00">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="删除标识" prop="deleteFlag">
      <el-select v-model="dataForm.deleteFlag" placeholder="删除标识">
        <el-option label="否" value="0"></el-option>
        <el-option label="是" value="1"></el-option>
      </el-select>
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
          classId: 0,
          courseId: '',
          startDate: '',
          endDate: '',
          deleteFlag: '0'
        },
        dataRule: {
          courseId: [
            { required: true, message: '课程id不能为空', trigger: 'blur' }
          ],
          startDate: [
            { required: true, message: '课程的开始时间不能为空', trigger: 'blur' }
          ],
          endDate: [
            { required: true, message: '课程的结束时间不能为空', trigger: 'blur' }
          ],
          deleteFlag: [
            { required: true, message: '删除标识不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.classId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.classId) {
            this.$http({
              url: this.$http.adornUrl(`/generator/classcourse/info/${this.dataForm.classId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.courseId = data.classCourse.courseId
                this.dataForm.startDate = data.classCourse.startDate
                this.dataForm.endDate = data.classCourse.endDate
                this.dataForm.deleteFlag = data.classCourse.deleteFlag
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
              url: this.$http.adornUrl(`/generator/classcourse/${!this.dataForm.classId ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'classId': this.dataForm.classId || undefined,
                'courseId': this.dataForm.courseId,
                'startDate': this.dataForm.startDate,
                'endDate': this.dataForm.endDate,
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
