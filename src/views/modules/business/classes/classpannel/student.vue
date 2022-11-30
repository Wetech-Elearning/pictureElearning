<template>
  <div>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
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
        :label="$t('student.student_sex')" :formatter="sexFormatter"/>
      <el-table-column
        prop="age"
        header-align="center"
        align="center"
        :label="$t('student.student_age')">
      </el-table-column>
      <!--<el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        :label="$t('common.oper')">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="sendCerifHandle(scope.row.uuid)">{{student.grant_certificateinfo}}</el-button>
        </template>
      </el-table-column>-->
    </el-table>
    <div class="pagination">
      <el-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalPage">
      </el-pagination>
    </div>
  </div>

</template>
<script>
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
      },
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0
    }
  },
  components:{
  },
  computed: {
  },
  methods: {
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getDataList()
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
        this.$refs.studentpannel.getDataList(this.dataForm.classuuid)
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
    deleteHandle (id) {
      var ids = id ? [id] : this.dataListSelections.map(item => {
        return item.uuid
      })
      this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
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
      console.log('aaaaaaaaaaaaaaa==' ,row.sex)
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
