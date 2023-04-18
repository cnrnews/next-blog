import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config/index';
import { ISession } from 'pages/api/index';
import { User } from 'db/entity';
import { prepareConnection } from 'db/index';
import { EXCEPTION_USER } from '../config/codes';

// 这样封装的异步请求的 req 中就可以获取到 session 了
export default withIronSessionApiRoute(update, ironOptions);

// 用户详情
async function update(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  const { userId } = session;
  const { nickname = '', job = '', introduce = '' } = req.body;

  // 获取数据库连接
  const db = await prepareConnection();
  const userRepo = db.getRepository(User);

  const user = await userRepo.findOne({
    where: {
      id: Number(userId),
    },
  });
  if (user) {
    user.nickname = nickname;
    user.job = job;
    user.introduce = introduce;

    const resUser = await userRepo.save(user);

    res.status(200).json({
      code: 0,
      msg: '',
      data: resUser,
    });
  } else {
    res.status(200).json({ ...EXCEPTION_USER.NOT_FOUND });
  }
}
