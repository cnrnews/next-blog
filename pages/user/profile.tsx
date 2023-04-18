/* eslint-disable @next/next/link-passhref */
import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Form, Input, Button, message } from 'antd';
import request from 'service/fetch';
import styles from './index.module.scss';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 4 },
};

const UserProfile = () => {
  const [form] = Form.useForm();

  // 请求用户详情
  useEffect(() => {
    request('/api/user/detail').then((res: any) => {
      console.log(res);
      if (res?.code === 0) {
        // 更新表单数据
        form.setFieldsValue(res?.data?.userInfo);
      }
    });
  }, [form]);

  //  更新个人信息
  const handleSubmit = (value: any) => {
    request.post('/api/user/update', { ...value }).then((res: any) => {
      if (res?.code === 0) {
        message.success('修改成功');
      } else {
        message.error(res?.msg || '修改失败');
      }
    });
  };
  return (
    <div className="content-layout">
      <div>
        <Form
          {...layout}
          form={form}
          className={styles.form}
          onFinish={handleSubmit}
        >
          <Form.Item label="用户名" name="nickname">
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item label="职位" name="job">
            <Input placeholder="请输入职位" />
          </Form.Item>
          <Form.Item label="个人介绍" name="introduce">
            <Input placeholder="请输入个人介绍" />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              保存修改
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
export default observer(UserProfile);
