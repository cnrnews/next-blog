import { IronSession } from 'iron-session';
import { IUserInfo } from 'store/userStore';

// 评论类型定义
export type IComment= {
  id: number
  content: string 
  create_time: Date
  update_time:Date
}
// 文章类型定义
export type IArticle = {
  id: number,
  title: string,
  content: string,
  views: number,
  create_time: Date,
  update_time: Date,
  user: IUserInfo,
  comments: IComment[],
};

// 扩展 iro-session 类型，支持任意 key,value 数据
export type ISession = IronSession & Record<string, any>;
