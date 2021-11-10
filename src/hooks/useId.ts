import {useMemo} from "react";
import {v4 as uuid} from "uuid";

const generateId = (prefix?: string) => {
    return (prefix ?? "") + uuid();
};

export const useId = (prefix?: string): string => {
    const id = useMemo(() => generateId(prefix), [prefix]);
    return id;
};
