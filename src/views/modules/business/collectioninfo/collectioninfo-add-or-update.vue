<template>
  <el-dialog
    :title="!dataForm.uuid ? $t('button.add') : $t('button.update')"
    :close-on-click-modal="false"
    @close="closeDialog"
    v-if="visible"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px">
<!--    <el-form-item label="学员id" prop="userId">
      <el-input v-model="dataForm.userId" placeholder="学员id"></el-input>
    </el-form-item>-->
    <el-form-item v-if="dataForm.courseType==1" :label="$t('course_type.course_type_name')" prop="courseId">
      <custom-select
        :action="'/generator/coursetype/listall'"
        :props="{label: 'courseTypeName', value: 'uuid'}"
        :placeHolder="$t('course_type.course_type_name')"
        :value.sync="dataForm.courseId"
        :label.sync="dataForm.courseName"
      ></custom-select>

    </el-form-item>

<!--      <el-form-item v-if="dataForm.courseType==2" label="课程包" prop="courseId">
        <custom-select
          :action="'/generator/coursetype/listall'"
          :props="{label: 'courseTypeName', value: 'uuid'}"
          :placeHolder="'课程包'"
          :value.sync="dataForm.courseId"
          :label.sync="dataForm.courseName"
        ></custom-select>
      </el-form-item>-->

<!--    <el-form-item :label="$t('common.creater')" prop="creater">
      <el-input v-model="dataForm.creater" :placeholder="$t('common.creater')"></el-input>
    </el-form-item>
    <el-form-item :label="$t('common.create_date')" prop="createDate">
      <el-date-picker
        v-model="dataForm.createDate"
        type="datetime"
        :placeholder="$t('common.create_date')"
        value-format="yyyy-MM-dd HH:mm:ss"
        format="yyyy-MM-dd HH:mm:ss"
        default-time="12:00:00">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="修改时间" prop="updateDate">
      <el-date-picker
        v-model="dataForm.updateDate"
        type="datetime"
        placeholder="修改时间"
        value-format="yyyy-MM-dd HH:mm:ss"
        format="yyyy-MM-dd HH:mm:ss"
        default-time="12:00:00">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="修改人" prop="updater">
      <el-input v-model="dataForm.updater" placeholder="修改人"></el-input>
    </el-form-item>
    <el-form-item :label="$t('common.remark')" prop="remark">
      <el-input v-model="dataForm.remark" :placeholder="$t('common.remark')"></el-input>
    </el-form-item>-->
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
          userName:'',
          courseType:'1',
          courseId: '',
          courseName: '',
          creater: '',
          createDate: '',
          updater: '',
          updateDate: '',
          remark: ''
        },
        dataRule: {
          userId: [
            { required: true, message: this.$t('student.not_null_student_name'), trigger: 'blur' }
          ],
          courseId: [
            { required: true, message: this.$t('course_type.not_null_course_type_name'), trigger: 'blur' }
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
              url: this.$http.adornUrl(`/generator/collectioninfo/info/${this.dataForm.uuid}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.userId = data.collectionInfo.userId
                this.dataForm.courseId = data.collectionInfo.courseId
                this.dataForm.creater = data.collectionInfo.creater
                this.dataForm.createDate = data.collectionInfo.createDate
                this.dataForm.updater = data.collectionInfo.updater
                this.dataForm.updateDate = data.collectionInfo.updateDate
                this.dataForm.remark = data.collectionInfo.remark
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
              url: this.$http.adornUrl(`/generator/collectioninfo/${!this.dataForm.uuid ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'uuid': this.dataForm.uuid || undefined,
                'userId': this.$store.state.user.relateUserId,
                'userName': this.$store.state.user.name,
                'courseType': this.dataForm.courseType,
                'courseId': this.$store.state.user.relateUserId,
                'courseName': this.dataForm.courseName,
                'creater': this.$store.state.user.name,
                'createDate': this.dataForm.createDate,
                'updater': this.$store.state.user.name,
                'updateDate': this.dataForm.updateDate,
                'remark': this.dataForm.remark
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
