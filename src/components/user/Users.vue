<template>
  <div>
    <!-- 导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            placeholder="请输入搜索内容"
            v-model="page.query"
            clearable
            @clear="getList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addUser">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table border :data="list" stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="changeState(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="editUser(scope.row.id)"
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteUser(scope.row.id)"
            ></el-button>
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="setRole(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="page.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="40%">
      <el-form
        :model="addUserForm"
        :rules="addRules"d
        ref="addRuleForm"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUserConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑用户 -->

    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="40%"
    >
      <el-form
        :model="editUserForm"
        :rules="addRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editUserForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>le_name

<script>
export default {
  data() {
    //    验证邮箱规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }

      cb(new Error('请输入合法的邮箱'))
    }
    //  验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

      if (regMobile.test(value)) {
        return cb()
      }

      cb(new Error('请输入合法的手机号'))
    }
    return {
      page: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      list: [],
      total: 0,
      addDialogVisible: false,
      editDialogVisible: false,
      editUserForm: {},
      addUserForm: {},
      addRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur',
          },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      const { data: res } = await this.$axios.get('/users', {
        params: this.page,
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败! ')
      }
      //   console.log(res)
      this.list = res.data.users
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.page.pagesize = newSize
      this.getList()
    },
    handleCurrentChange(newPage) {
      this.page.pagenum = newPage
      this.getList()
    },
    addUser() {
      this.addDialogVisible = true
    },
    addUserConfirm() {
      this.$refs.addRuleForm.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$axios.post('/users', this.addUserForm)
        if (res.meta.status !== 201) return this.$message.error('用户添加失败!')
        this.$message.success(res.meta.msg)
        this.$refs.addRuleForm.resetFields()
        this.addDialogVisible = false
        this.getList()
      })
    },
    async editUser(id) {
      this.editDialogVisible = true
      const { data: res } = await this.$axios.get('/users/' + id)
      this.editUserForm = res.data
      console.log(this.editUserForm)
    },
    editUserConfirm() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$axios.put(
          '/users/' + this.editUserForm.id,
          {
            email: this.editUserForm.email,
            mobile: this.editUserForm.mobile,
          }
        )
        if (res.meta.status !== 200) return this.$message.error('更新失败!')
        this.$message.success(res.meta.msg)
        this.editDialogVisible = false
        this.getList()
      })
    },
    async deleteUser(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$axios.delete('/users/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除失败!')
      this.$message.success('删除成功!')
      this.getList()
    },
    setRole(value) {
      console.log(value)
    },
    changeState(val) {
      this.$axios.put('/users/' + val.id + '/state/' + val.mg_state)
    },
  },
}
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 15px;
}
.el-input {
  margin-bottom: 15px;
}
.el-pagination {
  margin-top: 15px;
}
</style>