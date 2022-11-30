<template>
  <el-dialog
    :title="!dataForm.uuid ? $t('button.add') : $t('button.update')"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    v-if="visible"
    :before-close="handleclose"
    :visible.sync="visible">
    <el-form :inline="true">
      <el-form-item>
        <el-button v-if="isAuth('business:class:student:add')" type="primary" @click="addOrUpdateHandle()">{{$t('button.add')}}</el-button>
        <el-button v-if="isAuth('business:class:student:delete')" type="danger" @click="deleteHandle()">{{$t('button.delete')}}</el-button>
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
      <el-table-column
        prop="userName"
        header-align="center"
        align="center"
        :label="$t('student.student_name')">
        <template slot-scope="scope">
          {{scope.row.surname + scope.row.userName}}
        </template>
      </el-table-column>
      <el-table-column
        prop="userMobile"
        header-align="center"
        align="center"
        :label="$t('student.student_mobile')">
      </el-table-column>
      <el-table-column
        prop="sex"
        header-align="center"
        align="center"
        :label="$t('student.student_sex')" :formatter="sexFormatter" />
      <el-table-column
        prop="age"
        header-align="center"
        align="center"
        :label="$t('student.student_age')">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        :label="$t('common.oper')">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="sendCerifHandle(scope.row.uuid)">{{$t('student.grant_certificateinfo')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <studentPannel v-if="studentpannelvisable" ref="studentpannel" @refreshDataList="getDataList"/>
    <certificateinfoPannel v-if="certificateinfoPannel" ref="certificateinfoPannel" @refreshDataList="getDataList"/>
  </el-dialog>
</template>
<script>
  import studentPannel from '../student/student_pannel'
  import certificateinfoPannel from '../certificateinfo/cerifycateinfo_pannel'
  import { getNowTime } from '@/utils'
  export default {
    data () {
      return {
        visible: false,
        studentpannelvisable:false,
        certificateinfoPannel:false,
        dataListLoading:true,
        dataListSelections:[],
        dataList:[],
        dataForm: {
          classuuid: 0,
        }
      }
    },
    components:{
      studentPannel,
      certificateinfoPannel
    },
    computed: {
    },
    methods: {
      handleclose(){
        Object.assign(this.$data, this.$options.data())
        return true
      },
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      getDataList(){
        this.studentpannelvisable = false
        this.$nextTick(() => {
          if (this.dataForm.classuuid) {
            this.$http({
              url: this.$http.adornUrl(`/generator/classes/classInfos/${this.dataForm.classuuid}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                if(data.classes!=0 && data.classes.studentEntityList.length>0) {
                  this.dataList = data.classes.studentEntityList;
                } else {
                  this.dataList=[]
                }
              }
            })
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
              url: this.$http.adornUrl(`/generator/classes/classInfos/${this.dataForm.classuuid}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                if(data.classes!=null && data.classes.studentEntityList.length>0) {
                  this.dataList = data.classes.studentEntityList;

                }

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
          var ids = []
          for(var i= 0;i<this.dataList.length;i++){
            ids.push(this.dataList[i].uuid)
          }
          this.$refs.studentpannel.getDataList(this.dataForm.classuuid,ids)
        })
      },
      sendCerifHandle (id) {
        this.certificateinfoPannel = true
        this.$nextTick(() => {
          this.$refs.certificateinfoPannel.init(id)
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
          return item.userName
        })
        this.$confirm(this.$t('message.confirm_to') + `[${names.join(',')}]` + this.$t('message.conduct') + `[${name ? this.$t('message.delete') : this.$t('message.batch_delete')}]`+ this.$t('message.oper') +`?`, this.$t('message.tip'), {
          confirmButtonText: this.$t('message.confirm'),
          cancelButtonText: this.$t('message.cancle'),
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/generator/classes/delstudentfromClass/'+this.dataForm.classuuid),
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
      },
      // 性别格式化
      sexFormatter(row){
        if (row.sex == 0) {
          return this.$t('common.man')
        } else if(row.sex == 1) {
          return this.$t('common.woman')
        }else{
          return ''
        }
      }
    }
  }
</script>
