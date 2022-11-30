<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.key" :placeholder="$t('classes.search_key')" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">{{$t('button.search')}}</el-button>
        <el-button v-if="isAuth('business:classes:add')" type="primary" @click="addOrUpdateHandle()">{{$t('button.add')}}</el-button>
        <el-button v-if="isAuth('business:classes:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">{{$t('button.batch_delete')}}</el-button>
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
        prop="className"
        header-align="center"
        align="center"
        :label="$t('classes.classes_name')">
        <template slot-scope="scope">
          <a style="cursor: pointer" @click="gotoDetail(scope.row.uuid)">{{scope.row.className}}</a>
        </template>
      </el-table-column>
      <el-table-column
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
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        :label="$t('classes.classes_status')" :formatter="statusFormat">
      </el-table-column>
      <!--<el-table-column
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
      </el-table-column>-->
      <el-table-column
        prop="remark"
        header-align="center"
        align="center"
        :label="$t('common.remark')">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="250"
        :label="$t('common.oper')">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="$t('button.edit')" placement="top">
            <svg class="icon" aria-hidden="true" @click="addOrUpdateHandle(scope.row.uuid)">
              <use xlink:href="#icon-bianzu9"></use>
            </svg>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="$t('button.delete')" placement="top">
            <svg class="icon" aria-hidden="true" @click="deleteHandle(scope.row.uuid,scope.row.className)">
              <use xlink:href="#icon-shanchu"></use>
            </svg>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="$t('classes.add_student')" placement="top">
            <svg class="icon" aria-hidden="true" @click="studentaddUserHandle(scope.row.uuid)">
              <use xlink:href="#icon-xuesheng"></use>
            </svg>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="$t('classes.add_course')" placement="top">
            <svg class="icon" aria-hidden="true" @click="courseaddOrUpdateHandle(scope.row.uuid)">
              <use xlink:href="#icon-kecheng"></use>
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
    <student-add-or-update v-if="studentAddOrUpdateVisible" ref="studentaddOrUpdate" @refreshDataList="getDataList"></student-add-or-update>
    <course-add-or-update v-if="courseAddOrUpdateVisible" ref="courseaddOrUpdate" @refreshDataList="getDataList"></course-add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './classes-add-or-update'
  import StudentAddOrUpdate from './student-add-or-update'
  import CourseAddOrUpdate from './course-add-or-update'
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
        courseAddOrUpdateVisible: false,
        message: {
          confirm_to: this.$t('message.confirm_to'),
          conduct: this.$t('message.conduct'),
          delete: this.$t('message.delete'),
          batch_delete: this.$t('message.batch_delete'),
          oper: this.$t('message.oper'),
          tip: this.$t('message.tip')
        }
      }
    },
    components: {
      AddOrUpdate,
      StudentAddOrUpdate,
      CourseAddOrUpdate
    },
    activated () {
      this.getDataList()
    },
    methods: {
      gotoDetail(uuid){
        this.$router.push({path: '/classdetails', query: {uuid: uuid}})
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/generator/classes/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'className': this.dataForm.key
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
      deleteHandle (id,className) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.uuid
        })
        var classNames = className ? [className] : this.dataListSelections.map(item => {
          return item.className
        })
        this.$confirm(this.message.confirm_to + `[${classNames.join(',')}]`+ this.message.conduct +`[${className ? this.message.delete : this.message.batch_delete}]`+ this.message.oper +`?`, this.message.tip, {
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
      },
      statusFormat(row){
        if (row.status == 0) {
          return this.$t('classes.used')
        } else {
          return this.$t('classes.disable')
        }
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
