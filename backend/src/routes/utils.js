const Router = require('@koa/router')
const utils = require('../controllers/utils')
const { auth } = require('../middlewares')

const router = new Router()

router.post('/upload', auth.login, auth.admin, utils.upload)
router.get('/servertime', utils.serverTime)
router.get('/website', utils.websiteInformation)

module.exports = router
