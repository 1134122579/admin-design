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
        <el-form-item label="文章标题:">
          <el-input
            v-model="listQuery.title"
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
            >添加文章</el-button
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
          label="文章标题"
          align="center"
          :show-overflow-tooltip="true"
          min-width="220px"
        >
          <template slot-scope="{ row }">
            <span>{{ row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="作者"
          align="center"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="{ row }">
            <span>{{ row.author }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="点赞数"
          align="center"
          :show-overflow-tooltip="true"
          width="120px"
          prop="zan_num"
          sortable
        />
        <el-table-column
          label="在看数"
          align="center"
          :show-overflow-tooltip="true"
          width="120px"
          prop="zk_num"
          sortable
        />
        <el-table-column
          label="浏览数"
          align="center"
          :show-overflow-tooltip="true"
          width="120px"
          prop="pv_num"
          sortable
        />
        <el-table-column
          label="真实浏览数"
          align="center"
          :show-overflow-tooltip="true"
          width="120px"
          prop="rel_pv"
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
                :text="'http://api.skyorange.cn/mpqq/?id=' + row.id"
                :size="200"
              ></vue-qr>
              <el-button slot="reference" size="mini">扫码分享</el-button>
            </el-popover>
            <!-- <el-tag size="small" effect="dark" @click="handlenewherf(row.id)"
              >预览</el-tag
            > -->
          </template>
        </el-table-column>
        <el-table-column label="复制" width="120" align="center">
          <template slot-scope="{ row }">
            <el-tag
              size="small"
              effect="dark"
              v-clipboard:copy="
                'http://api.skyorange.cn/mpqq/pre.html?id=' + row.id
              "
              v-clipboard:success="clipboardSuccess"
              >复制（查看）</el-tag
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
      :title="is_edit ? '编辑文章' : '添加文章'"
      :visible.sync="dialogAddFormVisible"
      center
      top="5vh"
      width="40%"
    >
      <el-form :model="form" ref="fromdata" label-width="120px" :rules="rules">
        <el-form-item label="文章标题:" prop="title">
          <el-input
            v-model="form.title"
            clearable
            placeholder="请输入文章标题"
          />
        </el-form-item>

        <el-form-item label="作者:" prop="author">
          <el-input
            v-model="form.author"
            clearable
            placeholder="请输入展示作者"
          />
        </el-form-item>
        <el-form-item label="阅读原文:" prop="url">
          <el-input
            v-model="form.url"
            clearable
            placeholder="请输入阅读原文地址"
          />
        </el-form-item>
        <el-form-item label="文章简述:" prop="desc">
          <el-input
            v-model="form.desc"
            clearable
            type="textarea"
            :rows="2"
            placeholder="请输入文章简述"
          />
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
              请上传分享文章封面！
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="是否展示:" prop="status">
          <el-radio-group v-model="form.status" size="mini">
            <el-radio-button label="1">展示</el-radio-button>
            <el-radio-button label="2">不展示</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="视频展示:" prop="is_video">
          <el-radio-group v-model="form.is_video" size="mini">
            <el-radio-button label="1">展示</el-radio-button>
            <el-radio-button label="2">不展示</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.is_video == 1" label="视频:" prop="video_url">
          <el-select v-model="form.video_url" filterable placeholder="请选择">
            <el-option
              v-for="(item, index) in video_urlLsit"
              :key="index"
              :label="item.name"
              :value="item.video_url"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item
          v-if="form.is_video == 1"
          label="视频链接:"
          prop="video_url"
        >
          <el-input
            v-model.trim="form.video_url"
            clearable
            placeholder="请到视频列表复制视频链接"
          />
        </el-form-item> -->

        <el-form-item label="点赞数:" prop="zan_num">
          <el-input-number
            controls-position="right"
            v-model="form.zan_num"
            :min="0"
            size="small"
            label="点赞数"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="浏览数:" prop="pv_num">
          <el-input-number
            controls-position="right"
            v-model="form.pv_num"
            :min="0"
            size="small"
            label="浏览数"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="在看数:" prop="zk_num">
          <el-input-number
            v-model="form.zk_num"
            :min="0"
            size="small"
            label="在看数"
            controls-position="right"
          ></el-input-number>
        </el-form-item>
        <!-- 可以添加多个广告 -->
        <el-form-item label="底部广告:" prop="advert_ids">
          <ul class="adverlist">
            <li
              v-for="(item, index) in adverlist"
              :key="index"
              :class="form.advert_ids.includes(item.id) && 'adver-sel'"
              @click="adverClick(item.id)"
            >
              <el-popover placement="top" trigger="hover" :content="item.title">
                <div slot="reference">
                  <img :src="item.cover" />
                  <div class="adcver-title">{{ item.title }}</div>
                </div>
              </el-popover>
              <!-- <img :src="item.cover" />

              <div class="adcver-title">{{ item.title }}</div> -->
            </li>
          </ul>
        </el-form-item>
        <el-form-item label="所属话题:" prop="lable">
          <el-checkbox-group v-model="form.lable">
            <el-checkbox
              :label="item"
              v-for="(item, index) in typelist"
              :key="index"
              :disabled="item == '#天空之橙·DESIGN'"
            ></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="文章内容:" prop="content">
          <el-input
            v-model="form.content"
            clearable
            type="textarea"
            :rows="6"
            placeholder=" 请输入文章内容（HTML）代码"
            show-word-limit
          />
        </el-form-item>
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
  getArticle,
  addArticle,
  editArticle,
  setArticleStatus,
  delArticle,
  getQiniuToken,
  getAdvertSelect,
  getVideoList,
} from "@/api/article";
import vueQr from "vue-qr";
import clipboard from "@/directive/clipboard/index.js";
import waves from "@/directive/waves"; // waves directive 123
// import Tinymce from "@/components/Tinymce/index";
// import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
export default {
  name: "getArticle",
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
      video_urlLsit: [],
      typelist: [
        "#天空之橙·DESIGN",
        "#空间设计",
        "#建筑设计",
        "#景观设计",
        "#空间运营",
      ],
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
            message: "请输入文章标题",
            trigger: "blur",
          },
        ],
        video_url: [
          {
            required: true,
            message: "请选择视频",
            trigger: "blur",
          },
        ],
        cover: [
          {
            required: true,
            message: "请上传文章封面",
            trigger: "blur",
          },
        ],
        desc: [
          {
            required: true,
            message: "请输入文章简介",
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
        author: [
          {
            required: true,
            message: "请输入原创",
            trigger: "blur",
          },
        ],
        content: [
          {
            required: true,
            message: "请输入文章内容",
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
        title: "",
        status: "",
        querydate: "",
      },
      adverlist: [],
      form: {
        zk_num: 0,
        title: "",
        content: "",
        advert_ids: [],
        desc: "",
        lable: ["#天空之橙·DESIGN"],
        status: 1,
        is_video: 1,
        video_url: "",
        author: "天空之橙·DESIGN",
        url: "https://mp.weixin.qq.com/s?__biz=MzA4NTA2OTAyNA==&mid=2648921976&idx=1&sn=1046ee7de13e1b4a75518dd54ae2e73c&chksm=87ca6af7b0bde3e1ace804d99124a01a840911663d2406cbc3c8f092f1fe7a8829cca3773f64#rd",
        cover: "",
        share_title: "",
        zan_num: 1,
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
    this.getAdvertSelect();
    this.getVideoList();
  },
  methods: {
    video_urlchange(data) {
      console.log(data);
      this.form.video_url = data;
    },
    adverClick(id) {
      if (this.form.advert_ids.includes(id)) {
        this.form.advert_ids = this.form.advert_ids.filter(
          (item) => item != id
        );
      } else {
        this.form.advert_ids.push(id);
      }
    },
    getAdvertSelect() {
      getAdvertSelect().then((response) => {
        this.adverlist = response.data;
      });
    },
    getVideoList() {
      getVideoList().then((res) => {
        this.video_urlLsit = res.data;
      });
    },
    handlenewherf(id) {
      window.open("http://api.skyorange.cn/mpqq?id=" + id);
    },
    // numberchange() {
    //   let that = this;
    //   that.$set(
    //     that.form,
    //     "cover",
    //     that.form.video_url + "?vframe/jpg/offset/" + that.form.zhen_num
    //   );
    // },
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
      editArticle(this.form).then((res) => {
        this.dialogFormVisible = false;
        this.$message({
          message: "操作成功",
          type: "success",
        });
        this.getList();
      });
    },
    submitAddData() {
      console.log(this.form, "this.form");
      this.$refs["fromdata"].validate((valid) => {
        if (valid) {
          if (this.is_edit) {
            editArticle(this.form).then((res) => {
              this.dialogAddFormVisible = false;
              this.$message({
                message: "操作成功",
                type: "success",
              });
              this.getList();
            });
          } else {
            addArticle(this.form).then((res) => {
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
      this.form.video_url = this.form.video_url || "";
      this.form.advert_ids =
        this.form.advert_ids.length > 0
          ? this.form.advert_ids.map((item) => Number(item))
          : [];
      this.form.lable =
        this.form.lable.length > 0 ? this.form.lable.map((item) => item) : [];
      console.log(this.form);
      this.dialogAddFormVisible = true;
    },
    //发起投票活动
    handleAdd() {
      this.ID = 0;
      this.form = {
        title: "",
        cover: "",
        content: "",
        desc: "",
        status: "1",
        pv_num: "2",
        zan_num: 1,
        zk_num: 0,
        lable: ["#天空之橙·DESIGN"],
        advert_ids: [],
        is_video: 1,
        video_url: "",
        author: "天空之橙·DESIGN",
        url: "https://mp.weixin.qq.com/s?__biz=MzA4NTA2OTAyNA==&mid=2648921976&idx=1&sn=1046ee7de13e1b4a75518dd54ae2e73c&chksm=87ca6af7b0bde3e1ace804d99124a01a840911663d2406cbc3c8f092f1fe7a8829cca3773f64#rd",
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
      this.$confirm("此操作将修改文章状态, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let pstatus = status == 1 ? 2 : 1;
          setArticleStatus({ id: id, status: pstatus }).then((response) => {
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
      this.$confirm("此操作将删除文章, 是否继续?", "提示", {
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
    // 获取地点列表
    getList() {
      this.listLoading = true;
      getArticle(this.listQuery).then((response) => {
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
