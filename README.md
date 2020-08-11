# kubebot action

This action can be used to deploy your docker application to K8s clusters using Webjet kubebot.

## Example usage

```
- uses: webjet/action-kubebot-deploy@v1
  with:
    environment: 'dev'
    namespace: 'flights'
    service: 'flightsearchservice-wjau'
    tag: 'ca6b30'
    registry: $CONTAINERREGISTRY
    manifest: 'pipeline/dev-wjau.yaml'

```