---
title: 'How to make a docker image with Nginx and Nodejs'
date: '2020-02-15'
description: 'Nginx and Nodejs into one docker image'
---

In this post, I'll explain how to dockerize Nodejs app and Nginx as reverse proxy. The best or the most simple way might be just creating two docker images, one for Nginx and one for Nodejs. However I'll create just one docker image includes both.

### Create Nodejs app
For creating the docker image, let's just create very simple Nodejs app here.

```shell
mkdir nodeapp
cd nodeapp
npm init

# I'll just enter for every prompts

npm install --save express

```

<br />

Now we need to add index.js to run express server.

```javascript
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
```

### Prepare nginx.conf and start script
```
nodeapp
 |-- /node_modules
 |-- index.js
 |-- package.json
 |-- package-lock.json
 |-- nginx.conf
 |-- start.sh
```

### Dockerfile
There are many useful docker images we can use on docker hub. We will create our docker image based on one of the [Official Nginx docker images](https://hub.docker.com/_/nginx).

Let's create Dockerfile like below.
```dockerfile
# We will use nginx:mainline-alpine to minimize our docker image size.
FROM nginx:mainline-alpine

# Copy nginx.conf file to the docker image
COPY nginx.conf /etc/nginx/nginx.conf

# This line will install node and npm to the docker image.
# With --repository=http://.... option, we can install latest nodejs version.
RUN apk add --no-cache --repository=http://dl-cdn.alpinelinux.org/alpine/edge/main nodejs npm

# Out nodejs app will be located /usr/src/app
WORKDIR /usr/src/app

# Copy all our nodejs app into the docker image
COPY . .

# Install pm2 globally
RUN npm install -g pm2

# When your app is more complicated and need to be built before running
# npm prune and npm cach clean to minimize the size of our docker image
# RUN npm install \
#     && npm run build \
#     && npm prune --production \
#     && npm cache clean --force

EXPOSE 80

# COPY start.sh and make it executable
COPY start.sh /usr/src/app/start.sh
RUN chmod 744 start.sh

CMD ["/usr/src/app/start.sh"]
```
### Build docker image
Now we are very prepared to create the docker image.

All we have to do here is just enter below command.

```shell
docker build -t <IMAGE_NAME_YOU_WANT> .
```