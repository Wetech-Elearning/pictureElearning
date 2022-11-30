<template>
  <el-dialog
    :title="form_title"
    :modal-append-to-body="true"
    append-to-body
    :close-on-click-modal="false"
    v-if="visible"
    :visible.sync="visible">
<div class="mod-config">
  <i style="color:red">{{$t('message.home_image_size')}}</i>
  <el-upload
    :action="url"
    list-type="picture-card"
    :on-success="successHandle"
    :file-list="fileList"
    :on-remove="handleRemove">
    <i class="el-icon-plus"></i>

  </el-upload>
  <el-dialog :visible.sync="dialogVisible">
    <img width="100%" :src="dialogImageUrl" alt="">

  </el-dialog>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{$t('button.cancle')}}</el-button>
      <el-button type="primary" @click="dataFormSubmit()">{{$t('button.confirm')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import upload from '@/components/upload'
  export default {
    data () {
      return {
        url:'',
        uploadVisible: false,
        form_title:'',
        dialogVisible:false,
        visible:false,
        fileList:[],
        dataForm: {
          key: '',
          certificateCover:[]
        },
        nextId:'',
        imageurl:'',
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dialogImageUrl:'',
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false
      }
    },
    components: {
      upload
    },
    activated () {

    },
    methods: {
      successHandle(response, file, fileList){
        this.dataForm.certificateCover.push(response)
        this.$nextTick(() => {
          this.nextId = new Date().getTime()
          // 阿里云
          //this.url = this.$http.adornUrl(`/sys/alibaba/oss/upload?token=${this.$cookie.get('token')}&uuid=`+this.nextId)
          // 亚马逊
          this.url = this.$http.adornUrl(`/sys/aws/oss/upload?token=${this.$cookie.get('token')}&uuid=` + this.nextId)
        })

      },
      handleRemove(file, fileList) {
        this.dataForm.certificateCover = []
        for(var i =0;i<fileList.length;i++){
          if(fileList[i].response!=undefined){
            this.dataForm.certificateCover.push(fileList[i].response)
          } else {
            this.dataForm.certificateCover.push(fileList[i].url)
          }
        }
      },
      init(id,data){
        this.nextId=new Date().getTime()
        this.visible = true
        // 阿里云
        // this.url = this.$http.adornUrl(`/sys/alibaba/oss/upload?token=${this.$cookie.get('token')}&uuid=`+this.nextId)
        // 亚马逊
        this.url = this.$http.adornUrl(`/sys/aws/oss/upload?token=${this.$cookie.get('token')}&uuid=` + this.nextId + '&objType=轮播图')
        this.fileList = data
        console.log(data.length)
        for(var i = 0;i<data.length ;i++){
          this.dataForm.certificateCover.push(data[i].url)
        }
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.uploadVisible = true
        this.$nextTick(() => {
          var t = new Date().getTime();
          this.$refs.upload.init(t,'image','轮播图','轮播图')
        })
      },
      dataFormSubmit(){
        var content = "";
        for(var i =0;i<this.dataForm.certificateCover.length;i++){
          content +=","+this.dataForm.certificateCover[i]
        }
        content = content.substring(1)
        this.$http({
          url: this.$http.adornUrl(`/generator/renderhome/save/banners`),
          method: 'post',
          data: this.$http.adornData({
            'carouselList': content,
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
      //上传
      upload(id){
        this.uploadVisible = true
        this.$nextTick(() => {
          this.$refs.upload.init(id,'image','轮播图','轮播图')
        })
      },
      // 添加课程
      addChidrenHandle (row) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.initChildren(row)
        })
      },
      typeFormatter(row){
        if(row.type == "hot"){
          return '热门课程'
        }else if(row.type == "public"){
          return '公开课程'
        }else{
          return ''
        }
      }
    },
    mounted () {

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
