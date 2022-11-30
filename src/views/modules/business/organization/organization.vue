<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.key" :placeholder="$t('organization.search_key')" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">{{$t('button.search')}}</el-button>
        <!--<el-button v-if="isAuth('business:organization:organization:save')" type="primary" @click="addOrUpdateHandle()">{{$t('button.add')}}</el-button>-->
        <!--<el-button v-if="isAuth('business:organization:organization:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">{{$t('button.batch_delete')}}</el-button>-->
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      row-key="uuid"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <!--<el-table-column
        prop="parentOrg"
        header-align="center"
        align="center"
        label="归属企业">
      </el-table-column>-->
      <el-table-column
        prop="orgName"
        header-align="center"
        align="center"
        :label="$t('organization.organization_name')">
      </el-table-column>
      <el-table-column
        prop="orgType"
        header-align="center"
        align="center"
        :label="$t('organization.organization_type')" :formatter="orgTypeFormatter">
      </el-table-column>
      <!--<el-table-column
        prop="creater"
        header-align="center"
        align="center"
        :label="$t('common.creater')">
      </el-table-column>
      <el-table-column
        prop="createDate"
        header-align="center"
        align="center"
        :label="$t('common.create_date')">
      </el-table-column>
      <el-table-column
        prop="updater"
        header-align="center"
        align="center"
        label="修改人">
      </el-table-column>
      <el-table-column
        prop="updateDate"
        header-align="center"
        align="center"
        label="修改时间">
      </el-table-column>-->
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
          <svg v-if="scope.row.orgType !== 'office'" class="icon" aria-hidden="true" @click="addChidrenHandle(scope.row)">
            <use xlink:href="#icon-zengjia"></use>
          </svg>
          <svg v-if="scope.row.orgType == 'office'" class="icon" aria-hidden="true" @click="enjoy(scope.row)">
            <use xlink:href="#icon-erweima"></use>
          </svg>
          <svg v-if="scope.row.orgType != 'company'" class="icon" aria-hidden="true" @click="addOrUpdateHandle(scope.row.uuid)">
            <use xlink:href="#icon-bianzu9"></use>
          </svg>
          <svg v-if="scope.row.orgType != 'company'" class="icon" aria-hidden="true" @click="deleteHandle(scope.row.uuid,scope.row.orgName)">
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
    <el-dialog title="分享" :visible.sync="dialogQrCodeVisible">
      <div>
        分享链接:{{enjoyUrl}}
      </div>
      <div>
        分享二维码:
        <vue-qr :logoSrc="imageUrl" :text="enjoyUrl" :size="150"></vue-qr>
      </div>
    </el-dialog>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './organization-add-or-update'
  import vueQr from 'vue-qr'
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
        dialogQrCodeVisible: false,
        enjoyUrl: '',
        imageUrl: require("@/assets/img/avatar.png"),
        companyId: '',
        companyName: '',
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
      vueQr
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/generator/organization/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'orgName': this.dataForm.key,
            'userId':this.$store.state.user.relateUserId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            if(data.page.list.length > 0){
              this.companyId = data.page.list[0].uuid
              this.companyName = data.page.list[0].orgName
              this.dataList = data.page.list
              this.totalPage = data.page.totalCount
            }else{
              this.dataList = []
              this.totalPage = 0
            }
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      enjoy(data){
        console.log('data======',data)
        this.dialogQrCodeVisible = true
        this.enjoyUrl = `${window.SITE_CONFIG.register}/#/register?uuid=` + this.companyId + `&company=` + this.companyName + '&department=' + data.parentOrg + '&office=' + data.uuid
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
      // 添加子组织
      addChidrenHandle (row) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.initChildren(row)
        })
      },
      // 删除
      deleteHandle (id,orgName) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.uuid
        })
        var orgNames = orgName ? [orgName] : this.dataListSelections.map(item => {
          return item.orgName
        })
        this.$confirm(this.message.confirm_to + `[${orgNames.join(',')}]`+ this.message.conduct +`[${orgName ? this.message.delete : this.message.batch_delete}]`+ this.message.oper +`?`, this.message.tip, {
          confirmButtonText: this.$t('message.confirm'),
          cancelButtonText: this.$t('message.cancle'),
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/generator/organization/delete'),
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
      orgTypeFormatter(row){
        if(row.orgType == "company"){
          return '公司'
        }else if(row.orgType == "department"){
          return '事业部'
        }else if(row.orgType == "office"){
          return '科室'
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
