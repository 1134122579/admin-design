<template>
  <el-card style="margin: 20px">
    <div class="dashboard-container">
      <h3>系统设置：用于添加管理员和修改密码。</h3>
    </div>
  </el-card>
</template>

<script>
import { mapGetters } from "vuex";
// import adminDashboard from "./admin";
// import editorDashboard from "./editor";

export default {
  name: "Dashboard",
  // components: { adminDashboard, editorDashboard },
  data() {
    return {
      currentRole: "adminDashboard",
    };
  },
  computed: {
    ...mapGetters(["roles"]),
  },
  created() {
    if (!this.roles.includes("admin")) {
      this.currentRole = "editorDashboard";
    }
  },
};
</script>
