FROM ubuntu:latest
LABEL authors="bulat"

ENTRYPOINT ["top", "-b"]