<template>
  <el-dialog
    :title="questionnaireName"
    :close-on-click-modal="false"
    :visible.sync="questionnairedetailVisible"
    v-if="questionnairedetailVisible">
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%;">
      <el-table-column
        prop="questionType"
        header-align="center"
        align="center"
        :label="$t('questionnaire.questionnaire_type')">
      </el-table-column>
      <el-table-column
        prop="question"
        header-align="center"
        align="center"
        :label="$t('questionnaire.questionnaire_content')">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="反馈内容">
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        questionnairedetailVisible: false,
        dataList: [],
        dataListLoading: false,
        uuid: '',
        questionnaireName: ''
      }
    },
    methods: {
      init (id,questionnaireName) {
        this.uuid = id
        this.questionnaireName = questionnaireName
        this.questionnairedetailVisible = true
        this.$nextTick(() => {
          this.$http({
            url: this.$http.adornUrl(`/generator/questionnairedetail/info/${this.uuid}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.dataList = data.data
            }
          })
        })
      }
    }
  }
</script>
