import { applyPointsInput } from "@features/gameplay/PointsInput";

describe("PointsInput", () => {
  it("appends digit keys", () => {
    expect(applyPointsInput("", "4")).toBe("4");
    expect(applyPointsInput("4", "0")).toBe("40");
  });

  it("replaces a leading zero with the next digit", () => {
    expect(applyPointsInput("0", "5")).toBe("5");
  });

  it("deletes the last digit", () => {
    expect(applyPointsInput("125", "BACKSPACE")).toBe("12");
    expect(applyPointsInput("", "BACKSPACE")).toBe("");
  });

  it("clears all entered points", () => {
    expect(applyPointsInput("85", "CLEAR")).toBe("");
  });
});
