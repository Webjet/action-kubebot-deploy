#!/bin/sh -l

echo $NAMESPACE
echo $SERVICENAME
echo $TAG

echo "---"
echo $1
echo $2
echo $3
echo "---"
# response=$(curl -s -X POST "http://kubebot.default/deploy/$1/$2/$3/$4?registry=$5&repository=$6" \
#         --data-binary "@deployment.yaml" \
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