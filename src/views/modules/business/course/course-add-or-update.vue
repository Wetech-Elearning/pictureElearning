<template>
  <el-dialog
    :title="!dataForm.uuid ? $t('button.add') : $t('button.update')"
    :close-on-click-modal="false"
    @close="closeDialog"
    v-if="visible"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px">
      <el-form-item v-if="isShowRelatedCourseType" label="所属课程包" prop="relatedCourseType">
        <custom-select
          style="width:100%;"
          :action="'/generator/coursetype/listall'"
          :props="{label: 'courseTypeName', value: 'uuid'}"
          :placeHolder="'课程包'"
          :value.sync="dataForm.relatedCourseTypeId"
          :label.sync="dataForm.relatedCourseType"
        ></custom-select>
      </el-form-item>
      <el-form-item :label="$t('common.name')" prop="courseName">
        <el-input v-model="dataForm.courseName" :placeholder="$t('common.name')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('course.course_introduction')" prop="courseIntroduction">
        <el-input v-model="dataForm.courseIntroduction" :placeholder="$t('course.course_introduction')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('course.course_no')" prop="serial">
        <el-input type="number" min="1" v-model="dataForm.serial" :placeholder="$t('course.course_no')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('course.course_type')" prop="fileType">
        <el-radio v-model="dataForm.fileType" label="video">{{ $t('course.course_video') }}</el-radio>
        <el-radio v-model="dataForm.fileType" label="excel">{{ $t('course.course_excel') }}</el-radio>
        <el-radio v-model="dataForm.fileType" label="ppt">{{ $t('course.course_ppt') }}</el-radio>
        <el-radio v-model="dataForm.fileType" label="word">{{ $t('course.course_world') }}</el-radio>
        <el-radio v-model="dataForm.fileType" label="translate">{{ $t('course.course_translate') }}</el-radio>
      </el-form-item>
      <!--<el-form-item label="课件" v-if="dataForm.fileType != 'translate'">
        <upload-card-video v-if="dataForm.fileType=='video'"
          :imgId.sync="dataForm.fileId"
          :imgUrl.sync="dataForm.fileUrl"
          :action="'/sys/oss/upload/video'"
        ></upload-card-video>
        <upload-file-list v-if="dataForm.fileType != 'video'"
          :imgIds.sync="dataForm.fileIdList"
          :fileList.sync="dataForm.fileLists"
          :limit="1"
          :action="'/sys/oss/upload'"
          :fileType="['.pptx','.docx','.pdf','.xls','.xlsx','.zip']"
          :fileSize="1024*1024*30"
          :tips="'文件大小不能超过30M,且最多上传一个文件！！！'"
        ></upload-file-list>
      </el-form-item>-->
      <!--    <el-form-item label="课程url" prop="fileUrl">-->
      <!--      <el-input v-model="dataForm.fileUrl" placeholder="课程url"></el-input>-->
      <!--    </el-form-item>-->
      <el-form-item :label="$t('course.course_total_hour')" prop="totalTime">
        <el-input type="number" min="0" v-model="dataForm.totalTime" :placeholder="$t('course.course_total_hour')"></el-input>
      </el-form-item>
      <!--  <el-form-item label="试卷" prop="examPaperId">
    &lt;!&ndash;      <el-input v-model="dataForm.examPaperId" placeholder="试卷"></el-input>&ndash;&gt;
          <custom-select
            style="width:100%;"
            :action="'/generator/exampaperinfos/listall'"
            :props="{label: 'examPaperName', value: 'uuid'}"
            :placeHolder="'试卷'"
            :value.sync="dataForm.examPaperId"
            :label.sync="dataForm.examPaperName"
          ></custom-select>
        </el-form-item>-->
      <el-form-item :label="$t('course.course_status')" prop="status">
        <custom-select
          style="width:100%;"
          :action="'/sys/dict/json/data/coursestatus'"
          :props="{label: 'dictName', value: 'id'}"
          :placeHolder="$t('course.course_status')"
          :value.sync="dataForm.status"
          :label.sync="dataForm.statusLabel"
        ></custom-select>
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
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog()">{{$t('button.cancle')}}</el-button>
      <el-button type="primary" @click="dataFormSubmit()">{{$t('button.confirm')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getNowTime } from '@/utils'
import { noCheck, timeCheck } from '@/utils/validate'
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        fileIdList:[],
        fileLists:[],
        uuid: 0,
        courseName: '',
        courseIntroduction: '',
        relatedCourseTypeId: '',
        relatedCourseType: '',
        serial: '',
        fileType: 'video',
        fileId:'',
        fileUrl: '',
        totalTime: '',
        examPaperId:'',
        examPaperName: '',
        status: '',
        statusLabel: '',
        certificateId: '',
        certificateName: '',
        creater: '',
        createDate: '',
        updater: '',
        updateDate: '',
        remark: '',
        deleteFlag: '0'
      },
      dataRule: {
        serial: [
          { validator: noCheck, trigger: 'blur'}
        ],
        courseName: [
          { required: true, message: this.$t('course.not_null_course_name'), trigger: 'blur' }
        ],
        relatedCourseType: [
          { required: true, message: this.$t('course_type.not_null_course_type_name'), trigger: 'blur' }
        ],
        fileType: [
          { required: true, message: this.$t('course.not_null_course_type'), trigger: 'blur' }
        ],
        status: [
          { required: true, message: this.$t('course.not_null_course_status'), trigger: 'blur' }
        ],
        totalTime: [
          { required: true, message: this.$t('course.not_null_course_total_hour'), trigger: 'blur' },
          { validator: timeCheck, trigger: 'blur'}
        ]
      },
      isShowRelatedCourseType: true
    }
  },
  computed: {
    userName: {
      get () { return this.$store.state.user.name }
    },
    userId: {
      get () { return this.$store.state.user.relateUserId }
    }
  },
  methods: {
    init (id,relatedCourseTypeId,relatedCourseTypeName) {
      this.dataForm.uuid = id || 0
      this.dataForm.relatedCourseTypeId = relatedCourseTypeId
      this.dataForm.relatedCourseType = relatedCourseTypeName
      if(this.dataForm.relatedCourseTypeId){
        this.isShowRelatedCourseType = false
      }
      this.visible = true
      this.$nextTick(() => {
         //this.$refs['dataForm'].resetFields()
        // this.resetFieldsForm()
        console.log('dataForm=============', this.$refs['dataForm'])
        if (this.dataForm.uuid) {
          this.$http({
            url: this.$http.adornUrl(`/generator/course/info/${this.dataForm.uuid}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.dataForm.courseName = data.course.courseName
              this.dataForm.courseIntroduction = data.course.courseIntroduction
              this.dataForm.relatedCourseTypeId = data.course.relatedCourseTypeId
              this.dataForm.relatedCourseType = data.course.relatedCourseType
              this.dataForm.certificateId = data.course.certificateId
              this.dataForm.certificateName = data.course.certificateName
              this.dataForm.serial = data.course.serial
              this.dataForm.statusLabel = data.course.statusLabel
              this.dataForm.fileType = data.course.fileType
              this.dataForm.fileId = data.course.fileId
              this.dataForm.fileUrl = data.course.fileUrl
              this.dataForm.totalTime = data.course.totalTime
              this.dataForm.examPaperId = data.course.examPaperId
              this.dataForm.status = data.course.status
              this.dataForm.status = data.course.status
              this.dataForm.creater = data.course.creater
              this.dataForm.createDate = data.course.createDate
              this.dataForm.updater = data.course.updater
              this.dataForm.updateDate = data.course.updateDate
              this.dataForm.remark = data.course.remark
              this.dataForm.deleteFlag = data.course.deleteFlag
            }
          })
        }else{
          this.dataForm.creater = this.userName
          this.dataForm.createDate = getNowTime()
          this.dataForm.updater = this.userName
          this.dataForm.updateDate = getNowTime()
        }
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if(this.dataForm.fileIdList.length>0 && this.dataForm.fileType !='video'){
            this.dataForm.fileId = this.dataForm.fileIdList[0]
            this.dataForm.fileUrl = this.dataForm.fileLists[0].url
          }
          this.$http({
            url: this.$http.adornUrl(`/generator/course/${!this.dataForm.uuid ? 'save' : 'update'}`),
            method: 'post',
            data: this.$http.adornData({
              'uuid': this.dataForm.uuid || undefined,
              'courseName': this.dataForm.courseName,
              'courseIntroduction': this.dataForm.courseIntroduction,
              'relatedCourseType': this.dataForm.relatedCourseType,
              'serial': this.dataForm.serial,
              'fileType': this.dataForm.fileType,
              'relatedCourseTypeId': this.dataForm.relatedCourseTypeId,
              'certificateId': this.dataForm.certificateId,
              'certificateName': this.dataForm.certificateName,
              'fileId': this.dataForm.fileId ,
              'fileUrl': this.dataForm.fileUrl,
              'totalTime': this.dataForm.totalTime,
              'examPaperId': this.dataForm.examPaperId,
              'status': this.dataForm.status,
              'statusLabel': this.dataForm.statusLabel,
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
    // 关闭Dialog
    closeDialog () {
      this.$refs['dataForm'].resetFields()
      this.visible = false
      this.dataForm.certificateName = ''
    }
  }
}
</script>
