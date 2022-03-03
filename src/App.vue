<template>
  <div id="app">
    <!--路由出口-->
    <router-view/>
<!--    <el-button>默认按钮</el-button>
    <el-button type="danger">默认按钮</el-button>
    <el-button type="info">默认按钮</el-button>
    <el-button type="info" round>默认按钮</el-button>
    <el-button type="info" icon="el-icon-edit" circle></el-button>
    <hr/>
    <el-input-number
        v-model="num"
        :min="1"
        :max="10"
        label="描述文字">
    </el-input-number>-->
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      num: 6
    }
  },
  methods : {},
  created() {
  }
}
</script>

<style lang="less">

</style>
