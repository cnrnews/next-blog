/* eslint-disable @next/next/link-passhref */
import React from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { Avatar, Button, Divider } from 'antd';
import {
  CodeOutlined,
  FireOutlined,
  FundViewOutlined,
} from '@ant-design/icons';
import { User, Article } from 'db/entity';
import { prepareConnection } from 'db/index';
import ListItem from 'components/ListItem';
import styles from './index.module.scss';
export async function getServerSideProps({ params }: { params: any }) {
  console.log(params);
  // 用户id
  const userId = params?.id;
  // 连接数据库查询用户信息和先关信息
  // 获取数据库连接
  const db = await prepareConnection();
  // 获取用户和文章实体映射表
  const userRepo = db.getRepository(User);
  const articleRepo = db.getRepository(Article);
  // const tagRepo = db.getRepository(Tag);

  // 用户详情
  const user = await userRepo.findOne({
    where: {
      id: Number(userId),
    },
  });

  // 发布的文章列表
  const articles =
    (await articleRepo.find({
      where: {
        user: {
          id: Number(userId),
        },
      },
      relations: ['user', 'tags'],
    })) || [];
  return {
    props: {
      userInfo: JSON.parse(JSON.stringify(user)),
      articles: JSON.parse(JSON.stringify(articles)),
    },
  };
}

const UserDetail: NextPage = (props: any) => {
  const { userInfo, articles = [] } = props;

  // readuce 函数计算文章总阅读数
  const viewsCount = articles?.reduce(
    (prev: any, next: any) => prev + next?.views,
    0
  );
  return (
    <div className={styles.userDetail}>
      <div className={styles.left}>
        <div className={styles.userInfo}>
          <Avatar className={styles.avatar} src={userInfo?.Avatar} size={90} />
          <div>
            <div className={styles.nickname}>{userInfo?.nickname}</div>
            <div className={styles.desc}>
              <CodeOutlined />
              {userInfo?.job}
            </div>
            <div className={styles.desc}>
              <FireOutlined />
              {userInfo?.introduce}
            </div>
          </div>
          <Link href="/user/profile">
            <Button>编辑个人资料</Button>
          </Link>
        </div>
        <Divider />
        <div className={styles.article}>
          {articles?.map((article: any) => (
            <div key={article?.id}>
              <ListItem article={article} />
              <Divider />
            </div>
          ))}
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.achievement}>
          <div className={styles.header}>个人成就</div>
          <div className={styles.number}>
            <div className={styles.wrapper}>
              <FundViewOutlined />
              <span>共创作 {articles?.length} 篇文章</span>
            </div>
            <div className={styles.wrapper}>
              <FundViewOutlined />
              <span>文章被阅读 {viewsCount} 次</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UserDetail;
