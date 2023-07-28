# kubebot action

This action can be used to deploy your docker application to K8s clusters using Webjet kubebot.
In your github action workflow, make sure you have the following env as this action relies on them, otherwise, provide them in the inputs of the action
```
env:
  NAMESPACE: test
  IMAGENAME: my-test-image
```

## Example usage

```
- name: Deploy DEV AU
  uses: webjet/action-kubebot-deploy@v1
  with:
    environment: 'dev'
    service: 'testservice-wjau'
    manifest: 'pipeline/dev-wjau.yaml'

```

## Build 

```
docker compose build
```

## Debug and Test

```
docker compose up -d 

docker exec -it action-kubebot-deploy sh

go build -o app && ./app
```