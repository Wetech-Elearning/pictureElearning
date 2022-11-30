<template>
  <el-dialog
    :title="!dataForm.uuid ? $t('button.add') : $t('button.update')"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    v-if="visible"
    :visible.sync="visible">
    <el-form :inline="true">
      <el-form-item>
        <el-button v-if="isAuth('business:class:coursetype:add')" type="primary" @click="addOrUpdateHandle()">{{$t('button.add')}}</el-button>
        <el-button v-if="isAuth('business:class:coursetype:delete')" type="danger" @click="deleteHandle()">{{$t('button.delete')}}</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
<!--      <el-table-column-->
<!--        prop="courseTypeLabel"-->
<!--        header-align="center"-->
<!--        align="center"-->
<!--        label="课程类型">-->
<!--      </el-table-column>-->
      <el-table-column
        prop="courseTypeLabel"
        header-align="center"
        align="center"
        :label="$t('course_type.course_type_name')">
      </el-table-column>
      <!--<el-table-column
        prop="startDate"
        header-align="center"
        align="center"
        :label="$t('common.start_date')">
      </el-table-column>
      <el-table-column
        prop="endDate"
        header-align="center"
        align="center"
        :label="$t('common.end_date')">
      </el-table-column>-->
    </el-table>
    <classCouseAdd v-if="studentpannelvisable" ref="classCouseAdd" @refreshDataList="getDataList"/>
  </el-dialog>
</template>
<script>
import classCouseAdd from './class-couse-add'
import { getNowTime } from '@/utils'
export default {
  data () {
    return {
      visible: false,
      studentpannelvisable:false,
      dataListLoading:true,
      dataListSelections:[],
      dataList:[],
      dataForm: {
        classuuid: 0,
      }
    }
  },
  components:{
    classCouseAdd
  },
  computed: {
  },
  methods: {
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },
    getDataList(){
      this.$nextTick(() => {
        if (this.dataForm.classuuid) {
          this.$http({
            url: this.$http.adornUrl(`/generator/classes/listcourse/${this.dataForm.classuuid}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.dataList = data.data;
            }
          })
          this.dataListLoading = false
        }else{
          this.dataForm.creater = this.userName
          this.dataForm.createDate = getNowTime()
        }
      })
    },
    init (id) {
      this.dataForm.classuuid = id || 0
      this.visible = true
      this.$nextTick(() => {
        if (this.dataForm.classuuid) {
          this.$http({
            url: this.$http.adornUrl(`/generator/classes/listcourse/${this.dataForm.classuuid}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.dataList = data.data;
            }
          })
          this.dataListLoading = false
        }else{
          this.dataForm.creater = this.userName
          this.dataForm.createDate = getNowTime()
        }
      })
    },
    addOrUpdateHandle (id) {
      this.studentpannelvisable = true
      this.$nextTick(() => {
        this.$refs.classCouseAdd.init(this.dataForm.classuuid)
      })
    },
    closeAddStudentHandle(){
      this.studentpannelvisable = false
    },
    deleteHandle (id,name) {
      var ids = id ? [id] : this.dataListSelections.map(item => {
        return item.uuid
      })
      var names = name ? [name] : this.dataListSelections.map(item => {
        return item.courseTypeLabel
      })
      this.$confirm(this.$t('message.confirm_to') + `[${names.join(',')}]` + this.$t('message.conduct') + `[${name ? this.$t('message.delete') : this.$t('message.batch_delete')}]`+ this.$t('message.oper') +`?`, this.$t('message.tip'), {
        confirmButtonText: this.$t('message.confirm'),
        cancelButtonText: this.$t('message.cancle'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/generator/classes/delCoursefromClass/'+this.dataForm.classuuid),
          method: 'post',
          data: this.$http.adornData(ids, false)
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: this.$t('message.success'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList()
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(`/generator/classes/${!this.dataForm.uuid ? 'save' : 'update'}`),
            method: 'post',
            data: this.$http.adornData({
              'uuid': this.dataForm.uuid || undefined,
              'className': this.dataForm.className,
              'startDate': this.dataForm.startDate,
              'endDate': this.dataForm.endDate,
              'status': this.dataForm.status,
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
