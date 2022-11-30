<template>
  <div style="background-color: #ecf1cb;padding:10px;" >
     <h2>留言</h2>
    <div style="margin: 70px">
      <el-form :model="dataForm">
        <div class="block">
          <span class="demonstration">评分</span>
          <el-rate v-model="dataForm.rate"></el-rate>
        </div>
        <el-form-item label="是否私聊:" prop="isPrivate" style="margin-bottom: 0">
          <el-radio v-model="dataForm.isPrivate" label="0">否</el-radio>
          <el-radio v-model="dataForm.isPrivate" label="1">是</el-radio>
        </el-form-item>
        <el-form-item label="内容:" prop="content">
          <el-input type="textarea" maxlength="100" show-word-limit v-model="dataForm.content" placeholder="内容"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" style="float: right">
      <el-button type="primary" @click="dataFormSubmit()">提交</el-button>
    </span>
    </div>
    <div>
      <ul  style="list-style:none" >
        <li v-for="(item,index) in dataList" :key="index" style="border-bottom: 1px solid #bfb7b7">
          <div style="margin: 10px 0"><a style="margin-right: 10px">{{item.creater}}</a><label>{{item.createTime}}</label></div>
          <div style="margin: 10px;word-break:break-word">{{item.content}}</div>
          <el-row style="padding-left: 20px">
            <el-col :span="4"></el-col>
            <el-col :span="20" v-for="(itemss,indexss) in item.childrenList">
              <div style="margin: 10px 0;word-break:break-word"><a style="margin-right: 10px">{{itemss.creater}}</a><label>{{itemss.createTime}}</label></div>
              <el-row>
                <el-col :span="4"></el-col>
                <el-col :span="20">{{itemss.content}}</el-col>
              </el-row>
            </el-col>
          </el-row>
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
      courseType: {},
      dataForm:{
        rate:0,
        uuid:'',
        courseId:"",
        isPrivate:"0",
        content:"",
        creater:"",
        createrId:"",
        createTime:"",
        deleteFlag:""
      }
    }
  },
  methods:{
    init(courseId,courseType){
      this.courseType = courseType
      this.dataForm.courseId = courseId
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl(`/generator/leavemessage/list`),
        method: 'get',
        params: this.$http.adornParams({
          'page': this.pageIndex,
          'limit': this.pageSize,
          'courseId': this.dataForm.courseId,
          'isPrivate':'0',
          'studentId':this.$store.state.user.id
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
          'courseId': this.dataForm.courseId ,
          'isPrivate':'0',
          'studentId':this.$store.state.user.id
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
      console.log('this.courseType',this.courseType)
      this.$http({
        url: this.$http.adornUrl(`/generator/leavemessage/save`),
        method: 'post',
        data: this.$http.adornData({
          'uuid': this.dataForm.uuid || undefined,
          'courseTypeId': this.courseType.courseTypeId,
          'courseId': this.dataForm.courseId,
          'rate': this.dataForm.rate,
          'isPrivate': this.dataForm.isPrivate,
          'content': this.dataForm.content,
          'creater': this.$store.state.user.name,
          'createrId': this.$store.state.user.id,
          'deleteFlag': 0
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.$message({
            message: this.$t('message.success'),
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.refresh();
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
