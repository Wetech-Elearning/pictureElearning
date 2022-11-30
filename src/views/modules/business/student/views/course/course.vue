<template>
  <div class="mod-config">
    <div id="myExam">
      <div class="wrapper">
        <ul class="paper" v-loading="dataListLoading" style="float: left;">
          <el-card  style=" padding: 0px;cursor: pointer;margin-right: 15px" v-for="(item,index) in dataList" :key="index">
            <img style="padding: 5px;width: 245px;height: 246px;" :src="item.courseCover" class="image" @click="toCourseDetail(item.uuid)">
            <div style="padding: 14px;">
              <span>{{item.courseTypeName}}</span>
            </div>
          </el-card>
        </ul>
      </div>
      <empty v-if="dataList.length == 0"></empty>
    </div>
    <player v-if="showPlay" ref="play" @refreshDataList="getDataList"></player>
  </div>
</template>

<script>
  import player from './play'
  import empty from "@/components/empty"
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
      player,
      empty
    },
    activated () {
      this.getDataList()
    },
    methods: {
      toCourseDetail(uuid) {
        // this.$router.push({path: '/course-list', query: {uuid: uuid}})
        this.$router.push({path: '/course-detail', query: {id: uuid}})
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/generator/coursetype/listByStudent'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'studentId': this.$store.state.user.id
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.data
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
  background-color: #a4dbf1;
  //color: white;
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
//#myExam .search-li {
//  margin-left: auto;
//}
//#myExam {
//  width: 100%;
//  margin: 0 auto;
//}
#myExam .title {
  margin: 20px;
}
#myExam .wrapper {
  background-color: #fff;
}
</style>
