package main

import (
	log "github.com/sirupsen/logrus"
  "os"
	"strings"
	"bytes"
	"io"
	"io/ioutil"
	"net/http"
	"net/url"
	"github.com/rs/xid"
	"time"
	"fmt"
	"errors"
)

var environment string
var serviceName string
var repo string 
var manifest string 
var registry string
var namespace string
var tag string
var kubebotUrl string
var gitRunId string
var gitRunTime string
var githubRepository string
var githubOwner string
var githubCommitMsg string
var gitURL string

func init() {
	initLog()
}

func main() {

	fmt.Println("validating input...")
	getValidateInput()

	fmt.Println("reading deployment manifest...")
	yamlBytes, err := ioutil.ReadFile(manifest)
	if err != nil {
		panic(err)
	}

	fmt.Println("starting deployment...")
	traceID := xid.New().String()
	deploy(kubebotUrl, yamlBytes, traceID)
}

func getInput(name string) string {
	//Golang version of https://github.com/actions/toolkit/blob/master/packages/core/src/core.ts#L69
	value := os.Getenv("INPUT_" + strings.ToUpper(name))
	return value
}	

func getValidateInput() {

	environment = getInput("environment")
	serviceName = getInput("service")
	repo = getInput("repository")
	manifest = getInput("manifest")
	if manifest == "" {
		panic("manifest input is required!")
	} else {
		if _, err := os.Stat(manifest); errors.Is(err, os.ErrNotExist) {
			panic("manifest: " + manifest + " not found!")
		}
  }

	registry = getInput("registry") 
	if registry == "" {
		registry = os.Getenv("CONTAINERREGISTRY")
	}

	namespace = getInput("namespace")
	if namespace == "" {
		namespace = os.Getenv("NAMESPACE")
	}

	tag = getInput("tag")
	if tag == "" {
		tag = os.Getenv("TAG")
	}

	kubebotUrl = os.Getenv("KUBEBOT")
	if kubebotUrl == "" {
		panic("KUBEBOT env variable is required!")
	}

	gitRunId = getInput("gitrunid")
	gitRunTime = time.Now().Format(time.RFC3339)
	githubRepository = getInput("repositoryfullname")
	githubOwner = getInput("owner")
  githubCommitMsg = getInput("headcommit")
  gitURL = "https://github.com/" + getInput("repositoryfullname")
	githubCommitMsg = strings.Replace(githubCommitMsg, "\n", "", -1)
	githubCommitMsg = strings.Replace(githubCommitMsg, "\r", "", -1)
  githubCommitMsg = strings.Replace(githubCommitMsg, "…", "", -1)
 
	log.WithFields(log.Fields{
		"environment": environment,
		"serviceName": serviceName,
		"manifest": manifest,
		"repo": repo,
		"registry" : registry,
		"namespace" : namespace,
		"tag" : tag,
		"kubebotUrl" : kubebotUrl,
		"gitRunId" : gitRunId,
		"gitRunTime" : gitRunTime,
		"githubRepository" : githubRepository,
		"githubOwner" : githubOwner,
		"githubCommitMsg" : githubCommitMsg,
		"gitURL" : gitURL,

	}).Info("received and validated input")

}

func deploy(kubebotUrl string, yaml []byte, traceID string) {
	
	startTime := time.Now().Add(time.Minute * time.Duration(-30))
	requestBody := bytes.NewBuffer(yaml)
	requestUrl := fmt.Sprintf("%s/deploy/%s/%s/%s/%s?registry=%s&repository=%s" ,kubebotUrl, environment, namespace, serviceName, tag, registry, repo)
	 
	req, err := http.NewRequest(http.MethodPost, requestUrl, requestBody)
	if err != nil {
		log.WithFields(log.Fields{
			"error": err,
		}).Error("")
		panic("error creating deployment request! see error above for more details")
	}

	req.Header.Set("x-trace-id", traceID)
	req.Header.Set("Content-Type", "application/yaml")
	req.Header.Set("GITHUB-REPO-URL", gitURL)
	req.Header.Set("GITHUB-REPO", githubRepository)
	req.Header.Set("GITHUB-REPO-OWNER", githubOwner)
	req.Header.Set("GITHUB-WORKFLOW-ID", gitRunId)
	req.Header.Set("GITHUB-BUILD-DATESTAMP", gitRunTime)
	req.Header.Set("GITHUB-HEAD-COMMIT-MESSAGE", githubCommitMsg)

	client := http.Client{
	 Timeout: 1800 * time.Second,
  }

	res, err := client.Do(req)
  if err != nil {
		log.WithFields(log.Fields{
			"error": err,
		}).Error("")
		panic("error creating deployment request! see error above for more details")
	}

	_, err = io.ReadAll(res.Body)
	if err != nil {
		log.WithFields(log.Fields{
			"error": err,
		}).Error("")
		panic("error reading deployment response! see error above for more details")
	}
	res.Body.Close()
  
	if res.StatusCode != 200 {

		endTime := time.Now().Add(time.Minute * time.Duration(30))
		sumoQuery := "_sourcecategory = k8s/dev/bots/kubebot AND " + traceID
		sumoUrl := fmt.Sprintf("https://webjet.au.sumologic.com/ui/#/search/create?query=%v&startTime=%v&endTime=%v", url.QueryEscape(sumoQuery),startTime.UnixMilli(), endTime.UnixMilli())
		
		fmt.Println("DEPLOYMENT FAILED, please follow 2 steps below to troubleshoot")
		fmt.Println("1 - Check your deployment with KUBECTL commands")
		fmt.Println("2 - Please allow up to 5 minutes for deployment logs to ingest and check your deployment logs in Sumologic: " + sumoUrl)
		panic("deployment failed!")
	} else {
		fmt.Println("DEPLOYMENT COMPLETE")
	}
	
}