import '@uiw/react-md-editor/markdown-editor.css';
// import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';
import { prepareConnection } from 'db';
import { Article } from 'db/entity';
import { ChangeEvent, useState,useEffect } from 'react';
import { Input, Button, message,Select} from 'antd'
import { IArticle } from 'pages/api/index';
import styles from './index.module.scss'
import request from 'service/fetch'
import { useRouter } from 'next/router'

// props 数据类型定义
interface IProps {
  article: IArticle;
}

interface ITagType{
  id: number 
  title: string 
  icon: string
  follow_count: number 
  article_count: number
}


// 请求文章详情
export async function getServerSideProps({ params }:{params:any}) {
  const articleId = params.id;
  const db = await prepareConnection();
  // 获取文章Repository
  const articleRepo = db.getRepository(Article);
  // 获取文章详情
  const article = await articleRepo.findOne({
    where: {
      id: articleId
    }, // 查询条件
    relations: ['user','tags'], // 关联用户信息
  });

  // 更新文章阅读量
  if (article) {
    article.views = article.views + 1;
    await articleRepo.save(article);
  }

  // 返回给客户端数据
  return {
    props: {
      article: JSON.parse(JSON.stringify(article)) || {},
    },
  };
}


const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

const ModifyEditor = ({article}:IProps) => {
  const { push, query } = useRouter()
  const articleId = Number(query?.id)
  const [title, setTitle] = useState(article?.title);
  const [content, setContent] = useState(article.content);
  const [allTags, setAllTags] = useState([]); // 标签列表
  const [tagIds, setTagIds] = useState((article as any)?.tags?.map((tag:ITagType) => tag.id)||[]); // 选择的标签id集合

    // 获取文章标签列表
    useEffect(() => {
      request.post('/api/tag/get').then((res: any) => {
        if (res?.code === 0) {
          setAllTags(res?.data?.allTags || [])
        }
      })
    }, [])
  
  // 发布文章
  const handlePublish = () => {
    if (!title) {
      message.warning('请输入文章标题')
      return
    }
    request.post('/api/article/update', {
      title,content,id:articleId,tagIds
    }).then((res: any) => {
      if (res?.code === 0) {
        message.success('更新成功')
        articleId ? push(`/article/${articleId}`):push('/')
      } else {
        message.error(res?.msg || '更新失败')
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
        <Select className={styles.tag} mode="multiple" allowClear placeholder='请选择标签'   defaultValue={tagIds}
          onChange={handleSelectTag}>
          {
            allTags?.map((tag: any) => (<Select.Option key={tag.id} value={tag.id}>{ tag.title}</Select.Option>))
          }
        </Select>
        <Button className={styles.button} type='primary'  onClick={handlePublish}>发布</Button>
      </div>
      <MDEditor value={content} onChange={()=>setContent} />
    </div>
  );
};

// component 可以挂载 props 属性
(ModifyEditor as any).layout = null;

export default ModifyEditor;
