ARG REGISTRY=containerregistrydev.azurecr.io
FROM $REGISTRY/library/golang:1.21-alpine as debug
WORKDIR /src
COPY ./src/go.mod /src/
COPY ./src/go.sum /src/
RUN go mod download

FROM $REGISTRY/library/golang:1.21-alpine as build
WORKDIR /app
COPY ./src/go.mod /app/ 
COPY ./src/go.sum /app/
RUN go mod download

COPY ./src /app/
RUN CGO_ENABLED=0 GOOS=linux go build -o app -ldflags -s

FROM scratch as runtime
COPY --from=build /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ca-certificates.crt
COPY --from=build /app/app /app

ENTRYPOINT [ "/app" ]