const core = require('@actions/core');
const github = require('@actions/github');

try {
    const environment = core.getInput('environment');
    const serviceName = core.getInput('service');
    const manifest = core.getInput('manifest');
    const repo = core.getInput('repository');

    console.log(JSON.stringify(process.env));
} catch (error) {
  core.setFailed(error.message);
}