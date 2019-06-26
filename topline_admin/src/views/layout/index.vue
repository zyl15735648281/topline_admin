<template>
  <el-container>
    <el-aside width="200px"><AppAside></AppAside></el-aside>
    <el-container>
      <el-header><AppHeader></AppHeader></el-header>
      <el-main><router-view></router-view></el-main>
    </el-container>
  </el-container>
</template>

<script>
import AppAside from "./components/AppAside";
import AppHeader from "./components/AppHeader";
export default {
  components: {
    AppAside,
    AppHeader
  },
  data() {
    return {};
  }
};
</script>

<style scoped lang="less">
.el-container {
  height: 100%;
}
 .el-aside {
  background-color: #d0dce7;
}
 .el-header {
  background-color: #aec0d1;
}
 .el-main {
  background-color: #e8eff4;
}
</style>
