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
        <el-form-item label="视频标题:">
          <el-input
            v-model="listQuery.name"
            placeholder="请输入输入标题"
            class="filter-item"
            clearable
            size="small"
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
        <el-form-item label="状态:">
          <el-radio-group
            v-model="listQuery.status"
            size="mini"
            @change="selectStatus"
          >
            <!-- 用户状态 1 进行中 2 已结束 -->
            <el-radio-button label>全部</el-radio-button>
            <el-radio-button label="1">已上架</el-radio-button>
            <el-radio-button label="2">已下架</el-radio-button>
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
            >添加视频</el-button
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
          label="视频标题"
          align="center"
          :show-overflow-tooltip="true"
          min-width="220px"
        >
          <template slot-scope="{ row }">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="视频" align="center" width="180px">
          <template slot-scope="{ row }">
            <!-- :preview-src-list="[row.cover]" -->
            <el-image
              style="width: 100%; height: 100px"
              :src="row.cover"
              fit="cover"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column
          label="评论数"
          align="center"
          :show-overflow-tooltip="true"
          width="120px"
          prop="pl_num"
          sortable
        />
        <el-table-column
          label="收藏数"
          align="center"
          :show-overflow-tooltip="true"
          width="120px"
          prop="collect_num"
          sortable
        />
        <el-table-column
          label="分享数"
          align="center"
          :show-overflow-tooltip="true"
          width="120px"
          prop="pv_num"
          sortable
        />
        <el-table-column
          label="点赞数"
          align="center"
          :show-overflow-tooltip="true"
          width="120px"
          prop="like_num"
          sortable
        />
        <el-table-column
          label="浏览数"
          align="center"
          :show-overflow-tooltip="true"
          width="120px"
          prop="rel_pv"
          sortable
        />
        <el-table-column label="查看/分享" align="center" min-width="140">
          <template slot-scope="{ row }">
            <el-popover placement="top" width="200" trigger="click">
              <vue-qr
                :text="
                  'http://api.skyorange.cn/wxvideo/searchvideodetaile?id=' +
                  row.id
                "
                :size="180"
              ></vue-qr>
              <el-button slot="reference" size="mini">扫码查看/分享</el-button>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          align="center"
          sortable
          prop="status"
          :show-overflow-tooltip="true"
        >
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
        <el-table-column
          label="置顶"
          align="center"
          sortable
          :show-overflow-tooltip="true"
          prop="is_top"
        >
          <!-- @click="handleEditStatus(row.id, row.is_top)" -->

          <template slot-scope="{ row }">
            <el-tag
              :type="row.is_top | typeFilter"
              size="small"
              effect="dark"
              >{{ row.is_top | topFilter }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="视频地址" width="120" align="center">
          <template slot-scope="{ row }">
            <el-tag
              size="small"
              effect="dark"
              v-clipboard:copy="row.video_url"
              v-clipboard:success="clipboardSuccess"
              >复制</el-tag
            >
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
      :title="is_edit ? '编辑视频' : '添加视频'"
      :visible.sync="dialogAddFormVisible"
      center
      top="5vh"
      width="35%"
    >
      <el-form :model="form" ref="fromdata" label-width="120px" :rules="rules">
        <el-form-item label="视频标题:" prop="name">
          <el-input
            v-model.trim="form.name"
            clearable
            placeholder="请输入视频标题"
          />
        </el-form-item>
        <el-form-item label="分享标题:" prop="share_title">
          <el-input
            v-model.trim="form.share_title"
            clearable
            placeholder="请输入视频分享标题（不填默认视频标题）"
          />
        </el-form-item>
        <el-form-item label="视频简介:" prop="desc">
          <el-input
            v-model="form.desc"
            clearable
            type="textarea"
            :rows="2"
            placeholder="请输入视频简介"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="上传视频:" prop="video_url">
          <el-upload
            :action="action"
            accept="video/*"
            v-loading="isvideoloading"
            :data="dataObj"
            :on-success="handleAvatarSuccess"
            :show-file-list="false"
            :before-upload="beforeUpload"
          >
            <!-- <el-image
              class="avatar"
              :src="form.video_url"
              v-if="form.video_url"
            /> -->

            <el-button slot="trigger" size="small" type="primary"
              >选择视频</el-button
            >
          </el-upload>
          <div v-if="dialogAddFormVisible">
            <video
              id="video"
              class="videostyle"
              controls="controls"
              :src="form.video_url"
              v-if="form.video_url"
              @canplay="getVidDur"
            />
          </div>
        </el-form-item>
        <el-form-item label="上传封面:" prop="cover">
          <el-upload
            class="avatar-uploader"
            :action="action"
            v-loading="iscoverloading"
            :data="dataObj"
            :show-file-list="false"
            :on-success="handleAvatarcoverSuccess"
            :before-upload="beforecoverUpload"
          >
            <img v-if="form.cover" :src="form.cover" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip" style="color: #e6a23c">
              可自定义上传封面，亦可拖拽视频进度条自动选取封面！
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="是否展示:" prop="status">
          <el-radio-group v-model="form.status" size="mini">
            <el-radio-button label="1">展示</el-radio-button>
            <el-radio-button label="2">不展示</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否置顶:" prop="is_top">
          <el-radio-group v-model="form.is_top" size="mini">
            <el-radio-button label="1">是</el-radio-button>
            <el-radio-button label="2">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <div v-if="is_edit">
          <el-form-item label="帧数:" prop="like_num">
            <el-input-number
              v-model="form.zhen_num"
              @change="numberchange"
              :min="0"
              size="small"
              label="帧数"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="点赞数:" prop="like_num">
            <el-input-number
              v-model="form.like_num"
              :min="0"
              size="small"
              label="点赞数"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="收藏数:" prop="collect_num">
            <el-input-number
              v-model="form.collect_num"
              :min="0"
              size="small"
              label="收藏数"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="分享数:" prop="pv_num">
            <el-input-number
              v-model="form.pv_num"
              :min="0"
              size="small"
              label="分享数"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="评论数:" prop="pl_num">
            <el-input-number
              v-model="form.pl_num"
              :min="0"
              size="small"
              label="评论数"
            ></el-input-number>
          </el-form-item>
        </div>
        <!-- <el-form-item label="视频简介:" prop="desc">
          <el-input v-model="form.desc" clearable placeholder="请输入简介" />
        </el-form-item> -->
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
import {
  getVideo,
  addVideo,
  editVideo,
  setVideoStatus,
  delVideo,
  getQiniuToken,
} from "@/api/video";
import vueQr from "vue-qr";

import waves from "@/directive/waves"; // waves directive 123
// import Tinymce from "@/components/Tinymce/index";
// import { parseTime } from "@/utils";
import clipboard from "@/directive/clipboard/index.js";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
export default {
  name: "getVideo",
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
        1: "已上架",
        2: "已下架",
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
        name: [
          {
            required: true,
            message: "请输入视频标题",
            trigger: "blur",
          },
        ],
        video_url: [
          {
            required: true,
            message: "请上传视频",
            trigger: "blur",
          },
        ],
        cover: [
          {
            required: true,
            message: "请上传视频封面",
            trigger: "change",
          },
        ],
        desc: [
          {
            required: true,
            message: "请输入视频简介",
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
        is_top: [
          {
            required: true,
            message: "是否置顶",
            trigger: "blur",
          },
        ],
      },
      // action: process.env.VUE_APP_BASE_API + "/upImage",
      action: "https://upload-z2.qiniup.com",
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
        name: "",
        status: "",
        querydate: "",
      },
      form: {
        name: "",
        video_url: "",
        desc: "",
        status: "1",
        is_top: "2",
        zhen_num: 1,
        cover: "",
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
      }
    },
  },
  created() {
    this.getList();
  },
  methods: {
    numberchange() {
      let that = this;
      that.$set(
        that.form,
        "cover",
        that.form.video_url + "?vframe/jpg/offset/" + that.form.zhen_num
      );
    },
    getVidDur(e) {
      // console.log(e);
      let that = this;
      //监听播放时间
      var video = document.getElementById("video");
      //使用事件监听方式捕捉事件
      video.addEventListener(
        "timeupdate",
        function () {
          var timeDisplay;
          var duration;
          //用秒数来显示当前播放进度
          timeDisplay = Math.floor(video.currentTime);
          duration = Math.floor(video.duration);
          that.$set(
            that.form,
            "cover",
            that.form.video_url + "?vframe/jpg/offset/" + timeDisplay
          );
          that.$set(that.form, "zhen_num", timeDisplay);
          console.log("总时长", duration);
          console.log("当前播放的时长", timeDisplay);
        },
        false
      );
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
    handleAvatarcoverSuccess(res, file) {
      console.log(res, file);
      this.iscoverloading = false;
      this.form.cover = this.baseUrl + res.key;
    },
    handleAvatarSuccess(res, file) {
      console.log(res, file);
      // this.form.name = file.name.split(".")[0];
      this.isvideoloading = false;
      this.imageloading = false;
      this.form.video_url = this.baseUrl + res.key;
    },
    //提交修改投票信息
    submitEditData() {
      editVideo(this.form).then((res) => {
        this.dialogFormVisible = false;
        this.$message({
          message: "操作成功",
          type: "success",
        });
        this.getList();
      });
    },
    submitAddData() {
      this.$refs["fromdata"].validate((valid) => {
        if (valid) {
          if (this.is_edit) {
            editVideo(this.form).then((res) => {
              this.dialogAddFormVisible = false;
              this.$message({
                message: "操作成功",
                type: "success",
              });
              this.getList();
            });
          } else {
            addVideo(this.form).then((res) => {
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
      this.dialogAddFormVisible = true;
    },
    //发起投票活动
    handleAdd(row) {
      let that = this;
      this.form = {
        name: "",
        video_url: "",
        desc: "",
        status: "1",
        is_top: "2",
        zhen_num: 1,
        share_title: "",
        cover: "",
      };
      this.dialogAddFormVisible = true;
      this.$nextTick(() => {
        that.$refs.fromdata.resetFields();
      });
    },
    selectStatus() {
      this.getList();
    },
    // 修改状态状态
    handleEditStatus(id, status) {
      this.$confirm("此操作将修改视频状态, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let pstatus = status == 1 ? 2 : 1;
          setVideoStatus({ id: id, status: pstatus }).then((response) => {
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
      this.$confirm("此操作将删除视频, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delVideo({ ...row }).then((response) => {
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
    // 获取地点列表
    getList() {
      this.listLoading = true;
      getVideo(this.listQuery).then((response) => {
        this.listLoading = false;
        let list = response.data.result;
        this.list = list.map((item) => {
          item["cover"] =
            item.video_url + "?vframe/jpg/offset/" + (item.zhen_num || 1);
          item["pv_num"] = item["pv_num"] || 0;
          item["like_num"] = item["like_num"] || 0;
          item["pl_num"] = item["pl_num"] || 0;

          return item;
        });
        this.total = response.data.pageInfo.total;
      });
    },
    clipboardSuccess() {
      this.$message({
        message: "复制成功",
        type: "success",
        duration: 1500,
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
.numstyle {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}
.videostyle {
  width: 300px;
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
}
</style>
