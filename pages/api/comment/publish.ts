import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config/index';
import { ISession } from 'pages/api/index';
import { User, Article, Comment } from 'db/entity';
import { prepareConnection } from 'db/index';
import { EXCEPTION_COMMENT } from '../config/codes';

// 这样封装的异步请求的 req 中就可以获取到 session 了
export default withIronSessionApiRoute(publish, ironOptions);

// 用户登录
async function publish(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  // 解构请求体参数
  const { articleId = 0, content = '' } = req.body;
  try {
    // 获取数据库连接
    const db = await prepareConnection();

    const comment = new Comment();
    comment.content = content;
    comment.create_time = new Date();
    comment.update_time = new Date();

    const userRepo = db.getRepository(User);
    const articleRepo = db.getRepository(Article);
    const commentRepo = db.getRepository(Comment);

    // 是哪个用户发表的评论
    const user = await userRepo.findOne({
      id: session.userId,
    });

    // 针对那篇文章发表的评论
    const article = await articleRepo.findOne({
      where: {
        id: articleId,
      },
    });

    // 关联用户信息
    if (user) {
      comment.user = user;
    }

    // 关联文章信息
    if (article) {
      comment.article = article;
    }

    // 存储评论信息
    const resComment = await commentRepo.save(comment);

    if (resComment) {
      // 返回给客户端消息
      res.status(200).json({
        code: 0,
        msg: '发表成功',
        data: resComment,
      });
    } else {
      res.status(200).json({
        ...EXCEPTION_COMMENT.PUBLISH_FAILED,
      });
    }
  } catch (error) {
    console.log('连接错误:', error);
  }
}
