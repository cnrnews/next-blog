import { Entity, BaseEntity, PrimaryGeneratedColumn, Column,ManyToMany,ManyToOne,OneToMany, JoinColumn } from 'typeorm';
import { User } from './user'
import { Comment } from './comment'
import { Tag } from './tag'
@Entity({name: 'articles'})
export class Article extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id!: number;

  @Column('text')
  title!: string;

  @Column('text')
  content!: string;

  @Column('int')
  views!: number;

  @Column('date')
  create_time!: Date;

  @Column('date')
  update_time!: Date;

  @Column('int')
  is_delete!: number;

  @ManyToOne('User')
  @JoinColumn({name: 'user_id'})
  user!: User;

  // 标签 - 文章 多对多关系
  @ManyToMany('Tag', (tag:any) => tag.articles, {
    cascade: true
  })
  tags!: Tag[];

  @OneToMany('Comment',(comment:Comment)=>comment.article)
  comments!: Comment[];
}