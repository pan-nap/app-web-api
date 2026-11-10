import Router from '@koa/router';
import { login, logout } from '#controllers/authController';
import { auditLog } from '#middleware/audit';
import { wrap } from '#utils/response';

const router = new Router();

router.post('/login', auditLog('login', 'session'), wrap(login));
router.post('/logout', wrap(logout));
router.get('/home', (ctx) => {
  ctx.body = '服务正在运行中...';
});

export default router;