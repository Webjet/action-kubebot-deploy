package main

import (
	log "github.com/sirupsen/logrus"
  "os"
	"strings"
	"time"
)

func init() {
	initLog()
}

func main() {

	environment := getInput("environment")
	serviceName := getInput("service")
	repo := getInput("repository")
	manifest := getInput("manifest")
	if manifest == "" {
		panic("manifest input is required!")
	}

	registry := getInput("registry") 
	if registry == "" {
		registry = os.Getenv("CONTAINERREGISTRY")
	}

	namespace := getInput("namespace")
	if namespace == "" {
		namespace = os.Getenv("NAMESPACE")
	}

	tag := getInput("tag")
	if tag == "" {
		tag = os.Getenv("TAG")
	}

	kubebot := os.Getenv("KUBEBOT")
	if kubebot == "" {
		panic("KUBEBOT env variable is required!")
	}

	gitRunId := getInput("gitrunid")
	gitRunTime := time.Now().Format(time.RFC3339Nano)
	githubRepository := getInput("repositoryfullname")
	githubOwner := getInput("owner")

	log.WithFields(log.Fields{
		"environment": environment,
		"serviceName": serviceName,
		"manifest": manifest,
		"repo": repo,
		"registry" : registry,
		"namespace" : namespace,
		"tag" : tag,
		"kubebot" : kubebot,
		"gitRunId" : gitRunId,
		"gitRunTime" : gitRunTime,
		"githubRepository" : githubRepository,
		"githubOwner" : githubOwner,

	}).Info("hello world")

}

func getInput(name string) string {
	//Golang version of https://github.com/actions/toolkit/blob/master/packages/core/src/core.ts#L69
	value := os.Getenv("INPUT_" + strings.ToUpper(name))
	return value
}	