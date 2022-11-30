<template>
  <div style="width: 1000px;height: 100%">
    <el-dialog
      :fullscreen="fullscreen"
      :title="title"
      :close-on-click-modal="false"
      @close='closeDialog'
      width="70%"
      v-if="visible"
      :visible.sync="visible">
      <play ref="play" @bigpannel="bigpannel" @smallpannel="smallpannel" />
    </el-dialog>
  </div>
</template>

<script>
import play from './play'
export default {
  name: 'alertCompents',
  components:{
    play
  },
  data(){
    return {
      uuid:'',
      fullscreen:false,
      visible:false,
      title:"播放",
      courseType: {},
    }
  },
  methods:{
    bigpannel(){
      this.fullscreen = true
    },
    smallpannel(){
      this.fullscreen = false
    },
    init(data,title,courseType){
      this.visible = true
      this.$nextTick(() => {
        this.title = title
        this.courseType = courseType
        this.$refs.play.init(data,courseType);
      })
    },
    closeDialog(){
      this.$refs.play.$destroy();
      Object.assign(this.$data, this.$options.data.call(this));
      this.$emit("refreshPage")
    }
  }
}
</script>

<style scoped>

</style>
