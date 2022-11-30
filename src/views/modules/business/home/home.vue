<template>
  <div>
    <!-- banner -->
    <div class="banner-contain hgt_367">
       <el-row v-if="isAuth('business:companyadmin:edit')">
        <el-col :span="24" style="text-align:right;margin: 10px">
          <el-button size="mini" @click="edit()">{{$t('button.banner_release')}}</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="swiper-container banner">
            <div class="swiper-wrapper">
              <div class="swiper-slide" v-for="(item, index) in bannerList" :key="index">
                <img :src="item.url" alt class="wid_100 hgt_367" />
              </div>
            </div>
            <div class="swiper-pagination"></div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="course-container">
      <div class="public">
        <el-row v-if="isAuth('business:companyadmin:edit')">
          <el-col :span="24" style="text-align:right;margin: 10px">
            <el-button size="mini" @click="editpub()">{{$t('button.course_release')}}</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <h1 class="font-color" @click="toCourse('public')">
              {{$t('course.course_pub')}}
              <icon-svg name="more" class="el-icon-more"></icon-svg>
            </h1>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4" v-for="(item, index) in public" :key="index" :offset="index > 0 ? 2 : 0">
            <el-card :body-style="{ padding: '0px' }">
              <img style="padding: 5px;width: 245px;height: 246px;" :src="item.courseCover" class="image" @click="goCourseDetail(item.uuid)">
              <div style="padding: 14px;">
                <span>{{item.courseTypeName}}</span>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <empty v-if="hot.length == 0"></empty>
      </div>
      <div class="hot">
      <el-row v-if="isAuth('business:companyadmin:edit')">
        <el-col :span="24" style="text-align:right;margin: 10px">
          <el-button  size="mini" @click="edithot()">{{$t('button.course_release')}}</el-button>
        </el-col>
      </el-row>
        <el-row>
          <el-col :span="24">
            <h1 class="font-color" @click="toCourse('hot')">
              {{$t('course.course_hot')}}
              <icon-svg name="more" class="el-icon-more"></icon-svg>
            </h1>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4" v-for="(item, index) in hot" :key="index" :offset="index > 0 ? 2 : 0">
            <el-card body-style="text-align:center">
              <img style="padding: 5px;width: 100%;height: 246px;" :src="item.courseCover" class="image" @click="goCourseDetail(item.uuid)">
              <div style="padding: 14px;">
                <span>{{item.courseTypeName}}</span>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <empty v-if="public.length == 0"></empty>
      </div>
    </div>
    <courseTypeList v-if="editHotCourseTypList" ref="hotcourseTypeList" @refreshDataList="getHomePageInfos()"/>
    <pubcourseTypeList v-if="editpubCourseTypList" ref="pubcourseTypeList" @refreshDataList="getHomePageInfos()"/>
    <bannerList v-if="editbanner" ref="editbanner" @refreshDataList="getHomePageInfos()"/>
  </div>
</template>

<script>
import Swiper from "swiper";
import empty from "@/components/empty"
import courseTypeList from './courseTypeList'
import pubcourseTypeList from './pubcourseTypeList'
import bannerList from './bannerList'
export default {
  components: {
    empty,
    courseTypeList,
    pubcourseTypeList,
    bannerList
  },
  data() {
    return {
      editHotCourseTypList: false,
      editpubCourseTypList: false,
      editbanner: false,
      activeIndex: 1,
      homedata:"",
      hot: [],
      public: [],
      bannerList: [
        {
          url: '/static/img/banner/banner1.png'
        },
        {
          url: '/static/img/banner/banner2.png'
        },
        {
          url: '/static/img/banner/banner3.png'
        }
      ]

    };
  },
  mounted() {
    this.getBanner();

    this.getHomePageInfos();
  },
  methods: {
    // 获取数据列表
    edit(){
      this.editbanner = true
      this.$nextTick(() => {
        this.$refs.editbanner.init(undefined,this.bannerList)
      })
    },
    edithot(){
      this.editHotCourseTypList = true
      this.$nextTick(() => {
        if(this.homedata == '' || this.homedata == null || this.homedata.hotList == null ){
          this.$refs.hotcourseTypeList.getDataList([])
        } else {
          this.$refs.hotcourseTypeList.getDataList(this.homedata.hotList)
        }

      })
    },
    editpub(){
      this.editpubCourseTypList = true
      this.$nextTick(() => {
        if(this.homedata == null ||this.homedata.pubList == null ){
          this.$refs.pubcourseTypeList.getDataList([])
        } else {
          this.$refs.pubcourseTypeList.getDataList(this.homedata.pubList)
        }

      })
    },
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/generator/coursetype/showHome'),
        method: 'get',
        params: this.$http.adornParams({
          'page': 1,
          'limit': 4,
          'key': ''
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.hot = data.data.hot
          this.public = data.data.public
        } else {
          this.hot = []
          this.public = []
        }
      })
    },
    // banner图
    bannerSwiper() {
      let mySwiper = new Swiper(".swiper-container", {
        loop: true,
        slidesPerView: 1,
        pagination: {
          el: ".swiper-pagination",
          clickable: true
        },
        autoplay: {
          delay: 2000,
          stopOnLastSlide: false,
          disableOnInteraction: false
        },
        observer: true, //修改swiper自己或子元素时，自动初始化swiper
        observeParents: true
      });
      mySwiper.el.onmouseover = function() {
        //鼠标放上暂停轮播
        mySwiper.autoplay.stop();
      };
      mySwiper.el.onmouseleave = function() {
        mySwiper.autoplay.start();
      };
    },
    // 从后台获取banner数据资料
    getBanner() {
      this.$http({
        url: this.$http.adornUrl(`/sys/oss/getFileByObjType`),
        method: 'get',
        params: this.$http.adornParams({
          'objType': '轮播图'
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          if(data.data.length != undefined && data.data.length > 0){
            this.bannerList = data.data
          }
        }
      })
      // 待编写
      this.bannerSwiper();
    },
    //跳转到课程中心
    toCourse(type){
      this.$router.push({ name: 'course',query:{courseType:type}})
    },
    // 跳转到课程详情
    goCourseDetail (courseId) {
      this.$router.push({
        path: '/course-detail',
        query: {
          id: courseId
        }
      })
    },
    getHomePageInfos(){
      this.$http({
        url: this.$http.adornUrl('/generator/renderhome/list'),
        method: 'get',
        params: this.$http.adornParams({
          'page': this.pageIndex,
          'limit': this.pageSize
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          if(data.page.list.length == 0){
            this.getDataList();
            return
          } else {
            this.homedata = data.page.list[0]
            if(this.homedata.carouselList!=null && this.homedata.carouselList.length>0){
              var url  = this.homedata.carouselList.split(",")
              this.bannerList = []
              for(var i =0;i<url.length;i++){
                this.bannerList.push({url:url[i]})
              }
            }
            if(this.homedata.hotList!=null && this.homedata.hotList.length>0){
              this.hot = this.homedata.hotList
            }
            if(this.homedata.pubList!=null && this.homedata.pubList.length>0){
              this.public = this.homedata.pubList
            }
          }
          this.dataList = data.page.list
          this.totalPage = data.page.totalCount
        } else {
          this.dataList = []
          this.totalPage = 0
        }
        this.dataListLoading = false
      })
    }
  }

};
</script>
<style>
  .wid_100{
    width: 100%;
  }
 .hgt_367{
   height: 367px;
 }
 .font-color{
   color: #3E8EF7;
 }
 .el-icon-more{
    width: 70px;
    margin-left: 30px;
    height: 40px;
    padding-top: 25px;
    cursor:pointer;
   color: #3E8EF7;
 }
</style>
