import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { Cookie } from 'next-cookie';
import { ironOptions } from 'config/index';
import { ISession } from 'pages/api/index';
import { clearCookie } from 'utils';
// 这样封装的异步请求的 req 中就可以获取到 session 了
export default withIronSessionApiRoute(logout, ironOptions);

// 退出登陆
async function logout(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  // 得到 cookie 对象
  const cookies = Cookie.fromApiRoute(req, res);

  // 清除 session
  await session.destroy();

  // 清除 cookie
  clearCookie(cookies);

  // 返回给客户端消息
  res.status(200).json({
    code: 0,
    msg: '退出成功',
  });
}
