<template>
<!-- 
  封装树形组件
  action:required 获取数据地址
  props:required 对应tree的props 如{name:"nameProperty",children:"childrenProperty"}
  nodeKey:required 树中节点的唯一id
  placeHolder：可选 提示文本
  value:required 为绑定的数据值
  label:required 为绑定的数据label值
  height：可选 popover组件高度 不传默认
  width:可选 popover组件宽度  不传默认
  defaultExpandAll:可选 树组件节点是否展开
 -->
 
  <div class="tree-custom" >
    <el-popover ref = "custom_popver" placement="bottom-start" trigger="click">
      <el-tree
        :data="dataList"
        :props="props"
        :node-key="nodeKey"
        ref="custom_tree"
        @current-change = "currentChangeHandle"
        :default-expand-all="defaultExpandAll"
        :highlight-current="true"
      >
      </el-tree>
    </el-popover>
    <el-input
      v-model="label_"
      v-popover:custom_popver
      :placeholder="placeHolder"
      :readonly="true"
    >
    </el-input>
  </div>
</template>
<script>
import { treeDataTranslate } from "@/utils";
export default {
  name:'CustomTree',
  props:{
    props:{
      type:Object,
      default:{
        name:"name",
        children:"children"
      },
      required: true
    },
    action: {
			type: String,
      required: true,
      default:"",
    },
    nodeKey:{
	    type: String,
      required: true,
      default:"",
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
    placeHolder:{
      type: String,
			default: '请点击选择'
    },
    height:{
      type:String,
      default:""
    },
    width:{
      type:String,
      default:""
    },
    defaultExpandAll:{
      type:Boolean,
      default:false
    }
  },
  data(){
    return {
      dataList:[],
      value_:this.value,
			label_:this.label
    }
  },
  watch: {
		value(val){
			this.value_ = val
		},
		label(val){
			this.label_ = val
		},
    value_(val){
      this.$emit('update:value', val)
    },
		label_(val){
			this.$emit('update:label', val)
		}
  },
  methods: {
    currentChangeHandle(data,node){
      this.value_ = data[this.nodeKey]
      this.label_ = data[this.props["label"]]
    },
    // 菜单树设置当前选中节点
   setCurrentNode() {
      this.$refs.custom_tree.setCurrentKey(this.value_);
      this.label_ = (this.$refs.custom_tree.getCurrentNode() || {})[
        this.props["label"]
      ];
    }
  },
  created() {
    console.log("created");
    this.$http({
        url: this.$http.adornUrl(`${this.action}`),
        method: "get",
        params: this.$http.adornParams()
    }).then(({ data }) => {
      let {code,data:datas} = data
      if(data.code === 0){
        this.dataList = treeDataTranslate(datas, "id","parentId");
      }      
    }).then(()=>{
        this.setCurrentNode()
    });    
  },
  mounted(){
   console.log("mounte");
  }
}
</script>
