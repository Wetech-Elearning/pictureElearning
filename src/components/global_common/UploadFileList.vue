<template>
	<!--封装上传组件
    imgIds( 如imgIds ) 上传保存在父级组件的哪个字段里面 父组件使用.async保存数据双向绑定
    多张图片(limit  限制图片数量 默认不限制)
    fileList(上传组件展示图片列表 图片 文件列表 格式为 [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]) 默认[
    tips(提示信息 默认 只能上传jpg/png文件，且不超过1024kb)
    action(上传地址 默认为 '/sys/fdfs/upload')
		fileType: [".zip"] 数组  默认不限制
		fileSize:1024*1024*10  Number  默认10M   传递过来的单位为B

    ---------------------------------------------

    以下方法不传会执行默认
    beforeUpload: Function,  不传会执行默认
    beforeRemove: Function,
    onExceed: Function,
    onPreview: Function,
    onChange: Function,
    onRemove: Function,
    onSuccess: Function
	-->
	<div class="upload-item">
		<el-upload
			class="upload-file-list"
			:action="getAction()"
			multiple
			:imgIds="imgIds_"
			:limit="limit"
			list-type="text"
			:file-list="fileList_"
			:before-remove="beforeRemoveFun"
			:before-upload="beforeUploadFun"
			:on-preview="onPreviewFun"
			:on-remove="onRemoveFun"
			:on-change="onChangeFun"
			:on-exceed="onExceedFun"
			:on-success="onSuccessFun"
		>
			<el-button size="small" type="primary">点击上传</el-button>
			<div slot="tip" class="el-upload__tip">{{tips}}</div>
		</el-upload>
	</div>
</template>

<script>
export default {
	name: 'UploadFileList',
	props: {
		action: {
			type: String,
			default: '/sys/oss/upload/file'
		},
		deleteUrl: {
			type: String,
			default: '/sys/oss/delete'
		},
		imgIds: {
			type: String,
			default: ''
		},
		limit: {
			type: Number,
			default: 100000
		},

		fileList: {
			type: Array,
			default: () => []
		},
		fileType:{
			type:Array,
			default:() => []
		},
		fileSize:{
			type:Number,
			default:1024*1024*10
		},
		tips: {
			type: String,
			default: '文件大小不超过10M'
		},
		beforeUpload: {
			type: Function
		},
		beforeRemove: {
			type: Function
		},
		onPreview: {
			type: Function
		},
		onExceed: {
			type: Function
		},
		onChange: {
			type: Function
		},
		onRemove: {
			type: Function
		},
		onSuccess: {
			type: Function
		}
	},
	data() {
		return {
			onChangeFun: this.onChange ? this.onChange : this.onChangeFun_,
			beforeUploadFun: this.beforeUpload
				? this.beforeUpload
				: this.beforeUploadFun_,
			beforeRemoveFun: this.beforeRemove
				? this.beforeRemove
				: this.beforeRemoveFun_,
			onPreviewFun: this.onPreview ? this.onPreview : this.onPreviewFun_,
			onExceedFun: this.onExceed ? this.onExceed : this.onExceedFun_,
			onRemoveFun: this.onRemove ? this.onRemove : this.onRemoveFun_,
			onSuccessFun: this.onSuccess ? this.onSuccess : this.onSuccessFun_,

			imgIds_: this.imgIds,
			fileList_: this.fileList
		}
	},
	created() {},
	computed: {
		fileList_c(){
			return this.fileList
		},
		imgIds_c(){
			return this.imgIds
		}
	},
	watch: {
		fileList_c(){
			this.fileList_c.forEach((v)=>{
				v.url = this.$methods.getImgPath(v.url)
			})
			this.fileList_ = this.fileList_c
		},
		imgIds_c(){
			this.imgIds_ = this.imgIds_c
		},
		imgIds_(val) {
			this.$emit('update:imgIds', val)
		},
		fileList_(val) {
			this.$emit('update:fileList', val)
		}
	},
	methods: {
		// 获取单张图片地址
		getImgSrc() {
			return this.fileList && this.fileList.length > 0
				? this.fileList[this.fileList.length - 1].url
				: ''
		},
		getAction() {
			return this.$http.adornUrl(
				`${this.action}?token=${this.$cookie.get('token')}`
			)
		},
		beforeRemoveFun_(file, fileList) {
			// 此处解决上传不成功的文件删除信息
			if(!file.id) {
				return;
			}
			return new Promise((resolve, reject) => {
				this.$http({
					url: this.$http.adornUrl(`${this.deleteUrl}`),
					method: 'post',
					params: this.$http.adornParams({
						id: file.id
					})
				}).then(({ data }) => {
					if (data.code === 0) {
						resolve('')
					} else {
						this.$message.error(data.msg)
						reject('')
					}
				})
			})
		},
		beforeUploadFun_(file) {
			const isSize = file.size <= this.fileSize
			let  errMsg = ""
			let fType = file.name.substr(file.name.lastIndexOf("."))
			const isType = this.fileType.includes(fType)
			if (!isSize) {
				if(this.fileSize<=1024*1024){
					errMsg = `${this.fileSize/1024}KB`
				}else{
					errMsg = `${(this.fileSize/1024/1024).toFixed(2)}M`;
				}
				this.$message.error(`上传文件大小不能超过 ${errMsg}!`)
				return false
			}

			if(!isType && (this.fileType.length>0)){
				errMsg = this.fileType.join(',')
				this.$message.error(`请上传文件类型为 ${errMsg}结尾的文件`)
				return false
			}
			return true
		},
		onRemoveFun_(file, fileList) {
			fileList.forEach((element, i) => {
				if (element.id === file.id) {
					fileList.splice(i, 1)
					return
				}
			})

			this.fileList_ = fileList
			let tempIds = ''
			this.fileList_.forEach(element => {
				tempIds = `${tempIds},${element.id}`
			})
			this.imgIds_ = tempIds
		},
		onPreviewFun_(file) {
			// 预览文件
			window.open(this.$methods.getImgPath(file.url), '_blank');
		},
		onChangeFun_(file, fileList) {
			// todo   展示不需要
		},
		onExceedFun_(files, fileList) {
			this.$message.warning(
				`当前限制选择 ${this.limit} 个文件，本次选择了 ${
					files.length
				} 个文件，共选择了 ${files.length + fileList.length} 个文件`
			)
		},
		onSuccessFun_(response, file, fileList) {
			if (response && response.code === 0) {
				let { name, title, id, url } = response.data
				url = this.$methods.getImgPath(url)
				let c_file = { name, title, id, url }
				this.fileList_.push(c_file)
				let split = ''
				if (this.imgIds_) {
					split = ','
				}
				this.imgIds_ = `${this.imgIds_}${split}${id}`
			} else {
				console.log(JSON.stringify(fileList))
				fileList.pop()
				this.$message.error('上传失败！请重新上传')
			}
		}
	},
	mounted() {}
}
</script>
<style lang="scss" scoped>
.el-upload__tip {
	margin-top: 0px;
}
</style>

