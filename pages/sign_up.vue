<template>
  <div class="signUp">
    <a-row>
      <div class="logo">
        <NuxtLink href="#" class="">
          <img src="/images/logo.png" alt="logo" />
        </NuxtLink>
      </div>
    </a-row>
    <a-row type="flex" justify="center">
      <a-col :span="16">
        <a-row>
          <a-col :span="12">
            <a-row class="login-left" type="flex" justify="end">
              <img class="sign_bg" src="/images/sign_bg.png" alt="sign_bg" />
              <a-row>
                <a-button
                  style="width: 250px; height: 45px"
                  shape="round"
                  size="large"
                  type="primary"
                  >下载简书APP</a-button
                >
                <a-popover placement="topRight">
                  <template #content>
                    <div class="page_download">
                      <img
                        style="width: 100px"
                        src="/images/login_page_download.png"
                        alt="download"
                      />
                    </div>
                  </template>
                  <div class="page_download">
                    <img src="/images/login_page_download.png" alt="download" />
                  </div>
                </a-popover>
              </a-row>
            </a-row>
          </a-col>
          <a-col :span="12">
            <div class="login-right">
              <div class="login-form">
                <a-row type="flex" justify="center" class="tag-title">
                  <NuxtLink to="/sign_in" class="sign_in">登录</NuxtLink>
                  <b>·</b>
                  <NuxtLink to="/sign_up" class="active">注册</NuxtLink>
                </a-row>
                <div class="form">
                  <a-form :model="formState">
                    <a-form-item>
                      <a-input
                        style="
                          border: none;
                          background-color: #f7f7f7 !important;
                        "
                        placeholder="你的昵称"
                        v-model:value="formState.nickname"
                      >
                        <template #prefix>
                          <i-ep-user-filled />
                        </template>
                      </a-input>
                    </a-form-item>
                    <a-form-item style="border-top: 1px solid #c8c8c8">
                      <a-input
                        style="
                          border: none;
                          background-color: #f7f7f7 !important;
                        "
                        placeholder="手机号"
                        v-model:value="formState.phone"
                      >
                        <template #prefix>
                          <i-mdi-cellphone-iphone />
                        </template>
                      </a-input>
                    </a-form-item>
                    <a-form-item style="border-top: 1px solid #c8c8c8">
                      <a-input
                        style="
                          border: none;
                          background-color: #f7f7f7 !important;
                        "
                        placeholder="密码"
                        type="password"
                        v-model:value="formState.password"
                      >
                        <template #prefix>
                          <i-ant-design-lock-filled />
                        </template>
                      </a-input>
                    </a-form-item>
                  </a-form>
                </div>

                <a-row type="flex" justify="center" class="sign_in_btn">
                  <a-button @click="register" type="success" shape="round">
                    注册
                  </a-button>
                </a-row>
                <a-row type="flex" justify="center">
                  <p
                    style="
                      width: 80%;
                      color: #b5b5b5;
                      font-size: 13px;
                      text-align: center;
                      margin-top: 10px;
                    "
                  >
                    点击"注册"即表示您同意并愿意遵守简书的 <a>用户协议</a>和<a
                      >隐私政策</a
                    >
                  </p>
                </a-row>
                <div class="more-sign">
                  <h6>社交帐号注册</h6>
                  <a-row type="flex" justify="center" style="margin-top: 30px">
                    <div style="margin-right: 30px">
                      <i-ant-design-wechat-outlined
                        style="color: #00bb29; font-size: 30px"
                      />
                    </div>
                    <div>
                      <i-ant-design-qq-outlined
                        style="color: #498ad5; font-size: 30px"
                      />
                    </div>
                  </a-row>
                </div>
              </div>
            </div>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import { registerFetch } from "~/composables/useHttpFetch"

const formState = reactive({
  nickname: "",
  phone: "",
  password: "",
})

const { $message } = useNuxtApp()

//注册
const register = () => {
  //数据校验
  if (formState.nickname === "") {
    $message.error("昵称不能为空哦~")
    return
  }
  if (formState.phone === "") {
    $message.error("手机号不能为空哦~")
    return
  }
  if (formState.password === "") {
    $message.error("密码不能为空哦~")
    return
  }

  //请求注册接口
  registerFetch({
    method: "POST",
    body: {
      nickname: formState.nickname,
      phone: formState.phone,
      password: formState.password,
    },
    server: false,
    key: "registerFetch",
  }).then(({ data }) => {
    console.log("registerFetch", data)
    if (data.value.code === 1) {
      $message.error("注册失败~")
      return
    }
    $message.info("注册成功~")
    navigateTo("/sign_in")
  })
}
</script>

<style lang="scss" scoped>
.signUp {
  background: #f1f1f1;
  height: 100vh;
  .logo {
    margin-left: 50px;
    padding-top: 50px;
    img {
      width: 100px;
    }
  }
  .login-left {
    padding: 20px;
    .sign_bg {
      width: 70%;
      margin-bottom: 40px;
    }
    .page_download {
      background: #ffffff;
      margin-left: 20px;
      padding: 5px;
      img {
        width: 46px;
      }
    }
  }
  .login-right {
    padding: 20px;
    .login-form {
      width: 400px;
      margin: 0 auto;
      padding: 50px 50px 30px;
      background-color: #fff;
      border-radius: 4px;
      box-shadow: 0 0 8px rgb(0 0 0 / 10%);
      vertical-align: middle;
      display: inline-block;
      .tag-title {
        font-size: 18px;
        font-family: Georgia, Times New Roman, Times, Songti SC, serif;
        NuxtLink:hover {
          border-bottom: 2px solid #ea6f5a;
        }
        .active {
          font-weight: 700;
          color: #ea6f5a;
          border-bottom: 2px solid #ea6f5a;
          padding: 5px 10px;
        }
        b {
          padding: 5px 15px;
          color: #969696;
          font-weight: 700;
        }
        .sign_in {
          padding: 5px 10px;
          color: #969696;
        }
      }
      .form {
        margin-top: 30px;
        background-color: #f7f7f7;
        border: 1px #c8c8c8 solid;
        border-radius: 6px;
        margin-bottom: 20px;
        .ant-form-item {
          margin-bottom: 0 !important;
        }
      }
      .more-sign {
        margin-top: 50px;
        text-align: center;
      }
      .more-sign h6 {
        position: relative;
        margin: 0 0 10px;
        font-size: 12px;
        color: #b5b5b5;
      }
      .more-sign h6:before,
      .more-sign h6:after {
        content: "";
        border-top: 1px solid #b5b5b5;
        display: block;
        position: absolute;
        width: 60px;
        top: 8px;
      }
      .more-sign h6:before {
        left: 30px;
      }
      .more-sign h6:after {
        right: 30px;
      }
    }
  }
}
</style>
<style lang="scss">
.signUp {
  .ant-input {
    background-color: #f7f7f7 !important;
    height: 40px !important;
    border-radius: 6px;
    outline: none !important;
  }
  .ant-input-affix-wrapper:not(.ant-input-affix-wrapper-disabled):hover {
    border-color: #c8c8c8 !important;
    border-right-width: 1px !important;
    z-index: 1;
  }
  .ant-input-affix-wrapper:focus,
  .ant-input-affix-wrapper-focused {
    border-color: #c8c8c8 !important;
    box-shadow: none !important;
    border-right-width: 1px !important;
  }
  .ant-input-affix-wrapper {
    border-radius: 6px !important;
  }
  .ant-input-prefix {
    margin-right: 8px;
  }
  .sign_in_btn {
    margin-top: 20px;
    .ant-btn {
      height: 45px !important;
      width: 100% !important;
      background-color: #43bf2f !important;
      color: #ffffff !important;
    }
    .ant-btn:hover,
    .ant-btn:focus {
      color: #43bf2f;
      border-color: #43bf2f;
    }
  }
}
</style>
