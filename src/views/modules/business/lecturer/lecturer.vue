<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.key" :placeholder="$t('lecturer.search_key')" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">{{$t('button.search')}}</el-button>
        <el-button v-if="isAuth('business:lecturer:add')" type="primary" @click="addOrUpdateHandle()">{{$t('button.add')}}</el-button>
        <el-button v-if="isAuth('business:lecturer:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">{{$t('button.batch_delete')}}</el-button>
        <el-button type="success" @click="importHandle()" >{{$t('student.student_import')}}</el-button>
        <el-button type="info" @click="downFile">{{$t('student.student_down')}}</el-button>
        <el-button type="warning" @click="exportExcel">{{$t('common.excel')}}</el-button>
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
        header-align="center"
        align="center"
        :label="$t('platform.username')">
        <template slot-scope="scope">
          {{scope.row.surname + scope.row.lecturerName}}
        </template>
      </el-table-column>
      <el-table-column
        prop="account"
        header-align="center"
        align="center"
        :label="$t('platform.account')">
      </el-table-column>
      <el-table-column
        prop="lecturerMobile"
        header-align="center"
        align="center"
        :label="$t('lecturer.lecturer_mobile')">
      </el-table-column>
      <el-table-column
        prop="lecturerIntroduction"
        header-align="center"
        align="center"
        :label="$t('lecturer.lecturer_introduction')">
      </el-table-column>
      <el-table-column
        prop="sex"
        header-align="center"
        align="center"
        :label="$t('lecturer.lecturer_sex')" :formatter="sexFormat">
      </el-table-column>
      <el-table-column
        prop="age"
        header-align="center"
        align="center"
        :label="$t('lecturer.lecturer_age')">
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        :label="$t('common.status')">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status === 1"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeUserStatus(scope.row)">
          </el-switch>
        </template>
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
        width="150"
        :label="$t('common.oper')">
        <template slot-scope="scope">
          <svg class="icon" aria-hidden="true" @click="addOrUpdateHandle(scope.row.uuid)">
            <use xlink:href="#icon-bianzu9"></use>
          </svg>
          <svg class="icon" aria-hidden="true" @click="deleteHandle(scope.row.uuid,scope.row.lecturerName)">
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
    <!--上传-->
    <upload v-if="importVisible" ref="import" @refreshDataList="getDataList"></upload>
  </div>
</template>

<script>
  import AddOrUpdate from './lecturer-add-or-update'
  import upload from '@/components/upload'
  import excelUtil from '@/utils/ExcelUtils'
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
        importVisible: false,
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
      upload
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/generator/lecturer/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'lecturerName': this.dataForm.key
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
      deleteHandle (id,lecturerName) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.uuid
        })
        var lecturerNames = lecturerName ? [lecturerName] : this.dataListSelections.map(item => {
          return item.lecturerName
        })
        this.$confirm(`确定对[${lecturerNames.join(',')}]进行[${lecturerName ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: this.$t('message.confirm'),
          cancelButtonText: this.$t('message.cancle'),
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/generator/lecturer/delete'),
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
      // 性别翻译
      sexFormat(row){
        if (row.sex == 0) {
          return '男'
        } else {
          return '女'
        }
      },
      // 修改用户状态
      changeUserStatus(row){
        let status = 0
        if(row.status === 0){
          status = 1
          row.status = 1
        }else{
          status = 0
          row.status = 0
        }
        this.$http({
          url: this.$http.adornUrl(`/sys/user/changeUserStatus`),
          method: 'post',
          data: this.$http.adornData({
            username: row.account,
            status: status
          })
        }).then(({data}) => {
          if(data.code === 0){
            this.$message.success(this.$t('message.success'))
          }
        });
      },
      // 导入
      importHandle () {
        this.importVisible = true
        this.$nextTick(()=>{
          this.$refs.import.init(this.$store.state.user.id,'excel',this.$t('platform.lecturer') + 'excel', '讲师导入')
        })
      },
      // 下载模板
      downFile() {
        window.open(window.SITE_CONFIG.baseUrl + '/generator/lecturer/downLecturerTemplate?templateName=lecturer.xlsx')
      },
      // 导出excel
      exportExcel() {
        window.open(window.SITE_CONFIG.baseUrl + '/generator/lecturer/exportExcel?fileName=' + this.$t('platform.lecturer'))
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
