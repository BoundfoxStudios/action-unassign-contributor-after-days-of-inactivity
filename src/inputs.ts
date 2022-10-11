import * as core from '@actions/core';

interface RequiredInputs {
  token: string;
  lastActivity: number;
}

interface OptionalInputs {
  /**
   * Comma separated labels to search for.
   */
  labels: string;

  /**
   * Comma separated assigned exempt from unassigning.
   */
  exemptAssignees: string;
}

interface Inputs extends RequiredInputs, Partial<OptionalInputs> {}

export const getAndValidateInputs = (): Inputs => {
  const token = core.getInput('token');

  if (!token) {
    throw new Error('Input "token" not set');
  }

  const lastActivity = +core.getInput('last-activity');

  if (!lastActivity || isNaN(lastActivity)) {
    throw new Error('Input "last-activity" not set correctly.');
  }

  const labels = core.getInput('labels') || undefined;
  const exemptAssignees = core.getInput('exempt-assignees') || undefined;

  return {
    token,
    lastActivity,
    labels,
    exemptAssignees,
  };
};
