import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Article } from './article'
import { User } from './user'

@Entity({name: 'comments'})
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id!: number;

  @Column('text')
  content!: string;

  @Column('date')
  create_time!: Date;

  @Column('date')
  update_time!: Date;

  @ManyToOne('User')
  @JoinColumn({name: 'user_id'})
  user!: User;

  @ManyToOne('Article')
  @JoinColumn({name: 'article_id'})
  article!: Article;
}