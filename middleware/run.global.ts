export default defineNuxtRouteMiddleware((to, from) => {
  console.log(`路由 ${to.path}`)
})
