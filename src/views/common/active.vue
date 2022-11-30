<template>
  <div class="mod-active">
    <section class="HolyGrail">
      <div class="HolyGrail-body">
        <div v-if="show == false" style="font-size: 20px;">
          <i class="el-icon-error" style="color: red;font-size: 20px"></i>
          {{$t('message.active')}}
        </div>
        <div v-if="show == true" style="font-size: 20px;">
          <i v-if="show" class="el-icon-success" style="color: green;font-size: 20px"></i>
          {{$t('message.actived')}} {{count}}
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        show: false,
        code: '',
        timer: '',
        count: 5
      };
    },
    created() {
      this.code = this.$route.params.code
      this.active()
    },
    methods: {
      startCount () {
        this.count --
      },
      active (){
        this.$http({
          url: this.$http.adornUrl(`/sys/active`),
          method: 'get',
          params: this.$http.adornParams({
            'code':this.code
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.show = true
            this.timer = setInterval(this.startCount, 1000)
          }
        })
      }
    },
    watch:{
      'count':function(newVal,oldVal){
        if(newVal == 0){
          this.$router.replace('/login');
        }
      }
    },
    beforeDestroy() {
      clearInterval(this.timer);
    }
  }
</script>
<style>
  *{margin:0;padding:0}
  .HolyGrail {
     display: flex;
     min-height: 100vh;
     flex-direction: column;
   }
  .HolyGrail-body {
    display: flex;
    flex: 1;
    align-items: center;
  }
  .HolyGrail-body div{
    padding:50px 260px;
    margin:auto;
    border-radius:6px;
    background-color:#CCFFCC;
  }
</style>

