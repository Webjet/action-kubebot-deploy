FROM alpine

RUN apk update && apk upgrade && \
    apk add --no-cache curl

COPY $7 /deployment.yaml
COPY entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]