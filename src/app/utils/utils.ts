/*
Copyright 2023 Dynatrace LLC.
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { getEnvironmentUrl } from '@dynatrace-sdk/app-environment';
import { WorkflowRequest, workflowsClient } from '@dynatrace-sdk/client-automation';
// eslint-disable-next-line import/no-extraneous-dependencies
import { HttpClientResponseError } from '@dynatrace-sdk/http-client'; // transitive dependency

export const NOTEBOOKS_APP_ID = 'dynatrace.notebooks';
export const NOTEBOOKS_MULTIPLE_ELEMENTS_INTENT_ID = 'view-multiple-elements';

export const WORKFLOW_LICENSE_LIMIT_ERROR =
  'The sample workflow was not created because the license limit has been reached.';
export const WORKFLOW_INTERNAL_ERROR = 'The sample workflow was not created because of an internal error.';
export const WORKFLOW_UNDEFINED_ID_ERROR = 'Workflow ID is undefined.';

export const ERROR_CODE_LICENSE_LIMIT_REACHED = 'licenseLimitReached';

function isHttpClientResponseError(object: unknown): object is HttpClientResponseError {
  return object !== undefined && object !== null && typeof object === 'object' && 'response' in object;
}

function isLicenseLimitReachedError(errorResponse: WorkflowClientError): boolean {
  return errorResponse.error?.details?.errorCode === ERROR_CODE_LICENSE_LIMIT_REACHED;
}

export interface WorkflowClientError {
  error?: {
    details?: {
      errorCode?: string;
    };
  };
}

export function createWorkflow(workflowRequest: WorkflowRequest): Promise<string> {
  return workflowsClient
    .createWorkflow({ body: workflowRequest })
    .then((workflow) => {
      if (workflow.id) {
        return workflow.id;
      }

      console.error(WORKFLOW_UNDEFINED_ID_ERROR);
      throw new Error(WORKFLOW_INTERNAL_ERROR);
    })
    .catch((creationError) => {
      if (
        isHttpClientResponseError(creationError) &&
        creationError.response.status >= 400 &&
        creationError.response.status <= 499
      ) {
        return creationError.response.body('json').then((workflowClientError: WorkflowClientError) => {
          if (isLicenseLimitReachedError(workflowClientError)) {
            throw new Error(WORKFLOW_LICENSE_LIMIT_ERROR);
          }

          console.error(workflowClientError);
          throw new Error(WORKFLOW_INTERNAL_ERROR);
        });
      }

      console.error(creationError);
      throw new Error(WORKFLOW_INTERNAL_ERROR);
    });
}

export function getWorkflowUrl(workflowId: string): string {
  return `${getEnvironmentUrl()}/ui/apps/dynatrace.automations/workflows/${workflowId}`;
}

export function getWorkflowUrlOrErrorAnnotation(
  hasError: boolean,
  workflowIdOrError: string,
  workflowTitle: string,
): string {
  return hasError ? `\`${workflowIdOrError}\`` : `[${workflowTitle}](${getWorkflowUrl(workflowIdOrError)})`;
}

export function getErrorNoteAnnotationIfHasError(hasError: boolean, workflowIdOrError: string): string {
  return hasError ? `\n\n\`Note: ${workflowIdOrError}\`` : '';
}
