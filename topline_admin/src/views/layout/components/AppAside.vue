<template>
  <div>
    <!-- 里面有个router属性，是一个属性-->
    <el-menu
      default-active="2"
      @open="handleOpen"
      @close="handleClose"
      router
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <el-menu-item index="/">
        <i class="el-icon-s-home"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-folder"></i>
          <span>内容</span>
        </template>
        <el-menu-item index="/publish">
          <i class="el-icon-printer"></i>
          <span slot="title">发布</span>
        </el-menu-item>
        <el-menu-item index="/article">
          <i class="el-icon-document-copy"></i>
          <span slot="title">内容列表</span>
        </el-menu-item>
      </el-submenu>
      <el-menu-item index="/comment">
        <i class="el-icon-more-outline"></i>
        <span slot="title">评论</span>
      </el-menu-item>
      <el-menu-item index="/image">
        <i class="el-icon-s-cooperation"></i>
        <span slot="title">素材</span>
      </el-menu-item>
      <el-menu-item index="/fans">
        <i class="el-icon-s-flag"></i>
        <span slot="title">粉丝</span>
      </el-menu-item>
      <el-menu-item index="/account">
        <i class="el-icon-s-custom"></i>
        <span slot="title">账户</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "AppAside",
  components: {},
  data() {
    return {};
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>

<style scoped lang="less">
.el-menu {
  height: 100%;
}
.iconfont {
  margin-right: 5px;
}
</style>
