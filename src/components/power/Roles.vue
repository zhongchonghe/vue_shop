<template>
  <div>
    <!-- 导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <el-button type="primary" @click="addRoles">添加角色</el-button>

      <el-table :data="rolelist" stripe border>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['btm', 'vcenter', index1 === 0 ? 'btop' : '']"
              v-for="(item1, index1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag>{{ item1.authName }} </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级和三级权限 -->
              <el-col :span="19">
                <!-- 二级 -->
                <el-row
                  :class="['vcenter', index2 === 0 ? '' : 'btop']"
                  v-for="(item2, index2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag type="success">{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="(item3, i3) in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRight(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="editRole(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteRole(scope.row.id)"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色对话框 -->

    <el-dialog
      title="添加角色"
      :visible.sync="addRoledDalogVisible"
      width="30%"
    >
      <el-form
        :model="addRoleForm"
        :rules="addRoleRules"
        ref="addRoleFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoledDalogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoleCommit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色对话框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editRoledDalogVisible"
      width="30%"
    >
      <el-form
        :model="editRoleForm"
        :rules="addRoleRules"
        ref="editRoleFormRef"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoledDalogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleCommit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setDialogVisible"
      width="30%"
      @close="closeRole"
    >
      <el-tree
        :data="rightslist"
        :props="treeProps"
        show-checkbox
        default-expand-all
        node-key="id"
        :default-checked-keys="defKeys"
        ref="treeRef"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="alloRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
export default {
  data() {
    return {
      roleId: '',
      defKeys: [],
      rightslist: [],
      treeProps: {
        label: 'authName',
        children: 'children',
      },
      rolelist: [],
      addRoledDalogVisible: false,
      editRoledDalogVisible: false,
      setDialogVisible: false,
      addRoleForm: {
        roleName: '',
        roleDesc: '',
      },
      editRoleForm: {},
      addRoleRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$axios.get('/roles')
      console.log(res)
      this.rolelist = res.data
    },
    async removeRight(role, rightId) {
      console.log(role)
      const result = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (result !== 'confirm') {
        return this.$message.info('取消了删除! ')
      }
      const { data: res } = await this.$axios.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败! ')
      }
      role.children = res.data
    },
    /* 添加用户角色 */
    addRoles() {
      this.addRoledDalogVisible = true
    },
    addRoleCommit() {
      this.$refs.addRoleFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$axios.post('/roles', this.addRoleForm)
        if (res.meta.status !== 201)
          return this.$message.error('添加角色失败! ')
        this.$message.success('添加角色成功! ')
        this.addRoledDalogVisible = false
        this.getRolesList()
      })
    },
    async editRole(id) {
      this.editRoledDalogVisible = true
      const { data: res } = await this.$axios.get('roles/' + id)
      this.editRoleForm = res.data
    },
    editRoleCommit() {
      this.$refs.editRoleFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$axios.put(
          'roles/' + this.editRoleForm.roleId,
          {
            roleName: this.editRoleForm.roleName,
            roleDesc: this.editRoleForm.roleDesc,
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('更新角色失败! ')
        }
        this.$message.success('更新角色成功! ')
        this.editRoledDalogVisible = false
        this.getRolesList()
      })
    },
    async deleteRole(id) {
      const result = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (result !== 'confirm') {
        return this.$message.error('已取消删除!')
      }
      const { data: res } = await this.$axios.delete('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除失败!')
      this.$message.success('删除成功!')
      this.editRoledDalogVisible = false
      this.getRolesList()
    },
    async showSetRightDialog(val) {
      this.roleId = val.id

      this.setDialogVisible = true
      const { data: res } = await this.$axios.get('rights/tree')
      this.rightslist = res.data
      this.getLeaFKeys(val, this.defKeys)
    },
    getLeaFKeys(role, arr) {
      if (!role.children) {
        return arr.push(role.id)
      }
      role.children.forEach((element) => {
        this.getLeaFKeys(element, arr)
      })
    },
    closeRole() {
      this.defKeys = []
    },
    async alloRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ]
      const idStr = keys.join(',')
      const { data: res } = await this.$axios.post(
        `roles/${this.roleId}/rights`,
        {
          rids: idStr,
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('权限分配失败! ')
      }
      this.$message.success('权限分配成功! ')

      this.getRolesList()
      this.setDialogVisible = false
    },
  },
}
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 15px;
}
.el-table {
  margin-top: 15px;
}
.el-tag {
  margin: 5px;
}
.btop {
  border-top: 1px solid #eee;
}
.btm {
  border-top: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>