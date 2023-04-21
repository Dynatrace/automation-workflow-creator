import { Container, ExternalLink, Flex, Heading, Paragraph } from '@dynatrace/strato-components-preview';
import React from 'react';

export const WhatsNext = () => {
  return (
    <Container
      as={Flex}
      color='primary'
      flexDirection='row'
      alignItems='center'
      justifyContent='space-between'
      marginTop={16}
      paddingY={12}
      paddingX={16}
    >
      <Flex flexDirection='column' alignItems='left' gap={4}>
        <Heading as='h2' level={6}>
          What&apos;s next?
        </Heading>
        <Paragraph>Fork this app on GitHub and learn how to write apps for Dynatrace.</Paragraph>
      </Flex>
      <Flex alignItems='right'>
        <ExternalLink href='https://github.com/Dynatrace/automation-workflow-creator'>Fork on Github</ExternalLink>
      </Flex>
    </Container>
  );
};
