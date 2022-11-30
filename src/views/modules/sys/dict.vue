<template>
  <div class="md-main">
    <el-form :inline="true" :model="dataForm" ref="dataForm">
      <el-form-item>
        <el-button type="primary" v-if="isAuth('sys:dict:save')" @click="addOrUpdateHandle()">{{$t('button.add')}}</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border row-key="id" v-loading="dataListLoading" style="width: 100%;">
      <el-table-column prop="dictName" header-align="center" treeKey="id" label="字典名称"></el-table-column>
      <el-table-column prop="dictCode" header-align="center" align="center" label="字典编码"></el-table-column>
      <el-table-column prop="sortNo" header-align="center" align="center" label="排序"></el-table-column>
      <el-table-column className="action" fixed="right" header-align="center" align="center" width="240" :label="$t('common.oper')">
        <template slot-scope="scope">
          <el-button type="text" size="small" v-if="isAuth('sys:dict:update')"  @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="text" size="small" v-if="isAuth('sys:dict:delete')" @click="deleteHandle(scope.row.id)">删除</el-button>
          <el-button type="text" size="small" v-if="isAuth('sys:dict:save') && scope.row.parentId == '0'" @click="addChildHandle(scope.row.id)">添加子项</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <add-child v-if="addChildVisible" ref="addChild" @refreshDataList="getDataList"></add-child>
  </div>
</template>

<script>
import TableTreeColumn from "@/components/table-tree-column";
import AddOrUpdate from "./dict-add-or-update";
import AddChild from "./dict-add-child";
import { treeDataTranslate } from "@/utils";
export default {
  data() {
    return {
      dataForm: {},
      dataList: [],
      dataListLoading: false,
      addOrUpdateVisible: false,
      addChildVisible: false
    };
  },
  components: {
    TableTreeColumn,
    AddOrUpdate,
    AddChild
  },
  activated() {
    this.getDataList();
  },
  methods: {
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl("/sys/dict/list"),
        method: "get",
        params: this.$http.adornParams()
      }).then(({ data }) => {
        // console.log(data)
        if (data && data.code === 0 && data.data) {
          this.dataList = treeDataTranslate(data.data, "id");
        }
        this.dataListLoading = false;
      });
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id);
      });
    },
    addChildHandle(id) {
      this.addChildVisible = true;
      this.$nextTick(() => {
        this.$refs.addChild.init(id);
      });
    },
    // 删除
    deleteHandle(id) {
      this.$confirm(`确定对选定字典项进行删除操作?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl(`/sys/dict/delete/${id}`),
            method: "post",
            data: this.$http.adornData()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.getDataList();
                }
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        })
        .catch(() => {});
    }
  }
};
</script>
