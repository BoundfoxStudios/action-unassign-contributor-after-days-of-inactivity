import * as core from '@actions/core';
import * as github from '@actions/github';
import {fetchIssues, unassignIssues} from './issues';
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

    await unassignIssues({
      octokit,
      issues,
      labelsToRemove: inputs.labelsToRemove,
      message: inputs.message,
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
    });

    core.setOutput('unassigned-issues-count', issues.length);
    core.setOutput('unassigned-issues', JSON.stringify(issues.map(issue => issue.number)));
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
}

void run();
