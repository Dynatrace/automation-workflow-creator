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
import { EventQueryTriggerConfigType, EventType, WorkflowRequest } from '@dynatrace-sdk/client-automation';
import { IntentPayload, sendIntent } from '@dynatrace-sdk/navigation';
import {
  createWorkflow,
  getErrorNoteAnnotationIfHasError,
  getWorkflowUrlOrErrorAnnotation,
  NOTEBOOKS_APP_ID,
  NOTEBOOKS_MULTIPLE_ELEMENTS_INTENT_ID,
} from '../utils/utils';

const ownershipWorkflowTitle = 'Automation Samples: Targeted Notifications';
const ownershipWorkflowRequest: WorkflowRequest = {
  title: ownershipWorkflowTitle,
  tasks: {
    get_logs: {
      name: 'get_logs',
      input: {
        query: 'fetch logs\n| filter dt.entity.host == "{{ event()[\'dt.entity.host\'] }}"\n| limit 10',
      },
      action: 'dynatrace.automations:execute-dql-query',
      position: {
        x: 0,
        y: 1,
      },
      description: 'Executes DQL query',
      predecessors: [],
    },
    get_owners: {
      name: 'get_owners',
      input: {
        entityIds: '{{ event()["dt.entity.host"] }}',
        responsibilities: [],
      },
      action: 'dynatrace.ownership:get-ownership-from-entity',
      position: {
        x: 0,
        y: 2,
      },
      conditions: {
        states: {
          get_logs: 'OK',
        },
      },
      description:
          'Retrieves an entity and extracts ownership data from it together with the contact details that are grouped by the contact type.',
      predecessors: ['get_logs'],
    },
  },
  trigger: {
    eventTrigger: {
      triggerConfiguration: {
        type: EventQueryTriggerConfigType.Event,
        value: {
          eventType: EventType.Events,
          query:
            'event.kind == "DAVIS_EVENT" and event.type == "CUSTOM_INFO" and dt.entity.host == "REPLACE-WITH-HOST-ID"',
        },
      },
    },
  },
};

const ownershipIntentPayload = (hasError: boolean, workflowIdOrError: string): IntentPayload => ({
  'dt.elements': [
    {
      'dt.markdown':
        `# Introduction

In this sample, you learn how to query logs of a host in a workflow and how to send these logs to the owner of the host.

In detail, you learn
- how to ingest an event to a host,
- how to trigger a workflow with an event,
- how to query logs in a workflow using Dynatrace Query Language (DQL),
- how to assign an owner to a host and query the owner in a workflow, and
- optionally, how to send a targeted Slack message containing the logs of a host to its owner.` +
        getErrorNoteAnnotationIfHasError(hasError, workflowIdOrError),
    },
    {
      'dt.markdown': `# Step 1: Setup Ownership

**Prerequisite:**
- You have a host monitored that you can use throughout this sample

**Action:** Install the Ownership app
- Install the Ownership app using [Dynatrace Hub](${getEnvironmentUrl()}/ui/apps/dynatrace.hub/browse?subpage=all&details=dynatrace.ownership)

**Action:** Set up a [Team](https://dt-url.net/ownership?dt=s)
- In [Settings](${getEnvironmentUrl()}/ui/apps/dynatrace.classic.settings), select "Ownership" and then "Teams"
- Add a new team
- Optionally, add a Slack channel in contact details (needed for Step 7 where this channel is used for sending a targeted notification)

**Action:** Select a host and assign it to your team
- In [Hosts](${getEnvironmentUrl()}/ui/apps/dynatrace.classic.hosts), select a host which you can use throughout this sample
- Copy the entity ID starting with "HOST-", which you can find in the URL of your browser and will be needed throughout this sample
- In the top bar of the Host screen, click the icon for Ownership which will open a side panel
- In the side panel, choose "Add owner tag" and select your team

You've successfully created your team and assigned it to your monitored host.`,
    },
    {
      'dt.markdown': `# Step 2: Ingesting an event

The following code snipped ingests an event to your host.

**Action**: Ingest event
- Set your host ID in the constant in line 3
- Run the function`,
    },
    {
      'dt.code': `import { EventIngest, EventIngestEventType, eventsClient } from '@dynatrace-sdk/client-classic-environment-v2';

const Host = 'REPLACE-WITH-HOST-ID'

export default async function () {
  const terminationEvent: EventIngest = {
    eventType: EventIngestEventType.CustomInfo,
    title: 'Simulated event',
    entitySelector: 'type(HOST),entityId(' + Host + ')',
  };

  return eventsClient.createEvent({ body: terminationEvent });
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
      'dt.markdown': `**Action:** Check ingested custom event
- In [Hosts](${getEnvironmentUrl()}ui/apps/dynatrace.classic.hosts), select the host for which you ingested the event
- Check if the event shows up (please note that this can take a few minutes until the event is processed)`,
    },
    {
      'dt.markdown': `# Step 3: Define a workflow trigger using DQL

In the AutomationEngine, a [workflow](https://docs.dynatrace.com/platform/capabilities/workflows) can be triggered on-demand, using a schedule, or via an event. In this sample, an event is used as a workflow trigger. To define the trigger, the Dynatrace Query Language (DQL) is used. Next, we will define a DQL query, which queries the event ingested in Step 2.

**Action:** Test DQL query in the Notebook
- Insert the Host ID in the DQL query in line 4
- Run the query`,
    },
    {
      'dt.query': `fetch events
| filter event.kind == "DAVIS_EVENT" AND
event.type == "CUSTOM_INFO" AND
dt.entity.host == "REPLACE-WITH-HOST-ID"
| limit 1`,
      'dt.timeframe': {
        from: 'now-7d',
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
          lineWrapIds: [['labels.alerting_profile']],
          firstVisibleRowIndex: 0,
          enableLineWrap: true,
        },
      },
    },
    {
      'dt.markdown': `**Action:** Adapt the workflow trigger
- Open the sample workflow that has been created here: ${getWorkflowUrlOrErrorAnnotation(
        hasError,
        workflowIdOrError,
        ownershipWorkflowTitle,
      )}
- Select the "Event trigger" in the workflow and insert the Host ID in the input field "Filter query"
- Save the workflow

Now, the workflow will get triggered for all new custom info events on your host.`,
    },
    {
      'dt.markdown': `# Step 4: Execute a DQL query in a workflow

The workflow contains a "get_logs" action, which executes a DQL query for retrieving logs. To dynamically filter the logs based on data contained in the event triggering the workflow, you can use [expressions](https://docs.dynatrace.com/platform/capabilities/workflows/reference) in  DQL. For example, you can get the host defined in the event using \`{{ event()["dt.entity.host"] }}\`. This expression can then be used as filter in DQL.

**Actions:** Test the DQL query of the "get_logs" action in the Notebook
- Insert the Host ID in the DQL query in line 2
- Run the query

If logs are available, you should see the last 10 log statements.`,
    },
    {
      'dt.query': `fetch logs
| filter dt.entity.host == "REPLACE-WITH-HOST-ID"
| limit 10`,
      'dt.timeframe': {
        from: 'now-7d',
        to: 'now',
      },
      'visualizationSettings': {
        chartSettings: {
          gapPolicy: 'connect',
        },
        singleValue: {
          showLabel: true,
          label: '',
          autoscale: true,
        },
        table: {
          hiddenColumns: [['dataPond'], ['rollupType'], ['tenant'], ['recordType']],
          lineWrapIds: [['content']],
          firstVisibleRowIndex: 0,
        },
      },
    },
    {
      'dt.markdown': `**Actions:** Check the workflow action for retrieving logs
- Open the sample workflow that has been created here: ${getWorkflowUrlOrErrorAnnotation(
        hasError,
        workflowIdOrError,
        ownershipWorkflowTitle,
      )}
- Select the "get_logs" action
- Open the tab "Input" and check the the DQL query including the expression \`{{ event()["dt.entity.host"] }}\` for retrieving the host's logs`,
    },
    {
      'dt.markdown': `# Step 5: Get owners in a workflow

In Step 1, you assigned ownership information to your host. This ownership information can now be queried in a workflow. Therefore, a dedicated action named "Get owners" is available after installing the Ownership app (completed in Step 1).

This "Get owners" action takes an entity ID as input and outputs a list of teams set as owners together with the contact details that are grouped by the contact type. For the input, the entity ID of the event triggering the workflow is used. To access this entity ID, the input of the "Get owners" action uses the [expression](https://docs.dynatrace.com/platform/capabilities/workflows/reference) \`{{ event()["dt.entity.host"] }}\` to get the entity ID from the event. This expression is then resolved to the entity ID during the execution of the workflow.

**Actions:**
- Open the sample workflow that has been created here: ${getWorkflowUrlOrErrorAnnotation(
        hasError,
        workflowIdOrError,
        ownershipWorkflowTitle,
      )}
- Select the "get_owners" action
- In the tab "Input", check the expression \`{{ event()["dt.entity.host"] }}\` for accessing the entity ID of the event`,
    },
    {
      'dt.markdown': `# Step 6: Trigger your workflow

Let's now trigger the execution of the workflow and check the returned  logs, teams, and contact details.

**Actions:** Run the workflow and check the results
- Ingest a second event by running the function of Step 2 again
- Open the sample workflow that has been created here: ${getWorkflowUrlOrErrorAnnotation(
        hasError,
        workflowIdOrError,
        ownershipWorkflowTitle,
      )}
- In "Executions", select the last run which shows the "get_logs" and "get_owners" actions with a green border
- Check the results by clicking on the respective action and selecting the "Result" tab
  - "get_logs" returned the last 10 log statements in the records field
  - "get_owners" returned the team information which you provided in Step 1 in JSON format`,
    },
    {
      'dt.markdown': `# Optional Step 7: Add a Slack action for sending a targeted notification

In this optional step, you'll learn how to extend your workflow with a Slack action for sending the logs to the owner of the host.

**Actions:** Set up the Slack integration
- Install the Slack integration using [Dynatrace Hub](${getEnvironmentUrl()}/ui/apps/dynatrace.hub/browse?subpage=all&details=dynatrace.slack)
- Follow the setup steps as described in the [documentation](https://docs.dynatrace.com/platform/capabilities/workflows/actions/slack)

Next, you will learn how to use the Slack action for sending messages containing the logs as an attachment to the owner defined on your host. Therefore, we will learn how to iterate over all contact details in order to get the Slack channel defined in the team.

**Actions:** Add Slack message to the workflow
- Open the sample workflow that has been created here: ${getWorkflowUrlOrErrorAnnotation(
        hasError,
        workflowIdOrError,
        ownershipWorkflowTitle,
      )}
- Add a new task by clicking on the "+" symbol which appears when you hover over the "get_owners" task
- Choose the action "Send message"
- In "Connection" in the "Input" tab, select the configured Slack connection
- Dynamically configure the channel
  - Switch to the "Options" tab
  - Enable "Loop task"
  - In "Item variable name", enter \`contactDetail\`
  - In "List", enter the expression \`{{ result("get_owners").slackChannels }}\` for retrieving the contact details returned by the previous action
  - Switch back to the "Input" tab
  - In "Channel", you can now use the defined loop variable and access the Slack channel with \`{{ _.contactDetail.slackChannel }}\`
- Set the message content
  - In "Message", enter the sample text
      \`\`\`
      *Dear {{ _.contactDetail.teamName }}, owner of host {{ event()["dt.entity.host"] }}*
      A custom info event was ingested. Please find the last 10 logs attached.
      \`\`\`
  - In "Attachments", select "TextFile"
  - In "File Name", enter \`log.json\`
  - In "Content", enter the following expression for looping through the records of the logs:
      \`\`\`
      {% for log in result("get_logs").records %}
        - {{ log.content }}
      {% endfor %}
      \`\`\`
  - In "File type", select "JSON"
- Save the workflow

Let's now trigger the execution of the workflow again and check if you get the logs in Slack.

**Actions:** Run the workflow and check your messages in Slack
- Ingest another event by running the function of Step 2 again
- Open the sample workflow that has been created here: ${getWorkflowUrlOrErrorAnnotation(
        hasError,
        workflowIdOrError,
        ownershipWorkflowTitle,
      )}
- In "Executions", check if the last run was successful
- Check if you received a message containing the logs as an attachment in the Slack channel configured in Step 1.`,
    },
    {
      'dt.markdown': `# Conclusion

Congratulations! In this sample you learned how to
- assign ownership information (i.e., teams) to entities,
- ingest events using a serverless function,
- use events as a trigger for a workflow,
- query ownership and logs in a workflow, and
- optionally, how to send a targeted message containing the logs via Slack.

Now, you will be ready to adapt the workflow for your use case!`,
    },
    {
      'dt.markdown': `# References

- Introduction to [workflows](https://docs.dynatrace.com/platform/capabilities/workflows)
- Documentation for [Ownership](https://dt-url.net/ownership?dt=s)
- Documentation for the [Slack integration](https://docs.dynatrace.com/platform/capabilities/workflows/actions/slack)
- Blog post for [Ownership](https://www.dynatrace.com/news/blog/)`,
    },
  ],
});

export const sendOwnershipIntent = async () => {
  let workflowIdOrError: string;
  let hasError: boolean;

  try {
    workflowIdOrError = await createWorkflow(ownershipWorkflowRequest);
    hasError = false;
  } catch (e) {
    workflowIdOrError = (e as Error).message;
    hasError = true;
  }

  try {
    sendIntent(
      ownershipIntentPayload(hasError, workflowIdOrError),
      NOTEBOOKS_APP_ID,
      NOTEBOOKS_MULTIPLE_ELEMENTS_INTENT_ID,
    );
  } catch (e) {
    return Promise.reject(e);
  }
};