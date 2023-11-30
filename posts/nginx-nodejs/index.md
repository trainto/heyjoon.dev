---
title: 'Nginx - Configure Nginx as reverse proxy for Nodejs(Express)'
date: '2019-11-08'
---

Recently I deployed a Node.js(Express) web application on AWS, and I used Nginx as its reverse proxy. So I want to take notes.

## Why do we need reverse proxy?

### SSL

SSL might be the most popular reason, but in my case, I'm using AWS's load balancer and SSL is being handled by it. So SSL is not the reason I use reverse proxy.

### gzip

gzip compression is also popular feature which you should offload from the application to a reverse proxy. You should make your application server only focus on application logic for performance reasons.

### static asset

The best way is to use nginx server to serve you static file and let you node.js server handle the dynamic content. That would be the most optimized solution to reduce the amount of requests on your node.js server that is slower to server static files than nginx. and the configuration to achieve that is very simple.

## nginx.conf

Once you install Nginx, you can find it under /etc/nginx, and there will be 'nginx.conf' file which is the default configuration file.

For the nginx.conf configurationf file, I changed just two things. First, turning off server tokens which might be security issue, and turning on gzip compression.

```nginx
http {
    ##
    # Basic Settings
    ##

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    server_tokens off;

    # server_names_hash_bucket_size 64;
    # server_name_in_redirect off;

    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    ##
    # SSL Settings
    ##

    ssl_protocols TLSv1 TLSv1.1 TLSv1.2; # Dropping SSLv3, ref: POODLE
    ssl_prefer_server_ciphers on;

    ##
    # Logging Settings
    ##

    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    ##
    # Gzip Settings
    ##

    gzip on;

    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_buffers 16 8k;
    gzip_http_version 1.1;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    ##
    # Virtual Host Configs
    ##

    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
}
```

To turn off the server tokens(mainly to hide nginx version) and turn off gzip compression, I just uncommented them from default configuration file.

## Your appplication specific configuration

You need to create a configuration file under /etc/nginx/sites-available/ to set your application specific configuration. The file name can be whatever you like.

```nginx
server {
    listen 80;
    server_name your.domain.com;

    if ($http_x_forwarded_proto = "http") {
        return 301 https://$server_name$request_uri;
    }

    location /favicon.ico {
        alias /your/favicon/location/favicon.ico;
    }

    location /robots.txt {
        alias /your/robots/locaion/robots.txt;
    }

    location /static/ {
        alias /your/static/asset/location/;
        expires 30d;
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        client_max_body_size 20M;
    }
}
```

Specify port and domain first.

<br />

```nginx
if ($http_x_forwarded_proto = "http") {
    return 301 https://$server_name$request_uri;
}
```

If the request is with http, this configuration redirects it to https permanantly(301).

<br />

```nginx
location /favicon.ico {
    alias /your/favicon/location
}

location /robots.txt {
    alias /your/robots/location
}

location /static/ {
    alias /your/static/asset/location
    expires 30d;
}
```
There are configuratinos for serving static files. If you specify **_expires_** like 30d, the static files will have following header _cache-control: max-age=2592000_, and will be cached in the browser efficiently.

<br />

```nginx
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    client_max_body_size 20M;
}
```

This configuration will forward requests from clients to your node.js server. _prox_set_header_ for displaying actual remote ip address when logging, and _client_max_body_size_ is literally max body size. In my case, I set it to 20 Megabyte.

Now you need to make symbolic link to this congifuration file from /etc/nginx/sites-enabled and enter the command following to restart Nginx.

```shell
sudo service nginx restart
```
