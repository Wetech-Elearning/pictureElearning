<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.key" :placeholder="$t('course.course_name')" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">{{$t('button.search')}}</el-button>
        <el-button v-if="isAuth('business:course:add')" type="primary" @click="addOrUpdateHandle()">{{$t('button.add')}}</el-button>
        <el-button v-if="isAuth('business:course:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">{{$t('button.batch_delete')}}</el-button>
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
        prop="relatedCourseType"
        header-align="center"
        align="center"
        :label="$t('course_type.course_type_name')">
      </el-table-column>
      <el-table-column
        prop="courseName"
        header-align="center"
        align="center"
        :label="$t('common.name')">
      </el-table-column>
      <!--<el-table-column
        prop="courseIntroduction"
        header-align="center"
        align="center"
        :label="$t('course.course_introduction')">
      </el-table-column>-->
      <!--<el-table-column
        prop="serial"
        header-align="center"
        align="center"
        label="序号">
      </el-table-column>-->
      <el-table-column
        prop="fileType"
        header-align="center"
        align="center"
        :label="$t('course.course_type')" :formatter="fileTypeFormatter">
      </el-table-column>
      <el-table-column
        prop="totalTime"
        header-align="center"
        align="center"
        :label="$t('course.course_total_class_hour')">
      </el-table-column>
     <!-- <el-table-column
        prop="examPaperId"
        header-align="center"
        align="center"
        :label="$t('paper.paper_name')">
      </el-table-column>-->
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        :label="$t('course.course_status')" :formatter="statusFormatter">
      </el-table-column>
      <el-table-column
        prop="certificateName"
        header-align="center"
        align="center"
        :label="$t('certificateinfo.certificateinfo_name')">
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
        prop="percent"
        header-align="center"
        align="center"
        :label="$t('course.course_upload_process')">
        <template slot-scope="scope">
          <el-progress :percentage="scope.row.percent" :color="percentColor"></el-progress>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="180"
        :label="$t('common.oper')">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="$t('button.edit')" placement="top">
            <svg class="icon" aria-hidden="true" @click="addOrUpdateHandle(scope.row.uuid)">
              <use xlink:href="#icon-bianzu9"></use>
            </svg>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="$t('button.delete')" placement="top">
            <svg class="icon" aria-hidden="true" @click="deleteHandle(scope.row.uuid,scope.row.courseName)">
              <use xlink:href="#icon-shanchu"></use>
            </svg>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="$t('button.upload')" placement="top">
            <svg class="icon" aria-hidden="true" @click="addCourse(scope.row.uuid,scope.row.fileType)">
              <use xlink:href="#icon-shangchuan"></use>
            </svg>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="$t('button.study')" placement="top">
            <svg class="icon" aria-hidden="true" @click="play(scope.row,scope.row.fileType)">
              <use xlink:href="#icon-preview"></use>
            </svg>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="$t('button.release')" placement="top">
            <svg class="icon" aria-hidden="true" @click="release(scope.row)">
              <use xlink:href="#icon-fabu"></use>
            </svg>
          </el-tooltip>
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
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <player v-if="showPlay" ref="play" @refreshDataList="getDataList"></player>
    <upload v-if="uploadVisible" ref="upload" @refreshDataList="getDataList"></upload>
    <translate v-if="translateVisible" ref="translate" @refreshDataList="getDataList"></translate>
  </div>
</template>

<script>
  import AddOrUpdate from './course-add-or-update'
  import player from './play'
  import upload from '@/components/upload'
  import translate from '@/components/translate'
  let Base64 = require('js-base64').Base64
  export default {
    data () {
      return {
        translateVisible: false,
        percentColor: '#909399+/',
        uploadVisible: false,
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
        showPlay: false,
        relatedCourseTypeId: '',
        relatedCourseTypeName: '',
        fromPage: '',
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
      player,
      upload,
      translate
    },
    activated () {
      this.getDataList()
    },
    created () {
      this.relatedCourseTypeId = this.$route.query.relatedCourseTypeId
      this.relatedCourseTypeName = this.$route.query.relatedCourseTypeName
      this.fromPage = this.$route.query.fromPage
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/generator/course/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'courseName': this.dataForm.key,
            'creater': this.$store.state.user.name,
            'relatedCourseTypeId': this.relatedCourseTypeId
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
      play (value, type) {
        if (type == 'translate') {
          this.translateVisible = true
          this.$nextTick(() => {
            this.$refs.translate.init(value.uuid, type, '中日翻译', false)
          })
        } else {
          if ('' == value.fileUrl) {
            this.$message.error(this.$t('course.not_upload_course'))
            return
          }
          this.showPlay = true;
          this.$nextTick(() => {
            this.$refs.play.init(value.uuid)
          })
        }
        // if(type == 'video'){
        //   this.showPlay = true;
        //   this.$nextTick(() => {
        //     this.$refs.play.init(value.uuid)
        //   })
        // }else{
        //   window.open('http://39.106.17.85:8012/onlinePreview?url='+encodeURIComponent(Base64.encode(value.fileUrl)));
        // }
      },
      release (value) {
        this.$http({
          url: this.$http.adornUrl(`/generator/course/release/${value.uuid}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: this.$t('message.success'),
              type: 'success',
              duration: 1500
            })
            this.getDataList()
          } else {
            this.$message.error(data.msg)
          }
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
      // 上传
      addCourse (id, type) {
        if (type == 'translate') {
          this.translateVisible = true
          this.$refs.translate.init(id, type, '中日翻译', true)
        } else {
          this.uploadVisible = true
          this.$nextTick(() => {
            let title = ''
            if (type == 'video') {
              title = '视频'
            } else {
              title = type
            }
            this.$refs.upload.init(id, type, title, '课程上传')
          })
        }
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id,this.relatedCourseTypeId, this.relatedCourseTypeName)
        })
      },
      // 删除
      deleteHandle (id, courseName) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.uuid
        })
        var courseNames = courseName ? [courseName] : this.dataListSelections.map(item => {
          return item.courseName
        })
        this.$confirm(this.message.confirm_to + `[${courseNames.join(',')}]` + this.message.conduct +`[${courseName ? this.message.delete : this.message.batch_delete}]`+ this.message.oper +`?`, this.message.tip, {
          confirmButtonText: this.$t('message.confirm'),
          cancelButtonText: this.$t('message.cancle'),
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/generator/course/delete'),
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
      fileTypeFormatter (row) {
        if (row.fileType == 'translate') {
          return this.$t('course.course_translate')
        } else if (row.fileType == 'video') {
          return this.$t('course.course_video')
        } else {
          return row.fileType
        }
      },
      statusFormatter (row) {
        if (row.status == "49f2cf60922d4c2b9215b9bc69e642ef") {
          return this.$t('course.course_unrelease_status')
        } else if (row.status == '876ff807b5c84374b101be71ba7efd3f') {
          return this.$t('course.course_release_status')
        } else {
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
