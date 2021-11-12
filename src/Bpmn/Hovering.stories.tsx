import React from "react";
import {ActivityHandler, BpmnView} from "./BpmnView";
import {storiesOf} from "@storybook/react";
import bpmn from "!!raw-loader!./example.bpmn";
import {useHovering} from "./useHovering";
import {Paper, Popper} from "@mui/material";
import {Markdown} from "../Markdown";

type HoveringProps = {
    diagramXML?: string;

    onClick?: ActivityHandler;
    taskId?: string;

    showEmpty?: boolean;
};

const Hovering = ({diagramXML, onClick, taskId, showEmpty}: HoveringProps) => {
    const [hovered, onHover] = useHovering();

    return (
        <div>
            <BpmnView diagramXML={diagramXML} onHover={onHover} onClick={onClick} taskId={taskId} />

            <Popper
                open={!!hovered && (!!hovered?.documentation || showEmpty)}
                anchorEl={hovered?.anchorEl}
                placement="bottom-start"
                style={{zIndex: 10000}}
            >
                <Paper style={{maxWidth: "250px", padding: "20px"}}>
                    <Markdown>{hovered?.documentation ?? ""}</Markdown>
                </Paper>
            </Popper>
        </div>
    );
};

storiesOf("Hovering", module)
    .add("With Process", () => <Hovering diagramXML={bpmn} />)
    .add("Show Empty", () => <Hovering diagramXML={bpmn} showEmpty={true} />);
