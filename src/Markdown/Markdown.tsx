import React from "react";
import ReactMarkdown from "markdown-to-jsx";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import {MarkdownProps} from "./Markdown.types";

const options = {
    overrides: {
        h1: {
            component: Typography,
            props: {
                gutterBottom: true,
                variant: "h5",
            },
        },
        h2: {component: Typography, props: {gutterBottom: true, variant: "h6"}},
        h3: {component: Typography, props: {gutterBottom: true, variant: "subtitle1"}},
        h4: {
            component: Typography,
            props: {gutterBottom: true, variant: "caption", paragraph: true},
        },
        p: {component: Typography, props: {paragraph: true}},
        a: {component: Link},
        li: {
            component: ({...props}) => (
                <li style={{marginTop: 1}}>
                    <Typography component="span" {...props} />
                </li>
            ),
        },
        img: {
            component: ({...props}) => <img style={{width: "100%"}} alt={props.alt ? props.alt : "image"} {...props} />,
        },
    },
};

export const Markdown = ({children, ...props}: MarkdownProps) => {
    return (
        <ReactMarkdown options={options} {...props}>
            {children}
        </ReactMarkdown>
    );
};
