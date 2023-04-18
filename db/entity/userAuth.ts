import { Entity, BaseEntity, PrimaryGeneratedColumn, Column,ManyToOne, JoinColumn } from 'typeorm'
import {User} from './user'
@Entity({name:'user_auths'})
export class UserAuth extends BaseEntity{
  @PrimaryGeneratedColumn()
  readonly id!: number;

  @Column('text')
  identity_type!: string;

  @Column('text')
  identifier!: string;

  @Column('text')
  credential!: string;

  // 认证和用户多对一关系：一个用户有多重认证类型
  @ManyToOne('User', {
    cascade: true
  })
  @JoinColumn({ name: 'user_id' }) // 外键 
  user!:User // 关联的用户实体
}