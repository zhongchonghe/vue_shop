<template>
  <div>
    <!-- 导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <el-button type="primary" @click="addCate">添加分类</el-button>

      <!--  <el-table :data="catelist" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="cat_name" label="分类名称"></el-table-column>
        <el-table-column prop="cat_level" label="是否有效"></el-table-column>
        <el-table-column label="排序">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'"
              >二级</el-tag
            >
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="editCate(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteCate(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table> -->

      <tree-table
        :selection-type="false"
        show-index
        index-text="#"
        border
        :expand-type="false"
        :data="catelist"
        :columns="columns"
        :show-row-hover="false"
      >
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag sizi="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            sizi="mini"
            type="success"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag sizi="mini" type="warning" v-else>三级</el-tag>
        </template>
        <template slot="opt" slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="editCate(scope.row.cat_id)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="deleteCate(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>

      <!-- 分页 -->

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addDialogVisible"
      width="30%"
      @close="addCateClose"
    >
      <el-form
        :model="addForm"
        :rules="addRules"
        ref="addFormRef"
        label-width="80px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- <el-input v-model="addForm.name"></el-input> -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChanged"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改分类" :visible.sync="editDialogVisible" width="30%">
      <el-form
        :model="editForm"
        ref="editFormRef"
        :rules="addRules"
        label-width="80px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      catelist: [],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 10,
      },
      parentCateList: [],
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      selectedKeys: [],
      addDialogVisible: false,
      editDialogVisible: false,
      addForm: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0,
      },
      editForm: {
        cat_name: '',
        cat_id: 0,
      },
      addRules: {
        cat_name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' },
        ],
      },
      total: 0,
      columns: [
        { label: '分类名称', prop: 'cat_name' },
        { label: '是否有效', type: 'template', template: 'isok' },
        { label: '排序', type: 'template', template: 'order' },
        { label: '操作', type: 'template', template: 'opt' },
      ],
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    addCateClose() {
      this.$refs.addFormRef.resetFields()
      this.selectedKeys = []
      this.addForm.cat_level = 0
      this.addForm.cat_pid = 0
    },
    parentCateChanged() {
      console.log(this.selectedKeys)
      if (this.selectedKeys.length > 0) {
        this.addForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addForm.cat_level = this.selectedKeys.length
        return
      } else {
        this.addForm.cat_level = 0
      }
    },

    async getParentCateList() {
      const { data: res } = await this.$axios.get('categories', {
        params: {
          type: 2,
        },
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败!')
      }
      this.parentCateList = res.data
    },
    async getCateList() {
      const { data: res } = await this.$axios.get('categories', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败! ')
      }
      this.catelist = res.data.result
      this.total = res.data.total
    },
    async editCate(id) {
      this.editDialogVisible = true
      const { data: res } = await this.$axios.get('categories/' + id)
      this.editForm.cat_name = res.data.cat_name
      this.editForm.cat_id = res.data.cat_id
    },
    editConfirm() {
      this.$refs.editFormRef.validate(async (valid) => {
        const { data: res } = await this.$axios.put(
          'categories/' + this.editForm.cat_id,
          {
            cat_name: this.editForm.cat_name,
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('更新失败!')
        }
        this.$message.success('更新成功!')
        this.getCateList()
        this.editDialogVisible = false
      })
    },
    async deleteCate(id) {
      const confirm = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (confirm !== 'confirm') {
        return this.$message.info('已取消删除!')
      }
      const { data: res } = await this.$axios.delete('categories/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败!')
      }
      this.$message.success('删除成功!')
      this.getCateList()
      /* .then(() => {
          this.$axios.delete('categories/' + id)
          this.$message({
            type: 'success',
            message: '删除成功!',
          })
          this.getCateList()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        }) */
    },
    addCate() {
      this.getParentCateList()
      this.addDialogVisible = true
    },
    addConfirm() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$axios.post('categories', this.addForm)
        console.log(res)

        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败!')
        }
        this.$message.success('添加成功! ')
        this.getCateList()
        this.addDialogVisible = false
      })
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
  },
}
</script>

<style lang="less" scoped>
.el-card,
.el-table,
.el-pagination {
  margin-top: 15px !important;
}
.el-cascader {
  width: 100%;
}
</style>