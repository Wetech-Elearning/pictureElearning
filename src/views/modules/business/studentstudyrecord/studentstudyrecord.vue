<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.key" :placeholder="$t('platform.student')" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">{{$t('button.search')}}</el-button>
        <el-button v-if="isAuth('business:studentstudyrecord:studentstudyrecord:save')" type="primary" @click="addOrUpdateHandle()">{{$t('button.add')}}</el-button>
        <el-button v-if="isAuth('business:studentstudyrecord:studentstudyrecord:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">{{$t('button.batch_delete')}}</el-button>
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
        prop="userId"
        header-align="center"
        align="center"
        :label="$t('platform.student')">
      </el-table-column>
      <!--<el-table-column
        prop="classId"
        header-align="center"
        align="center"
        label="班级">
      </el-table-column>-->
      <el-table-column
        prop="courseId"
        header-align="center"
        align="center"
        :label="$t('course.course_name')">
      </el-table-column>
      <el-table-column
        prop="onlineTime"
        header-align="center"
        align="center"
        :label="$t('course.course_study_time')">
        <template slot-scope="scope">
          {{timeFormat(scope.row.onlineTime)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="courseTotalTime"
        header-align="center"
        align="center"
        :label="$t('course.course_total_hour')">
        <template slot-scope="scope">
          {{timeFormatss(scope.row.courseTotalTime)}}
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="left"
        width="150"
        :label="$t('course.course_study_process')">
        <template slot-scope="scope">
          <div v-if="scope.row.onlineTime>0 && scope.row.courseTotalTime>0">
            <el-progress :percentage="Math.round(scope.row.onlineTime /scope.row.courseTotalTime * 10000)/100 > 100 ? 100 : Math.round(scope.row.onlineTime /scope.row.courseTotalTime * 10000)/100" :color="percentColor"></el-progress>
          </div>
          <div v-if="!(scope.row.onlineTime>0 && scope.row.courseTotalTime>0)">
            <el-progress :percentage="0" :color="percentColor"></el-progress>
          </div>
        </template>
      </el-table-column>
      <!--<el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        :label="$t('common.oper')">
        <template slot-scope="scope">
          <svg class="icon" aria-hidden="true" @click="addOrUpdateHandle(scope.row.uuid)">
            <use xlink:href="#icon-bianzu9"></use>
          </svg>
          <svg class="icon" aria-hidden="true" @click="deleteHandle(scope.row.uuid)">
            <use xlink:href="#icon-shanchu"></use>
          </svg>
        </template>
      </el-table-column>-->
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
  import AddOrUpdate from './studentstudyrecord-add-or-update'
  export default {
    data () {
      return {
        dataForm: {
          key: ''
        },
        percentColor:'#909399+/',
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
          url: this.$http.adornUrl('/generator/studentstudyrecord/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'studentName': this.dataForm.key
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
        this.$confirm(`确定对[学习记录]进行['删除']操作?`, '提示', {
          confirmButtonText: this.$t('message.confirm'),
          cancelButtonText: this.$t('message.cancle'),
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/generator/studentstudyrecord/delete'),
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
      timeFormatss(time) {
        var tmptime = ""+time;
        if(tmptime.indexOf(':')>0){
          return tmptime;
        }
        if(time<60){
          time = time *60
        }
        var minute = Math.floor((time % 3600) / 60)
        var second = Math.floor(time % 60)
        minute = minute < 10 ? "0" + minute : minute
        second = second < 10 ? "0" + second : second
        return minute+":"+second
      },timeFormat(time) {
        var tmptime = ""+time;
        if(tmptime.indexOf(':')>0){
          return tmptime;
        }
        var minute = Math.floor((time % 3600) / 60)
        var second = Math.floor(time % 60)
        minute = minute < 10 ? "0" + minute : minute
        second = second < 10 ? "0" + second : second
        return minute+":"+second
      },
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
