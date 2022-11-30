<template>
  <el-dialog
    :close-on-click-modal="false"
    :modal-append-to-body="true"
    append-to-body
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px">
      <el-form-item :label="$t('certificateinfo.certificateinfo_name')" prop="channelName">
        <custom-select
          style="width:100%;"
          :action="'/generator/certificateinfo/listall'"
          :props="{label: 'certificateName', value: 'uuid'}"
          :placeHolder="'证书'"
          :value.sync="dataForm.certificateUuid"
          :label.sync="dataForm.certificateUuidLabel"
        ></custom-select>
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
        uuid:'',
        certificateUuid: '',
        certificateUuidLabel:'',
        userId: '',
        creater:'',
        createDate:'',
        deleteFlag:0
      },
      dataRule: {
        certificateUuidLabel: [
          { required: true, message: this.$t('certificateinfo.not_null_certificateinfo_name'), trigger: 'blur' }
        ],
        certificateUuid: [
          { required: true, message: this.$t('certificateinfo.not_null_certificateinfo_name'), trigger: 'blur' }
        ],
        userId: [
          { required: true, message: this.$t('certificateinfo.not_null_name'), trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
  },
  methods: {
    init (id) {
      this.dataForm.userId = id || 0
      this.visible = true
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(`/generator/certificateuserinfo/save`),
            method: 'post',
            data: this.$http.adornData({
              'uuid': '',
              'certificateUuid': this.dataForm.certificateUuid,
              'certUuidLabel': this.dataForm.certificateUuidLabel,
              'userId': this.dataForm.userId,
              'creater': this.dataForm.creater,
              'createDate': this.dataForm.createDate,
              'deleteFlag': this.dataForm.deleteFlag
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

<style scoped>

</style>
