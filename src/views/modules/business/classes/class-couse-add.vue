<template>
  <el-dialog
    :close-on-click-modal="false"
    :modal-append-to-body="true"
    append-to-body
    v-if="visible"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="课程包" prop="courseTypeName">
        <custom-select
          style="width:100%;"
          :action="'/generator/coursetype/listTwoLevelCourseType'"
          :props="{label: 'courseTypeName', value: 'uuid'}"
          :placeHolder="$t('course_type.course_type_name')"
          :value.sync="dataForm.courseType"
          :label.sync="dataForm.courseTypeLabel"
        ></custom-select>
      </el-form-item>
      <!--<el-form-item :label="$t('common.start_date')" prop="startDate">
        <el-date-picker
          style="width:100%;"
          v-model="dataForm.startDate"
          type="datetime"
          :placeholder="$t('common.start_date')"
          :picker-options="startTime"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd HH:mm:ss"
          default-time="12:00:00">
        </el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('common.end_date')" prop="endDate">
        <el-date-picker
          style="width:100%;"
          v-model="dataForm.endDate"
          type="datetime"
          :placeholder="$t('common.end_date')"
          :picker-options="endTime"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd HH:mm:ss"
          default-time="12:00:00">
        </el-date-picker>
      </el-form-item>-->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{$t('button.cancle')}}</el-button>
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
        startTime:{
          disabledDate: time => {
            if (this.dataForm.endDate) {
              return time.getTime() > new Date(this.dataForm.endDate).getTime()
            }
            return false
          }

        },
        endTime:{
          disabledDate: time => {
            if (this.dataForm.startDate) {
              return   time.getTime()< new Date(this.dataForm.startDate).getTime()
            }
            return false
          }
        },
        dataForm: {
          classId:'',
          courseType: '',
          courseTypeLabel: '',
          couseName:'',
          startDate:'',
          endDate:''
        },
        dataRule: {
          courseTypeLabel: [
            { required: true, message: '课程包不能为空', trigger: 'blur' }
          ],
          startDate: [
            { required: true, message: '开始时间不能为空', trigger: 'blur' }
          ],
          endDate: [
            { required: true, message: '结束时间不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
    },
    methods: {
      init (id) {
        this.dataForm.classId = id || 0
        this.visible = true
        this.$nextTick(() => {

          // if (this.dataForm.uuid) {
          //   this.$http({
          //     url: this.$http.adornUrl(`/generator/classes/listcourse/${this.dataForm.classId}`),
          //     method: 'get',
          //     params: this.$http.adornParams()
          //   }).then(({data}) => {
          //     if (data && data.code === 0) {
          //       this.dataForm.uuid = data.courseType.uuid
          //       this.dataForm.classId = data.courseType.classId
          //       this.dataForm.courseId = data.courseType.courseId
          //       this.dataForm.courseTypeName = data.courseType.courseTypeName
          //       this.dataForm.couseName = data.courseType.couseName
          //       this.dataForm.startDate = data.courseType.startDate
          //       this.dataForm.endDate = data.courseType.endDate
          //     }
          //   })
          // }else{
          //   this.dataForm.creater = this.userName
          //   this.dataForm.createDate = getNowTime()
          // }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/generator/classes/addcourse2Class`),
              method: 'post',
              data: this.$http.adornData({
                'uuid': '',
                'classId': this.dataForm.classId || undefined,
                'courseType': this.dataForm.courseType,
                'courseTypeLabel': this.dataForm.courseTypeLabel,
                'couseName': this.dataForm.couseName,
                'startDate': this.dataForm.startDate,
                'endDate': this.dataForm.endDate
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
                this.$message.error("课程重复添加")
                // this.$message.error(data.msg)
              }
            })
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
