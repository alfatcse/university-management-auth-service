import { SetOptions, createClient } from 'redis';
import config from '../config';

const redisClint = createClient({
  url: config.redis.url,
});
const redisPubClint = createClient({
  url: config.redis.url,
});
const redisSubClint = createClient({
  url: config.redis.url,
});
// eslint-disable-next-line no-console
redisClint.on('error', error => console.log('RedisError', error));
// eslint-disable-next-line no-console
redisClint.on('connect', () => console.log('Redis Connected'));
const connect = async (): Promise<void> => {
  await redisClint.connect();
  await redisPubClint.connect();
  await redisSubClint.connect();
};
const set = async (
  key: string,
  value: string,
  options?: SetOptions
): Promise<void> => {
  await redisClint.set(key, value, options);
};
const get = async (key: string): Promise<string | null> => {
  return await redisClint.get(key);
};
const del = async (key: string): Promise<void> => {
  await redisClint.del(key);
};
const setAccessToken = async (userId: string, token: string): Promise<void> => {
  const key = `access-token:${userId}`;
  await redisClint.set(key, token, { EX: Number(config.redis.expires_in) });
};
const getAccessToken = async (userId: string): Promise<string | null> => {
  const key = `access-token:${userId}`;
  return await redisClint.get(key);
};
const delAccessToken = async (userId: string): Promise<void> => {
  const key = `access-token:${userId}`;
  await redisClint.del(key);
};
const disconnect = async (): Promise<void> => {
  await redisClint.quit();
  await redisPubClint.quit();
  await redisSubClint.quit();
};
export const RedisClient = {
  connect,
  set,
  get,
  del,
  disconnect,
  setAccessToken,
  getAccessToken,
  delAccessToken,
  publish: redisPubClint.publish.bind(redisPubClint),
  subscribe: redisSubClint.subscribe.bind(redisSubClint),
};
