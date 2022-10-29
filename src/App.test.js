import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";    
import App from "./App"

// test("e2e: check if pop up message can be clicked away", () => {})

test("e2e: check if about is rendered when the button is clicked", () => {
    render(<App/>);
    // screen.getByRole("");
    // expect(screen.getByRole("button", {name: "About / Contact"})).toBeEnabled();
    // userEvent.click(screen.getByRole("button", {class: "popupcontrol"}));
    // screen.debug();

    // exepct h2 title to be "Get in Contact!"
    // expect buttons for github, linkedin and e-mail to be rendered
    
    // "button" "About / Contact"; "article" ""
})

// test("e2e: check if code snippets can be selected", () => {})

// test("e2e: check if code can be input and evaluated step by step", () => {})