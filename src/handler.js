// @flow
import Jimp from 'jimp';
import { diffImage } from './lib';

type APIGatewayRequest = {
  body: string,
};
type APIGatewayResponse = {
  statusCode: number,
  body: string,
};
type LambdaEvent = APIGatewayRequest;
type LambdaContext = Object;
type LambdaCallback = (?Error, ?APIGatewayResponse) => void;
type LambdaFunction = (LambdaEvent, LambdaContext, LambdaCallback) => any;

export const diff: LambdaFunction = async (event, context, callback) => {
  const param = JSON.parse(event.body);
  const { image, ...rest } = await diffImage(param);
  const buffer = await new Promise((resolve, reject) => {
    image.getBuffer(Jimp.MIME_PNG, (err, buf) => (err ? reject(err) : resolve(buf)));
  });
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      ...rest,
      image: buffer.toString('base64'),
    }),
  };
  callback(null, response);
};
