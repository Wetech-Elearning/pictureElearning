<template>
  <el-dialog
    :title="form_title"
    :modal-append-to-body="true"
    append-to-body
    :close-on-click-modal="false"
    v-if="visible"
    :visible.sync="visible">
<div class="mod-config">
  <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
    <el-form-item>
      <el-input v-model="dataForm.key" :placeholder="$t('course_type.search_key')" clearable></el-input>
    </el-form-item>
    <el-form-item>
      <el-button @click="getDataList()">{{$t('button.search')}}</el-button>
      <el-button  type="primary" @click="addOrUpdateHandle()">{{$t('button.add')}}</el-button>
      <el-button  type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">{{$t('button.batch_delete')}}</el-button>
    </el-form-item>
  </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      row-key="uuid"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="type"
        header-align="center"
        align="center"
        :label="$t('course_type.course_type_fileType')" :formatter="typeFormatter">
      </el-table-column>
      <el-table-column
        prop="courseTypeName"
        header-align="center"
        align="center"
        :label="$t('course_type.course_type_name')">
      </el-table-column>
      <el-table-column
        prop="courseTypeIntroduction"
        header-align="center"
        align="center"
        :label="$t('course_type.course_type_introduction')">
      </el-table-column>
      <el-table-column
        prop="creater"
        header-align="center"
        align="center"
        :label="$t('common.creater')"></el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 修改 -->
    <pubcourseTypeAdd v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getselectdata"></pubcourseTypeAdd>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{$t('button.cancle')}}</el-button>
      <el-button type="primary" @click="dataFormSubmit()">{{$t('button.confirm')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import pubcourseTypeAdd from './pubcourseTypeAdd'
  export default {
    data () {
      return {
        uploadVisible: false,
        form_title:'',
        visible:false,
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
      pubcourseTypeAdd
    },
    activated () {
      this.getDataList()
    },
    methods: {
      deleteHandle(id,data){
        for(var i =0;i<this.dataList.length;i++){
          for(var j =0;j<this.dataListSelections.length;j++){
            if(this.dataList[i].uuid == this.dataListSelections[j].uuid){
              this.dataList.splice(i,1)
            }
          }
        }
      },
      // 获取数据列表
      getDataList (data) {
        this.visible = true
        this.dataList = data
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      getselectdata(data){
        this.addOrUpdateVisible = false
        for(var i =0;i<data.length;i++){
          var isSame = false;
          for(var j =0;j<this.dataList.length;j++){
            if(this.dataList[j].uuid == data[i].uuid){
              isSame = true;
              break
            }
          }
          if(!isSame){
            this.dataList.push(data[i])
          }
        }
        console.log(data)
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
          this.$refs.addOrUpdate.getDataList()
        })
      },
      dataFormSubmit(){
        var content = "";
        for(var j =0;j<this.dataList.length;j++){
          content +=","+this.dataList[j].uuid
        }
        content = content.substring(1)
        this.$http({
          url: this.$http.adornUrl(`/generator/renderhome/save/pubCoursertype`),
          method: 'post',
          data: this.$http.adornData({
            'pubCourseTypeList': content,
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: this.$t('message.success'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.$emit('refreshDataList')
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      typeFormatter(row){
        if(row.type == "public"){
          return this.$t('course.course_pub')
        }else{
          return ''
        }
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
