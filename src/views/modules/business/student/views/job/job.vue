<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.examPaperName" :placeholder="$t('myJob.search_key')" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">{{$t('button.search')}}</el-button>
      </el-form-item>
    </el-form>
    <div id="myExam">
      <div class="wrapper">
<!--        <ul class="paper" v-loading="dataListLoading">
          <li @click="toExamMsg(item.uuid)" class="item" v-for="(item,index) in dataList" :key="index" style="cursor: pointer;">
            <h2 >{{item.examPaperName}}</h2>
            <p class="name">{{item.examPaperName}}-{{item.description}}</p>
            <div class="info">
              <i class="el-icon-loading"></i><span>{{item.createDate.substr(0,10)}}</span>
              <i class="el-icon-time"></i><span v-if="item.exmaTimeLimit != null">限时{{item.exmaTimeLimit}}分钟</span>
              <i class="el-icon-tickets"></i><span>满分{{item.totalScore}}分</span>
            </div>
          </li>
        </ul>-->
        <el-table
          :data="dataList"
          v-loading="dataListLoading"
          @selection-change="selectionChangeHandle"
          style="width: 100%;">
          <el-table-column
            prop="examPaperName"
            header-align="center"
            align="center"
            :label="$t('myJob.job_name')">
          </el-table-column>
          <el-table-column
            prop="description"
            header-align="center"
            align="center"
            :label="$t('myJob.job_desc')">
          </el-table-column>
          <el-table-column
            prop="examNum"
            header-align="center"
            align="center"
            :label="$t('myJob.job_num')">
          </el-table-column>
          <el-table-column
            prop="examMaxNum"
            header-align="center"
            align="center"
            :label="$t('myJob.job_max_num')">
          </el-table-column>
          <el-table-column
            prop="maxScore"
            header-align="center"
            align="center"
            :label="$t('myJob.job_score')">
          </el-table-column>
          <el-table-column
            prop="passScore"
            header-align="center"
            align="center"
            :label="$t('myJob.job_pass_score')">
          </el-table-column>
          <el-table-column
            prop="totalScore"
            header-align="center"
            align="center"
            :label="$t('myJob.job_total_score')">
          </el-table-column>
          <el-table-column
            prop=""
            header-align="center"
            align="center"
            :label="$t('common.oper')">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="查看" placement="top">
                <svg class="icon" aria-hidden="true" @click="toExamMsg(scope.row.uuid)">
                  <use xlink:href="#icon-preview"></use>
                </svg>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <empty v-if="dataList.length == 0"></empty>
        <div class="pagination">
          <el-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="pageIndex"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalPage">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import empty from "@/components/empty";
export default {
  data () {
    return {
      loading: false,
      dataForm: {
        examPaperName: ''
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
    empty
  },
  activated () {
    this.getDataList()

  },
  methods: {
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/generator/exampaperinfos/listByUser'),
        method: 'get',
        params: this.$http.adornParams({
          'page': this.pageIndex,
          'limit': this.pageSize,
          'userId': this.$store.state.user.id,
          "examPaperName": this.dataForm.examPaperName
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.dataList = data.data
          this.totalPage = data.total
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
        confirmButtonText: this.$t('message.confirm'),
        cancelButtonText: this.$t('message.cancle'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/generator/exampaperinfos/delete'),
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
    // 跳转到试卷详情页
    toExamMsg(uuid) {
      this.$router.push({path: '/exampaper-detail', query: {uuid: uuid}})
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
  background-color: #5761D5;
  color: white;
  width: 380px;
  border-radius: 4px;
  padding: 20px 30px;
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
.icon{
  width: 2em;
  height: 2em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
