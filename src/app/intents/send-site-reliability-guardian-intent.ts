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
import { EventQueryTriggerConfigType, WorkflowRequest } from '@dynatrace-sdk/client-automation';
import { IntentPayload, sendIntent } from '@dynatrace-sdk/navigation';
import {
  createWorkflow,
  getErrorNoteAnnotationIfHasError,
  getWorkflowUrlOrErrorAnnotation,
  NOTEBOOKS_APP_ID,
  NOTEBOOKS_MULTIPLE_ELEMENTS_INTENT_ID,
} from '../utils/utils';

const srgWorkflowTitle = 'Automation Samples: Run Validation';
const srgWorkflowRequest: WorkflowRequest = {
  title: srgWorkflowTitle,
  tasks: {
    run_validation: {
      name: 'run_validation',
      input: {
        executionId: '{{ execution().id }}',
        expressionFrom: "{{ event()['timeframe.from'] }}",
        expressionTo: "{{ event()['timeframe.to'] }}",
        timeframeSelector: {
          to: 'now',
          from: 'now-2h',
        },
        timeframeInputType: 'expression',
      },
      action: 'dynatrace.site.reliability.guardian:validate-guardian-action',
      description: 'Automation action to start a Site Reliability Guardian validation',
      predecessors: [],
      position: {
        x: 0,
        y: 1,
      },
    },
  },
  trigger: {
    eventTrigger: {
      triggerConfiguration: {
        type: EventQueryTriggerConfigType.Event,
        value: {
          query: 'tag.service == "carts" AND tag.stage == "hardening"',
        },
      },
    },
  },
};

const srgIntentPayload = (hasError: boolean, workflowIdOrError: string): IntentPayload => ({
  'dt.elements': [
    {
      'dt.annotation':
        `# Introduction

In this sample, you will learn more about the workflow leveraged by the [Site Reliability Guardian](https://docs.dynatrace.com/platform/capabilities/site-reliability-guardian). While the Dynatrace Site Reliability Guardian simplifies the adoption of DevOps and SRE best practices to ensure reliable, secure, and high-quality releases in general, the provisioned workflow is key for automating those best practices in particular. Learn in this sample how the workflow will act on changes in your environment and how it will perform a validation to make the right decision in a releasing or progressive delivery process.` +
        getErrorNoteAnnotationIfHasError(hasError, workflowIdOrError),
    },
    {
      'dt.annotation': `# Prerequisites

- Install Site Reliability Guardian via [Dynatrace Hub](${getEnvironmentUrl()}/ui/apps/dynatrace.hub/browse?details=dynatrace.site.reliability.guardian)
- Create your first guardian

## Create a guardian
- In the Dynatrace Launcher, select Site Reliability Guardian.
- On the overview page, select **New Guardian**. A new guardian is displayed in the editor.
- Provide a name for the guardian: \`my-first-guardian\`
- Add the following objective example by defining the name, a DQL, and specifying a target as well as a warning threshold.`,
    },
    {
      'dt.annotation': `- **Objective name**: Error rate
- **Description**: The error rate objective derives the number of error logs in ratio to the total number of log lines. The target is set to be less than 2% with a warning indicator at 1.5% of error logs.`,
    },
    {
      'title': 'DQL for error rate',
      'dt.timeframe': {
        from: 'now-2h',
        to: 'now',
      },
      'dt.query': `fetch logs
| fieldsAdd errors = toLong(loglevel == "ERROR")
| summarize errorRate = sum(errors)/count() * 100`,
      'visualizationSettings': {
        chartSettings: {
          gapPolicy: 'connect',
        },
        singleValue: {
          showLabel: true,
          suffix: '',
          autoscale: true,
        },
        table: {
          hiddenColumns: [['dataPond'], ['rollupType'], ['tenant'], ['recordType']],
          lineWrapIds: [],
          firstVisibleRowIndex: 0,
          enableLineWrap: true,
        },
      },
    },
    {
      'dt.annotation': `- **Set criteria for this objective**: \`Lower than the defined failure value is better for my objective\`
- **Target**: \`2\`
- **Warning**: \`1.5\`
> For other examples, please see: [Site Reliability Guardian objective examples](https://docs.dynatrace.com/platform/capabilities/site-reliability-guardian/reference).
- Click on **Create** to create the guardian.
- Click on **Validate** to perform a manual validation of the objective.`,
    },
    {
      'dt.annotation': `# Automation workflow

The provisioned automation workflow will act on events matching a defined filter. After a matching event is received, the workflow action, which the Site Reliability Guardian provides, is executed.

Find the sample workflow that has been created here: ${getWorkflowUrlOrErrorAnnotation(
        hasError,
        workflowIdOrError,
        srgWorkflowTitle,
      )}

## Event trigger
- Click the workflow trigger: \`Event trigger\`
- The filter query is \`tag.service == "carts" AND tag.stage == "hardening"\`, which starts the workflow if an event matches this criteria.

## Workflow action
- Click on the workflow action: \`run_validation\`

*Input:*
- Select the guardian you created before: \`my-first-guardian\`
- Select the second timeframe option to derive the validation timeframe from the event that triggered the workflow. The required expression is: From: \`{{ event()['timeframe.from'] }}\` and To: \`{{ event()['timeframe.to'] }}\`

*Result:* After the execution of the action, the result will return:
- \`guardian_id\`: ID of the validated guardian.
- \`validation_id\`: Unique identifier for all events generated by the validation.
- \`validation_status\`: Status out of this set: { pass | warning | fail | error } that expresses the overall validation result.`,
    },
    {
      'dt.annotation': '# Trigger validation and fetch result',
    },
    {
      'dt.annotation': '## Step 1: Trigger validation by sending an event to Dynatrace',
    },
    {
      'dt.annotation': `- Click **Run function** to execute the JavaScript code below.
- Open Dynatrace Workflows to follow the workflow execution. The **Executions** button allows you selecting the last workflow execution.
- Finally, come back to this Notebook.`,
    },
    {
      'dt.code': `/*
* This will run JavaScript in the DYNATRACE serverless environment.
* For information visit https://dt-url.net/serverless-runtime
*/
export default async function () {
  const event = {
    'timeframe.from': 'now-12m',
    'timeframe.to': 'now-2m',
    execution_context: {
      id: crypto.randomUUID().toString(),
      buildId: '4711',
      version: '0.1.0'
    },
    'tag.service': 'carts',
    'tag.application': 'sockshop',
    'tag.stage': 'hardening',
    'event.id': crypto.randomUUID().toString(),
    'event.provider': 'Jenkins',
    'event.type': 'guardian.validation.triggered'
  };

  console.log('Ingesting event: ', event);

  const ingestResponse = await fetch('/platform/classic/environment-api/v2/bizevents/ingest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
  });

  console.log('Event ingested', ingestResponse.status, await ingestResponse.text());

  return event['execution_context'];
}`,
      'dt.timeframe': {
        from: 'now-2h',
        to: 'now',
      },
      'visualizationSettings': {
        chartSettings: {
          gapPolicy: 'connect',
        },
        singleValue: {
          showLabel: true,
          suffix: '',
          autoscale: true,
        },
        table: {
          hiddenColumns: [['dataPond'], ['rollupType'], ['tenant'], ['recordType']],
          lineWrapIds: [],
          firstVisibleRowIndex: 0,
          enableLineWrap: true,
        },
      },
    },
    {
      'dt.annotation': `## Step 2: Copy context ID
- Copy the ID returned by the previous JavaScript function.`,
    },
    {
      'dt.annotation': '## Step 3: Fetch the validation result by providing the context ID',
    },
    {
      'dt.annotation': `- Paste the ID into the DQL.
- Click **Run query** to execute the DQL.`,
    },
    {
      'dt.query': `fetch bizevents
| filter event.type == "guardian.validation.finished"
| parse execution_context,"JSON:context"
| filter context[id] =="<PASTE-ID-HERE>"`,
      'dt.timeframe': {
        from: 'now-2h',
        to: 'now',
      },
      'visualizationSettings': {
        chartSettings: {
          gapPolicy: 'connect',
        },
        singleValue: {
          showLabel: true,
          suffix: '',
          autoscale: true,
        },
        table: {
          hiddenColumns: [['dataPond'], ['rollupType'], ['tenant'], ['recordType']],
          lineWrapIds: [],
          firstVisibleRowIndex: 0,
        },
      },
    },
    {
      'dt.annotation': `# Conclusion

In this sample, you explored the workflow of the Site Reliability Guardian and learned how to:
- Trigger a workflow with an event ingest
- Fetch data produced by the workflow execution`,
    },
    {
      'dt.annotation': `## References

- Introduction to [Workflows](https://docs.dynatrace.com/platform/capabilities/workflows)
- Documentation of [Site Reliability Guardian](https://docs.dynatrace.com/platform/capabilities/site-reliability-guardian)
- Blog post of [Site Reliability Guardian](https://docs.dynatrace.com/platform/capabilities/site-reliability-guardian)`,
    },
  ],
});

export const sendSiteReliabilityGuardianIntent = async () => {
  let workflowIdOrError: string;
  let hasError: boolean;

  try {
    workflowIdOrError = await createWorkflow(srgWorkflowRequest);
    hasError = false;
  } catch (e) {
    workflowIdOrError = (e as Error).message;
    hasError = true;
  }

  try {
    sendIntent(srgIntentPayload(hasError, workflowIdOrError), NOTEBOOKS_APP_ID, NOTEBOOKS_MULTIPLE_ELEMENTS_INTENT_ID);
  } catch (e) {
    return Promise.reject(e);
  }
};
