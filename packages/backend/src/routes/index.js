import authRouter from './auth.js';
import studentRouter from './students.js';
import orderRouter from './orders.js';
import dictionaryRouter from './dictionary.js';
import employeeRouter from './employees.js';
import uploadRouter from './upload.js';
import documentRouter from './documents.js';

export function registerRoutes(app) {
  app.use(authRouter.routes()).use(authRouter.allowedMethods());
  app.use(studentRouter.routes()).use(studentRouter.allowedMethods());
  app.use(orderRouter.routes()).use(orderRouter.allowedMethods());
  app.use(dictionaryRouter.routes()).use(dictionaryRouter.allowedMethods());
  app.use(employeeRouter.routes()).use(employeeRouter.allowedMethods());
  app.use(uploadRouter.routes()).use(uploadRouter.allowedMethods());
  app.use(documentRouter.routes()).use(documentRouter.allowedMethods());
}
