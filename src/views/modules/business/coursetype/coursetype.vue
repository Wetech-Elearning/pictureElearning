<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.key" :placeholder="$t('course_type.search_key')" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">{{$t('button.search')}}</el-button>
        <el-button v-if="isAuth('business:coursetype:add')" type="primary" @click="addOrUpdateHandle()">{{$t('button.add')}}</el-button>
        <el-button v-if="isAuth('business:coursetype:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">{{$t('button.batch_delete')}}</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      row-key="uuid"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
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
        :label="$t('common.name')">
        <template slot-scope="scope">
          <div v-if="scope.row.parentCourseType != 0">
            <router-link :to="{ path: '/business-course/course',query: {relatedCourseTypeId: scope.row.uuid,relatedCourseTypeName: scope.row.courseTypeName,fromPage:'coursetype'}}">
              {{scope.row.courseTypeName}}
            </router-link>
          </div>
          <div v-if="scope.row.parentCourseType == 0">
            {{scope.row.courseTypeName}}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="courseTypeIntroduction"
        header-align="center"
        align="center"
        :label="$t('course_type.course_type_introduction')">
      </el-table-column>
      <el-table-column
        prop="certificateName"
        header-align="center"
        align="center"
        :label="$t('certificateinfo.certificateinfo_name')">
      </el-table-column>
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
        width="150"
        :label="$t('common.oper')">
        <template slot-scope="scope">
          <svg class="icon" aria-hidden="true" @click="addOrUpdateHandle(scope.row.uuid)">
            <use xlink:href="#icon-bianzu9"></use>
          </svg>
          <svg class="icon" aria-hidden="true" @click="deleteHandle(scope.row.uuid,scope.row.courseTypeName)">
            <use xlink:href="#icon-shanchu"></use>
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
  </div>
</template>

<script>
  import AddOrUpdate from './coursetype-add-or-update'
  export default {
    data () {
      return {
        uploadVisible: false,
        fillType: 'fill',
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
        }
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
          url: this.$http.adornUrl('/generator/coursetype/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'courseTypeName': this.dataForm.key,
            'level': 'one'
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
      deleteHandle (id,courseTypeName) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.uuid
        })
        var courseTypeNames = courseTypeName ? [courseTypeName] : this.dataListSelections.map(item => {
          return item.courseTypeName
        })
        this.$confirm(this.$t('message.confirm_to') + `[${courseTypeNames.join(',')}]`+ this.message.conduct +`[${courseTypeName ? this.$t('message.delete') : this.$t('message.batch_delete')}]`+ this.message.oper +`?`, this.message.tip, {
          confirmButtonText: this.$t('message.confirm'),
          cancelButtonText: this.$t('message.cancle'),
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/generator/coursetype/delete'),
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
      // 添加课程
      addChidrenHandle (row) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.initChildren(row)
        })
      },
      typeFormatter(row){
        if(row.type == "hot"){
          return this.$t('common.no')
        }else if(row.type == "public"){
          return this.$t('common.yes')
        }else{
          return ''
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
