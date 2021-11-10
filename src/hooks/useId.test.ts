import {renderHook, act} from "@testing-library/react-hooks";
import {useId} from "./useId";

test("should return same id on each render", () => {
    const {result, rerender} = renderHook(() => useId());

    const firstId = result.current;
    rerender();
    const secondId = result.current;

    expect(firstId).toBe(secondId);
});

test("should return different ids for different components", () => {
    const {result} = renderHook(() => useId());
    const {result: result2} = renderHook(() => useId());

    expect(result.current).not.toBe(result2.current);
});

test("should start with prefix", () => {
    const {result} = renderHook(() => useId("Test"));

    expect(result.current.startsWith("Test")).toBeTruthy();
});
