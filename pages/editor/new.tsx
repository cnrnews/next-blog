import '@uiw/react-md-editor/markdown-editor.css';
// import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';
import { ChangeEvent, useState, useEffect} from 'react';
import {Input,Button,message,Select} from 'antd'
import styles from './index.module.scss'
import request from 'service/fetch'
import {useStore} from 'store'
import {useRouter} from 'next/router'

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

const NewEditor = () => {

  const store = useStore()
  const {push} = useRouter()
  const {userId} = store.user.userInfo

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [allTags, setAllTags] = useState([]); // 标签列表
  const [tagIds, setTagIds] = useState([]); // 选择的标签id集合

  // 获取文章标签列表
  useEffect(() => {
    request.post('/api/tag/get').then((res: any) => {
      if (res?.code === 0) {
        setAllTags(res?.data?.allTags || [])
      }
    })
  },[])

  // 发布文章
  const handlePublish = () => {
    if (!title) {
      message.warning('请输入文章标题')
      return
    }
    request.post('/api/article/publish', {
      title,content,tagIds
    }).then((res: any) => {
      if (res?.code === 0) {
        message.success('发布成功')
        // 发布成功跳转个人中心页
        userId ? push(`/user/${userId}`):push('/')
      } else {
        message.error(res?.msg || '发布失败')
      }
    })
  }
  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }
  // 选择的标签id集合
  const handleSelectTag = (value: []) => {
    setTagIds(value)
  }
  return (
    <div className={styles.container}>
      <div className={styles.operation}>
        <Input className={styles.title} placeholder='请输入文章标题' value={title} onChange={handleTitleChange} />
        <Select className={styles.tag} mode="multiple" allowClear placeholder='请选择标签'
          onChange={handleSelectTag}>
          {
            allTags?.map((tag: any) => (<Select.Option key={tag.id} value={tag.id}>{ tag.title}</Select.Option>))
          }
        </Select>
        <Button className={styles.button} type='primary' onClick={handlePublish}>发布</Button>
      </div>
      <MDEditor value={content} onChange={()=>setContent} />
    </div>
  );
};

// component 可以挂载 props 属性
(NewEditor as any).layout = null;

export default NewEditor;
