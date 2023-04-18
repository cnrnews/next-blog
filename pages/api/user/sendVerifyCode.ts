import { NextApiRequest, NextApiResponse } from 'next';
import {withIronSessionApiRoute} from 'iron-session/next'
import { format } from 'date-fns';// 日期格式化
import md5 from 'md5'; // md5 加密
import { encode } from 'js-base64'; // base64 处理
import request from 'service/fetch'; // 封装的axios api
import { ironOptions } from 'config/index'
import {ISession} from 'pages/api/index'

// 这样封装的异步请求的 req 中就可以获取到 session 了
export default withIronSessionApiRoute(sendVerifyCode,ironOptions)


async function sendVerifyCode(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session:ISession = req.session
  // 获取验证码接口参数处理
  const { to = '', templateId = '1' } = req.body;
  const AppId = '2c948876870df82e01878253a1ba1229';
  const AccountId = '2c948876870df82e01878253a0891222';
  const AuthToken = 'b3b52a45251a4c5d8d1fb93ee72d70a8';
  const NowDate = format(new Date(), 'yyyyMMddHHmmss');
  const SigParameter = md5(`${AccountId}${AuthToken}${NowDate}`);
  const Authorization = encode(`${AccountId}:${NowDate}`);
  const verifyCode = Math.floor(Math.random() * (9999 - 1000)) + 1000;
  const expireMinute = '5';
  const url = `https://app.cloopen.com:8883/2013-12-26/Accounts/${AccountId}/SMS/TemplateSMS?sig=${SigParameter}`;

  // 调用短信平台获取验证码接口
  const response = await request.post(
    url,
    {
      to,
      templateId,
      appId: AppId,
      datas: [verifyCode, expireMinute],
    }, // 请求体
    {
      headers: {
        Authorization,
      },
    } // headers
  );
  console.log('verifyCode',verifyCode);
  console.log('response',response);
  // 解构请求返回体数据
  const { statusCode, templateSMS, statusMsg } = response as any;
  if (statusCode === '000000') {
    // 在服务端 session 中存储验证码
    session.verifyCode = verifyCode
    await session.save()
    res.status(200).json({
      code: 0,
      msg: statusMsg,
      data: {
        templateSMS
      }
    })
  } else {
    res.status(200).json({
      code: statusCode,
      msg: statusMsg
    })
  }
}
