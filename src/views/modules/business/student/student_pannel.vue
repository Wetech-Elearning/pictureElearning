  <template>
  <el-dialog
    :close-on-click-modal="false"
    :modal-append-to-body="true"
    append-to-body
    v-if="visible"
    :before-close="handleclose"
    :visible.sync="visible">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.key" :placeholder="$t('classes.student')" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">{{$t('button.search')}}</el-button>
        <el-button v-if="isAuth('business:class:student:add')" type="primary" @click="addOrUpdateHandle()">{{$t('button.add')}}</el-button>
<!--        <el-button v-if="isAuth('business:student:student:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>-->
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
        header-align="center"
        align="center"
        :label="$t('student.student_name')">
        <template slot-scope="scope">
          {{ (scope.row.surname == null ? "" : scope.row.surname) + scope.row.userName}}
        </template>
      </el-table-column>
      <el-table-column
        prop="userMobile"
        header-align="center"
        align="center"
        :label="$t('student.student_mobile')">
      </el-table-column>
      <el-table-column
        prop="relatedCompany"
        header-align="center"
        align="center"
        :label="$t('student.student_related_company')">
      </el-table-column>
      <el-table-column
        prop="relatedDepartment"
        header-align="center"
        align="center"
        :label="$t('student.student_related_department')">
      </el-table-column>
      <el-table-column
        prop="sex"
        header-align="center"
        align="center"
        :label="$t('student.student_sex')" :formatter="sexFormatter" />
      <el-table-column
        prop="age"
        header-align="center"
        align="center"
        :label="$t('student.student_age')">
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
  </el-dialog>
</template>

<script>
import student from './student'
export default {
  name: 'student_pannel',
  components:{
    student
  },
  data(){
    return {
      classuuid:"",
      alreadyaddids:[],
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
      visible:false
    }
  },
  methods:{
    handleclose(){
      Object.assign(this.$data, this.$options.data())
      return true
    },
    getDataList (id,ids) {
      if(id !=undefined){
        this.classuuid = id
        this.alreadyaddids = ids

      }
      this.visible = true
      this.dataListLoading = true
      var delids = "";
       for(var i=0;i<this.alreadyaddids.length;i++){
         delids+=","+this.alreadyaddids[i]
       }
       if(this.alreadyaddids.length>0){
         delids = delids.substr(1)
       }
      this.$http({
        url: this.$http.adornUrl('/generator/student/list'),
        method: 'get',
        params: this.$http.adornParams({
          'page': this.pageIndex,
          'limit': this.pageSize,
          'studentName': this.dataForm.key,
          'delids' : delids
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
    // 新增 / 修改
    // addOrUpdateHandle (id) {
    //   this.addOrUpdateVisible = true
    //   this.$nextTick(() => {
    //     this.$refs.addOrUpdate.init(id)
    //   })
    // },
    // 删除
    addOrUpdateHandle (id) {
      var ids = id ? [id] : this.dataListSelections.map(item => {
        return ""+item.uuid
      })

      this.$confirm(`确定添加该批学员`, '提示', {
        confirmButtonText: this.$t('message.confirm'),
        cancelButtonText: this.$t('message.cancle'),
        type: 'warning'
      }).then(() => {

        this.$http({
          url: this.$http.adornUrl('/generator/classes/addstudent2Class/'+this.classuuid),
          method: 'post',
          data: this.$http.adornData(ids, false)
        }).then(({data}) => {
          if (data && data.code === 0) {
            var message = "保存总数："+data.data.total
            message+=",保存成功数："+data.data.saved
            message+=",重复学生数："+(data.data.total -  data.data.saved)
            this.$message({
              message: message,
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                Object.assign(this.$data, this.$options.data())
                this.$emit('refreshDataList')
              }
            })
          } else {
            // this.$message.error(data.msg)
            this.$message.error("班级已添加学生")
          }
        })
      })
    },
    // 性别格式化
    sexFormatter(row){
      console.log('aaaaaaaaaaaaaaa==' ,row.sex)
      if (row.sex == 0) {
        return this.$t('common.man')
      } else if(row.sex == 1) {
        return this.$t('common.woman')
      }else{
        return ''
      }
    }
  }
}
</script>

<style scoped>

</style>
