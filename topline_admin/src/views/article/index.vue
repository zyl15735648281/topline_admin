<template>
  <div>
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
        <span>全部图文</span>
      </div>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="文章状态">
          <el-radio-group v-model="form.resource">
            <el-radio label="全部"></el-radio>
            <el-radio label="草稿"></el-radio>
            <el-radio label="待审核"></el-radio>
            <el-radio label="审核通过"></el-radio>
            <el-radio label="审核失败"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道列表">
          <el-select v-model="form.region" placeholder="请选择">
            <el-option label="一" value="one"></el-option>
            <el-option label="二" value="two"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间选择">
          <el-date-picker
            v-model="form.value1"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-row>
          <el-button type="primary" icon="el-icon-edit" circle></el-button>
          <el-button type="info" icon="el-icon-message" circle></el-button>
          <el-button type="danger" icon="el-icon-delete" circle></el-button>
        </el-row>
      </el-form>
    </el-card>
    <!-- /筛选区域 -->

    <!-- 列表 -->
    <el-card class="list-card">
      <div slot="header" class="clearfix">
        <span>共找到15条符合条件的内容</span>
      </div>

      <!-- table 表格 -->
      <el-table class="list-table" :data="articles" style="width: 100%" v-loading="articleLoding">
        <el-table-column prop="cover.images[0]" label="封面" width="150">
          <template slot-scope="scope">
            <img :src="scope.row.cover.images[0]">
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" width="180"></el-table-column>
        <el-table-column prop="pubdate" label="发布日期" width="180"></el-table-column>
        <el-table-column prop="status" label="状态"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" circle></el-button>
          <!-- <el-button type="info" icon="el-icon-message" circle></el-button> -->
          <el-button type="danger" icon="el-icon-delete" circle @click="handelDel(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- /table 表格 -->

      <!-- 数据分页 -->
      数据分页需要的：
      总共多少页，每页多少条数据，页码
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalCount"
        :disabled="articleLoding"
        @current-change="handleCurrentChange"
      ></el-pagination>
      <!-- /数据分页 -->
    </el-card>
  </div>
</template>

<script>
export default {
  name: "",
  components: {},
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
      articleLoding: false
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    loadData(page = 1) {
      this.articleLoding = true;
      this.$http({
        method: "GET",
        url: "/articles",
        params: {
          page,
          per_page: 10
        }
      }).then(data => {
        console.log(data);
        // console.log(111);
        // 列表内容
        this.articles = data.results;
        console.log(this.articles);
        this.totalCount = data.total_count;
        this.articleLoding = false;
      });
    },
    handleCurrentChange(page) {
      console.log(111);
      // 当页面发生改变的时候，重新加载数据
      this.loadData(page);
    },
    handelDel(article) {
      this.$http({
        method: 'DELETE',
        url: `/articles/${article.id}`,
      }).then(data => {
        console.log(data);
      })
    }
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
