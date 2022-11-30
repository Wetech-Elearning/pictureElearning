<template>
  <el-dialog
    :title="!dataForm.uuid ? '新增' : '修改'"
    :close-on-click-modal="false"
    v-if="visible"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="试卷名称" prop="examPaperName">
      <el-input v-model="dataForm.examPaperName" placeholder="试卷名称"></el-input>
    </el-form-item>
    <el-form-item label="试卷描述" prop="description">
      <el-input v-model="dataForm.description" placeholder="试卷描述"></el-input>
    </el-form-item>
    <el-form-item label="试卷总分" prop="totalScore">
      <el-input v-model="dataForm.totalScore" placeholder="试卷及格分"></el-input>
    </el-form-item>
    <el-form-item label="试卷及格分" prop="passScore">
      <el-input v-model="dataForm.passScore" placeholder="试卷及格分"></el-input>
    </el-form-item>
    <el-form-item label="考试时长阈值" prop="exmaTimeLimit">
      <el-input v-model="dataForm.exmaTimeLimit" placeholder="考试时长阈值"></el-input>
    </el-form-item>
    <el-form-item label="试卷考试最大次数" prop="examMaxNum">
      <el-input v-model="dataForm.examMaxNum" placeholder="试卷考试最大次数"></el-input>
    </el-form-item>
    <el-form-item :label="$t('common.creater')" prop="creater">
      <el-input v-model="dataForm.creater" :placeholder="$t('common.creater')"></el-input>
    </el-form-item>
    <el-form-item :label="$t('common.create_date')" prop="createDate">
      <el-date-picker
        style="width:100%;"
        v-model="dataForm.createDate"
        type="datetime"
        :placeholder="$t('common.create_date')"
        value-format="yyyy-MM-dd HH:mm:ss"
        format="yyyy-MM-dd HH:mm:ss"
        default-time="12:00:00">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="修改时间" prop="updateDate">
      <el-date-picker
        style="width:100%;"
        v-model="dataForm.updateDate"
        type="datetime"
        placeholder="修改时间"
        value-format="yyyy-MM-dd HH:mm:ss"
        format="yyyy-MM-dd HH:mm:ss"
        default-time="12:00:00">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="修改人" prop="updater">
      <el-input v-model="dataForm.updater" placeholder="修改人"></el-input>
    </el-form-item>
    <el-form-item :label="$t('common.remark')" prop="remark">
      <el-input v-model="dataForm.remark" :placeholder="$t('common.remark')"></el-input>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{$t('button.cancle')}}</el-button>
      <el-button type="primary" @click="dataFormSubmit()">{{$t('button.confirm')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { getNowTime } from '@/utils'
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          uuid: 0,
          examPaperName: '',
          description: '',
          totalScore: '',
          passScore: '',
          exmaTimeLimit: '',
          examMaxNum: '',
          creater: '',
          createDate: '',
          updater: '',
          updateDate: '',
          remark: ''
        },
        dataRule: {
          examPaperName: [
            { required: true, message: '试卷名称不能为空', trigger: 'blur' }
          ],
          description: [
            { required: true, message: '试卷描述不能为空', trigger: 'blur' }
          ],
          totalScore: [
            { required: true, message: '试卷总分不能为空', trigger: 'blur' }
          ],
          passScore: [
            { required: true, message: '试卷及格分不能为空', trigger: 'blur' }
          ],
          exmaTimeLimit: [
            { required: true, message: '考试时长阈值不能为空', trigger: 'blur' }
          ],
          examMaxNum: [
            { required: true, message: '试卷考试最大次数不能为空', trigger: 'blur' }
          ],
          creater: [
            { required: true, message: '创建人不能为空', trigger: 'blur' }
          ],
          createDate: [
            { required: true, message: '创建时间不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
      userName: {
        get () { return this.$store.state.user.name }
      },
      userId: {
        get () { return this.$store.state.user.id }
      }
    },
    methods: {
      init (id) {
        this.dataForm.uuid = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.uuid) {
            this.$http({
              url: this.$http.adornUrl(`/generator/exampaperinfos/info/${this.dataForm.uuid}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.examPaperName = data.examPaperInfos.examPaperName
                this.dataForm.description = data.examPaperInfos.description
                this.dataForm.totalScore = data.examPaperInfos.totalScore
                this.dataForm.passScore = data.examPaperInfos.passScore
                this.dataForm.exmaTimeLimit = data.examPaperInfos.exmaTimeLimit
                this.dataForm.examMaxNum = data.examPaperInfos.examMaxNum
                this.dataForm.creater = data.examPaperInfos.creater
                this.dataForm.createDate = data.examPaperInfos.createDate
                this.dataForm.updater = data.examPaperInfos.updater
                this.dataForm.updateDate = data.examPaperInfos.updateDate
                this.dataForm.remark = data.examPaperInfos.remark
              }
            })
          }else{
            this.dataForm.creater = this.userName
            this.dataForm.createDate = getNowTime()
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/generator/exampaperinfos/${!this.dataForm.uuid ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'uuid': this.dataForm.uuid || undefined,
                'examPaperName': this.dataForm.examPaperName,
                'totalScore': this.dataForm.totalScore,
                'passScore': this.dataForm.passScore,
                'exmaTimeLimit': this.dataForm.exmaTimeLimit,
                'examMaxNum': this.dataForm.examMaxNum,
                'creater': this.dataForm.creater,
                'createDate': this.dataForm.createDate,
                'updater': this.dataForm.updater,
                'updateDate': this.dataForm.updateDate,
                'remark': this.dataForm.remark
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
          }
        })
      }
    }
  }
</script>
