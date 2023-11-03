const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/v2',
    createProxyMiddleware({
      target: 'https://test.paycrypto.money',
      changeOrigin: true,
      secure: false,
    })
  );
};
