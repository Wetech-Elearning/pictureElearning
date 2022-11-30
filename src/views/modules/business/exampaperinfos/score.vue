<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.key" :placeholder="$t('paper.search_key')" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">{{$t('button.search')}}</el-button>
        <el-button v-if="isAuth('business:exampaperinfos:add')" type="primary" @click="addOrUpdateHandle()">{{$t('button.add')}}</el-button>
<!--        <el-button v-if="isAuth('business:exampaperinfos:exampaperinfos:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">{{$t('button.batch_delete')}}</el-button>-->
      </el-form-item>
    </el-form>
    <div id="myExam">
      <div class="wrapper">
        <ul class="paper" v-loading="dataListLoading">
          <li class="item" v-for="(item,index) in dataList" :key="index">
            <h2 @click="toExamMsg(item.uuid)">
              {{item.examPaperName}}
              <i v-if="item.status == 1" class="el-icon-success" style="color: green;font-size: 20px"></i>
            </h2>
            <p class="name">{{item.description}}</p>
            <p class="name">{{$t('course.course_name')}}：{{item.subject}}</p>
            <div class="info">
              <i class="el-icon-loading" style="color: white"></i><span>{{item.createDate.substr(0,10)}}</span>
              <i class="el-icon-time" style="color: white"></i><span v-if="item.exmaTimeLimit != null">{{$t('paper.paper_time_limit')}}{{item.exmaTimeLimit}}{{$t('paper.paper_time_unit')}}</span>
              <i class="el-icon-tickets" style="color: white"></i><span>{{$t('paper.paper_total_score')}}{{item.totalScore}}{{$t('paper.paper_unit')}}</span>
            </div>
          </li>
        </ul>
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
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './exampaperinfos-add-or-update'
  export default {
    data () {
      return {
        loading: false,
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
          url: this.$http.adornUrl('/generator/exampaperinfos/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'examPaperName': this.dataForm.key,
            'creater': this.$store.state.user.name
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
  background-color: #007aff;
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
  color: white;
}
.paper .item .name {
  font-size: 14px;
  color: white;
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
