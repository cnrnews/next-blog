import React from 'react';
import { prepareConnection } from 'db';
import { Divider } from 'antd';
import { Article } from 'db/entity';
import { IArticle } from 'pages/api/index';
import ListItem from '../components/ListItem';

interface IProps {
  articles: IArticle[];
}

// 请求文章列表
export async function getServerSideProps() {
  const db = await prepareConnection();
  // 获取文章Repository
  const articleRepo = db.getRepository(Article);
  // 获取文章列表
  const articles = await articleRepo.find({
    relations: ['user'], // 关联用户表
  });
  // 返回给客户端数据
  return {
    props: {
      articles: JSON.parse(JSON.stringify(articles)) || [],
    },
  };
}

// 首页
const Home = (props: IProps) => {
  const { articles } = props;
  return (
    <div className="content-layout">
      {articles?.map((article) => (
        // eslint-disable-next-line react/jsx-key
        <>
          <ListItem article={article} />
          <Divider />
        </>
      ))}
    </div>
  );
};
export default Home;
