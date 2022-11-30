<template>
  <div>
    <ul class="ul-class">
      <li>
        <label>{{$t('classes.classes_name')}}:</label>
        <div>{{dataForm.className}}</div>
      </li>
      <li>
        <label>{{$t('classes.classes_start_time')}}:</label>
        <div>{{dataForm.startDate}}</div>
      </li>
      <li>
        <label>{{$t('classes.classes_end_time')}}:</label>
        <div>{{dataForm.endDate}}</div>
      </li>
      <li>
        <label>{{$t('classes.classes_status')}}:</label>
        <div>{{dataForm.status==0?$t('common.normal'):$t('common.disable')}}</div>
      </li>
      <li>
        <label>{{$t('common.dec')}}:</label>
        <div>{{dataForm.remark}}</div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "baseinfo",
  data(){
    return {
      dataForm: {
        uuid: 0,
        className: '',
        startDate: '',
        endDate: '',
        status: '0',
        creater: '',
        createDate: '',
        updater: '',
        updateDate: '',
        remark: '',
        deleteFlag: '0'
      }
    }
  },
  methods:{
    init (id) {
      this.dataForm.uuid = id || 0
      this.visible = true
      this.$nextTick(() => {
        if (this.dataForm.uuid) {
          this.$http({
            url: this.$http.adornUrl(`/generator/classes/info/${this.dataForm.uuid}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.dataForm.className = data.classes.className
              this.dataForm.startDate = data.classes.startDate
              this.dataForm.endDate = data.classes.endDate
              this.dataForm.status = data.classes.status
              this.dataForm.creater = data.classes.creater
              this.dataForm.createDate = data.classes.createDate
              this.dataForm.updater = data.classes.updater
              this.dataForm.updateDate = data.classes.updateDate
              this.dataForm.remark = data.classes.remark
              this.dataForm.deleteFlag = data.classes.deleteFlag
            }
          })
        }
      })
    }
  },
  mounted() {
    let uuid = this.$route.query.uuid
    this.init(uuid);
  }
}
</script>

<style scoped>
.ul-class{
  list-style: none
}
.ul-class li{
  margin: 15px;
  height: 20px;
  line-height: 20px;
}
.ul-class li label{
  float: left;
  font-size: 14px;
  width: 20%;
  text-align: right;
  color: #6c757d;
}
.ul-class li div{
  float: left;
  width: 80%;
  padding-left: 10px;
  font-size: 18px;
  font: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "\5FAE\8F6F\96C5\9ED1", Arial, sans-serif;
}
</style>
