import * as core from '@actions/core'
import * as fs from 'fs'
import { deploy } from './utils'
try {
    const environment = core.getInput('environment');
    const serviceName = core.getInput('service');
    const manifest = core.getInput('manifest');
    const repo = core.getInput('repository');
    const registry = core.getInput('registry') || process.env['CONTAINERREGISTRY'];
    const namespace = core.getInput('namespace') || process.env['NAMESPACE'];
    const tag = core.getInput('tag') || process.env['TAG'];
    const kubebot = process.env['KUBEBOT'];
    const gitRunId = core.getInput('gitrunid');
    const gitRunTime = new Date();
    const githubRepository = core.getInput('repositoryfullname');
    const githubOwner = core.getInput('repository_owner');
    const gitURL = "https://github.com/" + core.getInput('repositoryfullname');
    const headCommitMsg = String(core.getInput('headcommit')).replace(/\n/g, ' ').replace(/\r/g, ' ');
    console.dir(headCommitMsg);
    if (!kubebot) {
      throw new Error('kubebot url is needed!');
    }
    if (!fs.existsSync(manifest)) {
        throw new Error(`${manifest} not found`);
    }

    var headers = {
      'Content-Type': 'application/yaml',
      "GITHUB-REPO-URL":gitURL,
      "GITHUB-REPO":githubRepository,
      "GITHUB-REPO-OWNER":githubOwner,
      "GITHUB-WORKFLOW-ID":gitRunId,
      "GITHUB-BUILD-DATESTAMP":gitRunTime,
      "GITHUB-HEAD-COMMIT-MESSAGE": headCommitMsg,
    }
    const url = `${kubebot}/deploy/${environment}/${namespace}/${serviceName}/${tag}?registry=${registry}&repository=${repo}`;
    deploy(url, manifest,headers);
} catch (error: any) {
  core.setFailed(error.message);
}