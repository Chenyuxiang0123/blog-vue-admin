<template>
  <div class="register borderRadius5px">
    <h1>用户注册</h1>
    <el-form
      label-width="45px"
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-position="top"
    >
      <el-form-item label="邮箱:" prop="email">
        <el-input v-model="ruleForm.email" placeholder="请输入邮箱" />
      </el-form-item>
      <el-form-item label="密码:" prop="password">
        <el-input
          type="password"
          v-model="ruleForm.password"
          placeholder="请输入密码"
        />
      </el-form-item>
      <el-form-item
        class="checkPassword"
        label="确认密码:"
        prop="checkPassword"
      >
        <el-input
          type="password"
          v-model="ruleForm.checkPassword"
          placeholder="请再次输入密码"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="验证码:" prop="code" class="code">
        <el-input
          v-model="ruleForm.code"
          maxlength="6"
          placeholder="请输入验证码"
        />
        <el-button @click="getCode()" :disabled="disabled">{{
          message
        }}</el-button>
      </el-form-item>
      <el-form-item class="registerBtn">
        <el-button type="primary" @click="submitForm('ruleForm')"
          >注册</el-button
        >
      </el-form-item>
    </el-form>
    <div class="tips">
      <span>已有账号?</span>
      <router-link to="/login">去登录</router-link>
    </div>
  </div>
</template>

<script>
import { register, code } from "../../api/user";
export default {
  data() {
    let validateEmail = (rules, value, callback) => {
      let obj = JSON.parse(localStorage.getItem(value));
      if (value == "") {
        callback(new Error("请输入邮箱"));
      } else if (obj && value === obj.email) {
        let oldTime = new Date(obj.time);
        let newTime = new Date();
        this.message = "验证码已发送";
        this.disabled = true;
        if (newTime - oldTime > 900000) {
          localStorage.removeItem(value);
          this.message = "获取验证码";
          this.disabled = false;
        }
        callback();
      } else if (obj && value !== obj.email) {
        this.message = "获取验证码";
        this.disabled = false;
      } else {
        callback();
      }
    };
    let validatePassword = (rules, value, callback) => {
      if (value == "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    let validateCode = (rules, value, callback) => {
      if (value == "") {
        callback(new Error("请输入验证码"));
      } else {
        callback();
      }
    };
    let validateCheckPassword = (rules, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.password) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        email: "",
        password: "",
        code: "",
        checkPassword: ""
      },
      message: "获取验证码",
      disabled: false,
      rules: {
        email: [
          { validator: validateEmail, trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        password: [
          { type: "password", validator: validatePassword, trigger: "blur" },
          {
            min: 6,
            max: 20,
            message: "长度在 6 到 20 个字符",
            trigger: ["blur", "change"]
          }
        ],
        code: [{ type: "text", validator: validateCode, trigger: "blur" }],
        checkPassword: [
          {
            type: "password",
            validator: validateCheckPassword,
            trigger: "blur"
          },
          {
            min: 6,
            max: 20,
            message: "长度在 6 到 20 个字符",
            trigger: ["blur", "change"]
          }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let res = await register(this.ruleForm);
          this.$message({
            type: res.type,
            message: res.message
          });
          if (res.code === 0) {
            this.$router.push("/login");
          }
        } else {
          return false;
        }
      });
    },
    async getCode() {
      if (this.ruleForm.email === "") {
        this.$message({
          type: "error",
          message: "邮箱不能为空！！"
        });
        return;
      }
      let res = await code({ email: this.ruleForm.email });
      let timeId = null;
      if (res.code === 0) {
        clearInterval(timeId);
        this.message = "验证码已发送";
        this.disabled = true;
        let obj = {
          email: this.ruleForm.email,
          time: new Date()
        };
        localStorage.setItem(this.ruleForm.email, JSON.stringify(obj));
        timeId = setInterval(() => {
          this.$set(this.message, "获取验证码");
          this.$set(this.disabled, false);
        }, 1000 * 60 * 15);
      }
      this.$message({
        type: res.type,
        message: res.message
      });
    }
  }
};
</script>
<style lang="scss" scope>
#app {
  overflow: hidden;
  height: 100vh;
  background-image: url("../../assets/images/3.jpg");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  .register {
    width: 22.5rem /* 360/16 */;
    margin: 8% auto;
    padding: 0 0.9375rem /* 15/16 */;
    background-color: rgba(0, 0, 0, 0.4);
    text-align: center;
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.6);
    h1 {
      padding: 1.25rem /* 20/16 */ 0;
      font-size: 1.25rem /* 20/16 */;
      font-weight: 400;
    }
    .el-form {
      width: 17.5rem /* 280/16 */;
      margin: 0.625rem /* 10/16 */ auto;
      text-align: left;
      .el-form-item__label {
        padding-right: 0;
        color: #999;
        line-height: 1.625rem /* 26/16 */;
        font-size: 1.125rem /* 18/16 */;
      }
      .el-form-item__content {
        line-height: 1.625rem /* 26/16 */;
        .el-input__inner {
          height: 1.625rem /* 26/16 */;
          background-color: transparent;
          border-width: 0 0 1px;
          color: #fff;
          &.el-input__inner::placeholder {
            color: #999;
          }
        }
      }
      .code {
        .el-form-item__content {
          .el-input {
            width: 9.25rem /* 100/16 */;
          }
          .el-button {
            float: right;
            padding: 0.375rem /* 6/16 */ 0.75rem /* 12/16 */;
            background-color: rgba(0, 0, 0, 0.2);
            line-height: 0.875rem /* 14/16 */;
          }
        }
      }
      .registerBtn {
        .el-form-item__content {
          text-align: center;
          .el-button {
            background-image: linear-gradient(
              to right,
              #b8cbb8 0%,
              #b465da 0%,
              #cf6cc9 33%,
              #ee609c 100%
            );
            border: none;
            letter-spacing: 5px;
            border-radius: 37px;
            span {
              color: #fff;
            }
          }
          .el-button:hover {
            span {
              color: skyblue;
            }
          }
        }
      }
    }
    .tips {
      width: 17.5rem /* 280/16 */;
      margin: 0 auto;
      padding-bottom: 0.9375rem /* 15/16 */;
      text-align: right;
      span {
        margin-right: 0.3125rem /* 5/16 */;
        cursor: pointer;
      }
      a {
        color: #999;
      }
      a:hover {
        color: #409eff;
      }
    }
  }
}
</style>
