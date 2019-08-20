# falso-amqp
Falso AMQP

[![NPM Version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![codecov][codecov-image]][codecov-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]

# History
I was working with microservices in Node JS. The MS nodes were connected using RabbitMQ. My life was happy, until I've tried to deploy my project to azure.
That was when I realize that the thing is was not so easy.

In order to use AMQP on Azure, I had two options:
1) Set up a virtual machine, and a Rabbit MQ server inside.
2) Use the AMQP service, provided by azure (you really have to control your messages exchange, otherwise it will be very expensive).

I just wanted a simpler think: deploy my microservices into an "app service" resource. Just that!

So, I decided to implement a AMQP-Like NodeJS Server and Client (library).

# Getting started

You have two ways to implement the server.

### Server (outside your project)
1. Install falso-amqp globally
```bash
npm i falso-amqp -g
```
2. Run it
falso-amqp

### Server (inside your project)
1. Install falso-amqp
```bash
npm i falso-amqp --save
```
2. Require
```javascript
const runServer = require("falso-amqp");

runServer();
```

# Client Library

```bash
npm i falso-amqp-client --save
```

[Falso AMQP Client](https://github.com/lcnvdl/falso-amqp-client)

The objetive of the Client library is to be compatible with Rabbit MQ.

# Compatibility

Features based on amqplib channel api
- [Channel API](https://www.squaremobius.net/amqp.node/channel_api.html)
- [amqplib](https://github.com/squaremo/amqp.node)

| Function                         |   Status   |
|----------------------------------|------------|
|connect                           |     OK     |
|**ChannelModel and CallbackModel**|            |
|connection.close                  |     OK     |
|events                            |            |
|connection.createChannel          |     OK     |
|connection.createConfirmChannel   |            |
|**Channel**                       |            |
|channel.close                     |            |
|events                            |            |
|channel.assertQueue               |     OK     |
|channel.checkQueue                |            |
|channel.deleteQueue               |            |
|channel.purgeQueue                |            |
|channel.bindQueue                 |     OK     |
|channel.unbindQueue               |            |
|channel.assertExchange            |     OK     |
|channel.checkExchange             |            |
|channel.deleteExchange            |            |
|channel.bindExchange              |            |
|channel.unbindExchange            |            |
|channel.publish                   |     OK     |
|channel.sendToQueue               |     OK     |
|channel.consume                   |     OK     |
|channel.cancel                    |            |
|channel.get                       |            |
|channel.ack                       |In progress |
|channel.ackAll                    |            |
|channel.nack                      |In progress |
|channel.nackAll                   |            |
|channel.reject                    |            |
|channel.prefetch                  |In progress |
|channel.recover                   |            |
|**ConfirmChannel**                |            |
|confirmChannel.publish            |            |
|confirmChannel.sendToQueue        |            |
|confirmChannel.waitForConfirms    |            |



[npm-image]: https://img.shields.io/npm/v/falso-amqp.svg?style=flat-square
[npm-url]: https://npmjs.org/package/falso-amqp
[travis-image]: https://img.shields.io/travis/lcnvdl/falso-amqp/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/lcnvdl/falso-amqp
[codecov-image]: https://codecov.io/gh/lcnvdl/falso-amqp/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/lcnvdl/falso-amqp
[snyk-image]: https://snyk.io/test/github/lcnvdl/falso-amqp/badge.svg
[snyk-url]: https://snyk.io/test/github/lcnvdl/falso-amqp