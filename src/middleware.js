const jwt = require('jsonwebtoken');
const compose = require('koa-compose');

/*
* Return a middleware which finds an access token among the request params
* and saves the token into the `ctx.accessToken` variable.
*/

exports.setAccessTokenFromParams = function(param='accessToken') {
  return async function(ctx, next) {
    if (!param || ctx.accessToken) {
      return await next();
    }

    let content = ctx.request.query[param];
    if (content) {
      ctx.accessToken = content.trim();
    }

    await next();
  };
};

/*
* Return a middleware which parses the `Authorization` header, extracts a JWT 
* token from it and saves the token into the `ctx.accessToken` variable.
*/

exports.setAccessTokenFromHeaders = function(header='Authorization') {
  return async function(ctx, next) {
    if (!header || ctx.accessToken) {
      return await next();
    }

    let content = ctx.header[header.toLowerCase()];
    if (!content) {
      return await next();
    }

    let [kind, token] = content.split(' ');
    if (/^Bearer$/i.test(kind)) {
      ctx.accessToken = token.trim();
    }

    await next();
  };
};

/*
* Return a middleware which finds an access token among the request cookies
* and saves the token into the `ctx.accessToken` variable.
*/

exports.setAccessTokenFromCookies = function(cookie='accessToken') {
  return async function(ctx, next) {
    if (!cookie || ctx.accessToken) {
      return await next();
    }

    let content = ctx.cookies.get(cookie);
    if (content) {
      ctx.accessToken = content.trim();
    }

    await next();
  };
};

/*
* Returns a middleware which searches for an access token among request params,
* headers and cookies then saves its content into the `ctx.accessToken` variable.
*/

exports.setAccessToken = function({param='accessToken', header='Authorization', cookie='accessToken'}={}) {
  return compose([
    exports.setAccessTokenFromParams(param),
    exports.setAccessTokenFromHeaders(header),
    exports.setAccessTokenFromCookies(cookie)
  ]);
};

/*
* Returns a middleware which verifies access token existance, validates its 
* content and saves it into the `ctx.accessPayload` variable. In case when the 
* token is not set or its content is not valid, an error is thrown.
*/

exports.verifyAccessToken = function({secret, status=401}={}, options) {
  return async function(ctx, next) {
    let token = ctx.accessToken;

    if (!token) {
      ctx.throw(status, 'No access token found');
    }

    try {
      ctx.accessPayload = jwt.verify(token, secret, options);
    } catch(e) {
      ctx.throw(status, `Invalid token (${e.message})`);
    }

    await next();
  };
};
