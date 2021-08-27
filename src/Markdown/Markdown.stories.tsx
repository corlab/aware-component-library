import React from "react";
import {Story, Meta} from "@storybook/react";

import {Markdown as Md} from "./Markdown";
import {MarkdownProps} from "./Markdown.types";

export default {
    title: "Common/Markdown",
    component: Md,
    argTypes: {},
} as Meta;

const Template: Story<MarkdownProps> = (args) => <Md {...args} />;

export const Markdown = Template.bind({});
Markdown.args = {
    children: "# Heading\n" + "\n" + "Some Text\n\n" + "* a\n" + "* list",
};
