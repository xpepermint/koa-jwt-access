'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const jwt = require('jsonwebtoken');
const compose = require('koa-compose');

/*
* Return a middleware which finds an access token among the request params
* and saves the token into the `ctx.accessToken` variable.
*/

exports.setAccessTokenFromParams = function () {
  let param = arguments.length <= 0 || arguments[0] === undefined ? 'accessToken' : arguments[0];

  return (() => {
    var _ref = _asyncToGenerator(function* (ctx, next) {
      if (!param || ctx.accessToken) {
        return yield next();
      }

      let content = ctx.request.query[param];
      if (content) {
        ctx.accessToken = content.trim();
      }

      yield next();
    });

    return function (_x2, _x3) {
      return _ref.apply(this, arguments);
    };
  })();
};

/*
* Return a middleware which parses the `Authorization` header, extracts a JWT 
* token from it and saves the token into the `ctx.accessToken` variable.
*/

exports.setAccessTokenFromHeaders = function () {
  let header = arguments.length <= 0 || arguments[0] === undefined ? 'Authorization' : arguments[0];

  return (() => {
    var _ref2 = _asyncToGenerator(function* (ctx, next) {
      if (!header || ctx.accessToken) {
        return yield next();
      }

      let content = ctx.header[header.toLowerCase()];
      if (!content) {
        return yield next();
      }

      var _content$split = content.split(' ');

      var _content$split2 = _slicedToArray(_content$split, 2);

      let kind = _content$split2[0];
      let token = _content$split2[1];

      if (/^Bearer$/i.test(kind)) {
        ctx.accessToken = token.trim();
      }

      yield next();
    });

    return function (_x5, _x6) {
      return _ref2.apply(this, arguments);
    };
  })();
};

/*
* Return a middleware which finds an access token among the request cookies
* and saves the token into the `ctx.accessToken` variable.
*/

exports.setAccessTokenFromCookies = function () {
  let cookie = arguments.length <= 0 || arguments[0] === undefined ? 'accessToken' : arguments[0];

  return (() => {
    var _ref3 = _asyncToGenerator(function* (ctx, next) {
      if (!cookie || ctx.accessToken) {
        return yield next();
      }

      let content = ctx.cookies.get(cookie);
      if (content) {
        ctx.accessToken = content.trim();
      }

      yield next();
    });

    return function (_x8, _x9) {
      return _ref3.apply(this, arguments);
    };
  })();
};

/*
* Returns a middleware which searches for an access token among request params,
* headers and cookies then saves its content into the `ctx.accessToken` variable.
*/

exports.setAccessToken = function () {
  var _ref4 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var _ref4$param = _ref4.param;
  let param = _ref4$param === undefined ? 'accessToken' : _ref4$param;
  var _ref4$header = _ref4.header;
  let header = _ref4$header === undefined ? 'Authorization' : _ref4$header;
  var _ref4$cookie = _ref4.cookie;
  let cookie = _ref4$cookie === undefined ? 'accessToken' : _ref4$cookie;

  return compose([exports.setAccessTokenFromParams(param), exports.setAccessTokenFromHeaders(header), exports.setAccessTokenFromCookies(cookie)]);
};

/*
* Returns a middleware which verifies access token existance, validates its 
* content and saves it into the `ctx.accessPayload` variable. In case when the 
* token is not set or its content is not valid, an error is thrown.
*/

exports.verifyAccessToken = function () {
  var _ref5 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  let secret = _ref5.secret;
  var _ref5$status = _ref5.status;
  let status = _ref5$status === undefined ? 401 : _ref5$status;
  let options = arguments[1];

  return (() => {
    var _ref6 = _asyncToGenerator(function* (ctx, next) {
      let token = ctx.accessToken;

      if (!token) {
        ctx.throw(status, 'No access token found');
      }

      try {
        ctx.accessPayload = jwt.verify(token, secret, options);
      } catch (e) {
        ctx.throw(status, `Invalid token (${ e.message })`);
      }

      yield next();
    });

    return function (_x12, _x13) {
      return _ref6.apply(this, arguments);
    };
  })();
};