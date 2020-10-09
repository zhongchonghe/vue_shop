<template>
  <el-container>
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout" class="logout"
        >退出</el-button
      ></el-header
    >

    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="zhanshi">|||</div>
        <!-- 侧边栏菜单区域e -->
        <el-menu
          background-color="#313743"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in list" :key="item.id">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + value.path"
              v-for="value in item.children"
              :key="value.id"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ value.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      iconObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpingouwudai2',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao',
      },
      isCollapse: false,
    }
  },
  created() {
    this.getMenu()
  },
  methods: {
    async getMenu() {
      const { data } = await this.$axios.get('/menus')
      if (data.meta.status !== 200) return this.$message.error(data.meta.msg)
      this.list = data.data
    },
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    zhanshi() {
      this.isCollapse = !this.isCollapse
    },
  },
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
}
.el-header {
  background-color: #363d40;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #313743;
  .el-menu {
    border-right: none;
  }
  .toggle-button {
    height: 24px;
    background-color: #475162;
    text-align: center;
    letter-spacing: 1px;
    cursor: pointer;
    color: #fff;
  }
}
.el-main {
  background-color: #e9edf0;
}
.iconfont {
  margin-right: 10px;
}
</style> 