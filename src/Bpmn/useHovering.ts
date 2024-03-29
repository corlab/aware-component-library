import {useState} from "react";
import {ActivityHandler, SelectedActivity} from "./BpmnView";
import {InternalEvent} from "diagram-js/lib/core/EventBus";

type AnchorElement = {
    clientHeight: number;
    clientWidth: number;

    getBoundingClientRect(): ClientRect;
};

type HoverState = {
    x: number;
    y: number;
    id: string;
    anchorEl: AnchorElement;
    name: string;
    documentation: string;
    processId: string;
} | null;

export const useHovering = (): [HoverState, ActivityHandler] => {
    const [hovered, setHovered] = useState<HoverState>(null);

    const onHover = (element: SelectedActivity, event: InternalEvent) => {
        if (
            element.type === "bpmn:UserTask" ||
            element.type === "bpmn:IntermediateCatchEvent" ||
            element.type === "bpmn:CallActivity"
        ) {
            const x = event.originalEvent.x;
            const y = event.originalEvent.y;
            const id = element.id;

            if (x !== hovered?.x || y !== hovered?.y || id !== hovered?.id) {
                const boundingClientRect = {
                    left: x - 10,
                    top: y - 10,
                    right: x + 10,
                    bottom: y + 10,
                    x,
                    y,
                    width: 20,
                    height: 20,
                };

                const getBoundingClientRect = () => boundingClientRect as ClientRect;
                const anchorEl = {
                    clientWidth: getBoundingClientRect().width,
                    clientHeight: getBoundingClientRect().height,
                    getBoundingClientRect,
                };

                setHovered({
                    x,
                    y,
                    id,
                    anchorEl: anchorEl,
                    name: element.name,
                    documentation: element.documentation,
                    processId: element.processId,
                });
            }
        } else {
            setHovered(null);
        }
    };

    return [hovered, onHover];
};
