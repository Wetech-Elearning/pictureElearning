<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.key" :placeholder="$t('siteinfo.search_key')" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">{{$t('button.search')}}</el-button>
        <el-button v-if="isAuth('business:siteinfo:add')" type="primary" @click="addOrUpdateHandle()">{{$t('button.add')}}</el-button>
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
        prop="content"
        header-align="center"
        align="center"
        :label="$t('siteinfo.send_content')">
      </el-table-column>
      <el-table-column
        prop="type"
        header-align="center"
        align="center"
        :label="$t('siteinfo.accept_people_type')" :formatter="typeFormatter">
      </el-table-column>
      <el-table-column
        prop="acceptUserName"
        header-align="center"
        align="center"
        :label="$t('siteinfo.accept_people')">
      </el-table-column>
      <el-table-column
        prop="sendDate"
        header-align="center"
        align="center"
        :label="$t('siteinfo.send_date')">
      </el-table-column>
      <!--<el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        :label="$t('common.oper')">
        <template slot-scope="scope">
          <svg class="icon" aria-hidden="true" @click="addOrUpdateHandle(scope.row.uuid)">
            <use xlink:href="#icon-bianzu9"></use>
          </svg>
        </template>
      </el-table-column>-->
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
  import AddOrUpdate from './siteinfo-add-or-update'
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
        questionnaireData:[],
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
      handleClick(tab, event){
        console.log(tab)
      },
      // ??????????????????
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/generator/siteinfo/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'key': this.dataForm.key,
            'userId': this.$store.state.user.id
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
      //???????????????
      typeFormatter (row) {
        if (row.type == 1) {
          return '??????'
        } else if(row.type == 2) {
          return '??????'
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
