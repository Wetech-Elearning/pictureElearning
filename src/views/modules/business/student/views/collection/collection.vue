<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.key" placeholder="参数名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">{{$t('button.search')}}</el-button>
        <el-button v-if="isAuth('business:classes:classes:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('business:classes:classes:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
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
        prop="uuid"
        header-align="center"
        align="center"
        label="uuid">
      </el-table-column>
      <el-table-column
        prop="className"
        header-align="center"
        align="center"
        label="班级名称">
      </el-table-column>
      <el-table-column
        prop="startDate"
        header-align="center"
        align="center"
        label="班级的开始时间">
      </el-table-column>
      <el-table-column
        prop="endDate"
        header-align="center"
        align="center"
        label="班级的结束时间">
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="班级状态">
      </el-table-column>
      <el-table-column
        prop="creater"
        header-align="center"
        align="center"
        :label="$t('common.creater')">
      </el-table-column>
      <el-table-column
        prop="createDate"
        header-align="center"
        align="center"
        :label="$t('common.create_date')">
      </el-table-column>
      <el-table-column
        prop="updater"
        header-align="center"
        align="center"
        label="修改人">
      </el-table-column>
      <el-table-column
        prop="updateDate"
        header-align="center"
        align="center"
        label="修改时间">
      </el-table-column>
      <el-table-column
        prop="remark"
        header-align="center"
        align="center"
        :label="$t('common.remark')">
      </el-table-column>
      <el-table-column
        prop="deleteFlag"
        header-align="center"
        align="center"
        label="删除标识">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        :label="$t('common.oper')">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.uuid)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.uuid)">删除</el-button>
          <el-button type="text" size="small" @click="studentaddUserHandle(scope.row.uuid)">学员</el-button>
          <el-button type="text" size="small" @click="courseaddOrUpdateHandle(scope.row.uuid)">课程</el-button>
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
  </div>
</template>

<script>
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
        studentAddOrUpdateVisible: false,
        courseAddOrUpdateVisible: false
      }
    },
    components: {
    },
    activated () {
      this.getDataList()
    },
    methods: {

      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/generator/classes/list'),
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
      studentaddUserHandle(id){
        this.studentAddOrUpdateVisible = true
        this.$nextTick(() => {
          this.$nextTick(() => {
            this.$refs.studentaddOrUpdate.init(id)
          })
        })
      },
      courseaddOrUpdateHandle (id) {
        this.courseAddOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.courseaddOrUpdate.init(id)
        })
      },
      // 删除
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
            url: this.$http.adornUrl('/generator/classes/delete'),
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
      }
    }
  }
</script>
