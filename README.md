# Action: Unassign contributor after days of inactivity 

This action will unassign a contributor from an issue after days of inactivity.

This action is best used with [actions/stale](https://github.com/actions/stale).

See a running example [here](https://github.com/BoundfoxStudios/community-project/blob/develop/.github/workflows/project-management.yml#L105).

## Usage

### Inputs

All inputs are optional

| Input              | Description                                                    | Default                                                                   |
|--------------------|----------------------------------------------------------------|---------------------------------------------------------------------------|
| `token`            | PAT for GitHub API authentication                              | `${{ github.token }}`                                                     |
| `last-activity`    | Specifies after how many days the issue should get unassigned  | `7`                                                                       |
| `labels`           | Only search issues having the specified comma-separated labels | `Stale`                                                                   |
| `exempt-assignees` | Exempt specified assignees from being unassigned               |                                                                           |
| `labels-to-remove` | Labels to remove after unassignement                           | `Stale`                                                                   |
| `message`          | Comment message to create after unassignedment                 | `Due to longer inactivity, this issue has been unassigned automatically.` |


### Outputs

| Output                    | Description                                                    |
|---------------------------|----------------------------------------------------------------|
| `unassigned-issues-count` | Count of issues unassigned in this run                         |
| `unassigned-issues`       | JSON-Array with unassigned issue numbers (e.g. `[1, 3, 44]`)   |

### Example

```yaml
name: Example

on:
  schedule:
    cron: '0 0 * * *'

jobs:
  # Best used in combination with actions/stale to assign a Stale label
  
  unassign-issues-labeled-waiting-for-contributor-after-7-days-of-inactivity:
    name: Unassign issues labeled "Wartet auf Contributor" after 7 days of inactivity.
    runs-on: ubuntu-latest
    steps:
      - uses: boundfoxstudios/action-unassign-contributor-after-days-of-inactivity@main
        with:
          last-activity: 7 # After how many days the issue should get unassigned
          labels: 'Stale' # Only search for issues containing this labels (comma-separated)
          exempt-assignees: 'Octo,Cat' # Exempt some assignees from being unassigned
          labels-to-remove: 'Stale' # Labels to remove after unassigning an issue
          message: 'Automatically unassigned after 7 days of inactivity.'
```

## Caveats

On larger repos it could be that the action will fail due to reaching API limits.
If that happens for posting the comment message, it will simply be ignored right now.
