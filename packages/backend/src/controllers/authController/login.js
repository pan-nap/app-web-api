import { getConnectionWithCharset } from '#config/database';
import { comparePassword } from '#utils/bcrypt';
import { generateToken } from '#utils/jwt';
import { success, error } from '#utils/response';

export default function(ctx) {
  return getConnectionWithCharset(async (connection) => {
    const { username, password } = ctx.request.body;
    if (!username || !password) {
      return error(ctx, '请输入账号和密码');
    }

    const [users] = await connection.query('SELECT * FROM user WHERE username = ?', [username]);
    
    if (!users.length) {
      return error(ctx, '账号或密码错误');
    }

    const user = users[0];
    
    const isPasswordValid = await comparePassword(password, user.password);
    
    if (!isPasswordValid) {
      return error(ctx, '账号或密码错误');
    }

    const access_token = generateToken({ id: user.id, username: user.username });

    success(ctx, { access_token, username: user.username }, '登录成功');
  })
}