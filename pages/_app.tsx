import '../styles/globals.css';
import { NextPage } from 'next';
import { StoreProvider } from 'store/index';
import Layout from 'components/layout';

interface IProps {
  initialValue: Record<any, any>;
  Component: NextPage;
  pageProps: any;
}

export default function App({ initialValue, Component, pageProps }: IProps) {
  // 动态渲染页面，通过为 componnet 添加 layout 属性 隐藏 Header、Footer
  const renderLayout = () => {
    if ((Component as any).layout === null) {
      return <Component {...pageProps} />;
    } else {
      return (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      );
    }
  };

  return (
    <StoreProvider initialValue={initialValue}>{renderLayout()}</StoreProvider>
  );
}

// 初始化组件 props 数据 为 cookie 存储的用户信息
App.getInitialProps = async ({ ctx }: { ctx: any }) => {
  const { userId, nickname, avatar } = ctx?.req?.cookies || {};

  return {
    initialValue: {
      user: {
        userInfo: {
          userId,
          nickname,
          avatar,
        },
      },
    },
  };
};
