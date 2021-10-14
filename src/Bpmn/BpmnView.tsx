import React, {useEffect, useMemo, useRef} from "react";
import Viewer from "bpmn-js";

import "./bpmn.css";
import {Shape} from "diagram-js/lib/model";
import {getDocumentation} from "./bpmnUtil";
import {InternalEvent} from "diagram-js/lib/core/EventBus";

type SelectedActivity = {
    id: string;
    type: string;
    name?: string;
    documentation?: string;
};

export type ActivityHandler = (element: SelectedActivity, event: InternalEvent) => void;

export type BpmnViewProps = {
    diagramXML?: string;

    onClick?: ActivityHandler;
    onHover?: ActivityHandler;
    taskId?: string;
};

const CURRENT_TASK_CLASS = "current-task";

const BpmnView = ({diagramXML, onClick, onHover, taskId}: BpmnViewProps) => {
    const generatedId = useMemo(() => "bpmnContainer" + Date.now(), []);
    const viewer = useMemo<Viewer>(() => {
        const viewer = new Viewer();
        const eventBus = viewer.get("eventBus");
        eventBus.on("element.click", (e) => {
            onSelectActivity(e.element, e);
        });
        eventBus.on("element.hover", (e) => {
            onHoverActivity(e.element, e);
        });
        return viewer;
    }, []);

    const highlightedTask = useRef<string | null>(null);

    const onSelectActivity = (element: Shape, event: InternalEvent) => {
        if (!onClick) {
            return;
        }
        onActivity(onClick, element, event);
    };

    const onHoverActivity = (element: Shape, event: InternalEvent) => {
        if (!onHover) {
            return;
        }
        onActivity(onHover, element, event);
    };

    const onActivity = (eventHandler: ActivityHandler, element: Shape, event: InternalEvent) => {
        const businessObject = element.businessObject;

        const clickedElement = {
            id: businessObject.id,
            name: businessObject.name,
            type: businessObject.$type,
            documentation: getDocumentation(businessObject),
        };

        eventHandler(clickedElement, event);
    };

    const highlightTask = (viewer: Viewer, prevTask?: string, currentTask?: string) => {
        const canvas = viewer.get("canvas");

        if (prevTask) {
            const prev = viewer.get("elementRegistry").get(prevTask);
            if (prev) {
                canvas.removeMarker(prev, CURRENT_TASK_CLASS);
            }
        }
        if (currentTask) {
            const current = viewer.get("elementRegistry").get(currentTask);
            if (current) {
                canvas.addMarker(current, CURRENT_TASK_CLASS);
            }
        }
    };

    const importXML = (xml: string, viewer: Viewer) => {
        if (!xml) {
            viewer.clear();
            return;
        }

        viewer.importXML(xml).then(
            (result) => {
                const canvas = viewer.get("canvas");
                canvas.zoom("fit-viewport");

                highlightTask(viewer, undefined, taskId);

                const {warnings} = result;
                if (warnings) {
                    console.warn(warnings);
                }
            },
            (err) => {
                console.error(err.message, err.warnings);
            }
        );
    };

    useEffect(() => {
        viewer.attachTo("#" + generatedId);
        if (diagramXML) {
            importXML(diagramXML!, viewer);
        }
    }, []);

    useEffect(() => {
        importXML(diagramXML!, viewer);
    }, [diagramXML]);

    useEffect(() => {
        highlightTask(viewer, highlightedTask.current, taskId);
        highlightedTask.current = taskId;
    }, [taskId]);

    return <div style={{width: "70vw", height: "70vh"}} id={generatedId} />;
};

export {BpmnView};
