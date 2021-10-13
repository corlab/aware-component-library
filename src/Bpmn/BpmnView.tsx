import React from "react";
import BpmnViewer from "bpmn-js";

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

type BpmnViewState = {};

const CURRENT_TASK_CLASS = "current-task";

class BpmnView extends React.Component<BpmnViewProps, BpmnViewState> {
    viewer: BpmnViewer;
    generateId: string;

    state: BpmnViewState = {};

    constructor(props: Readonly<BpmnViewProps>) {
        super(props);
        this.viewer = new BpmnViewer();
        const eventBus = this.viewer.get("eventBus");
        eventBus.on("element.click", (e) => {
            this.onSelectActivity(e.element, e);
        });
        eventBus.on("element.hover", (e) => {
            this.onHoverActivity(e.element, e);
        });
        this.generateId = "bpmnContainer" + Date.now();
    }

    render() {
        return <div style={{width: "70vw", height: "70vh"}} id={this.generateId} />;
    }

    componentDidMount = () => {
        this.viewer.attachTo("#" + this.generateId);
        if (this.props.diagramXML) {
            this.importXML(this.props.diagramXML!, this.viewer);
        }
    };

    componentDidUpdate(prevProps: BpmnViewProps, prevState: BpmnViewState) {
        const diagramXml = this.props.diagramXML;
        if (diagramXml !== prevProps.diagramXML) {
            this.importXML(diagramXml, this.viewer);
        }

        if (prevProps.taskId !== this.props.taskId) {
            this.highlightTask(this.viewer, prevProps.taskId, this.props.taskId);
        }
    }

    highlightTask(viewer: BpmnViewer, prevTask?: string, currentTask?: string) {
        console.log("highlightTask", prevTask, currentTask);
        const canvas = viewer.get("canvas");

        if (prevTask) {
            canvas.removeMarker(prevTask, CURRENT_TASK_CLASS);
        }
        if (currentTask) {
            canvas.addMarker(currentTask, CURRENT_TASK_CLASS);
        }
    }

    onSelectActivity = (element: Shape, event: InternalEvent) => {
        if (!this.props.onClick) {
            return;
        }
        this.onActivity(this.props.onClick, element, event);
    };

    onHoverActivity = (element: Shape, event: InternalEvent) => {
        if (!this.props.onHover) {
            return;
        }
        this.onActivity(this.props.onHover, element, event);
    };

    onActivity = (eventHandler: ActivityHandler, element: Shape, event: InternalEvent) => {
        const businessObject = element.businessObject;

        const clickedElement = {
            id: businessObject.id,
            name: businessObject.name,
            type: businessObject.$type,
            documentation: getDocumentation(businessObject),
        };

        eventHandler(clickedElement, event);
    };

    importXML = async (xml: string, viewer: BpmnViewer) => {
        try {
            if (!xml) {
                viewer.clear();
                return;
            }
            const result = await viewer.importXML(xml);
            const canvas = viewer.get("canvas");
            canvas.zoom("fit-viewport");

            this.highlightTask(viewer, undefined, this.props.taskId);

            const {warnings} = result;
            if (warnings) {
                console.warn(warnings);
            }
        } catch (err) {
            console.error(err.message, err.warnings);
        }
    };
}

export {BpmnView};
