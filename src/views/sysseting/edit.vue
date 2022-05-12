<template>
  <div class="app-container">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      status-icon
      :rules="rules"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="新密码" prop="pass">
        <el-input
          v-model="ruleForm.pass"
          type="password"
          style="width:20%"
          autocomplete="off"
          minlength="5"
        />
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input
          v-model="ruleForm.checkPass"
          type="password"
          style="width:20%"
          autocomplete="off"
        />
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          @click="submitForm('ruleForm')"
        >提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { editUserPass } from '@/api/seting'
import { getToken, removeToken } from '@/utils/auth'
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        pass: '',
        checkPass: ''
      },
      rules: {
        pass: [{ validator: validatePass, trigger: 'blur' }],
        checkPass: [{ validator: validatePass2, trigger: 'blur' }]
      }
    }
  },
  methods: {
    submitForm(formName) {
      const token = getToken()
      this.$refs[formName].validate(valid => {
        const data = { 'pass': this.ruleForm.pass, 'token': token }
        if (valid) {
          editUserPass(data).then(response => {
            this.$notify({
              title: 'Success',
              message: '修改成功请重新登陆',
              type: 'success',
              duration: 1500
            })
            removeToken()
            setTimeout(() => {
              this.$router.push(`/login?redirect=${this.$route.fullPath}`)
            }, 2000)

            // await this.$store.dispatch('user/logout')
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped>
.line {
  text-align: center;
}
</style>
