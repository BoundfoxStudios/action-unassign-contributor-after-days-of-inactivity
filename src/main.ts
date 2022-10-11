import * as core from '@actions/core';
import * as github from '@actions/github';
import {fetchIssues} from './issues';
import {getAndValidateInputs} from './inputs';

async function run(): Promise<void> {
  try {
    const inputs = getAndValidateInputs();

    const octokit = github.getOctokit(inputs.token);
    const issues = await fetchIssues({
      octokit,
      lastActivity: inputs.lastActivity,
      labels: inputs.labels,
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
    });

    core.info(JSON.stringify(issues));

    /* const ms: string = core.getInput('milliseconds');
    core.debug(`Waiting ${ms} milliseconds ...`); // debug is only output if you set the secret `ACTIONS_STEP_DEBUG` to true

    core.debug(new Date().toTimeString());
    await wait(parseInt(ms, 10));
    core.debug(new Date().toTimeString());

    core.setOutput('time', new Date().toTimeString());*/
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
}

run();
