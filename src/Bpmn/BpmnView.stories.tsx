import React from "react";
import {BpmnView} from "./BpmnView";
import {storiesOf} from "@storybook/react";
import {select} from "@storybook/addon-knobs";
import {action} from "@storybook/addon-actions";

import bpmn from "!!raw-loader!./example.bpmn";

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
        />
    ))
    .add("Without Process", () => <BpmnView diagramXML={null} />);
