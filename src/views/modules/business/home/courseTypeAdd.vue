<template>
  <el-dialog
    :title="form_title"
    :close-on-click-modal="false"
    :modal-append-to-body="true"
    append-to-body
    v-if="visible"
    :visible.sync="visible">
<div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.key" :placeholder="$t('course_type.search_key')" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">{{$t('button.search')}}</el-button>
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
        :selectable="checkSelectable"
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
        :label="$t('common.creater')">
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
    <!-- 弹窗, 新增 / 修改 -->

    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{$t('button.cancle')}}</el-button>
      <el-button type="primary" @click="dataFormSubmit()">{{$t('button.confirm')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import upload from "@/components/upload";
  export default {
    data () {
      return {
        uploadVisible: false,
        form_title:'',
        visible:false,
        uuids:"",
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
      upload
    },
    activated () {
      this.getDataList()
    },
    methods: {
      checkSelectable(row, index){
        return row.parentCourseType != 0
      },
      // 获取数据列表
      getDataList (ids) {
        if(ids !=undefined){
          this.uuids = ids
        }
        this.visible = true
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/generator/coursetype/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'courseTypeName': this.dataForm.key,
            'level':'two',
            'notinids':this.uuids,
            'type':'hot'
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
      dataFormSubmit(){
        this.$emit("refreshDataList",this.dataListSelections)
        //this.$parent.getselectdata(this.dataListSelections)
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
      typeFormatter(row){
        if(row.type == "hot"){
          return this.$t('course.course_hot')
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
