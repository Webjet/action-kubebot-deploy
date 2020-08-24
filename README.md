# kubebot action

This action can be used to deploy your docker application to K8s clusters using Webjet kubebot.

## Example usage

```
- name: Deploy DEV AU
  uses: webjet/action-kubebot-deploy@v1
  with:
    environment: 'dev'
    manifest: 'pipeline/dev-wjau.yaml'

```