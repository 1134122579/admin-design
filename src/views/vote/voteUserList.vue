<template>
  <div class="app-container">
    <!-- 搜索   -->
    <el-card>
      <el-form
        :inline="true"
        :model="listQuery"
        label-width="100px"
        class="demo-form-inline"
      >
        <el-form-item label="用户信息:">
          <el-input
            v-model="listQuery.userinfo"
            placeholder="请输入输入姓名、手机号"
            class="filter-item"
            clearable
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
        <el-form-item label="注册号:">
          <el-input
            v-model="listQuery.register_no"
            placeholder="请输入输入猫咪注册号"
            class="filter-item"
            clearable
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
        <el-form-item label="审核状态:">
          <el-radio-group
            v-model="listQuery.status"
            size="mini"
            @change="selectStatus"
          >
            <!-- 用户状态 1 进行中 2 已结束 -->
            <el-radio-button label>全部</el-radio-button>
            <el-radio-button label="1">已审核</el-radio-button>
            <el-radio-button label="2">待审核</el-radio-button>
            <el-radio-button label="3">已拒审</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="参赛时间:">
          <el-date-picker
            v-model="listQuery.querydate"
            clearable
            style="width: 250px"
            unlink-panels
            value-format="yyyy-MM-dd"
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
            type="primary"
            class="starh_button"
            @click="handleFilter"
            >搜索</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 列    表 -->
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
        <el-table-column label="编号" type="index" align="center" width="80">
        </el-table-column>
        <el-table-column label="头像" prop="headimgurl" align="center">
          <template slot-scope="{ row }">
            <el-avatar
              :src="row.headimgurl"
              shape="square"
              :size="40"
            ></el-avatar>
          </template>
        </el-table-column>
        <el-table-column label="用户昵称" align="center">
          <template slot-scope="{ row }">
            <el-popover
              placement="top"
              title="参赛者信息"
              width="250"
              trigger="hover"
            >
              <p>
                <span>昵称：{{ row.nickname }}</span>
              </p>
              <p>
                <span>姓名：{{ row.name }}</span>
              </p>
              <p>
                <span>联系方式：{{ row.mobile }}</span>
              </p>

              <span slot="reference">{{ row.nickname }}</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="猫咪信息" align="center">
          <template slot-scope="{ row }">
            <el-popover
              placement="top"
              title="猫咪信息"
              width="250"
              trigger="hover"
            >
              <p>
                <span>性别：{{ row.sex == 1 ? "公" : "母" }}</span>
              </p>
              <p>
                <span>描述：{{ row.desc }}</span>
              </p>
              <p>
                <span>注册号：{{ row.register_no }}</span>
              </p>
              <span style="color: #13ce66" slot="reference">{{
                row.cat_name
              }}</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="猫咪照片" align="center" min-width="140"
          >>
          <template slot-scope="{ row }">
            <el-image
              style="width: 160px; height: 100px"
              :src="row.img"
              :preview-src-list="[row.img]"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column label="猫咪昵称" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.cat_name == "" ? "/" : row.cat_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="活动主题" align="center" min-width="120">
          <template slot-scope="{ row }">
            <span>{{ row.vote_name == "" ? "/" : row.vote_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="投票数" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.ticket_num == "" ? "/" : row.ticket_num }}</span>
          </template>
        </el-table-column>

        <el-table-column label="状态" align="center">
          <template slot-scope="{ row }">
            <el-tag
              :type="row.status | typeFilter"
              effect="dark"
              @click="handleEditStatus(row.id, row.status)"
              >{{ row.status | statusFilter }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column
          label="参赛时间"
          align="center"
          sortable
          prop="create_time"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="{ row }">
            <span>{{ row.create_time }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="{ row }">
            <div class="we_flex we_column">
              <el-button
                type="primary"
                class="we_marginT we_marginL_"
                size="mini"
                @click="handleModify(row)"
                >编辑</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 导入地点 -->
    <el-dialog
      title="修改信息"
      :visible.sync="dialogFormVisible"
      center
      top="5vh"
      width="30%"
    >
      <el-form :model="form" label-width="100px" ref="formName" :rules="rules">
        <el-form-item label="用户昵称:" prop="name">
          <span>{{ form.nickname }}</span>
        </el-form-item>
        <el-form-item label="用户姓名:" prop="name">
          <span>{{ form.name == "" ? "暂无" : form.name }}</span>
        </el-form-item>
        <el-form-item label="联系方式:" prop="name">
          <span>{{ form.mobile == "" ? "暂无" : form.mobile }}</span>
        </el-form-item>
        <el-form-item label="投票总数:" label-position="right">
          <el-input-number
            v-model="form.ticket_num"
            clearable
            controls-position="right"
            size="mini"
            placeholder="请输入票数"
            :min="1"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitData()">立即提交</el-button>
      </div>
    </el-dialog>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />
  </div>
</template>
<script>
import { getVoteUserList, setUserVote, setVoteStatus } from "@/api/vote";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
export default {
  name: "VoteUserList",
  components: {
    Pagination,
  },
  directives: {
    waves,
  },
  filters: {
    // 状态过滤   <!-- 用户状态 1 启用 2 冻结 3 注销 -->
    statusFilter(status) {
      const statusMap = {
        1: "已审核",
        2: "待审核",
        3: "已拒审",
      };
      return statusMap[status];
    },
    // 性别过滤 1 男 2 女 3 未知
    sexFilter(status) {
      const statusMap = {
        1: "男",
        2: "女",
        0: "未知",
      };
      return statusMap[status];
    },
    // 状态类型过滤
    typeFilter(status) {
      const statusMap = {
        1: "success",
        2: "warning",
        3: "danger ",
      };
      return statusMap[status];
    },
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      form: {},
      total: 0,
      status: "全部",
      listLoading: true,
      disabled: "false",
      type: "",
      downloadLoading: false,
      filename: "",
      listQuery: {
        page: 1,
        pageSize: 10,
        register_no: "",
        status: "",
        userinfo: "",
        querydate: "",
      },
      // 图片查看器变量
      showViewer: false,
      showReviewer: false,
      selectLoading: false,
      dialogFormVisible: false,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 清空
    handleNull() {
      (this.listQuery = {
        page: 1,
        pageSize: 10,
        userinfo: "",
        status: "",
        querydate: "",
      }),
        this.getList();
    },
    radioButtton(value, text) {
      this.getList();
    },
    onPreview: function () {
      this.showViewer = true;
    },
    // 提交信息
    submitData() {
      setUserVote(this.form).then((response) => {
        this.dialogFormVisible = false;
        this.$notify({
          title: "Success",
          message: "添加成功",
          type: "success",
          duration: 2000,
        });
        this.getList();
        return;
      });
    },

    // 获取列表
    getList() {
      this.listLoading = true;
      getVoteUserList(this.listQuery).then((response) => {
        this.listLoading = false;
        this.list = response.data.result;
        this.total = response.data.pageInfo.total;
      });
    },
    // 修改参赛状态
    handleEditStatus(id, status) {
      this.$confirm("此操作将审核参与投票状态, 是否继续?", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "审核通过",
        cancelButtonText: "审核拒绝",
        type: "warning",
      })
        .then(() => {
          if (status == 1) {
            this.$message({
              type: "success",
              message: "已审核成功!",
            });
            return;
          }
          setVoteStatus({ id: id, status: 1 }).then((response) => {
            this.getList();
            this.$message({
              type: "success",
              message: "操作成功!",
            });
          });
        })
        .catch((action) => {
          if (action === "cancel") {
            setVoteStatus({ id: id, status: 3 }).then((response) => {
              this.$message({
                type: "success",
                message: "操作成功!",
              });
              this.getList();
            });
          } else {
            this.$message({
              type: "info",
              message: "取消操作",
            });
          }
        });
    },
    // 搜索
    handleFilter() {
      this.getList();
    },
    //
    handleModify(row) {
      this.form = JSON.parse(JSON.stringify(row));
      this.dialogFormVisible = true;
    },
    selectStatus() {
      this.getList();
    },
    // 审核任务
    handleUpdate(row) {
      this.$notify({
        title: "Success",
        message: "操作成功",
        type: "success",
        duration: 2000,
      });
    },
  },
};
</script>
<style scoped>
.row_flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.demonstration {
  display: inline-block;
  margin: 0 10px;
  font-size: 12px;
  font-weight: 600;
  color: #606266;
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
.filter-item {
  width: 200px;
}
.starh_button {
  margin-left: 20px;
}
</style>
