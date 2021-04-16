# kubebot action

This action can be used to deploy your docker application to K8s clusters using Webjet kubebot.
In your github action workflow, make sure you have the following env as this action relies on them, otherwise, provide them in the inputs of the action
```
env:
  NAMESPACE: flights
  CONTAINERREGISTRY: ${{ secrets.CONTAINERREGISTRY }}
  TAG: abc
```

## Example usage

```
- name: Deploy DEV AU
  uses: webjet/action-kubebot-deploy@v1
  with:
    environment: 'dev'
    service: 'searchservice-wjau'
    manifest: 'pipeline/dev-wjau.yaml'

```