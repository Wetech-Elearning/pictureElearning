<template>
  <div class="m-t-115">
    <my-header></my-header>
    <!-- 学习套件搜索 -->
    <div class="box-shadow1">
      <div class="around-center p-t-50 p-b-20" style="background:url('static/img/bg/bg7.png')">
        <div class="between-center wid1200 m-b-20">
          <img src="static/img/slice/learningSuite.png" alt class="hgt36" />
          <div class="radius8 bg-fff hgt48 wid560 flex_mid">
            <input
              type="text"
              class="inputDefault p_both15 font16 flex_1 placeholder999"
              placeholder="请输入关键字搜索"
            />
            <div class="m-l-20 wid50 around-center bg-039BE9 hgt48">
              <img src="static/img/slice/search1.png" alt class="hgt32" />
            </div>
          </div>
        </div>
      </div>
      <div class="around-center">
        <div class="wid1200 flex_mid">
          <p
            class="cursor relative kind_type"
            @click="activeKind=item.Id"
            :class="{'ac_kind_type':activeKind==item.Id}"
            v-for="(item,index) in kindTypes"
            :key="index"
          >{{item.Label}}</p>
        </div>
      </div>
    </div>
    <!-- 学习套件 -->
    <div class="bg-f3f5f7 around-center">
      <div class="wid1200 p-v-30">
        <div class="m-v-10 flex_mid">
          <p
            class="cursor order_type"
            @click="activeOrder=item.Id"
            :class="{'ac_order_type':activeOrder==item.Id}"
            v-for="(item,index) in orderType"
            :key="index"
          >{{item.Label}}</p>
        </div>
        <div class="flex_stretch flex_wrap course_div font14">
          <div
            class="course_item m-v-10 bg-fff radius6 cursor"
            v-for="(i ,index) in 10"
            :key="index"
          >
            <img
              src="http://cdn.sendrobot.cn/uploads/img/20190608/b4fc0503f11b4319870c09169a54d52d.png?w=3508&h=2480"
              alt
              class="hgt130 wid_100 top-radius6"
            />
            <div class="pad10">
              <p class="color-333 line2">掌握机器学习库大数据开发 第 一节系统 Python3入门课程</p>
              <p class="color-888 font12 m-t-15 only_line">互联网思维的定价，告别传统培训互联网思维的定价，告别传统培训</p>
              <p class="color-FA3338 m-t-20 m-b-5 cursor">立即购买</p>
            </div>
          </div>
        </div>
        <div class="m-t-40 around-center">
          <el-pagination
            background
            :hide-on-single-page="true"
            layout="total,prev, pager, next"
            :total="1000"
          ></el-pagination>
        </div>
      </div>
    </div>
    <!-- 没有权限通知 -->
    <mes-notify :mesTitle="noRightMes" class="bg-f3f5f7" v-show="0"></mes-notify>
    <!-- 没有登录通知 -->
    <mes-notify :mesTitle="noLoginMes" class="bg-f3f5f7" v-show="0">
      <div slot="other_block" class="m-t-40 font14 color-fff">
        <p class="l-h-45 hgt45 inline_div bg-2F9AFF radius4 wid150 text-center">登录网站</p>
      </div>
    </mes-notify>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 没有权限通知
      noRightMes: "您没有权限看到本方向分类下的课程哦~~",
      // 没有权限通知
      noLoginMes: "您还没有登录网站哟，登录查看课程列表~~",
      // 筛选条件数据
      kindTypes: [
        { Label: "全部", Id: 0 },
        { Label: "初级编程", Id: 1 },
        { Label: " 中级编程", Id: 2 },
        { Label: "高级编程", Id: 3 },
        { Label: " 主题展示", Id: 4 }
      ],
      // 激活的条件类型
      activeKind: 0,
      // 排序类型数据
      orderType: [
        { Label: "默认排序", Id: 0 },
        { Label: "最新", Id: 1 },
        { Label: " 点击量", Id: 2 }
      ],
      // 激活的排序
      activeOrder: 0
    };
  },
  methods: {},
  mounted() {}
};
</script>
<style scoped>
.kind_type {
  margin-right: 55px;
  height: 80px;
  line-height: 80px;
}
.kind_type:last-child {
  margin-right: 0px;
}
.ac_kind_type,
.kind_type:hover {
  color: #039be9;
}
.ac_kind_type::after,
.kind_type:hover::after {
  position: absolute;
  content: "";
  width: 16px;
  height: 3px;
  background: #039be9;
  left: 50%;
  bottom: 15px;
  transform: translateX(-50%);
}
.order_type {
  color: #666666;
  font-size: 12px;
  margin-right: 24px;
  height: 24px;
  cursor: pointer;
  line-height: 24px;
  border-radius: 12px;
  padding: 0 10px;
}
.ac_order_type {
  background: #999999;
  color: #ffffff;
}
.course_div > .course_item {
  width: calc((100% - 80px) / 5);
  margin-right: 20px;
}
.course_div > .course_item:nth-child(5n) {
  margin-right: 0px;
}
</style>
