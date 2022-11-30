<template>
  <div style="background-color: #ecf1cb;padding:10px;" >
    <div>
      <ul  style="list-style:none" >
        <li v-if="dataList.length <= 0">{{$t('comment.null_comment_reply')}}</li>
        <li v-for="(item,index) in dataList" :key="index" style="border-bottom: 1px solid #bfb7b7">
          <div style="margin: 10px 0"><a style="margin-right: 10px">{{item.creater}}</a><label>{{item.createTime}}</label></div>
          <div style="margin: 10px">
            <el-row>
              <el-col :span="20" style="word-break:break-word">{{item.content}}</el-col>
              <el-col :span="2"><a v-if="showContentid != item.uuid" @click="openReply(item)">{{$t('leaveMessage.replay')}}</a></el-col>
              <el-col :span="2"><a v-if="showContentid != item.uuid" @click="deleteReply(item)" style="color: red">{{$t('button.delete')}}</a></el-col>
            </el-row>
            <el-row style="padding-left: 10px">
              <el-col :span="4"></el-col>
              <el-col :span="20" v-for="(itemss,indexss) in item.childrenList" :key="indexss">
                <div style="margin: 10px 0"><a style="margin-right: 10px">{{itemss.creater}}</a><label>{{itemss.createTime}}</label></div>
                <el-row>
                  <el-col :span="4"></el-col>
                  <el-col :span="20" style="word-break:break-word">{{itemss.content}}</el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row v-if="showContentid == item.uuid">
              <el-col :span="20"><el-input v-model="dataForm.content" type="textarea"  maxlength="100" show-word-limit  :placeholder="$t('leaveMessage.content')" clearable></el-input></el-col>
              <el-col :span="2"></el-col>
              <el-col :span="2"><el-button @click="dataFormSubmit">{{$t('button.submit')}}</el-button></el-col>
            </el-row>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'leaveMessage',
  data(){
    return {
      courseId:'',
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading:false,
      showContentid:"",
      dataForm:{
        rate:0,
        uuid:'',
        courseId:"",
        content:"",
        creater:"",
        createrId:"",
        createTime:"",
        deleteFlag:"",
        parentUuid:""
      }
    }
  },
  methods:{
    openReply(data){
      this.showContentid = data.uuid
      this.dataForm.parentUuid = data.uuid
      this.dataForm.uuid = ''
    },
    deleteReply(data){
      var ids = [data.uuid]
      this.$confirm(this.$t('message.delete_tip'), this.$t('message.tip'), {
        confirmButtonText: this.$t('message.confirm'),
        cancelButtonText: this.$t('message.cancle'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/generator/leavemessage/delete'),
          method: 'post',
          data: this.$http.adornData(ids, false)
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: this.$t('message.success'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.init(this.dataForm.courseId)
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      })
    },
    sendmessage(data){
      console.log(data)
    },
    init(courseId){
      console.log(courseId)
      this.dataForm.courseId = courseId
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl(`/generator/leavemessage/list`),
        method: 'get',
        params: this.$http.adornParams({
          'page': this.pageIndex,
          'limit': this.pageSize,
          'courseId': this.dataForm.courseId
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
    refresh(){
      this.$http({
        url: this.$http.adornUrl(`/generator/leavemessage/list`),
        method: 'get',
        params: this.$http.adornParams({
          'page': this.pageIndex,
          'limit': this.pageSize,
          'courseId': this.dataForm.courseId
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
      this.$http({
        url: this.$http.adornUrl(`/generator/leavemessage/save`),
        method: 'post',
        data: this.$http.adornData({
          'uuid': this.dataForm.uuid || undefined,
          'courseId': this.dataForm.courseId,
          'rate': this.dataForm.rate,
          'content': this.dataForm.content,
          'creater': this.$store.state.user.name,
          'createrId': this.$store.state.user.id,
          'parentUuid': this.dataForm.parentUuid,
          'deleteFlag': 0
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.$message({
            message: this.$t('leaveMessage.replay_success'),
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.refresh();
              this.showContentid = ''
              this.dataForm.parentUuid = ''
              this.dataForm.uuid = ''
            }
          })
        } else {
          this.$message.error(data.msg)
        }
      })
    }

  }
}
</script>

<style scoped>

</style>
