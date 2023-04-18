import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config/index';
import { ISession } from 'pages/api/index';
import { User, Article, Tag } from 'db/entity';
import { prepareConnection } from 'db/index';
import { EXCEPTION_ARTICLE } from '../config/codes';

// 这样封装的异步请求的 req 中就可以获取到 session 了
export default withIronSessionApiRoute(publish, ironOptions);

// 发表文章
async function publish(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  // 解构请求体参数
  const { title = '', content = '', tagIds } = req.body;
  try {
    // 获取数据库连接
    const db = await prepareConnection();
    // 获取用户和文章实体映射表
    const userRepo = db.getRepository(User);
    const articleRepo = db.getRepository(Article);
    const tagRepo = db.getRepository(Tag);

    // 查找是哪个用户发布的
    const user = await userRepo.findOne({
      id: session.userId,
    });

    // 获取用户选择标签的详情
    const tags = await tagRepo.find({
      where: tagIds?.map((tagId: number) => ({ id: tagId })),
    });

    const article = new Article();
    article.title = title;
    article.content = content;
    article.create_time = new Date();
    article.update_time = new Date();
    article.is_delete = 0;
    article.views = 0;

    if (user) {
      article.user = user;
    }

    if (tags) {
      const newTags = tags?.map((tag) => {
        // 更新文章数量
        tag.article_count = tag?.article_count + 1;
        return tag;
      });
      // 为文章绑定 Tag 标签
      article.tags = newTags;
    }

    // 存储文章信息
    const resArticle = await articleRepo.save(article);
    if (resArticle) {
      // 返回给客户端消息
      res.status(200).json({
        code: 0,
        msg: '发布成功',
        data: resArticle,
      });
    } else {
      // 验证码错误
      res.status(200).json({
        ...EXCEPTION_ARTICLE.PUBLISH_FAILED,
      });
    }
  } catch (error) {
    console.log('连接错误:', error);
  }
}
