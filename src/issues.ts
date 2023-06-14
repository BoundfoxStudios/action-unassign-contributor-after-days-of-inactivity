import * as core from '@actions/core';
import {DateTime} from 'luxon';
// eslint-disable-next-line import/named
import {GetResponseTypeFromEndpointMethod} from '@octokit/types';
import {GitHub} from '@actions/github/lib/utils';

interface Issue {
  number: number;
  labels: string[];
}

interface FetchIssuesArgs {
  octokit: InstanceType<typeof GitHub>;
  owner: string;
  repo: string;
  lastActivity: number;
  labels?: string;
  exemptAssignees?: string;
}

export const fetchIssues = async ({octokit, owner, repo, labels, lastActivity, exemptAssignees}: FetchIssuesArgs): Promise<Issue[]> => {
  type ListForRepoResponse = GetResponseTypeFromEndpointMethod<typeof octokit.rest.issues.listForRepo>;

  const response: ListForRepoResponse = await octokit.rest.issues.listForRepo({
    owner,
    repo,
    labels,
    assignee: '*',
    state: 'open',
    per_page: 100,
  });

  core.info(`Found ${response.data.length} issues to process...`);

  const lastActivityDateTime = DateTime.now().minus({days: lastActivity});
  let issues = response.data.filter(issue => {
    const updatedAtDateTime = DateTime.fromISO(issue.updated_at);

    return updatedAtDateTime < lastActivityDateTime;
  });

  const exemptAssigneeList = (exemptAssignees ?? '').split(',');
  if (exemptAssigneeList && exemptAssigneeList.length > 0) {
    issues = issues.filter(issue => issue.assignees && !issue.assignees.some(assignee => exemptAssigneeList.includes(assignee.login)));
  }

  return issues.map(issue => ({
    number: issue.number,
    labels: issue.labels.map(label => (typeof label === 'string' ? label : label.name) || '').filter(label => !!label),
  }));
};

interface UnassignIssuesArgs {
  octokit: InstanceType<typeof GitHub>;
  owner: string;
  repo: string;
  message: string;
  issues: Issue[];
  labelsToRemove?: string;
}

export const unassignIssues = async ({octokit, issues, owner, repo, message, labelsToRemove}: UnassignIssuesArgs): Promise<void> => {
  for (const issue of issues) {
    core.info(`Unassigning issue #${issue.number}...`);

    await octokit.rest.issues.removeAssignees({
      owner,
      repo,
      assignees: [],
      issue_number: issue.number,
    });

    const labels = (labelsToRemove || '').split(',');

    for (const label of labels) {
      if (!issue.labels.includes(label)) {
        continue;
      }

      await octokit.rest.issues.removeLabel({
        owner,
        repo,
        issue_number: issue.number,
        name: label,
      });
    }

    try {
      await octokit.rest.issues.createComment({
        body: message,
        owner,
        repo,
        issue_number: issue.number,
      });
    } catch {
      // For now, we don't care if comment creation was not successful (e.g. hitting rate limits).
    }
  }
};
