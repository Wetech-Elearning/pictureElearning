<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.key" placeholder="参数名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button type="primary" @click="batchImport()">批量下载/导出</el-button>
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
        prop="studentName"
        header-align="center"
        align="center"
        label="学员">
      </el-table-column>
      <el-table-column
        prop="courseTypeName"
        header-align="center"
        align="center"
        label="二级课程名称">
      </el-table-column>
      <el-table-column
        prop="courseReportTitle"
        header-align="center"
        align="center"
        label="报告题目">
      </el-table-column>
      <el-table-column
        prop="studentCourseReportTitle"
        header-align="center"
        align="center"
        label="学员报告标题">
      </el-table-column>
      <el-table-column
        prop="createDate"
        header-align="center"
        align="center"
        label="提交时间">
      </el-table-column>
      <el-table-column
        prop="createDate"
        header-align="center"
        align="center"
        label="下载报告">
        <template slot-scope="scope">
          <a href="#" @click="exportPDF(scope.row)">下载/导出</a>
        </template>
      </el-table-column>
      <el-table-column
        prop="createDate"
        header-align="center"
        align="center"
        label="查看">
        <template slot-scope="scope">
          <el-link type="primary" @click="detailHandle(scope.row,'check')">线上查看</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="阅读状态" :formatter="statusFormatter"/>
      <el-table-column
        header-align="center"
        align="center"
        label="打分">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status === '0'" type="primary" @click="detailHandle(scope.row,'score')">打分</el-button>
          <el-button v-if="scope.row.status === '1'" disabled>已打分</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './coursereportrecord-add-or-update'
  import { getPdf, getNowTime } from '@/utils'
  export default {
    data () {
      return {
        dataForm: {
          key: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/generator/coursereportrecord/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'key': this.dataForm.key
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.totalPage = data.page.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
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
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.uuid
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/generator/coursereportrecord/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
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
      // 预览/打分
      detailHandle(row,type){
        this.$http({
          url: this.$http.adornUrl(`/generator/coursereportrecord/getByCourseReportIdAndStudentId`),
          method: 'get',
          params: this.$http.adornParams({
            'courseReportId': row.courseReportId,
            'studentId': row.studentId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            let courseReport = {
              studentCourseReportTitle : data.courseReportRecord.studentCourseReportTitle,
              content : data.courseReportRecord.content,
              score : data.courseReportRecord.score,
              comment : data.courseReportRecord.comment
            }
            this.$router.push({name: 'coursereport-detail', params: {courseReportId : row.courseReportId, courseReport:courseReport, type: type, studentId: row.studentId  }})
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      batchImport(){
        console.log('批量导出')
      },
      statusFormatter(row){
        if (row.status == 0) {
          return '未批注'
        } else if(row.status == 1) {
          return '已批注'
        }else{
          return ''
        }
      },
      // 导出PDF
      exportPDF(row) {
        this.detailHandle(row,'down')
      }
    }
  }
</script>
<style scoped>
  .icon {
    width: 2em;
    height: 2em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
</style>
