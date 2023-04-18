import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config/index';
import { ISession } from 'pages/api/index';
import { Tag } from 'db/entity';
import { prepareConnection } from 'db/index';

// 这样封装的异步请求的 req 中就可以获取到 session 了
export default withIronSessionApiRoute(get, ironOptions);

// 湖区文章标签
async function get(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  const { userId = 0 } = session;
  try {
    // 获取数据库连接
    const db = await prepareConnection();

    // 获取 Tag Repositor
    const tagRepo = db.getRepository(Tag);

    // 获取关注的标签
    const followTags = await tagRepo.find({
      relations: ['users'],
      where: (qb: any) => {
        qb.where('user_id = :id', {
          id: Number(userId),
        });
      },
    });

    // 获取所有标签
    const allTags = await tagRepo.find({
      relations: ['users'],
    });

    res?.status(200).json({
      code: 0,
      msg: '',
      data: {
        followTags,
        allTags,
      },
    });
  } catch (err) {
    console.log(err);
  }
}
