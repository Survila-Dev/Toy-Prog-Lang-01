import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";    
import NavBar from "./NavBar"

test("on initial render two buttons appear", () => {
    render(<NavBar/>);
    expect(screen.getByRole("button", {name: "About / Contact"})).toBeEnabled();
    expect(screen.getByRole("button", {name: "Help"})).toBeEnabled();
})