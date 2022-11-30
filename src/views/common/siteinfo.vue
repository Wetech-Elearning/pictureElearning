<template>
  <el-dialog
    :append-to-body="true"
    width="70%"
    height="60%"
    :title="$t('message.tip')"
    v-if="siteInfoIsible"
    @close='closeDialog'
    :visible.sync="siteInfoIsible">
    <!--<el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.key" placeholder="参数名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">{{$t('button.search')}}</el-button>
      </el-form-item>
    </el-form>-->
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane :abel="$t('platform.site_info')" name="siteInfo">
        <span slot="label">{{$t('platform.site_info')}}<el-badge :value="siteInfoCount"></el-badge></span>
        <el-table
          :data="siteDataList"
          border
          v-loading="siteDataListLoading"
          style="width: 100%;">
          <el-table-column
            type="selection"
            header-align="center"
            align="center"
            width="50">
          </el-table-column>
          <el-table-column
            prop="sendUserName"
            header-align="center"
            align="center"
            :label="$t('siteinfo.send_people')">
          </el-table-column>
          <el-table-column
            prop="content"
            header-align="center"
            align="center"
            :label="$t('siteinfo.send_content')">
          </el-table-column>
          <el-table-column
            prop="sendDate"
            header-align="center"
            align="center"
            :label="$t('siteinfo.send_date')">
          </el-table-column>
          <el-table-column
            fixed="right"
            header-align="center"
            align="center"
            width="150"
            :label="$t('siteinfo.send_oper')">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="$t('button.read')" placement="top">
                <svg class="icon" aria-hidden="true" @click="readed(scope.row.uuid)">
                  <use xlink:href="#icon-yiyue"></use>
                </svg>
              </el-tooltip>

            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="siteSizeChangeHandle"
          @current-change="siteCurrentChangeHandle"
          :current-page="sitePageIndex"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="sitePageSize"
          :total="siteTotalPage"
          layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane :label="$t('platform.questionnaire_info')" name="questionnaireInfo">
        <span slot="label">{{$t('platform.questionnaire_info')}}<el-badge :value="questionnaireInfoCount"></el-badge></span>
        <el-table
          :data="questionnaireDataList"
          border
          v-loading="questionnaireDataListLoading"
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
          <el-table-column
            fixed="right"
            header-align="center"
            align="center"
            width="150"
            :label="$t('siteinfo.send_oper')">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="填写" placement="top">
                <svg class="icon" aria-hidden="true" @click="writed(scope.row.questionnaireId)">
                  <use xlink:href="#icon-bianzu9"></use>
                </svg>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="questionnaireSizeChangeHandle"
          @current-change="questionnaireCurrentChangeHandle"
          :current-page="questionnairePageIndex"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="questionnairePageSize"
          :total="questionnaireTotalPage"
          layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
        <AnswerQuestionnaire v-if="answerQuestionnaireVisible" ref="answerQuestionnaire" @refreshDataList="getQuestionnaireDataList"></AnswerQuestionnaire>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
  import AnswerQuestionnaire from './answerQuestionnaire'
  export default {
    data () {
      return {
        activeName: 'siteInfo',
        siteInfoIsible: false,
        answerQuestionnaireVisible: false,
        dataForm: {
          key: ''
        },
        siteDataList: [],
        sitePageIndex: 1,
        sitePageSize: 10,
        siteTotalPage: 0,
        siteDataListLoading: false,
        siteInfoCount: 0,
        questionnaireDataList: [],
        questionnairePageIndex: 1,
        questionnairePageSize: 10,
        questionnaireTotalPage: 0,
        questionnaireDataListLoading: false,
        questionnaireInfoCount: 0
      }
    },
    components: {
      AnswerQuestionnaire
    },
    methods: {
      // 初始化
      init (siteInfoCount,questionnaireInfoCount) {
        this.siteInfoCount = siteInfoCount
        this.questionnaireInfoCount = questionnaireInfoCount
        this.siteInfoIsible = true
        this.$nextTick(() => {
          this.getSiteDataList()
          this.getQuestionnaireDataList()
        })
      },
      // 获取数据列表
      getSiteDataList () {
        this.siteDataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/generator/siteinfo/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.sitePageIndex,
            'limit': this.sitePageSize,
            'key': this.dataForm.key,
            'userId': this.$store.state.user.id
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.siteDataList = data.page.list
            this.siteTotalPage = data.page.totalCount
            this.siteInfoCount = data.page.totalCount
          } else {
            this.siteDataList = []
            this.SiteTotalPage = 0
          }
          this.siteDataListLoading = false
        })
      },
      //已阅
      readed (id) {
        this.$http({
          url: this.$http.adornUrl(`/generator/siteinfo/updateSiteInfo/`+id),
          method: 'get',
          params: this.$http.adornParams()
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
            this.getSiteDataList()
          }
        })
      },
      // 填写问卷
      writed (id) {
        this.answerQuestionnaireVisible = true
        this.$nextTick(()=>{
          this.$refs.answerQuestionnaire.init(id)
        })
      },
      // 每页数
      siteSizeChangeHandle (val) {
        this.SitePageSize = val
        this.SitePageIndex = 1
        this.getSiteDataList()
      },
      // 当前页
      siteCurrentChangeHandle (val) {
        this.sitePageIndex = val
        this.getSiteDataList()
      },

      getQuestionnaireDataList() {
        this.questionnaireDataList = []
        this.questionnaireDataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/generator/questionnairerelation/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.questionnairePageIndex,
            'limit': this.questionnairePageSize,
            'userId': this.$store.state.user.id
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.questionnaireDataList = data.page.list
            this.questionTotalPage = data.page.totalCount
            this.questionnaireInfoCount = data.page.totalCount
          } else {
            this.questionnaireDataList = []
            this.questionTotalPage = 0
          }
          this.questionnaireDataListLoading = false
        })
      },

      // 每页数
      questionnaireSizeChangeHandle (val) {
        this.questionnairePageSize = val
        this.questionnairePageIndex = 1
        this.getQuestionnaireDataList()
      },
      // 当前页
      questionnaireCurrentChangeHandle (val) {
        this.questionnairePageIndex = val
        this.getQuestionnaireDataList()
      },

      // tab切换
      handleClick(tab, event) {
        if('siteInfo' === this.activeName){
          this.getSiteDataList()
        }
        if('questionnaireInfo' === this.activeName){
          this.getQuestionnaireDataList()
        }
      },

      // 关闭事件
      closeDialog(){
        this.$emit('refreshDataList')
      },
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

