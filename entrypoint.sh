#!/bin/sh -l

environment=$1
namespace=$NAMESPACE
[ -z "$namespace" ] && namespace=$2
service=$3
tag=$TAG
[ -z "$tag" ] && tag=$4
registry=$CONTAINERREGISTRY
[ -z "$registry" ] && registry=$5
repository=$6

cat /deployment.yaml

# response=$(curl -s -X POST "http://kubebot.default/deploy/$environment/$namespace/$service/$tag?registry=$registry&repository=$repository" \
#         --data-binary "@/deployment.yaml" \
#         -H 'Content-Type: application/yaml' \
#         -H 'Expect:' \
#         -D -)
# echo $response
# http_status=$(echo $response | grep HTTP | awk '{print $2}')
# if [ $http_status = 200 ]; then
#     echo "Deployed"
# else
#     echo "Something went wrong with the deployment, query the Kb-Trace-Id in sumo for more details."
#     exit 1
# fi