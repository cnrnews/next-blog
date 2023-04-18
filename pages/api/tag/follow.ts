import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config/index';
import { ISession } from 'pages/api/index';
import { User, Tag } from 'db/entity';
import { prepareConnection } from 'db/index';
import { EXCEPTION_TAG, EXCEPTION_USER } from '../config/codes';

// 这样封装的异步请求的 req 中就可以获取到 session 了
export default withIronSessionApiRoute(follow, ironOptions);

// 关注/取关
async function follow(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  const { userId = 0 } = session;
  const { tag_id, type } = req?.body || {};
  try {
    // 获取数据库连接
    const db = await prepareConnection();

    // 获取 User Repositor
    const userRepo = db.getRepository(User);
    const tagRepo = db.getRepository(Tag);

    const user = await userRepo.findOne({
      where: {
        id: userId,
      },
    });

    const tag = await tagRepo.findOne({
      where: {
        id: tag_id,
      },
      relations: ['users'],
    });

    // 没有登录
    if (!user) {
      res?.status(200).json({
        ...EXCEPTION_USER.NOT_LOGIN,
      });
      return;
    }

    if (tag) {
      console.log('tag', tag);
      if (tag.users) {
        if (type == 'follow') {
          tag.users = tag.users.concat([user]);
          tag.follow_count += 1;
        } else {
          tag.users = tag.users.filter((user) => user.id !== userId);
          tag.follow_count -= 1;
        }
      }

      const resTag = await tagRepo.save(tag);
      console.log('resTag', tag);
      res?.status(200).json({
        code: 0,
        msg: '',
        data: resTag,
      });
    } else {
      res?.status(200).json({
        ...EXCEPTION_TAG.PUBLISH_FAILED,
      });
    }
  } catch (err) {
    console.log(err);
  }
}
