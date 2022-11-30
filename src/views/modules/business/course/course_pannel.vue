<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.key" :placeholder="$t('course.search_key')" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">{{$t('button.search')}}</el-button>
        <el-button v-if="isAuth('business:course:course:save')" type="primary" @click="addOrUpdateHandle()">{{button.add}}</el-button>
        <el-button v-if="isAuth('business:course:course:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">{{button.batch_delete}}</el-button>
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
        prop="courseName"
        header-align="center"
        align="center"
        :label="$t('course.course_name')">
      </el-table-column>
      <el-table-column
        prop="courseIntroduction"
        header-align="center"
        align="center"
        :label="$t('course.course_introduction')">
      </el-table-column>
      <el-table-column
        prop="relatedCourseType"
        header-align="center"
        align="center"
        :label="$t('course_type.course_type_name')">
      </el-table-column>
      <el-table-column
        prop="serial"
        header-align="center"
        align="center"
        :label="$t('course.course_no')">
      </el-table-column>
      <el-table-column
        prop="fileType"
        header-align="center"
        align="center"
        :label="$t('course.course_type')">
      </el-table-column>
      <el-table-column
        prop="fileUrl"
        header-align="center"
        align="center"
        :label="$t('course.course_url')">
      </el-table-column>
      <el-table-column
        prop="totalTime"
        header-align="center"
        align="center"
        :label="$t('course.course_total_hour')">
      </el-table-column>
      <el-table-column
        prop="examPaperId"
        header-align="center"
        align="center"
        :label="$t('paper.paper_name')">
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        :label="$t('course.course_status')">
      </el-table-column>
      <el-table-column
        prop="certificateId"
        header-align="center"
        align="center"
        :label="$t('certificateinfo.certificateinfo_name')">
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
        prop="remark"
        header-align="center"
        align="center"
        :label="$t('common.remark')">
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
    <player v-if="showPlay" ref="play" @refreshDataList="getDataList"></player>
  </div>
</template>

<script>
import AddOrUpdate from './course-add-or-update'
import player from './play'
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
      showPlay: false
    }
  },
  components: {
    AddOrUpdate,
    player
  },
  activated () {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/generator/course/list'),
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
    play(value){
      this.showPlay = true;
      this.$nextTick(() => {
        this.$refs.play.init(value)
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
        confirmButtonText: this.$t('message.confirm'),
        cancelButtonText: this.$t('message.cancle'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/generator/course/delete'),
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
