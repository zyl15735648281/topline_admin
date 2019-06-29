<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>评论管理</span>
    </div>
    <el-table stripe style="width: 100%" :data="articles">
      <el-table-column prop="title" label="标题" width="180"></el-table-column>
      <el-table-column prop="total_comment_count" label="总评论数"></el-table-column>
      <el-table-column prop="fans_comment_count" label="粉丝评论数"></el-table-column>
      <el-table-column label="允许评论">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.comment_status"
            :disabled="scope.row.changeLoading"
            @change="handelCommentChange(scope.row)"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  name: "comment",
  data() {
    return {
      articles: []
    };
  },
  created() {
    this.loadComment();
  },
  methods: {
    loadComment() {
      // console.log(111);
      this.$http({
        method: "GET",
        url: "/articles",
        params: {
          response_type: 'comment'
        }
      }).then(data => {
        console.log(data);
        data.results.forEach(item => {
          item.changeLoading = false
        });
        this.articles = data.results
      });
    },
    handelCommentChange(item) {
      item.changeLoading = true
      this.$http({
        method:'PUT',
        url:'/comments/status',
        params:{
          article_id:item.id.toString()
        },
        data:{
          allow_comment:item.comment_status
        }
      }).then(() => {
        // console.log(data);
        item.changeLoading = true 
        this.$message({
          type:'success',
          message:`${item.comment_status ? '启用' : '关闭'}评论状态成功`
        })
        item.changeLoading = false 
      }).catch(err => {
        console.log(err);
        item.changeLoading = false
        item.comment_status = !item.comment_status
        this.$message.error('修改评论状态失败')
      })
    }
  }
};
</script>

<style scoped lang="less">
</style>
