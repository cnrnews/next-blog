import React from 'react';
import type { NextPage } from 'next';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Avatar, Button, Dropdown, Menu, message } from 'antd';
import { HomeOutlined, LoginOutlined } from '@ant-design/icons';
import Link from 'next/link';
import styles from './index.module.scss';
import { navs } from './config';
import Login from '../Login';
import request from 'service/fetch';
import { useStore } from 'store/index';
const NavBar: NextPage = () => {
  const store = useStore();
  const { userId, avatar } = store.user.userInfo;
  const { pathname, push } = useRouter();
  const [isShowLogin, setIsShowLogin] = useState(false);
  console.log(setIsShowLogin);

  // 新建文章
  const handleGotoEditorPage = () => {
    if (userId) {
      push('/editor/new');
    } else {
      message.warning('请先登录');
    }
  };
  const handleLogin = () => {
    setIsShowLogin(true);
  };
  // 关闭登录框
  const handleClose = () => {
    setIsShowLogin(false);
  };
  // 个人主页
  const handleGotoPersonalPage = () => {
    push(`/user/${userId}`);
  };

  // 退出系统
  const handleLogout = () => {
    request.post('/api/user/logout').then((res: any) => {
      // 请求成功，清空 store
      if (res?.code === 0) {
        store.user.setUserInfo({});
      }
    });
  };

  // 渲染下拉菜单
  const renderDropDownMenu = (
    <Menu>
      <Menu.Item onClick={handleGotoPersonalPage}>
        <HomeOutlined />
        &nbsp; 个人主页
      </Menu.Item>
      <Menu.Item onClick={handleLogout}>
        <LoginOutlined />
        &nbsp; 退出系统
      </Menu.Item>
    </Menu>
  );
  return (
    <div className={styles.navbar}>
      <section className={styles.logoArea}>BLOG-C</section>
      <section className={styles.linkArea}>
        {navs?.map((nav) => (
          <Link key={nav?.label} href={nav?.route}>
            <a className={pathname == nav?.route ? styles.active : ''}>
              {nav?.label}
            </a>
          </Link>
        ))}
      </section>
      <section className={styles.opeoperationArea}>
        <Button onClick={handleGotoEditorPage}>写文章</Button>
        {userId ? (
          <>
            <Dropdown overlay={renderDropDownMenu} placement="bottomLeft">
              <Avatar src={avatar} size={32} />
            </Dropdown>
          </>
        ) : (
          <Button type="primary" onClick={handleLogin}>
            登录
          </Button>
        )}
      </section>
      <Login isShow={isShowLogin} onClose={handleClose} />
    </div>
  );
};
export default observer(NavBar);
