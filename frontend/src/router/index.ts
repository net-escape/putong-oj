import { LoadingBar } from 'view-ui-plus'
import { createRouter, createWebHistory } from 'vue-router'
import { useSessionStore } from '@/store/modules/session'
import routes from './routes'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 全局身份确认
router.beforeEach((to, from, next) => {
  LoadingBar.start()
  const session = useSessionStore()

  if (to.meta.requiresLogin && !session.isLogined) {
    session.toggleAuthnDialog()
    return next({ name: 'home' })
  }
  if (to.meta.requiresAdmin && !session.isAdmin) {
    return next({ name: 'home' })
  }

  next()
})

router.afterEach(() => {
  LoadingBar.finish()
})

export default router
