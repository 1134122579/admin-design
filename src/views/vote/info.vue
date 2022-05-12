<template>
  <div class="app-container">
    <el-card style="margin: 0 auto; width: 3  0%">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        status-icon
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <!-- <el-form-item label="标题:" prop="title">
          <el-input v-model="ruleForm.title" style="width: 60%" />
        </el-form-item> -->
        <el-form-item label="关注数:" prop="gz_num">
          <el-input-number
            v-model="ruleForm.gz_num"
            :min="0"
            size="small"
            label="评论数"
          ></el-input-number>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >提交</el-button
          >
          <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { getInfo, setInfo } from "@/api/vote";
export default {
  data() {
    return {
      ruleForm: {
        gz_num: 1,
        title: "",
        user: "",
      },
      rules: {
        // title: [
        //   {
        //     required: true,
        //     message: "请输入标题",
        //     trigger: "blur",
        //   },
        // ],
        gz_num: [
          {
            required: true,
            message: "请输入数量",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    getInfo().then((res) => {
      console.log(res);
      this.ruleForm = res.data;
    });
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          setInfo(this.ruleForm).then((response) => {
            this.$notify({
              title: "Success",
              message: "修改成功",
              type: "success",
              duration: 6000,
            });
          });
        } else {
          // console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style scoped>
.line {
  text-align: center;
}
</style>
