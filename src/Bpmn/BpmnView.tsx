import React from "react";
import BpmnViewer from "bpmn-js";

import "./bpmn.css";

export type BpmnViewProps = {
    diagramXML?: string;
    //modelerProps?: any;

    taskId?: string;
};

type BpmnViewState = {
    diagramXML?: string | null;
};

const CURRENT_TASK_CLASS = "current-task";

class BpmnView extends React.Component<BpmnViewProps, BpmnViewState> {
    viewer: BpmnViewer;
    generateId: string;

    state: BpmnViewState = {};

    constructor(props: Readonly<BpmnViewProps>) {
        super(props);
        this.viewer = new BpmnViewer();
        this.generateId = "bpmnContainer" + Date.now();
        this.state = {diagramXML: props.diagramXML};
    }

    initDiagramXml = () => {
        this.setState({diagramXML: this.props.diagramXML});
    };

    render() {
        return <div style={{width: "70vw", height: "70vh"}} id={this.generateId} />;
    }

    componentDidMount = () => {
        this.viewer.attachTo("#" + this.generateId);
        if (this.state.diagramXML) {
            this.importXML(this.state.diagramXML!, this.viewer);
        }
    };

    componentDidUpdate(prevProps: BpmnViewProps, prevState: any) {
        if (this.props.diagramXML !== prevProps.diagramXML) {
            this.initDiagramXml();
        }

        const diagramXml = this.state.diagramXML;
        if (diagramXml && diagramXml !== prevState.diagramXML) {
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

    importXML = async (xml: string, viewer: BpmnViewer) => {
        try {
            const result = await viewer.importXML(xml);
            const canvas = viewer.get("canvas");
            canvas.zoom("fit-viewport");

            this.highlightTask(viewer, undefined, this.props.taskId);

            const {warnings} = result;
            if (warnings) {
                console.log(warnings);
            }
        } catch (err) {
            console.log(err.message, err.warnings);
        }
    };
}

export {BpmnView};
