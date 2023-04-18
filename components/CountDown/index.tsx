import React,{useState,useEffect} from 'react';
import type { NextPage } from 'next';

// 参数类型定义
interface IPropsType {
  time: number
  onEnd: Function
}
const CountDown: NextPage<IPropsType> = (props) => {
  const { time, onEnd } = props
  // 本地变量
  const [count, setCount] = useState(time || 60)
  
  // 副作用函数：可以监听值的改变
  useEffect(() => {
    let timer = setInterval(() => {
      // 执行 state 变更
      setCount((count) => {
        if (count == 0) {
          // 清除定时器
          clearInterval(timer)
          // 执行定时器结束函数
          onEnd && onEnd()
          return count
        }
        return count - 1
      })
    }, 1000)
     // 副作用函数 useEffect 默认回调函数，用于处理优化逻辑
     return () => {
      // 清除定时器
      clearInterval(timer)
     }
  },[time,onEnd])
  return <div>{count}</div>;
};
export default CountDown;
