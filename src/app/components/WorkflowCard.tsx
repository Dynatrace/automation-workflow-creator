import { Button, Flex, Grid, Heading, Surface, Text } from '@dynatrace/strato-components-preview';
import { Borders } from '@dynatrace/strato-design-tokens';
import { ArrowRightIcon } from '@dynatrace/strato-icons';
import React from 'react';

interface WorkflowCardProps {
  /** Title shown in the card */
  title: string;
  /** Description shown in the card */
  description: string;
  /** The src for the image to show. */
  imgSrc: string;
  /** OnClick function for the button */
  onClick: () => void;
  /** data-testId for the button */
  buttonTestId?: string;
}

export const WorkflowCard = ({ title, description, imgSrc, onClick, buttonTestId }: WorkflowCardProps) => {
  return (
    <Surface padding={16} as={Grid} gridTemplateRows='auto 1fr auto' gap={16} justifyItems='end'>
      <div
        style={{
          maxWidth: '100%',
          aspectRatio: '16/9',
        }}
      >
        <img
          src={imgSrc}
          alt={title}
          style={{ width: '100%', objectFit: 'contain', borderRadius: Borders.Radius.Container.Default }}
        />
      </div>
      <Flex flexDirection='column' gap={4}>
        <Heading as='h3' level={5}>
          {title}
        </Heading>
        <Text>{description}</Text>
      </Flex>
      <Button onClick={onClick} data-testid={buttonTestId ?? ''}>
        Choose workflow
        <Button.Suffix>
          <ArrowRightIcon />
        </Button.Suffix>
      </Button>
    </Surface>
  );
};
