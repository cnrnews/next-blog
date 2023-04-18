import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { Cookie } from 'next-cookie';
import { ironOptions } from 'config/index';
import { ISession } from 'pages/api/index';
import { User, UserAuth } from 'db/entity';
import { prepareConnection } from 'db/index';
import { setCookie } from 'utils';

// 这样封装的异步请求的 req 中就可以获取到 session 了
export default withIronSessionApiRoute(login, ironOptions);

// 用户登录
async function login(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  // 得到 cookie 对象
  const cookies = Cookie.fromApiRoute(req, res);
  // 解构请求体参数
  const { phone = '', verify = '', identity_type = 'phone' } = req.body;
  try {
    // 获取数据库连接
    const db = await prepareConnection();
    // 获取用户和认证实体映射表
    const userAuthRepo = db.getRepository(UserAuth);

    console.log('----------------');
    console.log(session.verifyCode, verify);

    // 验证码是否正确
    if (String(session.verifyCode) === String(verify)) {
      // 从 user_auth 表中查询是否存在映射记录
      const userAuth = await userAuthRepo.findOne(
        {
          identity_type,
          identifier: phone,
        },
        {
          relations: ['user'], // 关联用户表
        }
      );

      // 如果存在验证记录
      if (userAuth) {
        const user = userAuth.user;
        const { id, nickname, avatar } = user;

        session.userId = id;
        session.nickname = nickname;
        session.avatar = avatar;
        // 存储用户信息到 session
        await session.save();

        // 存储信息到 cookie
        setCookie(cookies, { userId: String(id), nickname, avatar });

        // 返回给客户端消息
        res.status(200).json({
          code: 0,
          msg: '登录成功',
          data: {
            userId: id,
            nickname,
            avatar,
          },
        });
      } else {
        // 创建新用户
        const user = new User();
        user.nickname = `用户_${Math.floor(Math.random() * 10000)}`;
        user.avatar = '/images/avatar.jpg';
        user.job = '暂无';
        user.introduce = '暂无';

        // 创建认证记录
        const newUserAuth = new UserAuth();
        newUserAuth.identifier = phone;
        newUserAuth.identity_type = identity_type; // 验证类型
        newUserAuth.credential = session.verifyCode; // 验证码
        newUserAuth.user = user; // 关联用户

        // 创建用户认证记录
        const resUserAuth = await userAuthRepo.save(newUserAuth);
        const {
          user: { id, nickname, avatar },
        } = resUserAuth;

        session.userId = id;
        session.nickname = nickname;
        session.avatar = avatar;
        // 存储用户信息到 session
        await session.save();

        // 存储信息到 cookie
        setCookie(cookies, { userId: String(id), nickname, avatar });

        // 返回给客户端消息
        res.status(200).json({
          code: 0,
          msg: '登录成功',
          data: {
            userId: id,
            nickname,
            avatar,
          },
        });
      }
    } else {
      // 验证码错误
      res.status(200).json({
        code: -1,
        msg: '验证码错误',
      });
    }
  } catch (error) {
    console.log('连接错误:', error);
  }
}
