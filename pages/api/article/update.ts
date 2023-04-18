import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config/index';
import { Article, Tag } from 'db/entity';
import { prepareConnection } from 'db/index';
import { EXCEPTION_ARTICLE } from '../config/codes';

// 这样封装的异步请求的 req 中就可以获取到 session 了
export default withIronSessionApiRoute(update, ironOptions);

// 文章修改
async function update(req: NextApiRequest, res: NextApiResponse) {
  // 解构请求体参数
  const { title = '', content = '', id = 0, tagIds } = req.body;
  try {
    // 获取数据库连接
    const db = await prepareConnection();
    const articleRepo = db.getRepository(Article);
    const tagRepo = db.getRepository(Tag);

    const article = await articleRepo.findOne({
      where: {
        id,
      },
      relations: ['user'],
    });

    // 筛选选择的tab信息
    const tags = await tagRepo.find({
      where: tagIds?.map((tagId: number) => ({ id: tagId })),
    });

    if (article) {
      article.title = title;
      article.content = content;
      article.update_time = new Date();

      if (tags) {
        const newTags = tags?.map((tag) => {
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
          msg: '更新成功',
          data: resArticle,
        });
      } else {
        res.status(200).json({
          ...EXCEPTION_ARTICLE.UPDATE_FAILED,
        });
      }
    } else {
      res.status(200).json({
        ...EXCEPTION_ARTICLE.NOT_FOUND,
      });
    }
  } catch (error) {
    console.log('连接错误:', error);
  }
}
