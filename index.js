const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');

try {
    const environment = core.getInput('environment');
    const serviceName = core.getInput('service');
    const manifest = core.getInput('manifest');
    const repo = core.getInput('repository');
    const registry = core.getInput('registry') || process.env['CONTAINERREGISTRY'];
    const namespace = core.getInput('namespace') || process.env['NAMESPACE'];
    const tag = core.getInput('tag') || process.env['TAG'];
    
    if (fs.existsSync(manifest)) {
        core.info("exists");
    } else {
        core.info("!exists");
    }
    const url = `http://kubebot.default/deploy/${environment}/${namespace}/${serviceName}/${tag}?registry=${registry}&repository=${repo}`;
    core.info(url);

} catch (error) {
  core.setFailed(error.message);
}