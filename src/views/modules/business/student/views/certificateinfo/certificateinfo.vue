<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <!--<el-form-item>
        <el-input v-model="dataForm.key" placeholder="参数名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">{{$t('button.search')}}</el-button>
        <el-button v-if="isAuth('business:exampaperinfos:exampaperinfos:save')" type="primary" @click="addOrUpdateHandle()">{{$t('button.add')}}</el-button>
        <el-button v-if="isAuth('business:exampaperinfos:exampaperinfos:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">{{$t('button.batch_delete')}}</el-button>
      </el-form-item>-->
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
        prop="certificateName"
        header-align="center"
        align="center"
        :label="$t('certificateinfo.certificateinfo_name')">
      </el-table-column>
      <el-table-column
        prop="createDate"
        header-align="center"
        align="center"
        :label="$t('certificateinfo.certificateinfo_name')">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        :label="$t('common.oper')">
        <template slot-scope="scope">
          <svg class="icon" aria-hidden="true" @click="preview(scope.row)">
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
<!--    <div id="myExam">-->
<!--      <div class="wrapper">-->
<!--        <ul class="paper" v-loading="dataListLoading" style="float: left">-->
<!--          <li class="item" v-for="(item,index) in dataList" :key="index">-->
<!--            &lt;!&ndash;<h2 @click="toExamMsg(item.uuid)">{{item.certificateName}}</h2>&ndash;&gt;-->
<!--            <h2>{{item.certificateName}}</h2>-->
<!--            <div class="info">-->
<!--              <i class="el-icon-loading"></i><span>{{item.createDate.substr(0,10)}}</span>-->
<!--            </div>-->
<!--          </li>-->
<!--        </ul>-->
<!--        <empty v-if="dataList.length == 0"></empty>-->
<!--      </div>-->
<!--    </div>-->
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <cerifycateinfoPreview v-if="cerifycateinfoPreviewVisible" ref="cerifycateinfoPreview" @refreshDataList="getDataList"></cerifycateinfoPreview>
  </div>
</template>

<script>
import AddOrUpdate from './exampaperinfos-add-or-update'
import cerifycateinfoPreview from "@/views/modules/business/certificateinfo/cerifycateinfo_preview";
import empty from "@/components/empty";
export default {
  data () {
    return {
      cerifycateinfoPreviewVisible:false,
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
      addOrUpdateVisible: false
    }
  },
  components: {
    AddOrUpdate,
    empty,
    cerifycateinfoPreview
  },
  activated () {
    this.getDataList()

  },
  methods: {
    // 获取数据列表
    preview(row){
      this.cerifycateinfoPreviewVisible = true
      this.$nextTick(() => {
        var rowsdata = {
          uuid:row.uuid,
          authname:this.$store.state.user.name,
          givetime:row.createDate
        }
        console.log(rowsdata)
        this.$refs.cerifycateinfoPreview.init(rowsdata)
      })
    },
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/generator/certificateinfo/listByUser'),
        method: 'get',
        params: this.$http.adornParams({

          'userId': this.$store.state.user.relateUserId
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
      console.log(examCode)
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
  background-color: #f68e38;
  color: white;
  width: 230px;
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
