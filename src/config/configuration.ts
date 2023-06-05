export default () => ({
  ...process.env,
    PORT: parseInt(process.env.PORT, 10) || 5555,
    MONGO_URI : process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/worktestxxx',
    SECRETKEY: process.env.SECRETKEY || 'test',
  });