<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.key" :placeholder="$t('company.search_key')" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">{{$t('button.search')}}</el-button>
        <el-button v-if="isAuth('business:company:company:save')" type="primary" @click="addOrUpdateHandle()">{{$t('button.add')}}</el-button>
        <el-button v-if="isAuth('business:company:company:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">{{$t('button.batch_delete')}}</el-button>
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
        prop="companyName"
        header-align="center"
        align="center"
        :label="$t('company.company_name')">
      </el-table-column>
      <el-table-column
        prop="companyIntroduction"
        header-align="center"
        align="center"
        :label="$t('company.company_introduction')">
      </el-table-column>
      <el-table-column
        prop="companyContact"
        header-align="center"
        align="center"
        :label="$t('company.company_contact')">
      </el-table-column>
      <el-table-column
        prop="companyEmail"
        header-align="center"
        align="center"
        :label="$t('company.company_email')">
      </el-table-column>
      <el-table-column
        prop="companyLocation"
        header-align="center"
        align="center"
        :label="$t('company.company_address')">
      </el-table-column>
      <el-table-column
        prop="companyNature"
        header-align="center"
        align="center"
        :label="$t('company.company_nature')">
      </el-table-column>
      <el-table-column
        prop="companyLegalPerson"
        header-align="center"
        align="center"
        :label="$t('company.company_legal_person')">
      </el-table-column>
      <el-table-column
        prop="companyMobile"
        header-align="center"
        align="center"
        :label="$t('company.company_mobile')">
      </el-table-column>
      <!--<el-table-column
        prop="createDate"
        header-align="center"
        align="center"
        :label="$t('common.create_date')">
      </el-table-column>
      <el-table-column
        prop="updateDate"
        header-align="center"
        align="center"
        label="????????????">
      </el-table-column>
      <el-table-column
        prop="creater"
        header-align="center"
        align="center"
        :label="$t('common.creater')">
      </el-table-column>
      <el-table-column
        prop="updater"
        header-align="center"
        align="center"
        label="?????????">
      </el-table-column>-->
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        :label="$t('common.status')" :formatter="stateFormate">
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
        width="150"
        :label="$t('common.oper')">
        <template slot-scope="scope">
          <svg class="icon" aria-hidden="true" @click="addOrUpdateHandle(scope.row.uuid)">
            <use xlink:href="#icon-bianzu9"></use>
          </svg>
          <svg class="icon" aria-hidden="true" @click="deleteHandle(scope.row.uuid,scope.row.companyName)">
            <use xlink:href="#icon-shanchu"></use>
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
    <!-- ??????, ?????? / ?????? -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './company-add-or-update'
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
      AddOrUpdate
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // ??????????????????
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/generator/company/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'companyName': this.dataForm.key
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
      // ?????????
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // ?????????
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // ??????
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // ?????? / ??????
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // ??????
      deleteHandle (id,companyName) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.uuid
        })
        var companyNames = companyName ? [companyName] : this.dataListSelections.map(item => {
          return item.companyName
        })
        this.$confirm(this.$t('message.confirm_to') + `[${companyNames.join(',')}]`+ this.message.conduct +`[${companyName ? this.$t('message.delete') : this.$t('message.batch_delete')}]`+ this.message.oper +`?`, this.message.tip, {
          confirmButtonText: this.$t('message.confirm'),
          cancelButtonText: this.$t('message.cancle'),
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/generator/company/delete'),
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
      // ???????????????
      stateFormate(row){
        if (row.status == 0) {
          return this.$t('common.disable')
        } else if(row.status == 1) {
          return this.$t('common.normal')
        }else{
          return ''
        }
      },
      //???????????????
      childrenLoad(tree, treeNode, resolve) {

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
