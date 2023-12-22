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

import {
  ExternalLink,
  Flex,
  Grid,
  Heading,
  List,
  Paragraph,
  Text,
  TitleBar,
} from '@dynatrace/strato-components-preview';
import { Spacings } from '@dynatrace/strato-design-tokens';
import React from 'react';
import { WhatsNext } from '../components/WhatsNext';
import { WorkflowCard } from '../components/WorkflowCard';
import { sendOwnershipIntent } from '../intents/send-ownership-intent';
import { sendSiteReliabilityGuardianIntent } from '../intents/send-site-reliability-guardian-intent';

export const Home = () => {
  return (
    <Flex flexDirection='column' alignItems='center' padding={32}>
      <Flex maxWidth={960} gap={16} flexDirection='column'>
        <TitleBar>
          <TitleBar.Title>
            <Heading as='h1'>Automation Workflow Creator Sample</Heading>
          </TitleBar.Title>
          <TitleBar.Suffix>
            <img
              src='./assets/AW-logo-small.png'
              alt='Automation Workflow Creator icon'
              style={{
                height: Spacings.Size64,
              }}
            />
          </TitleBar.Suffix>
          <TitleBar.Subtitle>This app assists you in building your first automated workflow.</TitleBar.Subtitle>
        </TitleBar>
        <Heading as='h2' level={4}>
          With a dedicated tutorial in the form of a notebook you&apos;ll:
        </Heading>
        <List>
          <Text>Be guided through the definition process step by step</Text>
          <Text>Find an explanation of the prerequisites</Text>
          <Text>Try out and define the workflow event trigger and adapt it according to your needs</Text>
          <Text>Configure workflow actions</Text>
        </List>

        <Heading as='h2' level={4}>
          Choose a workflow
        </Heading>
        <Grid gridTemplateColumns='repeat(auto-fit, minmax(320px, 1fr));' gap={16}>
          <WorkflowCard
            title='Integrate Site Reliability Guardian with CI/CD pipelines'
            description='Explore how to set up and adjust a workflow to ensure reliable, secure, and high-quality releases, apply DevOps and SRE best practices, and integrate SLO-based validation with your Jenkins pipeline.'
            imgSrc='./assets/srg_workflow.png'
            onClick={sendSiteReliabilityGuardianIntent}
            buttonTestId='srg-button'
          />
          <WorkflowCard
            title='Send logs to the owner of an entity'
            description='Learn how to query logs of a host in a workflow and how to send these logs to the owner of the host.'
            imgSrc='./assets/notification_workflow.png'
            onClick={sendOwnershipIntent}
            buttonTestId='ownership-button'
          />
        </Grid>
        <Paragraph>
          For complete details, see the{' '}
          <ExternalLink href={`https://docs.dynatrace.com/platform/capabilities/workflows/quickstart`}>
            Workflow quick start guide
          </ExternalLink>
          .
        </Paragraph>
        <WhatsNext />
      </Flex>
    </Flex>
  );
};
