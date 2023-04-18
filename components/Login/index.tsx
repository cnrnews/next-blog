import React, { ChangeEvent, useState } from 'react';
import type { NextPage } from 'next';
import { message } from 'antd';
import { observer } from 'mobx-react-lite';
import styles from './index.module.scss';
import CountDown from '../CountDown';
import request from '../../service/fetch';
interface IPropsType {
  isShow: boolean;
  onClose: Function;
}
const Login: NextPage<IPropsType> = (props) => {
  const { isShow = false, onClose } = props;
  // 验证码
  const [isShowVerifyCode, setIsShowVerifyCode] = useState(false);
  // 登录表单
  const [form, setForm] = useState({
    phone: '',
    verify: '',
  });

  // 关闭弹框
  const handleClose = () => {
    setIsShowVerifyCode(false);
    onClose && onClose();
  };
  // 获取验证码
  const handleGetVerifyCode = () => {
    if (!form.phone) {
      message.warning('请输入手机号');
      return;
    }
    // 发送获取验证码请求接口
    // url 路径要跟定义的接口路径一致
    request
      .post('/api/user/sendVerifyCode', {
        to: form?.phone,
        templateId: 1,
      })
      .then((res: any) => {
        if (res?.code === 0) {
          setIsShowVerifyCode(true);
        } else {
          message.error(res?.msg || '未知错误');
        }
      });
  };
  // 登录
  const handleLogin = () => {
    // url 路径要跟定义的接口路径一致
    request
      .post('/api/user/login', {
        phone: form?.phone,
        verify: form?.verify,
        identity_type: 'phone',
      })
      .then((res: any) => {
        if (res?.code === 0) {
          message.success(res?.msg);
          // 关闭弹框
          handleClose();
        } else {
          message.error(res?.msg || '未知错误');
        }
      });
  };
  // 三方登录
  const handleOAuthGithub = () => {};
  // 输入框内容改变
  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(name, value);
    setForm({
      ...form,
      [name]: value,
    });
  };
  // 倒计时结束
  const handleCountDownEnd = () => {
    setIsShowVerifyCode(false);
  };
  return isShow ? (
    <div className={styles.loginArea}>
      <div className={styles.loginBox}>
        <div className={styles.loginTitle}>
          <div>手机号登录</div>
          <div className={styles.close} onClick={handleClose}>
            x
          </div>
        </div>
        <input
          type="text"
          name="phone"
          placeholder="请输入手机号"
          value={form.phone}
          onChange={handleFormChange}
        />
        <div className={styles.verifyCodeArea}>
          <input
            type="text"
            name="verify"
            placeholder="请输入验证码"
            value={form.verify}
            onChange={handleFormChange}
          />
          <span className={styles.verifyCode} onClick={handleGetVerifyCode}>
            {isShowVerifyCode ? (
              <CountDown time={10} onEnd={handleCountDownEnd} />
            ) : (
              '获取验证码'
            )}
          </span>
        </div>
        <div className={styles.loginBtn} onClick={handleLogin}>
          登录
        </div>
        <div className={styles.otherLogin} onClick={handleOAuthGithub}>
          使用 Github 登录
        </div>
        <div className={styles.loginPrivacy}>
          注册登录即表示同意
          <a
            href="https://moco.imooc.com/privacy.html"
            target="_blank"
            rel="noreferrer"
          >
            隐私政策
          </a>
        </div>
      </div>
    </div>
  ) : null;
};
export default observer(Login);
