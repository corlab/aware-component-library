import {ModdleElement} from "diagram-js/lib/model";

export const getDocumentation = (businessObject: ModdleElement) => {
    const documentation = businessObject?.documentation?.length ? businessObject.documentation[0].text : undefined;

    return documentation;
};
