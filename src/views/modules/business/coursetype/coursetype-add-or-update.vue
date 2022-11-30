<template>
  <el-dialog
    :title="!dataForm.uuid ? $t('button.add') : $t('button.update')"
    :close-on-click-modal="false"
    v-if="visible"
    @close="closeDialog"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px">
      <el-form-item :label="$t('common.name')" prop="courseTypeName">
        <el-input v-model="dataForm.courseTypeName" :placeholder="$t('course_type.course_type_name')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('course_type.course_type_introduction')" prop="courseTypeIntroduction">
        <el-input v-model="dataForm.courseTypeIntroduction" :placeholder="$t('course_type.course_type_introduction')"></el-input>
      </el-form-item>
        <el-form-item :label="$t('certificateinfo.certificateinfo_name')" prop="certificateId">
          <custom-select
            style="width:100%;"
            :action="'/generator/certificateinfo/listall'"
            :props="{label: 'certificateName', value: 'uuid'}"
            :placeHolder="$t('certificateinfo.certificateinfo_name')"
            :value.sync="dataForm.certificateId"
            :label.sync="dataForm.certificateName"
          ></custom-select>
        </el-form-item>
      <el-form-item :label="$t('common.remark')" prop="remark">
        <el-input v-model="dataForm.remark" :placeholder="$t('common.remark')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('course_type.is_public')" prop="courseTypeName">
        <el-radio v-model="dataForm.type" label="hot">{{$t('common.no')}}</el-radio>
        <el-radio v-model="dataForm.type" label="public">{{$t('common.yes')}}</el-radio>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel()">{{$t('button.cancle')}}</el-button>
      <el-button type="primary" @click="dataFormSubmit()">{{$t('button.confirm')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { getNowTime } from '@/utils'
  export default {
    data () {
      return {
        url:'',
        dialogImageUrl:'',
        dialogVisible:false,
        visible: false,
        dataForm: {
          uuid: 0,
          type: 'hot',
          courseCover: '',
          courseTypeName: '',
          parentCourseType: '0',
          courseTypeIntroduction: '',
          certificateId:'',
          certificateName:'',
          creater: '',
          createDate: '',
          updater: '',
          updateDate: '',
          remark: '',
          deleteFlag: '0'
        },
        dataRule: {
          courseTypeName: [
            { required: true, message: this.$t('course_type.not_null_course_type_name'), trigger: 'blur' }
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
        //初始化上传url
        //this.url = this.$http.adornUrl(`/sys/alibaba/oss/upload?token=${this.$cookie.get('token')}&uuid=`+id)
        this.dataForm.uuid = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs.dataForm.resetFields()
          if (this.dataForm.uuid) {
            this.$http({
              url: this.$http.adornUrl(`/generator/coursetype/info/${this.dataForm.uuid}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.courseTypeName = data.courseType.courseTypeName
                this.dataForm.parentCourseType = data.courseType.parentCourseType
                this.dataForm.courseCover = data.courseType.courseCover
                this.dataForm.certificateName = data.courseType.certificateName
                this.dataForm.certificateId = data.courseType.certificateId
                this.dataForm.type = data.courseType.type
                this.dataForm.courseTypeIntroduction = data.courseType.courseTypeIntroduction
                this.dataForm.creater = data.courseType.creater
                this.dataForm.createDate = data.courseType.createDate
                this.dataForm.updater = data.courseType.updater
                this.dataForm.updateDate = data.courseType.updateDate
                this.dataForm.remark = data.courseType.remark
                this.dataForm.deleteFlag = data.courseType.deleteFlag
              }
            })
          }else{
            this.dataForm.creater = this.userName
            this.dataForm.createDate = getNowTime()
            this.dataForm.updater = this.userName
            this.dataForm.updateDate = getNowTime()
            this.dataForm.parentCourseType = 0
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          console.log("this.dataForm.certificateId",this.dataForm.certificateId)
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/generator/coursetype/${!this.dataForm.uuid ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'uuid': this.dataForm.uuid || undefined,
                'courseTypeName': this.dataForm.courseTypeName,
                'parentCourseType': this.dataForm.parentCourseType,
                'courseCover': this.dataForm.courseCover,
                'certificateName': this.dataForm.certificateName,
                'certificateId': this.dataForm.certificateId,
                'type': this.dataForm.type,
                'courseTypeIntroduction': this.dataForm.courseTypeIntroduction,
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

      // 取消
      cancel(){
        this.closeDialog()
      },

      // 关闭Dialog
      closeDialog () {
        this.$refs['dataForm'].resetFields()
        this.visible = false
        this.dataForm.certificateName = ''
      }
    }
  }
</script>
