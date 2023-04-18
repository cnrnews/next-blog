import React from 'react';
import Link from 'next/link';
import { markdownToTxt } from 'markdown-to-txt';
import { IArticle } from 'pages/api/index';
import styles from './index.module.scss';
interface IProps {
  article: IArticle;
}

const ListItem = (props: IProps) => {
  const article = props.article;
  const user = article.user;
  return (
    // eslint-disable-next-line @next/next/link-passhref
    <Link href={`/article/${article.id}`}>
      <div className={styles.container}>
        <div className={styles.article}>
          <div className={styles.userInfo}>
            <span className={styles.name}>{user?.nickname}</span>
            <span className={styles.date}>{article?.update_time}</span>
          </div>
          <h4 className={styles.title}>{article?.title}</h4>
          <p className={styles.content}>{markdownToTxt(article?.content)}</p>
        </div>
      </div>
    </Link>
  );
};
export default ListItem;
