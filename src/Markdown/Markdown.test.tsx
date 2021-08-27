import React from "react";
import { render } from "@testing-library/react";

import {Markdown} from "./Markdown";

describe("Markdown", () => {
  it("should render", () => {
    render(<Markdown>
      # Some Markdown Text
    </Markdown>)
  });

});
