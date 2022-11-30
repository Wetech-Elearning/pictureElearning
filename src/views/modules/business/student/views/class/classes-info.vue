<template>
  <div class="mod-config">
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        prop="className"
        header-align="center"
        align="center"
        :label="$t('classes.classes_name')">
        <template slot-scope="scope">
          <a style="cursor: pointer" @click="toExamMsg(scope.row.uuid)">{{scope.row.className}}</a>
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
<!--    <div id="myExam">-->
<!--      <div class="wrapper">-->
<!--        <ul class="paper" v-loading="dataListLoading">-->
<!--          <li class="item"  @click="toExamMsg(item.uuid)" v-for="(item,index) in dataList" :key="index">-->
<!--            <h2>{{item.className}}</h2>-->
<!--            <div class="info">-->
<!--              <i class="el-icon-time"></i><span>{{item.startDate.substr(0,10)}}</span>-->
<!--              <i class="el-icon-time"></i><span>至{{item.endDate.substr(0,10)}}</span>-->
<!--            </div>-->
<!--          </li>-->
<!--        </ul>-->
<!--      </div>-->
<!--    </div>-->
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
      init(){
        this.getDataList ()
      },
      toExamMsg(uuid) {
        this.$router.push({path: '/classdetails', query: {uuid: uuid}})
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/generator/classes/listByStudentId'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'studentId': this.$store.state.user.id
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.data
            // this.totalPage = data.page.totalCount
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
<style lang="scss" scoped>
.pagination {
  padding: 20px 0px 30px 0px;
  .el-pagination {
    display: flex;
    justify-content: center;
  }
}
.paper {
  h2 {
    cursor: pointer;
  }
}
.item{
  cursor: pointer;
}
.paper .item a {
  color: #000;
}
.item .info i {
  margin-right: 2px;
  color: #0195ff;
}
.item .info span {
  margin-right: 14px;
}
.paper .item {
  background-color: #54f887;
  color: white;
  width: 160px;
  border-radius: 4px;
  padding: 20px 20px;
  border: 1px solid #eee;
  box-shadow: 0 0 4px 2px rgba(217,222,234,0.3);
  transition: all 0.6s ease;
}
.paper .item:hover {
  box-shadow: 0 0 4px 2px rgba(140, 193, 248, 0.45);
  transform: scale(1.03);
}
.paper .item .info {
  font-size: 14px;
  color: #88949b;
}
.paper .item .name {
  font-size: 14px;
  color: #88949b;
}
.paper * {
  margin: 20px 0;
  list-style: none;
}
.wrapper .paper {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}
#myExam .search-li {
  margin-left: auto;
}
#myExam {
  width: 100%;
  margin: 0 auto;
}
#myExam .title {
  margin: 20px;
}
#myExam .wrapper {
  background-color: #fff;
}
</style>
