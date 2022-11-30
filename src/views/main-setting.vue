<template>
  <el-card
    class="set-container"
    :body-style="{padding: 0}"
  >
    <el-popover
      placement="left"
      title="简介"
      width="200"
      trigger="hover"
      content="这是一段简介">
      <div
        slot="reference"
        class="tip-wrapper bg2 flex flex-direction justify-center align-center"
        @click="openDrawer"
      >
        <i class="el-icon-document"></i>
        <div>
          简介
        </div>
      </div>
    </el-popover>
    <div style="height: 1px;"></div>
    <el-popover
      placement="left"
      title="二维码"
      width="200"
      trigger="hover">
      <vue-qr :logoSrc="imageUrl" :text="enjoyUrl" :size="150"></vue-qr>
      <div
        slot="reference"
        class="tip-wrapper bg2 flex flex-direction justify-center align-center"
        @click="openDrawer"
      >
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-erweima1"></use>
        </svg>
        <div class="qrcode">
          二维码
        </div>
      </div>
    </el-popover>
    <div style="height: 1px;"></div>
    <el-popover
      placement="left"
      title="电话"
      width="200"
      trigger="hover"
      content="1008611">
      <div
        slot="reference"
        class="tip-wrapper bg2 flex flex-direction justify-center align-center"
        @click="openDrawer"
      >
        <i class="el-icon-phone"></i>
        <div>
          电话
        </div>
      </div>
    </el-popover>
    <div style="height: 1px;"></div>
    <div
      class="tip-wrapper bg2 flex flex-direction justify-center align-center"
      @click="showFullCalendar"
    >
      <i class="el-icon-date"></i>
      <div>
        日程
      </div>
    </div>
    <el-dialog v-if="dialogFullCalendarVisible" title="日程" :visible.sync="dialogFullCalendarVisible" width="65%">
      <full-calendar class="calendar" ref="fullCalendar" style="width:100%;" :options="calendarOptions"></full-calendar>
    </el-dialog>
  </el-card>
</template>

<script>
  import vueQr from 'vue-qr'
  import FullCalendar from '@fullcalendar/vue'
  import dayGridPlugin from '@fullcalendar/daygrid'
  import interactionPlugin from '@fullcalendar/interaction'
  import timeGridPlugin from '@fullcalendar/timegrid'
  import listPlugin from '@fullcalendar/list'
  export default {
    name: 'Setting',
    data() {
      return {
        enjoyUrl: '',
        imageUrl: require("@/assets/img/avatar.png"),
        dialogFullCalendarVisible: false,
        calendarOptions: {
          plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
          initialView: 'dayGridMonth',
          locale: 'zh',
          firstDay: 1,
          buttonText: {
            today: '今天',
            month: '月',
            week: '周',
            day: '日'
          },
          headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          },
          height: 650,
          validRange: this.validRange,  //设置可显示的总日期范围
          events: [], //背景色 (添加相同时间的背景色时颜色会重叠)
          // datesSet: this.datesSet, //日期渲染；修改日期范围后触发
          eventClick: this.handleEventClick, //点击日程触发
          dateClick: this.handleDateClick, //点击日期触发
          eventDrop: this.calendarEventDropOrResize, //拖动事件触发
          eventResize: this.calendarEventDropOrResize, //缩放事件触发
          displayEventTime: false, //不显示具体时间
        },
      }
    },
    components: {
      vueQr,
      FullCalendar
    },
    created() {
      this.init()
      this.enjoyUrl = `${window.SITE_CONFIG.register}/#/register?uuid=` + this.companyId + `&company=` + this.companyName
    },
    /*mounted () {
      this.init()
    },*/
    methods: {
      openDrawer() {
        this.$emit('open-drawer')
      },
      init() {
        this.calendarOptions.events = []
        this.$http({
          url: this.$http.adornUrl('/generator/classes/showFullCalendar'),
          method: 'get',
          params: this.$http.adornParams({
            'studentId': this.$cookie.get('userId')
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            console.log('data.data',data.data)
            for(let i=0;i<data.data.length;i++){
              let classData = data.data[i]
              let courseEntityList = classData.courseEntityList
              for(let j=0;j<courseEntityList.length;j++){
                let courserData = courseEntityList[j]
                this.calendarOptions.events.push({
                  id: j,
                  title: courserData.courseTypeName,
                  start: classData.startDate,
                  end: classData.endDate,
                  color: '#ffcc99',
                  editable: true, //允许拖动缩放，不写默认就是false
                  overlap: true, //允许时间重叠，即可以与其他事件并存，不写默认就是false
                })
              }
            }
          }
        })
      },
      // 注意：该方法在页面初始化时就会触发一次
      datesSet(info) {
        console.log(info)
        this.init()
      },
      // 点击日程触发
      handleEventClick (info) {
        console.log('点击日程触发', info)
      },
      // 点击日期触发
      handleDateClick (info){
        console.log('点击日期触发', info)
      },
      // 缩放事件触发
      calendarEventDropOrResize(info){
        console.log('缩放事件触发', info)
      },
      showFullCalendar () {
        this.init()
        this.dialogFullCalendarVisible = true
      }
    }
  }
</script>

<style lang="scss">
  .dark {
    .el-drawer {
      background-color: #272727 !important;
    }
  }
  .light,
  .dark-side,
  .blue-side {
    .el-drawer {
      background-color: #ffff !important;
    }
  }
</style>
<style lang="scss" scoped>
  $width: 60px;
  .set-container {
    position: fixed;
    z-index: 999999;
    right: -60px;
    top: 0;
    margin-top: calc(50vh - 50px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    padding: 5px;
    .tip-wrapper {
      background-color: #007aff;
      width: $width;
      height: $width;
      border-radius: 4px;
      font-size: 10px;
      transition: color 0.15s ease, background-color 0.15s ease;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      & > i {
        font-size: 20px;
        margin-bottom: 8px;
      }
    }
    .tip-wrapper + .tip-wrapper {
      margin-top: 10px;
    }
  }
  .set-container:hover {
    position: fixed;
    right: 0;
    top: 0;
    margin-top: calc(50vh - 50px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    padding: 5px;
    .tip-wrapper {
      width: $width;
      height: $width;
      border-radius: 4px;
      font-size: 10px;
      transition: color 0.15s ease, background-color 0.15s ease;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      & > i {
        font-size: 20px;
        margin-bottom: 8px;
      }
    }
    .tip-wrapper + .tip-wrapper {
      margin-top: 10px;
    }
    .bg1 {
      color: white;
    }
    .bg1:hover {
      color: #ffffff;
    }
    .bg2 {
      color: white;
    }
    .bg2:hover {
      color: #ffffff;
    }
  }
  .qrcode{
    margin-top: 4px;
  }
  .icon {
    width: 2em;
    height: 2em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
</style>
