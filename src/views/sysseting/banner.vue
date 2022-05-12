<template>
  <div class="app-container">
    <!-- 搜索 -->
    <el-card>
      <el-form
        :inline="true"
        :model="listQuery"
        label-width="160px"
        class="demo-form-inline"
      >
        <el-form-item label="使用状态:">
          <el-radio-group
            v-model="listQuery.status"
            size="mini"
            @change="selectStatus()"
          >
            <!-- 状态：1 为 启用，2 停用 出库 3为 停用-->
            <el-radio-button label>全部</el-radio-button>
            <el-radio-button :label="1">启用</el-radio-button>
            <el-radio-button :label="2">停用</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <div>
          <el-form-item label="添加日期:">
            <el-date-picker
              v-model="listQuery.querydate"
              clearable
              size="mini"
              value-format="yyyy-MM-dd"
              unlink-panels
              type="daterange"
              class="filter-item"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>

          <el-form-item>
            
            <el-button
              v-waves
              size="mini"
              class="filter-item search"
              type="success"
              icon="el-icon-circle-plus"
              @click="handleAdd('add')"
              >添加轮播图</el-button
            >
            <el-button
              v-waves
              size="mini"
              class="filter-item search"
              type="primary"
              icon="el-icon-search"
              @click="handleFilter"
              >搜索</el-button
            >
          </el-form-item>
        </div>
      </el-form>
    </el-card>
    <!-- 列表 -->
    <el-card style="margin-top: 20px">
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column
          label="编号"
          align="center"
          fixed="left"
          min-width="60px"
        >
          <template slot-scope="{ row }">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="轮播图"
          align="center"
          :show-overflow-tooltip="true"
          min-width="160"
        >
          <template slot-scope="{ row }">
            <img class="logo" :src="row.img_url"/>
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          align="center"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="{ row }">
            <el-tag
              :type="row.status | typeFilter"
              effect="dark"
              @click="handleEditStatus(row.id, row.status)"
            >
              {{ row.status | statusFilter }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          :show-overflow-tooltip="true"
          align="center"
          min-width="120"
        >
          <template slot-scope="{ row }">
            <span>{{ row.create_time }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="100">
          <template slot-scope="{ row }">
            <el-button
              type="primary"
              size="mini"
              @click="handleAdd('edit', row)"
              >编辑</el-button
            >
            <el-button size="mini" type="danger" @click="handleDel(row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />
    <!-- 导入地点 -->
    <el-dialog
      :title="fromType == 'add' ? '添加地点' : '修改地点'"
      :visible.sync="dialogFormVisible"
      center
      top="5vh"
      width="35%"
    >
      <el-form :model="form" label-width="100px" ref="formName" :rules="rules">
        <el-form-item label="上传banner:" label-position="right">
          <el-upload
            class="avatar-uploader"
            :action="action"
            name="file"
            accept="image/*"
            :on-success="handleAvatarSuccess"
            :show-file-list="false"
          >
            <el-image class="avatar" :src="form.img_url" v-if="form.img_url" />
            <i class="el-icon-plus avatar-uploader-icon" v-else></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="状态:">
          <el-radio-group v-model="form.status">
            <!-- 状态：1 出租，2 自用 -->
            <el-radio-button :label="1">启用</el-radio-button>
            <el-radio-button :label="2">停用</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitProData()">立即提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getBannerList,addBanner,editBanner,editBannerStatus,delBanner} from "@/api/banner";
import waves from "@/directive/waves"; // waves directive 00
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
export default {
  name: "getBannerList",
  components: {
    Pagination,
  },
  directives: {
    waves,
  },
  filters: {
    // 状态：1 为入库，2 为 出库 3 为 停用
    statusFilter(status) {
      const statusMap = {
        1: "启用",
        2: "停用",
        3: "删除",
      };
      return statusMap[status];
    },
    // 状态颜色
    typeFilter(status) {
      const statusMap = {
        1: "success",
        2: "warning",
        3: "danger",
      };
      return statusMap[status];
    },
  },

  data() {
    return {
      rules: {
        title: [
          { required: true, message: "请输入地点名称", trigger: "change" },
        ],
        address: [{ required: true, message: "请输入地点", trigger: "change" }],
        // tump: [{ required: true, message: "请上传缩略图", trigger: "change" }],
        class_id: [
          { required: true, message: "请选择所属分类", trigger: "change" },
        ],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
        lng: [
          { required: true, message: "请输入地点经度lng", trigger: "change" },
        ],
        lat: [
          { required: true, message: "请输入地点纬度lat", trigger: "change" },
        ],
      },
      fromType: null,
      action: process.env.VUE_APP_BASE_API + "/upImage",
      tableKey: 0,
      list: null,
      total: 0,
      tableTotal: 0,
      date: "",
      listLoading: false,
      table: true,
      status: "全部",
      disabled: "false",
      fileList: [],
      listQuery: {
        page: 1,
        pageSize: 10,
        status: "",
        querydate: "",
      },
      form: {
        img_url: "",
        status: "",
        skip_url: "",
      }, //导入文件
      fileLoading: false, //文件上传loading
      submitType: "",
      dialogFormVisible: false,
      imageloading: false,
    };
  },
  watch: {
  },
  created() {
    this.getList();
  },
  methods: {
    // 上传到本地
    uploadChange(file, fileList) {
      this.form.file = file.raw;
    },
    // 上传前
    beforeAvatarUpload(file) {
      this.imageloading = true;
    },
    handleAvatarSuccess(res, file) {
      this.imageloading = false;
      this.form.img_url = res.data.imgUrl;
      // this.form.tumplook=res.data.imgUrl
    },
     //提交
    submitProData() {
      switch (this.fromType) {
        case 'add':
          addBanner(this.form).then(res => {
            this.$message({
              message: '提交成功',
              type: 'success'
            })
            this.getList()
            this.dialogFormVisible = false
          })
          break
        case 'edit':
          editBanner(this.form).then(res => {
            this.$message({
              message: '提交成功',
              type: 'success'
            })
            this.getList()
            this.dialogFormVisible = false
          })
          break
      }
      return
    },
    //弹出导入地点表单
    handleAdd(fromType, row) {
      this.fromType = fromType;
      switch (fromType) {
        case "add":
          // this.$refs["formName"].resetFields();
          break;
        case "edit":
          this.form = JSON.parse(JSON.stringify(row));
          break;
      }

      this.dialogFormVisible = true;
    },
    // 修改地点状态
    handleEditStatus(id, status) {
      this.$confirm("此操作将修改地点状态, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let pstatus = status == 1 ? 2 : 1;
          editBannerStatus({ id: id, status: pstatus }).then((response) => {
            this.getList();
            this.$message({
              type: "success",
              message: "操作成功!",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
    // 删除地点
    handleDel(id) {
      this.$confirm("此操作将删除地点, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delBanner({ id: id }).then((response) => {
            this.$message({
              type: "success",
              message: "操作成功!",
            });
            this.getList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
    // 筛选地点状态
    selectStatus() {
      this.getList();
    },
    // 筛选地点类型
    selectType() {
      this.getList();
    },
    // 获取地点列表
    getList() {
      this.listLoading = true;
      getBannerList(this.listQuery).then((response) => {
        this.listLoading = false;
        this.list = response.data.result;
        this.total = response.data.pageInfo.total;
      });
    },
    //筛选过滤
    handleFilter() {
      this.getList();
    },
  },
};
</script>
<style>
.demonstration {
  display: inline-block;
  margin: 0 10px;
  font-size: 12px;
  font-weight: 600;
  color: #606266;
}
.textinput {
  width: 60%;
}
.search {
  margin-left: 30px;
}
.list_time {
  width: 88px;
}
.sarch {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.logo {
  width: 100%;
  height: 120px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
