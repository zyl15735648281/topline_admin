<template>
  <div>
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
        <span>全部图文</span>
      </div>
      <el-form :model="form" label-width="80px">
        <el-form-item label="文章状态">
          <!-- 这里需要遍历将index取出放在label里面【在控制台里当做状态显示】，查看文档 -->
          <!-- 问题：因为这里后端没有做容错处理，所以需要处理返回空数组报错的问题
          解决方案：将提交的label转换为字符串 -->
          <el-radio-group v-model="filterParams.status">
            <el-radio label="">全部</el-radio>
            <el-radio v-for="(item,index) in statusType" :key="item.label" :label="index + ''">{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 这里是考虑到用户输入为空查不到数据 -->
        <!-- <el-form-item label="频道列表">
          <el-select v-model="filterParams.channel_id" placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="item in channels" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="频道列表">
          <article-channel v-model="filterParams.channel_id"></article-channel>
        </el-form-item>
        <!-- 这里使用change事件，必须使用v-model，但是绑定又不知道怎么绑，他要求返回的是数组，两个时间，所以解决办法： -->
        <!-- 给model随便绑定一个数据，定义一个空数组，绑定 -->
        <el-form-item label="时间选择">
          <el-date-picker
            v-model="begin_end_pubdate"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="handelTimeChange"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-row>
          <el-button type="primary" icon="el-icon-edit" circle></el-button>
          <el-button type="info" icon="el-icon-message" circle @click="onSubmit" :loading="articleLoding"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle></el-button>
        </el-row>
      </el-form>
    </el-card>
    <!-- /筛选区域 -->

    <!-- 列表 -->
    <el-card class="list-card">
      <div slot="header" class="clearfix">
        <span>共找到<strong>{{totalCount}}</strong>条符合条件的内容</span>
      </div>

      <!-- table 表格 -->
      <el-table class="list-table" :data="articles" style="width: 100%" v-loading="articleLoding">
        <el-table-column prop="cover.images[0]" label="封面">
          <template slot-scope="scope">
            <img :src="scope.row.cover.images[0]" width="60px">
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" width="180"></el-table-column>
        <el-table-column prop="pubdate" label="发布日期" width="180"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <!-- <input :value="scope.row"> -->
            <el-tag :type="statusType[scope.row.status].type">{{statusType[scope.row.status].label}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 两种方式 -->
            <!-- <el-button type="primary" icon="el-icon-edit" circle @click="$router.push(`/publish/${scope.row.id}`)"></el-button> -->
            <el-button type="primary" icon="el-icon-edit" circle @click="$router.push({
              name:'publish-edit',
              params:{
                id:scope.row.id
              }
            })"></el-button>
          <!-- <el-button type="info" icon="el-icon-message" circle></el-button> -->
          <el-button type="danger" icon="el-icon-delete" circle @click.native="handelDel(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- /table 表格 -->

      <!-- 数据分页 -->
      <!-- 数据分页需要的：
      总共多少页，每页多少条数据，页码
      current-page 代表当前页码，也就是高亮的那个页码 -->
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalCount"
        :disabled="articleLoding"
        @current-change="handleCurrentChange"
        :current-page="page"
      ></el-pagination>
      <!-- /数据分页 -->
    </el-card>
  </div>
</template>

<script>
import ArticleChannel from '@/components/article-channel'
export default {
  name: "",
  components: {
    ArticleChannel
  },
  data() {
    return {
      articles: [],
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
        value1: ""
      },
      totalCount: 0,
      articleLoding: false,
      page:1,
      statusType:[
        {
          type:'info',
          label:'草稿'
        },
        {
          type:'',
          label:'待审核'
        },
        {
          type:'success',
          label:'审核通过'
        },
        {
          type:'waring',
          label:'审核失败'
        },
        {
          type:'danger',
          label:'已删除'
        },
      ],
      channels:[],
      filterParams:{
        status:'',
        channel_id:'',
        begin_pubdate:'',
        end_pubdate:''
      },
      begin_end_pubdate:[],
    };
  },
  created() {
    this.loadData();
    this.loadChannels()
  },
  methods: {
    loadData(page = 1) {
      this.articleLoding = true;
      // 这里判断过滤字段是否有效
      const filterData = {}
      for (let key in this.filterParams){
        if (this.filterParams[key]){
          filterData[key] = this.filterParams[key]
        }
      }
      console.log(filterData);  
      this.$http({
        method: "GET",
        url: "/articles",
        params: {
          page,
          per_page: 10,
          // 将过滤之后的字段混入当前对象
          ...filterData
        }
      }).then(data => {
        // console.log(data);
        // console.log(111);
        // 列表内容
        this.articles = data.results;
        // console.log(this.articles);
        this.totalCount = data.total_count;
        this.articleLoding = false;
      });
    },
    loadChannels(){
      this.$http({
        method:'GET',
        url:'/channels'
      }).then(data => {
        // console.log(data);
        this.channels = data.channels
      })
    },
    handleCurrentChange(page) {
      // console.log(111);
      this.page = page
      // 当页面发生改变的时候，重新加载数据
      this.loadData(page);
    },
    handelDel(article) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
          }).then(() => {
            this.$http({
              method: 'DELETE',
              url: `/articles/${article.id}`,
            }).then(data => {
              // console.log(data);
              this.$message({
              type: 'success',
              message: '删除成功!'
              });
              this.loadData(this.page)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    // 这里处理时间的改变
    handelTimeChange(value) {
      // console.log(value);
      // 这里需要手动赋值，将数组里面的内容单独赋值给开始和结束时间
      this.filterParams.begin_pubdate = value[0]
      this.filterParams.end_pubdate = value[1]
    },
    // 这里点击查询的时候，重新加载数据列表
    onSubmit() {
      // 这里不传参默认 page 为1
      this.page = 1 //让页码回到第一页
      this.loadData()  //加载第一页的数据
    },
    // handelEdit() {
    //   method:'PUT',
    //   url: `/articles/:${this.$router.id}`
    // }
  }
};
</script>

<style scoped lang="less">
.filter-card {
  margin-bottom: 20px;
}
.list-table {
  margin-bottom: 30px;
}

</style>
