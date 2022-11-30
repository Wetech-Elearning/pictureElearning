<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.key" placeholder="课程报告题目" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('business:coursereport:add')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('business:coursereport:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
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
        prop="courseTypeName"
        header-align="center"
        align="center"
        label="二级课程包名称">
      </el-table-column>
      <el-table-column
        prop="courseReportTitle"
        header-align="center"
        align="center"
        label="课程报告题目">
      </el-table-column>
      <el-table-column
        prop="createDate"
        header-align="center"
        align="center"
        label="创建时间">
      </el-table-column>
      <el-table-column
        prop="deadlineDate"
        header-align="center"
        align="center"
        label="截止时间">
      </el-table-column>
      <el-table-column
        prop="submitNums"
        header-align="center"
        align="center"
        label="提交次数" :formatter="submitNumsFormatter" />
      <el-table-column
        prop="score"
        header-align="center"
        align="center"
        label="分数">
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="发布状态" :formatter="statusFormatter" />
      <el-table-column
        prop="remark"
        header-align="center"
        align="center"
        label="备注">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="$t('button.edit')" placement="top">
            <svg class="icon" aria-hidden="true" @click="addOrUpdateHandle(scope.row.uuid)">
              <use xlink:href="#icon-bianzu9"></use>
            </svg>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="$t('button.delete')" placement="top">
            <svg class="icon" aria-hidden="true" @click="deleteHandle(scope.row.uuid,scope.row.companyName)">
              <use xlink:href="#icon-shanchu"></use>
            </svg>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="$t('button.preview')" placement="top">
            <svg class="icon" aria-hidden="true" @click="previewHandle(scope.row)">
              <use xlink:href="#icon-preview"></use>
            </svg>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="$t('button.release')" placement="top">
            <svg class="icon" aria-hidden="true" @click="releaseHandle(scope.row)">
              <use xlink:href="#icon-fabu"></use>
            </svg>
          </el-tooltip>
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
    <!-- 弹窗, 预览 -->
    <CoursereportPreview v-if="previewVisible" ref="coursereportPreview" @refreshDataList="getDataList"></CoursereportPreview>
  </div>
</template>

<script>
  import AddOrUpdate from './coursereport-add-or-update'
  import CoursereportPreview from './coursereport-preview'
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
        addOrUpdateVisible: false,
        previewVisible: false
      }
    },
    components: {
      AddOrUpdate,
      CoursereportPreview
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/generator/coursereport/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'courseReportQuestion': this.dataForm.key
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
            url: this.$http.adornUrl('/generator/coursereport/delete'),
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
      //预览
      previewHandle(row){
        this.$router.push({path: '/coursereport-preview', query: {coursereport : row }})
      },
      //发布
      releaseHandle(row){
        this.$http({
          url: this.$http.adornUrl(`/generator/coursereport/release/` + row.uuid),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.getDataList()
            this.$message({
              message: '发布成功',
              type: 'success',
            })
          }
        })
      },
      submitNumsFormatter(row){
        if (row.submitNums == 0) {
          return '无限制'
        } else if(row.submitNums == 1) {
          return '1次'
        }else{
          return ''
        }
      },
      statusFormatter(row){
        if (row.status == 0) {
          return this.$t('common.unrelease')
        } else if(row.status == 1) {
          return this.$t('common.release')
        }else{
          return ''
        }
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
