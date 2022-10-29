import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";    
import NavBar from "./NavBar"

test("on initial render two buttons appear", () => {
    render(<NavBar/>);
    //screen.getByRole(""); // gets a list of elements with their roles and names
    expect(screen.getByRole("button", {name: "About / Contact"})).toBeEnabled();
    expect(screen.getByRole("button", {name: "Help"})).toBeEnabled();
    //screen.debug(); // displays the dom element 
})

test("on initial render two buttons appear (async)", async() => {
    // this should be used if the element does not reach its final testing state directly on render but a bit later
    render(<NavBar/>);
    //screen.getByRole(""); // gets a list of elements with their roles and names
    expect(await screen.findByRole("button", {name: "About / Contact"})).toBeEnabled();
    expect(await screen.findByRole("button", {name: "Help"})).toBeEnabled();
    //screen.debug(); // displays the dom element 
})