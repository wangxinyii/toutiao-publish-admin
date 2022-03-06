<template>
  <el-container class="layout-container">
    <el-aside
        class="aside"
        width="auto"
    >
      <app-aside
          class="aside-menu"
          :is-collapse = "isCollapse"
      />
    </el-aside>
    <el-container>
      <el-header class="header">
        <div>
        <i
            :class="{
          'el-icon-s-fold': !isCollapse,
          'el-icon-s-unfold': isCollapse
            }"
            @click="isCollapse = !isCollapse"
        />
          陕西理工大学
        </div>
        <el-dropdown>
<!--          <span class="el-dropdown-link">
            下拉菜单<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>
          </span>-->
          <div class="avatar-wrap">
            <img class="avatar" :src="user.photo" alt="">
            <span>{{ user.name  }}</span>
            <i
                class="el-icon-arrow-down el-icon&#45;&#45;right"
            />
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>个人设置</el-dropdown-item>
            <el-dropdown-item
            @click.native="onLogout"
            >退出账户</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-main class="main">
        <!-- 子路由出口 -->
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import appAside from './componment/aside'
import { getUserProfile } from "@/api/user";

export default {
  name: 'LayoutIndex',
  components: {
    appAside
  },
  props: {},
  data() {
    return {
      user: {}, // 当前用户信息
      isCollapse: false //侧边栏是否展开
    }
  },
  computed: {},
  watch: {},
  created() {
    this.loadUserProfile()
  },
  mounted() {},
  methods: {
    loadUserProfile() {
      getUserProfile().then(res => {
        this.user = res.data.data
      })
    },
    //退出账号
    onLogout() {
      this.$confirm('确认退出吗?', '退出提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //清除用户状态
        window.localStorage.removeItem('user')
        //跳转到登录页面
        this.$router.push('/login')
      }).catch(() => {})
    }
  }
}
</script>

<style scoped lang="less">
.layout-container {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}

.aside {
  background-color: #d3dce6;
  .aside-menu {
    height: 100%;
  }
}

.header {
  //background-color: #b3c0d1;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc ;
}

.main {
  background-color: #e9eef3;
}

.avatar-wrap {
  display: flex;
  align-items: center;
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 6px
  }
}


</style>