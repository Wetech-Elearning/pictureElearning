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
    <div class="wrapper">
      <ul class="paper" v-loading="dataListLoading">
        <li class="item" v-for="(item,index) in dataList" :key="index">
          <h2 @click="toLeaveMessageDetail(item.courseTypeId,item.courseTypeName)">
            <el-badge :value="item.num">
              {{item.courseTypeName}}
            </el-badge>
          </h2>
          <p class="name">课程包简介: {{item.courseTypeIntroduction}}</p>
          <p class="name">是否必修: {{item.courseTypeIsRequired == 'public'?$t('common.yes'):$t('common.no')}}</p>
        </li>
      </ul>
      <empty v-if="dataList.length == 0"></empty>
    </div>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './comment-add-or-update'
  import empty from "@/components/empty";
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
        }
      }
    },
    components: {
      AddOrUpdate,
      empty
    },
    activated () {
      this.getDataList()
    },
    methods: {
      getDataList(){
        this.$http({
          url: this.$http.adornUrl('/generator/leavemessage/listGroupByCourseTypeId'),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.data
          } else {
            this.dataList = []
          }
          this.dataListLoading = false
        })
      },

      // 跳转到评论列表
      toLeaveMessageDetail(courseTypeId,courseTypeName){
        this.$router.push({path: '/commentDetail', query: {courseTypeId: courseTypeId,courseTypeName: courseTypeName}})
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
      }
    }
  }
</script>
<style lang="scss" scoped>
.icon {
  width: 2em;
  height: 2em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
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
.item {
  margin-top: 10px;
  margin-right: 40px;
}
</style>
