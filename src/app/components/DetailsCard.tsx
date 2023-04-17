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

import { Container, Flex, Surface, Text } from '@dynatrace/strato-components-preview';
import { ExternalLinkIcon } from '@dynatrace/strato-icons';
import React, { ReactElement } from 'react';

interface DetailsCardProps {
  /** Absolute or relative link for the Card */
  href: string;
  /** The src for the image to show. */
  icon: ReactElement;
  /** The title shown on the card. */
  title: string;
  /** The text shown on the Card. */
  text: string;
}

export const DetailsCard = ({ href, icon, title, text }: DetailsCardProps) => {
  return (
    <Surface interactive as='a' target='_blank' href={href} rel='noopener noreferrer' padding={8}>
      <Flex flexDirection='row' alignItems='center' gap={12}>
        <Container as={Flex} flexShrink={0} alignItems='center' justifyContent='center'>
          {icon}
        </Container>
        <Flex flexDirection='column' gap={4} flexGrow={1}>
          <Text textStyle='base-emphasized'>{title}</Text>
          <Text textStyle='small'>{text}</Text>
        </Flex>
        <ExternalLinkIcon />
      </Flex>
    </Surface>
  );
};
