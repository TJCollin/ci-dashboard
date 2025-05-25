#!/bin/bash

FILE=Dockerfile

TAG=node_zhangcong

NAME=zd-devops-nj-release-docker.artnj.zte.com.cn/docker-local/node

docker build --no-cache -f "$FILE" -t "$NAME":"$TAG" .

