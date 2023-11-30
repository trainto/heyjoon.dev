---
title: 'Docker - Setting up a MongoDB Replica Set with Docker'
date: '2019-09-17'
---

Setting up a MongoDB replica set on the one host might not make sense, but it can be useful to build up the dev environment. Because you don't have to set up 2 or 3 servers to build dev environment. Instead having physical servers for MongoDB replica set, Docker can simulate it.

## Install Docker

First of all, we should install Docker. To install Docker on your system, please refer [official document](https://docs.docker.com/install/linux/docker-ce/ubuntu/) for installing it.

Ater installing Docker, we need docker-compose as well, so that we can set up MongoDB via docker-compose.yml.

```shell
// Ubuntu
sudo apt install docker-compose
```

## docker-compose.yml

The following is yaml file for composing MongoDB replica set. This yaml file will compose primay, secondary and arbiter. I'm sure you already know well about replica set, but if you need more information about this, then refer MongoDB's [official document](https://docs.mongodb.com/manual/core/replica-set-members/).

```yml
version: '3.3'
services:
  mongo-primary:
    container_name: mongo-primary
    image: mongo:4.0.11
    volumes:
      - $HOME/.dockerMongoRepl/primary/data/db:/data/db
      - $HOME/.dockerMongoRepl/keyfile:/data/keyfile
    extra_hosts:
      - 'your.domain.example:192.168.1.xx'
    ports:
      - 27017:27017
    restart: always
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: yourpassword
    command: --bind_ip_all --auth --keyFile /data/keyfile/mongo-cluster-key --replSet rs0 --enableMajorityReadConcern false
  mongo-secondary:
    container_name: mongo-secondary
    image: mongo:4.0.11
    volumes:
      - $HOME/.dockerMongoRepl/secondary/data/db:/data/db
      - $HOME/.dockerMongoRepl/keyfile:/data/keyfile
    depends_on:
      - mongo-primary
    extra_hosts:
      - 'your.domain.example:192.168.1.xx'
    ports:
      - 27018:27017
    restart: always
    command: --bind_ip_all -auth --keyFile /data/keyfile/mongo-cluster-key --replSet rs0 --enableMajorityReadConcern false
  mongo-arbiter:
    container_name: mongo-arbiter
    image: mongo:4.0.11
    volumes:
      - $HOME/.dockerMongoRepl/arbiter/data/arb:/data/arb
      - $HOME/.dockerMongoRepl/keyfile:/data/keyfile
    depends_on:
      - mongo-primary
    extra_hosts:
      - 'your.domain.example:192.168.1.xx'
    ports:
      - 27019:27017
    restart: always
    command: --bind_ip_all --auth --keyFile /data/keyfile/mongo-cluster-key --replSet rs0 --enableMajorityReadConcern false
```

If you google for Docker and MongoDB replica set, you can find a lot of docker-compose.yml examples similar above. They also work well, however none of them work properly when I try to connect it from remote client like Node.js.

To make the replica set on Docker works properly with remote connection, we need to set "extra_hosts" and "ports". In my case, I use asus router and its ddns, so "extra_hosts" value would be

```yml
extra_hosts:
  - 'id.asuscomm.com:192.168.1.100'
```

The IP address is assigned by asus router, and domain is assigned by asus ddns service.

And ports should be different for each node, in my case 27017, 27018 and 27019, so that we can specify different address for each node in the replica set.

## Starting MongoDB replica set

In my case, I made sh script file to start it.

```shell
 #!/bin/sh

sudo su <<EOF

mkdir $HOME/.dockerMongoRepl
mkdir $HOME/.dockerMongoRepl/keyfile

openssl rand -base64 756 > $HOME/.dockerMongoRepl/keyfile/mongo-cluster-key
chmod 400 $HOME/.dockerMongoRepl/keyfile/mongo-cluster-key
chown 999:999 $HOME/.dockerMongoRepl/keyfile/mongo-cluster-key
EOF

sudo docker-compose up -d
```

This shell script file makes directories for MongoDB's data and keyfile for security between replica nodes, and then stars MongoDB replica set using docker-compose.yml file introduced above.

## Setting replica set

Now that MongoDB nodes are running on Docker, we need to config that the nodes can recognize each other.

```shell
// Access to primary mongo image's  shell
sudo docker exec -it mongo-primary bash
// Execute mongo shell
mongo -u root
```

When you try to execute mongo with -u options, it requires you to enter password. The password is the on you entered in docker-compose.yml.

Once you entered mongo shell, to set up replica set, the following should be applied.

```shell
config = {
  "_id": "rs0",
  "members": [{
    "_id": 0,
    "host": "address.whichCanAccess.yourServer:27017"
  }, {
    "_id": 1,
    "host": "address.whichCanAccess.yourServer:27018"
  }, {
    "_id": 2,
    "host": "address.whichCanAccess.yourServer:27019",
    arbiterOnly: true
  }]
}

rs.initiate(config)
```

Each "host" value would be the value you entered in docker-compose.yml as extra_hosts and ports. After above applied, if you see mongo's shell prompt becoming like "rs0:PRIMARY>", then everything is done.
