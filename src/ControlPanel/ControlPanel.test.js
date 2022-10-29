import ControlPanel from "./ControlPanel";
import { render, screen } from "@testing-library/react"

test("check if all buttons on render enabled", () => {
    render(<ControlPanel/>);
    expect(screen.getByRole("button", {name: "RUN"})).toBeEnabled();
    expect(screen.getByRole("button", {name: "STOP"})).toBeEnabled();
    expect(screen.getByRole("button", {name: "Run One Line"})).toBeEnabled();
    expect(screen.getByRole("button", {name: "Start at the Beginning / Clear Call Stack"})).toBeEnabled();
    expect(screen.getByRole("button", {name: "Clear"})).toBeEnabled();
})