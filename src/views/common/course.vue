<template>
  <div class="course-container">
    <div class="course-screen">
      <el-collapse  v-model="activeNames">
        <el-collapse-item name="1" style="color:#45c2b5;">
          <template slot="title">
            <h3 class="font-color">{{$t('course.course_screen')}}</h3>
          </template>
          <el-form :model="form" :inline="true" ref="searchForm" label-position="right">
            <el-row>
              <el-col :span="6">
                <el-form-item :label="$t('course.course_name')">
                  <el-input v-model="form.courseTypeName" :placeholder="$t('course.course_name')"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item :label="$t('course.course_type')">
                  <el-select v-model="form.courseType" :placeholder="$t('course.course_type')">
                    <el-option :label="$t('course.course_hot')" value="hot"></el-option>
                    <el-option :label="$t('course.course_pub')" value="public"></el-option>
                    <el-option :label="$t('course.course_all')" value="all"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item>
                  <el-button type="primary" @click="search('searchForm')">{{$t('button.search')}}</el-button>
                  <el-button @click="resetForm('searchForm')">{{$t('button.reset')}}</el-button>
                </el-form-item>
              </el-col>
            </el-row>
            <!--<el-row>
              <el-col :span="6">
                <el-form-item label="课程类型:">
                  <el-input v-model="form.courseType" placeholder="课程类型"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="讲师名称:">
                  <el-input v-model="form.lecturer" placeholder="讲师名称"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="学习时间">
                  <el-col :span="11">
                    <el-form-item>
                      <el-date-picker
                        v-model="form.startDate"
                        type="datetime"
                        :placeholder="$t('common.start_date')"
                        default-time="12:00:00">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col class="line" :span="2">——</el-col>
                  <el-col :span="11">
                    <el-form-item>
                      <el-date-picker
                        v-model="form.endDate"
                        type="datetime"
                        placeholder="结束时间"
                        default-time="12:00:00">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>-->
          </el-form>
        </el-collapse-item>
      </el-collapse>
    </div>
    <h3 class="font-color">{{$t('course.course_screen_result')}}</h3>
    <div class="course-content">
      <el-row :gutter="30">
          <el-col :span="6" v-for="(item, index) in dataList" :key="index">
            <el-card :body-style="{ padding:'0px' }" shadow="hover">
              <img :src="item.courseCover" class="image" @click="goCourseDetail(item.uuid, item.type)">
              <div style="padding: 14px;">
                <span>{{item.courseTypeName}}</span>
              </div>
            </el-card>
          </el-col>
        </el-row>
      <empty v-if="dataList.length == 0"></empty>
    </div>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </div>
</template>
<script>
  import empty from "@/components/empty";
export default {
  data() {
    return {
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      activeNames: ['1'],
      form:{
        type: '',
        isExam: '1',
        courseTypeName: '',
        lecturer: '',
        courseType: ''
     }
    };
  },
  components: {
    empty
  },
  beforeMount () {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/generator/coursetype/list'),
        method: 'get',
        params: this.$http.adornParams({
          'page': this.pageIndex,
          'limit': this.pageSize,
          'type': this.form.courseType,
          'courseTypeName': this.form.courseTypeName,
          'level': 'two',
          'from': 'courseCenter'
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
    handleSizeChange () {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    handleCurrentChange () {
      this.pageIndex = val
      this.getDataList()
    },
    // 跳转到课程详情
    goCourseDetail (courseId, courseType) {
      if (courseType == 'public') {
        this.$http({
          url: this.$http.adornUrl('/generator/classes/listCorusesByStudentId'),
          method: 'get',
          params: this.$http.adornParams({
            'studentId': this.$store.state.user.id,
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            if (data.data.length > 0) {
              let flag = false
              for (let i = 0; i < data.data.length; i++) {
                let item = data.data[i]
                if (courseId == item.uuid) {
                  flag = true
                }
              }
              if (!flag) {
                this.$message.warning('当前用户的班级没有关联此必修课,无法查看')
              } else {
                this.$router.push({
                  path: '/course-detail',
                  query: {
                    id: courseId
                  }
                })
              }
            } else {
              this.$message.warning('当前用户的班级没有关联此必修课,无法查看')
            }
          }
        })
      } else {
        this.$router.push({
          path: '/course-detail',
          query: {
            id: courseId
          }
        })
      }
    },
    // {{$t('button.search')}}
    search (form) {
      this.getDataList()
    },
    // 重置
    resetForm (form) {
      this.form.type = ''
      this.form.courseName = ''
    }
  }
};
</script>
<style scoped>
  img{
    width: 100%;
    height: 234px;
  }
  .course-content{
    margin-bottom: 20px;
  }
  .font-color{
   color: #3E8EF7;
  }
  el-col{
    cursor: pointer;
  }
</style>
