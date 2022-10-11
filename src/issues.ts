import {DateTime} from 'luxon';
// eslint-disable-next-line import/named
import {GetResponseTypeFromEndpointMethod} from '@octokit/types';
import {GitHub} from '@actions/github/lib/utils';

interface Issue {
  number: number;
}

interface FetchIssuesArgs {
  octokit: InstanceType<typeof GitHub>;
  owner: string;
  repo: string;
  labels?: string;
  lastActivity: number;
}

export const fetchIssues = async ({octokit, owner, repo, labels, lastActivity}: FetchIssuesArgs): Promise<Issue[]> => {
  type ListForRepoResponse = GetResponseTypeFromEndpointMethod<typeof octokit.rest.issues.listForRepo>;

  const since = DateTime.now().set({hour: 0, minute: 0, second: 0, millisecond: 0}).minus({day: lastActivity}).toISO();

  const issues: ListForRepoResponse = await octokit.rest.issues.listForRepo({
    owner,
    repo,
    labels,
    assignee: '*',
    since,
  });

  return issues.data.map(issue => ({number: issue.number}));
};
