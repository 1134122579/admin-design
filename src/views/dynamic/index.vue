<template>
  <div class="app-container">
    <!-- 搜索 -->
    <el-card>
      <el-form
        :inline="true"
        :model="listQuery"
        label-width="100px"
        class="demo-form-inline"
      >
        <el-form-item label="动态标题:">
          <el-input
            v-model="listQuery.title"
            clearable
            size="mini"
            placeholder="请输入动态标题"
            style="width: 250px"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
        <el-form-item label="状态:">
          <el-radio-group
            v-model="listQuery.status"
            size="mini"
            @change="selectStatus()"
          >
            <!-- 状态：1 已审核 2 待审核  3 已下架 -->
            <el-radio-button label>全部</el-radio-button>
            <el-radio-button :label="1">已审核</el-radio-button>
            <el-radio-button :label="2">待审核</el-radio-button>
            <el-radio-button :label="3">已下架</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="动态类型:">
          <el-radio-group
            v-model="listQuery.type"
            size="mini"
            @change="selectType()"
          >
            <!-- 状态：1 已审核 2 待审核  3 已下架 -->
            <el-radio-button label>全部</el-radio-button>
            <el-radio-button :label="1">图文</el-radio-button>
            <el-radio-button :label="2">视频</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <div>
          <el-form-item label="发布日期:">
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
          label="动态封面"
          align="center"
          :show-overflow-tooltip="true"
          min-width="160"
        >
          <template slot-scope="{ row }">
            <el-image
              class="logo"
              v-if="row.type == 1"
              :src="row.link_url[0]"
              :preview-src-list="row.link_url"
            ></el-image>
            <el-image
              class="logo"
              v-if="row.type == 2"
              :src="row.video_urlfm"
              @click="lookvideo(row)"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column label="动态标题" align="center" min-width="160">
          <template slot-scope="{ row }">
            <span>{{ row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="内容描述" align="center" min-width="140">
          <template slot-scope="{ row }">
            <el-popover trigger="hover" placement="top">
              <p class="descpopoverlook">{{ row.desc }}</p>
              <span slot="reference" class="desclook">{{ row.desc }}</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          label="内容标签"
          align="center"
          :show-overflow-tooltip="true"
          min-width="100"
        >
          <template slot-scope="{ row }">
            <span>{{ row.label || "/" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="评论数"
          align="center"
          :show-overflow-tooltip="true"
          min-width="100px"
        >
          <template slot-scope="{ row }">
            <span>{{ row.pl_num }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="点赞数"
          align="center"
          :show-overflow-tooltip="true"
          min-width="100px"
        >
          <template slot-scope="{ row }">
            <span>{{ row.zan_num }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="收藏数"
          align="center"
          :show-overflow-tooltip="true"
          min-width="100px"
        >
          <template slot-scope="{ row }">
            <span>{{ row.sc_num }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="动态类型"
          align="center"
          :show-overflow-tooltip="true"
          min-width="100px"
        >
          <template slot-scope="{ row }">
            <span>{{ row.type == 1 ? "图文" : "视频" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" min-width="80">
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
          label="备注"
          align="center"
          :show-overflow-tooltip="true"
          min-width="160"
        >
          <template slot-scope="{ row }">
            <span>{{ row.remark }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="发布时间"
          :show-overflow-tooltip="true"
          align="center"
          min-width="100px"
        >
          <template slot-scope="{ row }">
            <span>{{ row.create_time }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="140">
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

    <el-dialog
      title="动态备注"
      :visible.sync="dialogFormVisible"
      center
      top="5vh"
      width="35%"
    >
      <el-form :model="form" label-width="100px" ref="formName" :rules="rules">
        <el-form-item label="动态标题:" prop="name">
          <span>{{ form.title }}</span>
        </el-form-item>
        <el-form-item label="动态备注:" label-position="right">
          <el-input
            type="textarea"
            :rows="4"
            v-model="form.remark"
            clearable
            size="mini"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitData()">立即提交</el-button>
      </div>
    </el-dialog>

    <!-- 查看视频 -->
    <el-dialog
      title="查看视频"
      :visible.sync="dialogFormlookvideoVisible"
      center
      top="5vh"
      width="35%"
    >
      <video :src="lookvideourl" autoplay controls width="100%"></video>
    </el-dialog>
  </div>
</template>
<script>
import {
  getDynamicList,
  editDynamicStatus,
  setDynamicRemark,
} from "@/api/dynamic.js";
import waves from "@/directive/waves"; //
import Tinymce from "@/components/Tinymce/index";
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
export default {
  name: "getDynamicListPage",
  components: {
    Pagination,
    Tinymce,
  },
  directives: {
    waves,
  },
  filters: {
    // 1 已审核 2 待审核  3 已下架
    statusFilter(status) {
      const statusMap = {
        1: "已审核",
        2: "待审核",
        3: "已下架",
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
      dialogFormlookvideoVisible: false,
      lookvideourl: "",
      rules: {
        title: [
          { required: true, message: "请输入动态名字", trigger: "change" },
        ],
        desc: [
          { required: true, message: "请输入动态简介", trigger: "change" },
        ],
        content: [
          { required: true, message: "请输入动态内容", trigger: "change" },
        ],
        cover: [{ required: true, message: "上传动态图片", trigger: "change" }],
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
      cover: "",
      ID: "",
      content: false,
      listQuery: {
        page: 1,
        pageSize: 10,
        type: "", //	1 动态介绍 2 企业动态
        title: "",
        userinfo: "",
        status: "", //	1 启用 2 停用
        querydate: "",
      },
      form: {
        type: 2, //	1 动态介绍 2 企业动态
        title: "",
        cover: "",
        desc: "",
        content: "",
      }, //导入文件
      fileLoading: false, //文件上传loading
      classOptions: [],
      multipleSelection: [],
      submitType: "",
      dialogFormVisible: false,
      dialogFormVisible: false,
      imageloading: false,
    };
  },
  watch: {
    dialogFormlookvideoVisible(nV, oV) {
      if (!nV) {
        this.lookvideourl = "";
      }
    },
    dialogFormVisible(nV, oV) {
      if (!nV) {
        this.ID = 0;
      }
    },
  },
  created() {
    console.log(123);
    this.getList();
  },
  methods: {
    //富文本编辑
    TinymceInput(value) {
      this.form.content = value;
    },
    // 上传到本地
    uploadChange(file, fileList) {
      this.form.file = file.raw;
    },
    //封面
    handleyunSuccess(res, file) {
      this.form.cover = res.data.baseImg;
      this.cover = res.data.imgUrl;
    },
    // 上传前
    beforeAvatarUpload(file) {
      this.imageloading = true;
    },
    handleAvatarSuccess(res, file) {
      this.imageloading = false;
      this.form.tump = res.data.baseImg;
      // this.form.tumplook=res.data.imgUrl
    },
    //提交订单备注
    submitData() {
      setDynamicRemark(this.form).then((res) => {
        this.$message({
          message: "提交成功",
          type: "success",
        });
        this.getList();
        this.dialogFormVisible = false;
      });
    },
    //弹出导入地点表单
    handleAdd(fromType, row) {
      this.fromType = fromType;
      switch (fromType) {
        case "add":
          // this.$refs["formName"].resetFields();
          // console.log(this.$refs["formName"]);
          this.form = {
            type: 2,
            id: "",
            title: "",
            cover: "",
            desc: "",
            content: "",
          };
          this.cover = "";

          break;
        case "edit":
          this.ID = JSON.parse(JSON.stringify(row)).id;
          this.cover = row.cover;
          this.form = JSON.parse(JSON.stringify(row));
          break;
      }
      this.dialogFormVisible = true;
    },
    // 修改地点状态
    handleEditStatus(id, status) {
      this.$confirm("此操作将审核动态状态, 是否继续?", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "审核通过",
        cancelButtonText: "审核拒绝",
        type: "warning",
      })
        .then(() => {
          editDynamicStatus({ id: id, status: 1 }).then((response) => {
            this.$message({
              type: "success",
              message: "操作成功!",
            });
            this.getList();
          });
        })
        .catch((action) => {
          if (action === "cancel") {
            editDynamicStatus({ id: id, status: 3 }).then((response) => {
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
    // 删除地点
    handleDel(id) {
      this.$confirm("此操作将删除地点, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delNewsApi({ id: id }).then((response) => {
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
    // 筛选类型
    selectType() {
      this.getList();
    },
    // 获取地点列表
    getList() {
      this.listLoading = true;
      console.log(2123);

      getDynamicList(this.listQuery).then((response) => {
        this.listLoading = false;
        let result = response.data.result;
        result = result.map((item) => {
          if (item.type == 2) {
            // item["link_url"] = item["link_url"].map(link_urlitem => {
            //   link_urlitem = link_urlitem + "?vframe/jpg/offset/1";
            //   return link_urlitem;
            // });
            item["video_urlfm"] = item["link_url"][0] + "?vframe/jpg/offset/1";
          }
          return item;
        });
        this.list = result;
        this.total = response.data.pageInfo.total;
      });
    },
    // 查看视频
    lookvideo(item) {
      this.lookvideourl = item["link_url"][0];
      this.dialogFormlookvideoVisible = true;
    },
    //筛选过滤
    handleFilter() {
      this.getList();
    },
  },
};
</script>
<style lang="scss">
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
.desclook {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
.descpopoverlook {
  max-width: 500px;
}
</style>
