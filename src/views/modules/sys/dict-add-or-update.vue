<template>
  <el-dialog :title="!dataForm.id ? $t('button.add') : $t('button.update')" :close-on-click-modal="false" :visible.sync="visible">
    <el-form class="el-form-normal" :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px">
      <el-form-item label="父级字典" prop="parentName">
        <custom-tree
            :action="'/sys/dict/select'"
            :nodeKey="'id'"
            :props="{label: 'dictName', children: 'children'}"
            :placeHolder="'父级字典'"
            :value.sync="dataForm.parentId"
            :label.sync="dataForm.parentName"
            v-if="visible"
          ></custom-tree>
      </el-form-item>
      <el-form-item label="字典名称" prop="dictName">
        <el-input v-model.trim="dataForm.dictName" placeholder="字典名称" maxlength="32"></el-input>
      </el-form-item>
      <el-form-item label="字典编码" prop="dictCode">
        <el-input v-model.trim="dataForm.dictCode" placeholder="字典编码" maxlength="32"></el-input>
      </el-form-item>
      <el-form-item :label="$t('common.remark')" prop="remarks">
        <el-input v-model.trim="dataForm.remarks" placeholder="备注信息" maxlength="128"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="sortNo">
        <el-input-number size="medium" :min="1" :max="100" v-model="dataForm.sortNo"></el-input-number>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{$t('button.cancle')}}</el-button>
      <el-button type="primary" @click="dataFormSubmit()">{{$t('button.confirm')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      dataForm: {
        id: "",
        parentId: "",
        parentName: "",
        dictName: "",
        dictCode: "",
        sortNo: 1,
        remarks: ""
      },
      dataRule: {
        // parentName: [
        //   { required: true, message: "请选择父级字典", trigger: "blur" }
        // ],
        dictName: [
          { required: true, message: "字典名称不能为空", trigger: "blur" }
        ],
        dictCode: [
          { required: true, message: "字典编码不能为空", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    init(id) {
      this.dataForm.id = id || "";
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
        this.dataForm.parentId  = "";
        if (this.dataForm.id) {
            // 修改
            this.$http({
              url: this.$http.adornUrl(`/sys/dict/info/${this.dataForm.id}`),
              method: "get",
              params: this.$http.adornParams()
            }).then(({ data }) => {
              this.dataForm.id = data.data.id;
              this.dataForm.dictName = data.data.dictName;
              this.dataForm.dictCode = data.data.dictCode;
              this.dataForm.sortNo = data.data.sortNo;
              this.dataForm.remarks = data.data.remarks;
              this.dataForm.parentId = data.data.parentId;
              this.dataForm.parentName = data.data.parentName;
            });
          }
      });
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(
              `/sys/dict/${!this.dataForm.id ? "save" : "update"}`
            ),
            method: "post",
            data: this.$http.adornData({
              id: this.dataForm.id || "",
              dictName: this.dataForm.dictName,
              dictCode: this.dataForm.dictCode,
              parentId: this.dataForm.parentId,
              parentName: this.dataForm.parentName,
              sortNo: this.dataForm.sortNo,
              remarks: this.dataForm.remarks
            })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.visible = false;
                  this.$emit("refreshDataList");
                }
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        }
      });
    }
  }
};
</script>
