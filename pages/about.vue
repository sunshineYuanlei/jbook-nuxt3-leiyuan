<template>
  <h1>about</h1>
  <h1>{{ route.query }}</h1>
</template>

<script setup>
const route = useRoute()

// 命名路由中间件
// definePageMeta({
//   middleware: "auth",
// })

// 匿名路由中间件
definePageMeta({
  middleware: defineNuxtRouteMiddleware(() => {
    //判断用户是否登录
    let user = false
    if (!user) {
      return navigateTo("/login")
    }
  }),
})
</script>

<style scoped></style>
