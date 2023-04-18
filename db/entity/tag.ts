import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { User } from './user'
import { Article } from './article'

@Entity({name: 'tags'})
export class Tag extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id!: number;

  @Column('text')
  title!: string;

  @Column('text')
  icon!: string;

  @Column('int')
  follow_count!: number;

  @Column('int')
  article_count!: number;

  // 用户 - 标签： 多对多关系
  // 中间表： tags_users_rel
  @ManyToMany('User', {
    cascade: true
  })
  @JoinTable({
    name: 'tags_users_rel',
    joinColumn: {
      name: 'tag_id'
    },
    inverseJoinColumn: {
      name: 'user_id'
    }
  })
  users!: User[]

  // @JoinTable用于描述“多对多”关系， 并描述中间表表的连接列
  // 文章 - 标签： 多对多关系
  // 中间表： articles_tags_rel
  @ManyToMany('Article', (article:any) => article.tags)
  @JoinTable({
    name: 'articles_tags_rel',
    joinColumn: { // 外键
      name: 'tag_id'
    },
    inverseJoinColumn: {
      name: 'article_id'
    }
  })
  articles!: Article[]
}