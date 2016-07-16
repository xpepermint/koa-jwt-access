# [koa](http://koajs.com/)-[jwt](https://en.wikipedia.org/wiki/JSON_Web_Token)-access 

> Flexible JWT middleware for Koa.js v2.

## Installation

```js
$ npm install --save koa-jwt-access
```

## Example

```js
const Koa = require('koa');
const access = require('koa-jwt-access');

let koa = new Koa();
koa.context.secret = 'notasecret';
koa.use(access.setAccessToken());
koa.use(access.verifyAccessToken({secret: (ctx) => ctx.secret}));
```

## API

### setAccessTokenFromParams(param='accessToken')

Return a middleware which finds an access token among the request params and saves the token into the `ctx.accessToken` variable.

### setAccessTokenFromHeaders(header='Authorization')

Return a middleware which parses the `Authorization` header, extracts a JWT token from it and saves the token into the `ctx.accessToken` variable.

### setAccessTokenFromCookies(cookie='accessToken')

Return a middleware which finds an access token among the request cookies and saves the token into the `ctx.accessToken` variable.

### setAccessToken({param='accessToken', header='Authorization', cookie='accessToken'})

Returns a middleware which searches for an access token among request params, headers and cookies then saves its content into the `ctx.accessToken` variable.

### verifyAccessToken({secret, status=401}={}, options)

Returns a middleware which verifies access token existance, validates its content and saves it into the `ctx.accessPayload` variable. In case when the token is not set or its content is not valid, an error is thrown.

The `secret` attribute expects a key for decoding the JWT token. Here you can pass a `string` of a `function`.  

The `options` attribute is passed directly into `verify` method of the [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) package. 

## License (MIT)

```
Copyright (c) 2016 Kristijan Sedlak <xpepermint@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
