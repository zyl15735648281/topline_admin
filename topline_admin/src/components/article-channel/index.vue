<template>
  <!-- 
    这里不能直接使用v-model，因为 v-model 是prop传下来的值，所以不能更改，props数据不能更改【单向数据流】
    value属性用来绑定同步的数据[这里的value是组件本身的value，内容是接收过来的value]
    change事件，当选项发生改变被触发，回调参数就是选项的 value
  -->
  <el-select clearable :value="value" @change="handleChange">
    <!-- <el-option label="全部" value></el-option> -->
    <el-option v-for="item in channels" :key="item.id" :label="item.name" :value="item.id"></el-option>
  </el-select>
</template>

<script>
export default {
  name: "articleChannel",
  components: {},
  props: {
    value: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      channels: []
    };
  },
  created() {
    this.loadChannels();
  },
  methods: {
    loadChannels() {
      this.$http({
        method: "GET",
        url: "/channels"
      })
        .then(data => {
          // console.log(data);
          this.channels = data.channels;
        })
        .catch(err => {
          console.log(err);
          this.$message.error("加载失败");
        });
    },
    handleChange(value) {
      // console.log(value);
      // 这里如果你没有封装你的自定义事件，就必须使用组件里面有的
      this.$emit('input',value)
    }
  }
};
</script>

<style scoped lang="less">
</style>
