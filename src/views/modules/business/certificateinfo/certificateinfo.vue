<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.key" :placeholder="$t('certificateinfo.search_key')" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">{{$t('button.search')}}</el-button>
        <el-button v-if="isAuth('business:certificateinfo:add')" type="primary" @click="addOrUpdateHandle()">{{$t('button.add')}}</el-button>
      </el-form-item>
    </el-form>
    <div class="goods-wrapper goods-scroll__wrapper">
      <el-row :gutter="10">
        <el-col
          v-for="item of dataList"
          :key="item.uuid"
          :xs="24"
          :sm="12"
          :md="6"
          class="col-item"
        >
          <el-card
            :body-style="{ padding: '0px' }"
            shadow="hover"
            style="position: relative"
          >
            <i class="el-icon-delete" style="position: relative;top: 6px;left: 180px;font-size: 17px;" @click="deleteHandle(item.uuid,item.certificateName)"></i>
            <i class="el-icon-edit" style="position: relative;top: 6px;left: 185px;font-size: 17px;" @click="addOrUpdateHandle(item.uuid)"></i>
            <div class="padding text-center demo-image block" :style="zs" @click="preview(item)">
              <p class="tit">{{ item.certificateName }}</p>
            </div>
            <div style="padding: 14px">
              <div class="goods-title text-cut-l2" style="text-align:center">
                {{ item.certificateName }}
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
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
    <!--上传-->
    <upload v-if="uploadVisible" ref="upload" @refreshDataList="getDataList"></upload>
    <!--预览-->
    <cerifycateinfoPreview v-if="cerifycateinfoPreviewVisible" ref="cerifycateinfoPreview" @refreshDataList="getDataList"></cerifycateinfoPreview>
  </div>
</template>

<script>
  import AddOrUpdate from './certificateinfo-add-or-update'
  import upload from "@/components/upload";
  import cerifycateinfoPreview from "./cerifycateinfo_preview";
  export default {
    data () {
      return {
        imgurl:'',
        fit: 'cover',
        uploadVisible: false,
        cerifycateinfoPreviewVisible: false,
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
        zs:{
          'backgroundImage':'url(' + require('@/assets/img/zs.png') + ')',
          'text-align':'center',
          'backgroundRepeat':'no-repeat',
          'backgroundSize': 'cover',
          'height': '200px',
          'width': '100%',
          'position': 'relative'
        },
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
      upload,
      cerifycateinfoPreview
    },
    activated () {
      this.getDataList()
    },
    created() {
      this.imgurl = require("@/assets/img/zs.png")
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/generator/certificateinfo/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'certificateName': this.dataForm.key,
            'creater': this.$store.state.user.id
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list.map(item =>{
              item.createDate = item.createDate.substr(0,10)
              item.code = item.createDate.replaceAll('-','')
              return item
            })
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
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 删除
      deleteHandle (id,certificateName) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.uuid
        })
        var certificateNames = certificateName ? [certificateName] : this.dataListSelections.map(item => {
          return item.certificateName
        })
        this.$confirm(this.message.confirm_to + `[${certificateNames.join(',')}]`+ this.message.conduct +`[${certificateNames ? this.message.delete : this.message.batch_delete}]`+ this.message.oper +`?`, this.message.tip, {
          confirmButtonText: this.$t('message.confirm'),
          cancelButtonText: this.$t('message.cancle'),
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/generator/certificateinfo/delete'),
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
      //上传
      upload(id){
        this.uploadVisible = true
        this.$nextTick(() => {
          this.$refs.upload.init(id,'image','图片')
        })
      },
      // 预览
      preview(row){
        this.cerifycateinfoPreviewVisible = true
        this.$nextTick(() => {
          this.$refs.cerifycateinfoPreview.init(row)
        })
      }
    }
  }
</script>
<style>
  .tit {
    color: #cf0c0c;
    font-size: 10px;
    font-weight: 700;
    position: relative;
    top: 27px;
    left: 8px;
    font-family: STHeiti;
    margin: 20px 0;
    padding: 10px;
  }
  .proid {
    text-align: right;
    margin: 37px 27px;
    font-weight: 500;
    /* margin-right: 5px; */
    font-size: 10px;
  }
  .con {
    font-size: 10px;
    font-weight: 700;
    text-align: left;
    margin: 10px 0;
    line-height: 32px;
    text-indent: 2em;
  }
  .con-name {
    font-family: 华文行楷, STXingkai;
    border-bottom: 2px solid #000;
  }
  .con-unit {
    font-size: 1px;
    font-weight: 700;
    position: absolute;
    right: 34px;
    bottom: 12px;
    text-align: center;
    letter-spacing: 3px;
  }
  .con-unit p {
    margin: 5px 0;
  }
  .con-footer {
    font-size: 18px;
    font-weight: 700;
    position: absolute;
    bottom: 45px;
    left: 0;
    right: 0;
    text-align: center;
  }
  .chapter {
    border-radius: 50%;
    position: absolute;
    bottom: 75px;
    right: 134px;
  }
  .icon {
    width: 2em;
    height: 2em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
  .col-item + .col-item {
    margin-bottom: 10px;
  }
  .goods-wrapper {
    padding: 5px 10px;
  .goods-title {
    color: #666666;
    font-size: 12px;
    line-height: 16px;
  }
  }
</style>
