<template>
  <div>
    <el-row>
      <el-table
        :data="courseTypeListData"
        style="width: 100%;margin-bottom: 20px;"
        row-key="id"
        default-expand-all
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
        <el-table-column
          prop="name"
          label="标题"
          width="300"
        >
          <template slot-scope="scope">
            <a v-if="scope.row.type =='course'" style="cursor: pointer" @click="gotoDetail(scope.row.id)">
              <span v-if="scope.row.fileType == 'excel'" class="iconfont icon-ex" style="color:green;margin-right: 15px"></span>
              <span v-if="scope.row.fileType == 'ppt'" class="iconfont icon-ppt" style="color:orangered;margin-right: 15px"></span>
              <span v-if="scope.row.fileType == 'word'" class="iconfont icon-word" style="color:blue;margin-right: 15px"></span>
              <span v-if="scope.row.fileType == 'translate'" class="iconfont icon-fanyi" style="color:coral;margin-right: 15px"></span>
              <span v-if="scope.row.fileType == 'video'" class="iconfont icon-shipin" style="color:gray;margin-right: 15px"></span>
              {{scope.row.name}}
            </a>
            <span v-if="scope.row.type !='course'">{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="readtime"
          label="已学时长"
          width="100"
        >
        </el-table-column>
        <el-table-column
          prop="totalTime"
          label="总时长"
          width="100"
        >
        </el-table-column>
        <el-table-column
          prop="isFinished"
          label="是否完成"
          width="100"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.type =='course' && scope.row.isFinished =='0'">未完成</span>
            <span v-if="scope.row.type =='course' && scope.row.isFinished ==''">未开始</span>
            <span v-if="scope.row.type =='course' && scope.row.isFinished =='1'">已完成</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('common.oper')"
          width="120"
        >
          <template slot-scope="scope">
<!--            <el-button type="primary" size="mini" @click="gotoDetail(scope.row.id)">开始学习</el-button>-->
            <el-button v-if="scope.row.type =='course'"  type="primary" size="mini" @click="play(scope.row.id,scope.row.name,scope.row.fileType)">开始学习</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <alertCompents v-if="showPlay" @refreshPage="refresh" ref="alertCompents" />
    <translate v-if="translateVisible" ref="translate"></translate>
  </div>
</template>
<script>
import alertCompents from './alertCompents'
import translate from '@/components/translate'
export default {
  components:{
    alertCompents,
    translate
  },
  data() {
    return {
      translateVisible: false,
      courseTypeListData: [],
      courseType: {},
      showPlay:false
    }
  },
  methods: {
    refresh(){
      this.showPlay=false
    },
    play(value,name,type){
      if(type == 'translate'){
        this.translateVisible = true
        this.$nextTick(() => {
          this.$refs.translate.init(value, type, '中日翻译', false)
        })
      }else{
        this.showPlay = true;
        this.$nextTick(() => {
          this.$refs.alertCompents.init(value,name,this.courseType)
        })
      }
    },
    initdata(data){
      this.courseTypeListData = data.children
      console.log('data.children',data.children)
      this.courseType.courseTypeId = data.uuid
      this.courseType.courseTypeName = data.courseTypeName
      setTimeout(() => {
        this.load()
      }, 1000)
    },
    load() {
      var els = document.getElementsByClassName("el-table__expand-icon");
      for(let i=0;i<els.length;i++){
        els[i].click()
      }
    },
    gotoDetail(uuid){
      this.$router.push({path: '/play', query: {uuid: uuid}})
    },
  },
  mounted() {
  }
}
</script>
