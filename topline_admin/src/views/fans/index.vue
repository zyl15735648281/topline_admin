o<template>
  <el-card>
    <div slot="header">
      <span>详情分析</span>
    </div>
    <div>
      <el-radio-group v-model="radio1" style="padding-right:20px">
        <el-radio-button label="今日"></el-radio-button>
        <el-radio-button label="本周"></el-radio-button>
        <el-radio-button label="本月"></el-radio-button>
      </el-radio-group>
      <el-date-picker
        v-model="value1"
        type="datetimerange"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :default-time="['12:00:00']"
      ></el-date-picker>
    </div>
    <el-row style="margin-top:20px;margin-bottom:20px">
      <el-col :span="7" class="center">
        <el-col :span="6" class="right">
          <span class="circle"></span>
        </el-col>
        <el-col :span="6" style="text-align:center">
          <span>
            30个
            <br />粉丝数
          </span>
        </el-col>
      </el-col>
      <el-col :span="7" class="center">
        <el-col :span="6" class="right">
          <span class="circle"></span>
        </el-col>
        <el-col :span="10" style="text-align:center">
          <span>
            22%
            <br />粉丝累计阅读量
          </span>
        </el-col>
      </el-col>
      <el-col :span="7" class="center">
        <el-col :span="6" class="right">
          <span class="circle"></span>
        </el-col>
        <el-col :span="6" style="text-align:center">
          <span>
            1.2元
            <br />粉丝收益
          </span>
        </el-col>
      </el-col>
    </el-row>
    <p>头条粉丝</p>
    <br />
    <div ref="fans" style="width: 600px; height: 400px;"></div>
    <p>图文数据</p>
    <br />
    <div ref="datas" style="width: 600px; height: 400px;"></div>
  </el-card>
</template>

<script>
import echarts from "echarts";

export default {
  name: "",
  components: {},
  data() {
    return {
      radio1: "今日",
      value1: ""
    };
  },
  // mounted() {
  //   // 初始化Echart实例
  //   // var myChart = echarts.init(this.$refs.fans);
  //   //初始化图表组件
  //   this.initChart();
  //   // 发送请求，更新数据
  //   this.loadData();
  // },
  methods: {
    // initChart() {
    //   var myChart = echarts.init(document.getElementById("main"));
    //   // 显示标题，图例和空的坐标轴
    //   myChart.setOption({
    //     title: {
    //       text: "异步数据加载示例"
    //     },
    //     tooltip: {},
    //     legend: {
    //       data: ["销量"]
    //     },
    //     xAxis: {
    //       data: []
    //     },
    //     yAxis: {},
    //     series: [
    //       {
    //         name: "销量",
    //         type: "bar",
    //         data: []
    //       }
    //     ]
    //   });
    // },
    // loadData() {
    //   this.myChart.showLoading()
    //   setTimeout(() => {
    //     this.$http({
    //       method:'GET',
    //       url:'http://localhost:3000/barData'
    //     }).then(data => {
    //       this.myChart.setOption({
    //         xAxis:{
    //           data:data.xAxisData
    //         },
    //         series:[{
    //           // 根据名字对应到相应的系列
    //           name:'销量',
    //           data: data.seriesData
    //         }]
    //       })
    //       this.myChart.hideLoading()
    //     })
    //   }, 2000);
    // }
  }
};
</script>

<style scoped lang="less">
.circle {
  width: 60px;
  height: 60px;
  background-color: red;
  border-radius: 50%;
}
.right {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.center {
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f8f8f8;
  margin-right: 35px;
}
</style>
