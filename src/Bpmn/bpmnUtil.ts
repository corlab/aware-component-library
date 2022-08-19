import {ModdleElement} from "diagram-js/lib/model";

export const getDocumentation = (businessObject: ModdleElement) => {
    return businessObject?.documentation?.length ? businessObject.documentation[0].text : undefined;
};
