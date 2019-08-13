# falso-amqp
Falso AMQP

## History
I was working with microservices in Node JS. The MS nodes were connected using RabbitMQ. My life was happy, until I've tried to deploy my project to azure.
That was when I realize that the thing is was not so easy.

In order to use AMQP on Azure, I had two options:
1) Set up a virtual machine, and a Rabbit MQ server inside.
2) Use the AMQP service, provided by azure (you really have to control your messages exchange, otherwise it will be very expensive).

I just wanted a simpler think: deploy my microservices into an "app service" resource. Just that!

So, I decided to implement a AMQP-Like NodeJS Server and Client (library).

## Getting started

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
2. TODO

## Client Library

```bash
npm i falso-amqp-client --save
```

[Falso AMQP Client](https://github.com/lcnvdl/falso-amqp-client)

The objetive of the Client library is to be compatible with Rabbit MQ.






