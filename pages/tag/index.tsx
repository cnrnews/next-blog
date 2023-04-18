/* eslint-disable no-unsafe-optional-chaining */
import React, { useState, useEffect } from 'react'
import { Tabs, Button, message } from 'antd'
import {observer} from 'mobx-react-lite'
import * as ANTD_ICONS  from '@ant-design/icons'
import { useStore } from 'store'
import request from 'service/fetch'
import styles from './index.module.scss'

const {TabPane} = Tabs
interface IUser{
  id: number
  nickname: string 
  avatar:string
}

interface ITag{
  id: number 
  title: string 
  icon: string 
  follow_count: number  // 关注量
  article_count: number  // 文章数量
  users: IUser[] // 关注的用户信息
}

const Tag:React.FC = () => {
  const store = useStore()
  const loginUserInfo = store?.user?.userInfo
  const userId = loginUserInfo?.userId
  // 关注的标签
  const [followTags, setFollowTags] = useState<ITag[]>()
  // 所有标签
  const [allTags, setAllTags] = useState<ITag[]>()
  // Tab 切换标签
  const [activeKey, setActiveKey] = useState<string>('all')
  // 是否需要刷新列表
  const [needRefresh, setNeedRefresh] = useState<boolean>(false)
  
  // 副作用函数：请求标签接口数据
  useEffect(() => {
    request('/api/tag/get').then((res: any) => {
      if (res?.code == 0) {
        const { followTags = [], allTags = [] } = res?.data

        setFollowTags(followTags)
        setAllTags(allTags)
      }
    })
  }, [needRefresh])
  
  // 取消关注
  const handleUnFollow = (tag_id:number) => {
    request.post('/api/tag/follow', {
      tag_id,
      type:'unfollow'
   }).then((res: any) => {
     if (res?.code == 0) {
       message.success('取关成功')
       setNeedRefresh(!needRefresh)
     } else {
       message.error('取关失败')
     }
   })
  }
   // 关注
   const handleFollow = (tag_id:number) => {
     request.post('/api/tag/follow', {
       tag_id,
       type:'follow'
    }).then((res: any) => {
      if (res?.code == 0) {
        message.success('关注成功')
        // 通知刷新列表
        setNeedRefresh(!needRefresh)
      } else {
        message.error('关注失败')
      }
    })
  }
  // Tab 切换change
  const handleTabChange = (activeKey: string) => {
    console.log('activeKey',activeKey);
    setActiveKey(activeKey)
    }
  return  <div className='content-layout'>
  <Tabs defaultActiveKey="all" activeKey={activeKey} onChange={handleTabChange}>
      <TabPane tab="已关注标签" key="follow" className={styles.tags}>
      {
       activeKey == 'follow' && followTags?.map(tag => (
          <div key={tag?.title} className={styles.tagWrapper}>
            <div>{(ANTD_ICONS as any)[tag?.icon]?.render()}</div>
            <div className={styles.title}>{tag?.title}</div>
            <div>{tag?.follow_count} 关注 {tag?.article_count} 文章</div>
            {
              tag?.users?.find((user) => Number(user?.id) === Number(userId)) ? (
                <Button type='primary' onClick={() => handleUnFollow(tag?.id)}>已关注</Button>
              ) : (
                <Button onClick={() => handleFollow(tag?.id)}>关注</Button>
              )
            }
          </div>
        ))
      }
    </TabPane>
      <TabPane tab="全部标签" key="all" className={styles.tags}>
      
    {
       activeKey == 'all' && allTags?.map(tag => (
          <div key={tag?.title} className={styles.tagWrapper}>
            <div>{(ANTD_ICONS as any)[tag?.icon]?.render()}</div>
            <div className={styles.title}>{tag?.title}</div>
            <div>{tag?.follow_count} 关注 {tag?.article_count} 文章</div>
            {
              tag?.users?.find((user) => Number(user?.id) === Number(userId)) ? (
                <Button type='primary' onClick={() => handleUnFollow(tag?.id)}>已关注</Button>
              ) : (
                <Button onClick={() => handleFollow(tag?.id)}>关注</Button>
              )
            }
          </div>
        ))
      }
    </TabPane>
  </Tabs>
</div>
}

export default observer(Tag)