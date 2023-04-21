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

import { Button, Heading, Flex, Text } from '@dynatrace/strato-components-preview';
import { ChatIcon, CodeIcon, XmarkIcon } from '@dynatrace/strato-icons';
import React from 'react';
import { DetailsCard } from './DetailsCard';
import { GithubIcon } from './GithubIcon';

interface SideBarContentProps {
  onClose: () => void;
}

export const SideBarContent = ({ onClose }: SideBarContentProps) => {
  return (
    <Flex flexDirection='column' paddingTop={32} gap={6}>
      <Flex flexDirection='row' justifyContent='space-between'>
        <Heading as='h2' level={4}>
          Ready to develop?
        </Heading>
        <Button aria-label='Close Details' onClick={onClose}>
          <Button.Suffix>
            <XmarkIcon />
          </Button.Suffix>
        </Button>
      </Flex>
      <Flex flexDirection='column' gap={12}>
        <Text textStyle='small'>Learn to write apps with Dynatrace Developer and the Dynatrace Community</Text>
        <DetailsCard
          href='https://dynatrace.dev/'
          icon={<CodeIcon />}
          title='Learn to create apps'
          text='Dynatrace Developer shows you how'
        />
        <DetailsCard
          href='https://community.dynatrace.com/'
          icon={<ChatIcon />}
          title='Join Dynatrace Community'
          text='Ask questions, get answers, share ideas'
        />
        <DetailsCard
          href='https://github.com/Dynatrace/automation-workflow-creator'
          icon={<GithubIcon />}
          title='Collaborate in GitHub'
          text='Start your own app by cloning it on Github'
        />
      </Flex>
    </Flex>
  );
};
