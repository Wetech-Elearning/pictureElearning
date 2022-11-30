<template>
  <div>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        prop="courseTypeLabel"
        header-align="center"
        align="center"
        :label="$t('course_type.course_type_name')">
      </el-table-column>
<!--      <el-table-column-->
<!--        prop="startDate"-->
<!--        header-align="center"-->
<!--        align="center"-->
<!--        :label="$t('common.start_date')">-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        prop="endDate"-->
<!--        header-align="center"-->
<!--        align="center"-->
<!--        :label="$t('common.end_date')">-->
<!--      </el-table-column>-->
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
    },
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
  }
}
</script>
