<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.key" placeholder="" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">{{$t('button.search')}}</el-button>
        <el-button v-if="isAuth('business:comment:update')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">{{$t('button.batch_delete')}}</el-button>
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
        :label="$t('course_type.course_type_name')">
      </el-table-column>
      <el-table-column
        prop="courseName"
        header-align="center"
        align="center"
        :label="$t('course.course_name')">
      </el-table-column>
      <el-table-column
        prop="courseType"
        header-align="center"
        align="center"
        :label="$t('course.course_type')">
      </el-table-column>
      <el-table-column
        prop="courseStatus"
        header-align="center"
        align="center"
        :label="$t('course.course_status')">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        :label="$t('common.oper')">
        <template slot-scope="scope">
          <svg class="icon" aria-hidden="true" @click="preview(scope.row.courseId,scope.row.courseCover)">
            <use xlink:href="#icon-preview"></use>
          </svg>
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
    <!-- 查看评论 -->
    <el-dialog title="学员评论" :visible.sync="dialogCommentVisible">
      <div class="demo-image__preview">
        <el-image
          width="200"
          height="100"
          :src="courseCover">
        </el-image>
      </div>
      <leaveMessage  ref="leaveMessage" style="margin-top: 15px"/>
    </el-dialog>
  </div>
</template>

<script>
import AddOrUpdate from './comment-add-or-update'
//import leaveMessage from '../student/views/course/leaveMessage'
import leaveMessage from '../course/leaveMessage'
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
      message: {
        confirm_to: this.$t('message.confirm_to'),
        conduct: this.$t('message.conduct'),
        delete: this.$t('message.delete'),
        batch_delete: this.$t('message.batch_delete'),
        oper: this.$t('message.oper'),
        tip: this.$t('message.tip')
      },
      dialogCommentVisible: false,
      courseCover:''
    }
  },
  components: {
    AddOrUpdate,
    leaveMessage
  },
  activated () {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/generator/leavemessage/list'),
        method: 'get',
        params: this.$http.adornParams({
          'page': this.pageIndex,
          'limit': this.pageSize,
          'key': this.dataForm.key,
          'courseTypeId': this.$route.query.courseTypeId,
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
      this.$confirm(this.$t('message.delete_tip'), this.$t('message.tip'), {
        confirmButtonText: this.$t('message.confirm'),
        cancelButtonText: this.$t('message.cancle'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/generator/comment/delete'),
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

    preview (courseId,courseCover) {
      this.courseCover = ''
      this.dialogCommentVisible = true
      this.$nextTick(() => {
        this.courseCover = courseCover
        this.$refs.leaveMessage.init(courseId,{
          courseTypeId:this.$route.query.courseTypeId,
          courseTypeName:this.$route.query.courseTypeName,
        });
      })
    }
  }
}
</script>
<style>
.icon {
  width: 2em;
  height: 2em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
