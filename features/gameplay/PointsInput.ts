export type PointsInputAction = "BACKSPACE" | "CLEAR" | `${number}`;

export function applyPointsInput(current: string, action: PointsInputAction): string {
  if (action === "CLEAR") {
    return "";
  }

  if (action === "BACKSPACE") {
    return current.slice(0, -1);
  }

  if (!/^\d$/.test(action)) {
    return current;
  }

  if (current === "0") {
    return action;
  }

  return `${current}${action}`;
}
