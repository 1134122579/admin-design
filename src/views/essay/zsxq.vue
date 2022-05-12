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
            placeholder="请输入输入标题"
            class="filter-item"
            clearable
            size="small"
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
        <el-form-item label="是否展示:">
          <el-radio-group
            v-model="listQuery.status"
            size="mini"
            @change="selectStatus"
          >
            <!-- 用户状态 1 进行中 2 已结束 -->
            <el-radio-button label>全部</el-radio-button>
            <el-radio-button label="1">展示</el-radio-button>
            <el-radio-button label="2">隐藏</el-radio-button>
          </el-radio-group>
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
          <el-button
            v-waves
            size="mini"
            type="success"
            class="starh_button"
            @click="handleAdd"
            >添加动态</el-button
          >
          <el-button
            v-waves
            size="mini"
            type="primary"
            class="starh_button"
            @click="handlestate"
            >刷新</el-button
          >
        </el-form-item>
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
        <el-table-column label="编号" type="index" align="center" width="80">
        </el-table-column>
        <el-table-column
          label="动态标题"
          align="center"
          :show-overflow-tooltip="true"
          min-width="220px"
        >
          <template slot-scope="{ row }">
            <span>{{ row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="图片" align="center" min-width="220px">
          <template slot-scope="{ row }">
            <el-image
              style="width: 200px; height: 100px"
              :src="row.imgs[0]"
              :preview-src-list="row.imgs"
              fit="cover"
            >
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="所属标签" align="center">
          <template slot-scope="{ row }">
            <el-tag :type="row.label | typeFilter" size="small" effect="dark">{{
              row.label | labelFilter
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="真实浏览数"
          align="center"
          :show-overflow-tooltip="true"
          width="120px"
          prop="pv_num"
          sortable
        />
        <el-table-column label="状态" align="center">
          <template slot-scope="{ row }">
            <el-tag
              :type="row.status | typeFilter"
              size="small"
              effect="dark"
              @click="handleEditStatus(row.id, row.status)"
              >{{ row.status | statusFilter }}</el-tag
            >
          </template>
        </el-table-column>

        <el-table-column label="分享" align="center" width="120">
          <template slot-scope="{ row }">
            <el-popover placement="top" width="200" trigger="click">
              <vue-qr
                :text="'http://api.skyorange.cn/starh5/?id=' + row.id"
                :size="180"
              ></vue-qr>
              <el-button slot="reference" size="mini">扫码分享</el-button>
            </el-popover>
            <!-- <el-tag size="small" effect="dark" @click="handlenewherf(row.id)"
              >预览</el-tag
            > -->
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          :show-overflow-tooltip="true"
          align="center"
          min-width="100px"
        >
          <template slot-scope="{ row }">
            <span>{{ row.create_time }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          min-width="150"
          fixed="right"
        >
          <template slot-scope="{ row }">
            <el-button type="primary" size="mini" @click="handleEdit(row)"
              >编辑</el-button
            >
            <el-button type="danger" size="mini" @click="handleDel(row)"
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
    <!-- 修改活动相关 -->
    <el-dialog
      :title="is_edit ? '编辑动态' : '添加动态'"
      :visible.sync="dialogAddFormVisible"
      center
      top="2vh"
      width="50%"
    >
      <el-form
        :model="form"
        ref="fromdata"
        label-width="120px"
        :rules="rules"
        size="mini"
      >
        <div>
          <el-form-item label="动态标题:" prop="title">
            <el-input
              type="textarea"
              rows="4"
              v-model="form.title"
              clearable
              placeholder="请输入动态标题标题"
            />
          </el-form-item>
          <el-form-item label="分享标题:" prop="share_title">
            <el-input
              type="textarea"
              rows="4"
              v-model="form.share_title"
              clearable
              placeholder="请输入分享标题"
            />
          </el-form-item>
          <el-form-item label="分享简介:" prop="desc">
            <el-input
              type="textarea"
              rows="4"
              v-model="form.desc"
              clearable
              placeholder="请输入分享简介"
            />
          </el-form-item>
        </div>

        <el-form-item label="是否展示:" prop="status">
          <el-radio-group v-model="form.status" size="mini">
            <el-radio-button label="1">展示</el-radio-button>
            <el-radio-button label="2">不展示</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="所属标签:" prop="label">
          <!-- "精华", "建筑", "景观", "空间", "打卡" -->
          <el-radio-group v-model="form.label" size="mini">
            <el-radio-button label="1">精华</el-radio-button>
            <el-radio-button label="2">建筑</el-radio-button>
            <el-radio-button label="3">景观</el-radio-button>
            <el-radio-button label="4">空间</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <div>
          <el-form-item label="上传图集:" prop="imgs">
            <el-upload
              :action="action"
              name="file"
              accept="image/*"
              multiple
              :limit="9"
              :on-exceed="onexceed"
              :on-success="handleAvatarSuccess"
              :file-list="form.imgs"
              :on-remove="handleRemove"
              :on-change="onchange"
              list-type="picture-card"
            >
              <i class="el-icon-plus"></i>
              <div slot="tip" class="el-upload__tip" style="color: #ffba00">
                一次性最多上传9张图片
              </div>
            </el-upload>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddData()">
          {{ is_edit ? "立即修改" : "立即提交" }}</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getPyq, addPyq, editPyq, setPyqStatus } from "@/api/zsxq";
import vueQr from "vue-qr";
import clipboard from "@/directive/clipboard/index.js";
import waves from "@/directive/waves"; // waves directive 123
// import Tinymce from "@/components/Tinymce/index";
// import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
export default {
  name: "getPyq",
  components: {
    Pagination,
    vueQr,
  },
  directives: {
    waves,
    clipboard,
  },
  filters: {
    // 状态： 1 自动，2 手动
    statusFilter(status) {
      const statusMap = {
        1: "展示",
        2: "隐藏",
      };
      return statusMap[status];
    },
    // 状态： 1 自动，2 手动
    labelFilter(status) {
      const statusMap = {
        1: "精华",
        2: "建筑",
        3: "景观",
        4: "空间",
      };
      return statusMap[status];
    },
    // 状态： 1 自动，2 手动
    topFilter(status) {
      const statusMap = {
        1: "已置顶",
        2: "未置顶",
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
      video_urlLsit: [],
      typelist: ["精华", "建筑", "景观", "空间", "打卡"],
      autosize: { minRows: 10, maxRows: 30 },
      iscoverloading: false,
      isvideoloading: false,
      dataObj: {
        token: "",
        key: "",
        domain: "designvideo",
        config: {
          useCdnDomain: true,
        },
      },
      baseUrl: "",
      rules: {
        title: [
          {
            required: true,
            message: "请输入动态标题",
            trigger: "change",
          },
        ],
        share_title: [
          {
            required: true,
            message: "请输入动态标题",
            trigger: "change",
          },
        ],
        imgs: [
          {
            required: true,
            message: "请上传动态封面",
            trigger: "blur",
          },
        ],

        status: [
          {
            required: true,
            message: "是否展示",
            trigger: "blur",
          },
        ],
      },
      action: process.env.VUE_APP_BASE_API + "/upImage",
      tableKey: 0,
      list: null,
      total: 0,
      is_edit: false,
      listLoading: false,
      table: true,
      status: "全部",
      disabled: "false",
      listQuery: {
        page: 1,
        pageSize: 10,
        title: "",
        status: "",
        querydate: "",
        desc: "",
        share_title: "",
      },
      adverlist: [],
      fileList: [],
      form: {
        title: "",
        label: 1,
        status: 1,
        imgs: [],
      }, //导入文件
      dialogFormVisible: false,
      dialogAddFormVisible: false,
      imageloading: false,
    };
  },
  watch: {
    dialogAddFormVisible(newV, onlv) {
      if (!newV) {
        this.is_edit = false;
        this.form = {};
      }
    },
  },
  created() {
    this.getList();
  },
  methods: {
    onexceed(files, fileList) {
      this.$message({
        message: "一次性最多上传9张图片",
        type: "warning",
      });
    },
    handlenewherf(id) {
      window.open("http://api.skyorange.cn/mpqq?id=" + id);
    },
    // 上传前
    beforeUpload(file) {
      const _self = this;
      this.isvideoloading = true;
      return new Promise((resolve, reject) => {
        getQiniuToken()
          .then((response) => {
            console.log(response);
            this.baseUrl = response.data.baseUrl;
            const token = response.data.upToken;
            _self._data.dataObj.token = token;
            _self._data.dataObj.key = new Date().getTime() + file.name;
            resolve(true);
          })
          .catch((err) => {
            console.log(err);
            reject(false);
            _self.isvideoloading = false;
          });
      });
    },
    beforecoverUpload(file) {
      const _self = this;
      this.iscoverloading = true;
      return new Promise((resolve, reject) => {
        getQiniuToken()
          .then((response) => {
            console.log(response);
            this.baseUrl = response.data.baseUrl;
            const token = response.data.upToken;
            _self._data.dataObj.token = token;
            _self._data.dataObj.key = new Date().getTime() + "" + Math.random();
            resolve(true);
          })
          .catch((err) => {
            console.log(err);
            reject(false);
            _self.iscoverloading = false;
          });
      });
    },
    //富文本编辑
    TinymceInput(value) {
      this.form.rule = value;
    },
    // 上传前
    beforeAvatarUpload(file) {
      this.imageloading = true;
    },
    // 上传成功
    handleAvatarSuccess(response, file, fileList) {
      this.form.imgs = fileList.map((item) => {
        item["url"] = item?.response?.data?.imgUrl || item["url"];
        return item;
      });
      console.log(this.form.imgs);
    },
    handleAvatarcoverSuccess(res, file) {
      console.log(res, file);
      this.form.imgs = this.baseUrl + res.key;
    },
    // handleAvatarSuccess(res, file) {
    //   console.log(res, file);
    //   // this.form.name = file.name.split(".")[0];
    //   this.isvideoloading = false;
    //   this.imageloading = false;
    //   this.form.video_url = this.baseUrl + res.key;
    // },
    //提交修改投票信息
    submitEditData() {
      editPyq(this.form).then((res) => {
        this.dialogFormVisible = false;
        this.$message({
          message: "操作成功",
          type: "success",
        });
        this.getList();
      });
    },
    // 修改信息
    submitAddData() {
      console.log(this.form, "this.form");
      this.form.imgs = this.form.imgs.map((item) => {
        return item.url;
      });
      this.$refs["fromdata"].validate((valid) => {
        if (valid) {
          if (this.is_edit) {
            editPyq(this.form).then((res) => {
              this.dialogAddFormVisible = false;
              this.$message({
                message: "操作成功",
                type: "success",
              });
              this.getList();
            });
          } else {
            addPyq(this.form).then((res) => {
              this.dialogAddFormVisible = false;
              this.$message({
                message: "操作成功",
                type: "success",
              });
              this.getList();
            });
          }
        }
      });
    },

    //修改会员信息
    handleEdit(row) {
      this.is_edit = true;
      this.form = JSON.parse(JSON.stringify(row));
      this.form.imgs = this.form.imgs.map((item) => {
        return {
          url: item,
        };
      });
      this.dialogAddFormVisible = true;
    },
    //发起投票活动
    handleAdd() {
      this.ID = 0;
      this.form = {
        title: "",
        status: "1",
        label: 1,
        imgs: [],
        desc: "",
        share_title: "",
      };
      this.dialogAddFormVisible = true;
    },
    selectStatus() {
      this.getList();
    },
    clipboardSuccess() {
      this.$message({
        message: "复制成功,请手机微信打开",
        type: "success",
        duration: 1500,
      });
    },
    // 修改状态状态
    handleEditStatus(id, status) {
      this.$confirm("此操作将修改动态状态, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let pstatus = status == 1 ? 2 : 1;
          setPyqStatus({ id: id, status: pstatus }).then((response) => {
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
    //删除活动
    handleDel(row) {
      this.$confirm("此操作将删除动态, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delArticle({ ...row }).then((response) => {
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
    // 筛选项目
    selectProject(e) {
      this.form.projectId = e.project_id;
      this.form.project_name = e.project_name;
      this.getTempOption();
      this.getGroupOption();
    },
    onchange(file, fileList) {
      console.log(file, fileList);
      //   this.fileList = fileList;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.form.imgs = fileList;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 获取地点列表
    getList() {
      this.listLoading = true;
      getPyq(this.listQuery).then((response) => {
        this.listLoading = false;
        let list = response.data.result;
        this.list = list.map((item) => {
          return item;
        });
        this.total = response.data.pageInfo.total;
      });
    },
    handlestate() {
      this.listQuery.title = this.listQuery.title || "";
      this.getList();
    },
    //筛选过滤
    handleFilter() {
      this.getList();
    },
  },
};
</script>
<style>
.numstyle {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}
.videostyle {
  width: 320px;
  height: 176px;
}
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
  width: 80px;
  height: 80px;
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
  width: 278px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 278px;
  height: 178px;
  display: block;
  object-fit: cover;
}
</style>

<style lang="scss">
// 广告列
.adverlist {
  width: 100%;
  display: flex;
  padding-left: 0px;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  box-sizing: border-box;

  li {
    margin-bottom: 5px;
    width: 30%;
    margin-right: 10px;
    background: #ccc;
    box-sizing: border-box;
    padding: 6px;
    overflow: hidden;
    cursor: pointer;
    .adcver-title {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 30px;
    }
    img {
      width: 100%;
      height: 80px;
      display: block;
      object-fit: cover;
    }
  }
  .adver-sel {
    background: #13ce66;
  }
}
</style>
