// 管理接口异常code和消息的映射关系
export const EXCEPTION_USER = {
  NOT_LOGIN: {
    code: 1001,
    msg: '未登录',
  },
  NOT_FOUND: {
    code: 1002,
    msg: '未找到用户',
  },
};

export const EXCEPTION_ARTICLE = {
  PUBLISH_FAILED: {
    code: 2001,
    msg: '发布失败',
  },
  UPDATE_FAILED: {
    code: 2002,
    msg: '更新失败',
  },
  NOT_FOUND: {
    code: 2003,
    msg: '未找到文章',
  },
};

// Tag 异常管理
export const EXCEPTION_TAG = {
  PUBLISH_FAILED: {
    code: 3001,
    msg: '关注/取关失败',
  },
};

// 评论异常code
export const EXCEPTION_COMMENT = {
  PUBLISH_FAILED: {
    code: 4001,
    msg: '发表失败',
  },
};
