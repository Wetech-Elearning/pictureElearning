<template>
  <!--封装上传组件
    tips(提示信息 默认 只能上传jpg/png文件，且不超过1024kb)
    action(上传地址 默认为 '/sys/fdfs/upload')
		imgUrl(图片地址) 必传
		imgId(图片Id)
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
      class="upload-card"
      :action="getAction()"
      :listType="'picture-card'"
      :show-file-list="false"
      :file-list="fileList_"
      :before-remove="beforeRemoveFun"
      :before-upload="beforeUploadFun"
      :on-preview="onPreviewFun"
      :on-remove="onRemoveFun"
      :on-change="onChangeFun"
      :on-exceed="onExceedFun"
      :on-success="onSuccessFun"
    >
      <!--上传单张图片 或者展示方式为照片墙-->
      <div v-if="imgUrl_" class="img_con">
        <img class="avatar" :src="vidoeimgUrl_" />
        <i
          class="el-icon-delete avatar-el-icon-delete"
          style="color: #ffffff;font-size: 20px;"
          @click.stop.prevent="deleteOnlyOnePic()"
        ></i>
      </div>
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>

      <div slot="tip" class="el-upload__tip">{{tips}}</div>
    </el-upload>
  </div>
</template>

<script>
export default {
  name: "UploadCardImg",
  props: {
    action: {
      type: String,
      default: "/sys/oss/upload/video"
    },
    deleteUrl: {
      type: String,
      default: "/sys/oss/delete"
    },
    imgId: {
      type: String,
      default: ""
    },
    imgUrl: {
      type: String,
      default: ""
    },
    tips: {
      type: String,
      default: "只能上传視頻文件，且不超过500M"
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

      imgId_: this.imgId,
      imgUrl_: this.imgUrl,
      vidoeimgUrl_: this.vidoeimgUrl_,
      fileList_: []
    };
  },
  created() {},
  computed: {},
  watch: {
    imgId(val) {
      this.imgId_ = val;
    },
    imgUrl(val) {
      this.imgUrl_ = this.$methods.getImgPath(val);
    },
    imgId_(val) {
      this.$emit("update:imgId", val);
    },
    imgUrl_(val) {
      var v = val.replace(`${window.SITE_CONFIG.imgDomain}`, '');
      if (v.indexOf('http') < 0) {
        v = v.replace("//", '/');
      }
      this.vidoeimgUrl_ = val.replace('.mp4','.jpg')
      console.log("imgUrl::" + v)
      this.$emit("update:imgUrl", v);
    }
  },
  methods: {
    // 获取单张图片地址
    getImgSrc() {
      return this.fileList && this.fileList.length > 0
        ? this.fileList[this.fileList.length - 1].url
        : "";
    },
    getAction() {
      return this.$http.adornUrl(
        `${this.action}?token=${this.$cookie.get("token")}`
      );
    },
    // 删除仅单张上传图片
    deleteOnlyOnePic() {
      // 直接设置imgUrl为空，不实际删除图片
      if (this.imgId_ == "") {
          this.fileList_ = [];
          this.imgId_ = "";
          this.imgUrl_ = "";
      } else {
        //  调用服务删除图片
        this.$http({
          url: this.$http.adornUrl(`${this.deleteUrl}`),
          method: "post",
          params: this.$http.adornParams({
            id: this.imgId_
          })
        }).then(({ data }) => {
          if (data.code === 0) {
            this.fileList_ = [];
            this.imgId_ = "";
            this.imgUrl_ = "";
          } else {
            this.$message.error(data.msg);
          }
        });
      }
    },
    beforeRemoveFun_(file, fileList) {},
    beforeUploadFun_(file) {
      // console.log(file.type);
      // const isJPG = file.type === "image/jpeg";
      // const isGIF = file.type === "image/gif";
      // const isPNG = file.type === "image/png";
      // const isBMP = file.type === "image/bmp";
      const isLt2M = file.size / 1024 / 1024 / 500 <= 1;
      // if (!isJPG && !isGIF && !isPNG && !isBMP) {
      //   this.$message.error("上传图片必须是JPG/GIF/PNG/BMP 格式!");
      //   return false;
      // }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 5MB!");
        return false;
      }
      return /*(isJPG || isBMP || isGIF || isPNG) &&*/ isLt2M;
    },
    onRemoveFun_(file, fileList) {
      // todo 暂时不需要
    },
    onPreviewFun_(file) {
      // todo  暂时不需要
    },
    onChangeFun_(file, fileList) {
      // todo   展示不需要
    },
    onExceedFun_(files, fileList) {
      this.$message.warning(
        `当前限制选择 ${this.limit} 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    onSuccessFun_(response, file, fileList) {
      if (response && response.code === 0) {
        let { name, title, id, url } = response.data;
        // url = this.$methods.getImgPath(url);
        console.log("id::" + id);
        console.log("url::" + url);
        let c_file = { name, title, id, url };
        this.fileList_ = [c_file];
        this.imgId_ = `${id}`;
        url = url.replaceAll("\\",'/')
        console.log(url)
        this.imgUrl_ = url
        this.vidoeimgUrl_ = url.replace('.mp4','.jpg');
      } else {
        this.$message.error("上传失败！请重新上传");
      }
    }
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
.upload-card {
  .img_con {
    height: inherit;
    position: relative;
  }
  .avatar {
    width: 100%;
    height: 100%;
  }
  .avatar-el-icon-delete {
    position: absolute;
    top: 5px;
    right: 5px;
  }
  .el-upload__tip {
    margin-top: 0px;
  }
}
</style>

