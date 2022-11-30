<template>
	<!-- 
  封装下拉框组件
  action:required 获取数据地址
  value:required 为绑定的数据值
  label:required 为绑定的数据label
  props:required 为取值的字段名 如{ value:"valueProps", label:"nameProps"}
	requestParams:为传入的参数如limit
	searchKey 为搜索字段名称
	-->
	<el-select
		v-model="value_"
		filterable
		clearable
		:placeholder="placeholder"
		:filter-method="filterMethod"
	  	:popper-class = "popperClass"
		v-loadmore="loadMore"
		@clear="clear"
		@change="customSelectChange"
	>
		<!-- 注意：这里的监听事件不要加到option上面，我在项目过程中经历过，是获取不到数据的  -->
		<el-option
			v-for="item in dataList"
			:key="item[props.value]"
			:label="item[props.label]"
			:value="item[props.value]"
		></el-option>
	</el-select>
</template>
<script>
export default {
	name: 'CustomSelectMore',
	props: {
		action: {
			type: String,
			required: true,
			default: ''
		},
		popperClass:{
			type: String,
			required: true,
			default: ''
		},
		value: {
			type: String,
			required: true,
			default: ''
		},
		label: {
			type: String,
			required: true,
			default: ''
		},
		searchKey: {
			type: String,
			required: false,
			default: ''
		},
		props: {
			type: Object,
			required: false,
			default: () => ({
				value: 'id',
				label: 'name'
			})
		},
		requestParams: {
			type: Object,
			required: false,
			default: () => ({})
		},
		placeholder: {
			type: String,
			default: '请点击选择'
		}
	},

	data() {
		return {
			dataList: [],
			value_: this.value,
			page: 1,
			totalPage: 1,
			searchContent: '',
			busy: false,
			preTime: 0,
			curTime: 0,
			preScrollTop: 0,
			SELECTWRAP_DOM: '',
			filterMethod: function(key) {
				this.filterMethodFunc(key)
			}
		}
	},
	watch: {
		label(val) {
			this.label_ = val
		},
		label_(val) {
			this.$emit('update:label', val)
		},
		value(val) {
			this.value_ = val
		},
		value_(val) {
			// value_改变的时候 改变label_的值
			if (this.dataList && this.dataList.length > 0) {
				for (let item of this.dataList) {
					if (item[this.props.value] === this.value_) {
						this.$emit('update:label', item[this.props.label])
						break
					}
				}
			}
			this.$emit('update:value', val)
		}
	},
	created() {
		this.filterMethod = this.filterMethodFunc
		this.getDataList()
	},

	methods: {
		filterMethodFunc(key) {
			//
			this.page = 1
			this.searchContent = key
			this.preTime = 0
			this.preScrollTop = 0
			this.curTime = 0
			this.getDataList('first')
		},
		getDataList(isFirst) {
			this.requestParams.page = this.page
			if (this.searchKey) {
				this.requestParams[this.searchKey] = this.searchContent
			}
			this.$http({
				url: this.$http.adornUrl(`${this.action}`),
				method: 'get',
				params: this.$http.adornParams(this.requestParams)
			}).then(({ data }) => {
				this.busy = false
				let { code, data: datas } = data
				if (data.code === 0) {
					let dataList = Array.isArray(datas) ? datas : datas.list
					this.totalPage = datas ? (datas.totalPage ? datas.totalPage : 1) : 1
					if (isFirst) {
						this.dataList = [...dataList]
					} else {
						this.dataList = [...this.dataList, ...dataList]
					}
				}
			})
		},
		loadMore() {
			if (!this.SELECTWRAP_DOM) {
				this.SELECTWRAP_DOM = document.querySelector(
					`.${this.popperClass}   .el-select-dropdown__wrap`
				)
			}
			this.preTime = this.curTime
			this.curTime = new Date().getTime()

			// 做时间对比
			if (this.curTime - this.preTime > 50) {
				return
			}
			if (this.preScrollTop >= this.SELECTWRAP_DOM.scrollTop) {
				this.preScrollTop = this.SELECTWRAP_DOM.scrollTop
				return
			}
			this.preScrollTop = this.SELECTWRAP_DOM.scrollTop
			if (this.totalPage === this.page) {
				return
			}
			if (!this.busy) {
				this.busy = true
				this.page = this.page + 1
				this.getDataList()
			}
		},
		clear() {
			this.page = 1
			this.searchContent = ''
			this.preTime = 0
			this.preScrollTop = 0
			this.curTime = 0
			this.getDataList('first')
		},
		customSelectChange(val){
      		this.$emit('update:value', val);
      		this.$emit('change', val);
    	}
	}
}
</script>
<style lang="scss" scoped>
</style>