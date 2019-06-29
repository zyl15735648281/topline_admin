<template>
  <el-row class="app-header">
    <el-col :span="14">江苏传智播客教育科技股份有限公司</el-col>
    <el-col :span="4" :offset="6">
      <el-dropdown trigger="click">
        <span class="el-dropdown-link">
          <img width="30" :src="userInfo.photo">
          {{ userInfo.name }}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>账户设置</el-dropdown-item>
          <el-dropdown-item @click.native="handellogout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "AppHeader",
  components: {},
  data() {
    return {
      userInfo: {}
    };
  },
  created() {
    // 因为拿到的是对象，所以需要转成JSON格式，然后再转回来
    this.userInfo = JSON.parse(window.localStorage.getItem("user_info"));
  },
  methods: {
    handellogout() {
      this.$confirm("此操作将退出页面, 是否继续?", "退出提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          window.localStorage.removeItem("user_info");
          this.$message({
            type: "success",
            message: "退出成功!"
          });
          this.$router.push({
            name: "login"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消退出"
          });
        });
    }
  }
};
</script>

<style scoped lang="less">
.app-header {
  height: 60px;
  display: flex;
  align-items: center;
}
.el-dropdown-link {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #409eff;
  img {
    border-radius: 50%;
  }
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>
