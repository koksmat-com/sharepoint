import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';


import { TopNode } from '../components/TopNode';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Example/TopNode',
  component: TopNode,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof TopNode>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof TopNode> = (args) => <TopNode {...args} />;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  Title: "3D Secure (coming...)",
  
};

export const Karlo = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  Title: "Karlo",
  
};
export const Secondary = Template.bind({});
Secondary.args = {
  
};

export const Large = Template.bind({});
Large.args = {
  
};

export const Small = Template.bind({});
Small.args = {
  size: 'small',
  label: 'TopNode',
};
