<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.key" :placeholder="$t('questionnaire.search_key')" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">{{$t('button.search')}}</el-button>
        <el-button v-if="isAuth('business:questionnaire:save')" type="primary" @click="addOrUpdateHandle()">{{$t('button.add')}}</el-button>
        <el-button v-if="isAuth('business:questionnaire:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">{{$t('button.batch_delete')}}</el-button>
      </el-form-item>
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
        prop="questionnaireName"
        header-align="center"
        align="center"
        :label="$t('questionnaire.questionnaire_name')">
      </el-table-column>
      <!--<el-table-column
        prop="creater"
        header-align="center"
        align="center"
        label="">
      </el-table-column>
      <el-table-column
        prop="createDate"
        header-align="center"
        align="center"
        label="">
      </el-table-column>
      <el-table-column
        prop="updater"
        header-align="center"
        align="center"
        label="">
      </el-table-column>
      <el-table-column
        prop="updateDate"
        header-align="center"
        align="center"
        label="">
      </el-table-column>-->
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        :label="$t('questionnaire.questionnaire_status')" :formatter="statusFormatter">
      </el-table-column>
      <el-table-column
        prop="remark"
        header-align="center"
        align="center"
        :label="$t('common.remark')">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="200"
        :label="$t('common.oper')">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="$t('button.edit')" placement="top">
            <svg class="icon" aria-hidden="true" @click="addOrUpdateHandle(scope.row.uuid)">
              <use xlink:href="#icon-bianzu9"></use>
            </svg>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="$t('button.questionnaire_add')" placement="top">
            <svg class="icon" aria-hidden="true" @click="addHandle(scope.row.uuid)">
              <use xlink:href="#icon-zengjia"></use>
            </svg>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="$t('button.delete')" placement="top">
            <svg class="icon" aria-hidden="true" @click="deleteHandle(scope.row.uuid,scope.row.questionnaireName)">
              <use xlink:href="#icon-shanchu"></use>
            </svg>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="$t('button.preview')" placement="top">
            <svg class="icon" aria-hidden="true" @click="preview(scope.row.uuid)">
              <use xlink:href="#icon-preview"></use>
            </svg>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="$t('button.release')" placement="top">
            <svg class="icon" aria-hidden="true" @click="release(scope.row.uuid)">
              <use xlink:href="#icon-fabu1"></use>
            </svg>
          </el-tooltip>
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
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <!-- 添加问卷题目 -->
    <addQuestionnairequestion v-if="addQuestionnairequestionVisible" ref="addQuestionnairequestion" @refreshDataList="getDataList"></addQuestionnairequestion>
    <!-- 查看问卷 -->
    <Questionnairedetail v-if="questionnairedetailVisible" ref="questionnairedetail" @refreshDataList="getDataList"></Questionnairedetail>
  </div>
</template>

<script>
  import AddOrUpdate from './questionnaire-add-or-update'
  import AddQuestionnairequestion from './addQuestionnairequestion'
  import Questionnairedetail from './questionnairedetail'
  export default {
    data () {
      return {
        questionnairedetailVisible: false,
        addQuestionnairequestionVisible: false,
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
      AddQuestionnairequestion,
      Questionnairedetail
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/generator/questionnaire/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'questionnaireName': this.dataForm.key
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
      // 添加问卷题目
      addHandle (uuid) {
        this.addQuestionnairequestionVisible = true
        this.$nextTick(()=>{
          this.$refs.addQuestionnairequestion.init(uuid)
        })
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 删除
      deleteHandle (id, questionnaireName) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.uuid
        })
        var questionnaireNames = questionnaireName ? [questionnaireName] : this.dataListSelections.map(item => {
          return item.questionnaireName
        })
        this.$confirm(this.message.confirm_to + `[${questionnaireNames.join(',')}]`+ this.message.conduct +`[${questionnaireName ? this.message.delete : this.message.batch_delete}]`+ this.message.oper +`?`, this.message.tip, {
          confirmButtonText: this.$t('message.confirm'),
          cancelButtonText: this.$t('message.cancle'),
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/generator/questionnaire/delete'),
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

      // 发布
      release(uuid){
        this.$http({
          url: this.$http.adornUrl(`/generator/questionnaire/release/`+uuid),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: this.$t('message.success'),
              type: 'success',
              duration: 1500
            })
          }else {
            this.$message.error(data.msg)
          }
        })
      },

      // 预览
      preview(uuid){
        this.questionnairedetailVisible = true
        this.$nextTick(()=>{
          this.$refs.questionnairedetail.init(uuid)
        })
      },

      // 状态格式化
      statusFormatter(row){
        if (row.status == 0) {
          return '未发布'
        } else if(row.status == 1){
          return '已发布'
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
