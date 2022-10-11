import * as core from '@actions/core';

interface Inputs {
  token: string;

  /**
   * Last activity in days
   */
  lastActivity: number;

  /**
   * Comma separated labels to search for.
   */
  labels?: string;

  /**
   * Comma separated assigned exempt from unassigning.
   */
  exemptAssignees?: string;

  /**
   * Comma separated labens to remove when issue is being unassigned.
   */
  labelsToRemove?: string;

  /**
   * The message to comment
   */
  message: string;
}

export const getAndValidateInputs = (): Inputs => {
  const token = core.getInput('token');

  if (!token) {
    throw new Error('Input "token" not set.');
  }

  const lastActivity = +core.getInput('last-activity');

  if (!lastActivity || isNaN(lastActivity)) {
    throw new Error('Input "last-activity" not set correctly.');
  }

  const message = core.getInput('message');

  if (!message) {
    throw new Error('Input "message" not set.');
  }

  const labels = core.getInput('labels') || undefined;
  const exemptAssignees = core.getInput('exempt-assignees') || undefined;
  const labelsToRemove = core.getInput('labels-to-remove') || undefined;

  return {
    token,
    lastActivity,
    labels,
    exemptAssignees,
    message,
    labelsToRemove,
  };
};
