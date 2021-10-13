import React from "react";
import {BpmnView} from "./BpmnView";
import {storiesOf} from "@storybook/react";
import {select} from "@storybook/addon-knobs";
import {action} from "@storybook/addon-actions";
import {encode, decode} from "js-base64";

const nullsafe = (fun: (arg: any) => any) => {
    return (arg) => {
        if (arg === null || arg === undefined) {
            return arg;
        }
        return fun(arg);
    };
};

import bpmn from "!!raw-loader!./example.bpmn";
import bpmn2 from "!!raw-loader!./example_2.bpmn";

storiesOf("BpmnView", module)
    .add("With Process", () => (
        <BpmnView
            diagramXML={bpmn}
            taskId={select(
                "Current Task",
                {
                    "-": null,
                    "Start Event": "Event_0rxup3e",
                    "User Task": "Activity_0cdaniw",
                    "User Task 2": "Activity_00alg3y",
                    "Timer Event": "Event_1c92y6a",
                    "End Event": "Event_0m2nftb",
                },
                null
            )}
            onClick={action("onClick")}
            onHover={action("onHover")}
        />
    ))
    .add("Without Process", () => <BpmnView diagramXML={null} />)
    .add("Invalid Process", () => <BpmnView diagramXML={"Foo Bar"} />)
    .add("Switch Process", () => (
        <BpmnView
            diagramXML={nullsafe(decode)(
                select(
                    "Current Task",
                    {
                        "-": null,
                        "Invalid Process": nullsafe(encode)("Foo Bar"),
                        "Bpmn Example": nullsafe(encode)(bpmn),
                        "Bpmn Example 2": nullsafe(encode)(bpmn2),
                    },
                    null
                )
            )}
        />
    ));
