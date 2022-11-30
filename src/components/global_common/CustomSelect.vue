<template>
  <!--
    封装下拉框组件
    action:required 获取数据地址
    value:required 为绑定的数据值
   -->

  <el-select v-model="value_" filterable clearable  :placeholder="placeHolder" :disabled="disabled" @change="customSelectChange">
    <!-- 注意：这里的监听事件不要加到option上面，我在项目过程中经历过，是获取不到数据的  -->
    <el-option
      v-for="item in dataList"
      :key="item[props.value]"
      :label="item[props.label]"
      :value="item[props.value]">
    </el-option>
  </el-select>
</template>
<script>
export default {
  name:'CustomSelect',
  props:{
    action: {
      type: String,
      required: true,
      default:"",
    },
    disabled:{
      type: Boolean,
      default: false,
    },
    value:{
      type: String,
      required: true,
      default:"",
    },
    label:{
      type: String,
      required: true,
      default:"",
    },
    props:{
      type: Object,
      required: true,
      default:{
        value:"id",
        label:"name"
      }
    },
    placeHolder:{
      type: String,
      default: '请点击选择'
    }
  },
  data(){
    return {
      dataList:[],
      value_:this.value
    }
  },
  watch: {
    label(val){
      this.label_ = val
    },
    label_(val){
      this.$emit('update:label', val)
    },
    value(val){
      this.value_ = val
    },
    value_(val){
      // value_改变的时候 改变label_的值
      if(this.dataList&&this.dataList.length>0){
        for(let item of this.dataList){
          if(item[this.props.value]===this.value_){
            this.$emit('update:label', item[this.props.label])
            break
          }
        }
      }
      this.$emit('update:value', val)
    }
  },
  created() {
    this.$http({
      url: this.$http.adornUrl(`${this.action}`),
      method: "get",
      params: this.$http.adornParams()
    }).then(({ data }) => {
      let {code,data:datas} = data
      if(data.code===0){
        this.dataList = datas
      }
    })
  },
  methods: {
    customSelectChange(val){
      this.$emit('update:value', val);
      this.$emit('change', val);
    }
  }

}
</script>
<style lang="scss"  >


</style>
