import 'dotenv/config'
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Koa from 'koa';
import cors from '@koa/cors';
import mount from 'koa-mount';
import Static from 'koa-static';
import staticIndex from '#utils/staticIndex';
import { bodyParser } from '@koa/bodyparser';
import { error } from '#utils/response';
import { registerRoutes } from '#routes/index';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = new Koa();

app.use(cors());

app.use(async (ctx, next) => {
  if (ctx.path.startsWith('/upload')) {
    await next();
  } else {
    await bodyParser()(ctx, next);
  }
});

app.use(staticIndex(__dirname));
app.use(mount('/uploads', Static(path.join(__dirname, '../uploads'), {
  index: false, 
  maxage: 86400000,
  gzip: true,
  hidden: false
})));

registerRoutes(app);

app.use(async (ctx, next) => {
  try {
    await next();
    if (ctx.body === undefined) {
      ctx.status = 404;
      error(ctx, '接口不存在', 404);
    }
  } catch (err) {
    console.error('服务器错误:', err);
    ctx.status = 500;
    error(ctx, `服务器内部错误: ${err}`, 500);
  }
});

const PORT = process.env.PORT;

const startServer = async () => {
  const server = app.listen(PORT, () => {
    console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
  });
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;
