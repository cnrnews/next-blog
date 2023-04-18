import React, { useState } from 'react';
import { prepareConnection } from 'db';
import { Avatar, Input, Button, message, Divider } from 'antd';
import Link from 'next/link';
import MarkDown from 'markdown-to-jsx';
import { Article } from 'db/entity';
import { useStore } from 'store/index';
import { IArticle } from 'pages/api/index';
import styles from './index.module.scss';
import request from 'service/fetch';
import format from 'date-fns/format';
// props 数据类型定义
interface IProps {
  article: IArticle;
}

// 请求文章详情
export async function getServerSideProps({ params }: { params: any }) {
  const articleId = params?.id;
  const db = await prepareConnection();
  // 获取文章Repository
  const articleRepo = db.getRepository(Article);
  // 获取文章详情
  const article = await articleRepo.findOne({
    where: {
      id: articleId,
    }, // 查询条件
    relations: ['user', 'comments', 'comments.user'], // 关联用户、评论以及评论用户信息
  });

  // 更新文章阅读量
  if (article) {
    article.views = article.views + 1;
    await articleRepo.save(article);
  }

  // 返回给客户端数据
  return {
    props: {
      article: JSON.parse(JSON.stringify(article)) || {},
    },
  };
}

const ArticleDetail = (props: IProps) => {
  const store = useStore();
  const loginUserInfo = store?.user?.userInfo;
  const { article } = props;
  const {
    user: { nickname, avatar, id },
  } = article;
  const [inputVal, setInputVal] = useState('');
  const [comments, setComments] = useState(article?.comments || []); // 初始化 state 评论列表

  // 发布评论
  const handleComment = () => {
    request
      .post('/api/comment/publish', {
        articleId: article.id,
        content: inputVal,
      })
      .then((res: any) => {
        if (res?.code === 0) {
          message.success('发表成功');
          // 追加评论列表
          const newComents = [
            {
              id: Math.random(),
              create_time: new Date(),
              update_time: new Date(),
              content: inputVal,
              user: {
                avatar: loginUserInfo?.avatar,
                nickname: loginUserInfo?.nickname,
              },
            },
          ].concat([...(comments as any)]);
          setComments(newComents);
          // 清空输入框内容
          setInputVal('');
        } else {
          message.error('发表失败');
        }
      });
  };
  return (
    <div>
      <div className="content-layout">
        <div className={styles.title}>{article.title}</div>
        <div className={styles.user}>
          <Avatar src={avatar} size={32} />
          <div className={styles.info}>
            <div className={styles.name}>{nickname}</div>
            <div className={styles.date}>
              <div>{article.update_time}</div>
              <div>阅读 {article?.views}</div>
              {Number(loginUserInfo?.userId) === Number(id) && (
                <Link href={`/editor/${article.id}`}>编辑</Link>
              )}
            </div>
          </div>
        </div>
        <MarkDown className={styles.markdown}>{article?.content}</MarkDown>
      </div>
      {/* 评论 */}
      <div className="content-layout">
        <div className={styles.comment}>
          <h3>评论</h3>
          {loginUserInfo?.userId && (
            <div className={styles.enter}>
              <Avatar src={avatar} size={40}></Avatar>
              <div className={styles.content}>
                <Input.TextArea
                  placeholder="请输入评论"
                  rows={4}
                  value={inputVal}
                  onChange={(event) => setInputVal(event?.target?.value)}
                ></Input.TextArea>
                <Button type="primary" onClick={handleComment}>
                  发表评论
                </Button>
              </div>
            </div>
          )}
          <Divider />
          <div className={styles.display}>
            {comments?.map((comment: any) => (
              <div className={styles.wrapper} key={comment?.id}>
                <Avatar src={comment?.user?.avatar} size={40} />
                <div className={styles.info}>
                  <div className={styles.name}>
                    <div>{comment?.user?.nickname}</div>
                    <div className={styles.date}>
                      {format(
                        new Date(comment?.update_time),
                        'yyyy-MM-dd hh:mm:ss'
                      )}
                    </div>
                  </div>
                  <div className={styles.content}>{comment?.content}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ArticleDetail;
