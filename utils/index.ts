// 要存储数据的类型定义
interface ICookieInfo{
  userId: string
  nickname: string
  avatar: string
}

// 设置 cookie信息
export const setCookie = (cookies:any, { userId, nickname, avatar }:ICookieInfo) => {
  // 超时
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
  const path = '/'

  cookies.set('userId', userId, {
    path,
    expires
  })
  cookies.set('nickname', nickname, {
    path,
    expires
  })
  cookies.set('avatar', avatar, {
    path,
    expires
  })
}

// 清除 cookie信息
export const clearCookie = (cookies:any) => {
  // 超时
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
  const path = '/'

  cookies.set('userId','', {
    path,
    expires
  })
  cookies.set('nickname', '', {
    path,
    expires
  })
  cookies.set('avatar', '', {
    path,
    expires
  })
}