import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";    
import App from "./App"

test("e2e (critical): check if pop up message can be closed by clicking the close button", () => {
    render(<App/>);
    // Expect for the pop-up article to exist
    expect(screen.queryByTestId("pop-up-article")).toBeTruthy();
    expect(screen.queryByTestId("pop-up-article")).toBeInTheDocument();
    userEvent.click(screen.getByTestId("pop-up-close"));
    expect(screen.queryByTestId("pop-up-article")).toBeNull();
})

test("e2e (critical): check if about is rendered when the button is clicked", () => {
    render(<App/>);
    userEvent.click(screen.getByTestId("pop-up-close"));
    userEvent.click(screen.getByRole("button", {name: "About / Contact"}));

    const gitHubLink = screen.getByRole("link", {name: "GitHub"});
    const LinkedIn = screen.getByRole("link", {name: "LinkedIn"});

    expect(gitHubLink).toBeInTheDocument();
    expect(gitHubLink).toHaveAttribute('href', 'https://github.com/Survila-Dev');

    expect(LinkedIn).toBeInTheDocument();
    expect(LinkedIn).toHaveAttribute('href', 'https://www.linkedin.com/in/eimantas-survila/');

    const { getByText } = within(screen.getByTestId("pop-up-article"))
    expect(getByText('eimantas.survila.contact@gmail.com')).toBeInTheDocument()
})

test("e2e: check if code snippets can be selected", () => {
    render(<App/>);
    userEvent.click(screen.getByTestId("pop-up-close"));

    const TextBeforeChange = "PRINT(Start of the code);\nFOR (i = 5 | i < 20 | i = i + 4) {\n\tIF (i >= 15) {\n\t\tPRINT(i larger than 15);\n\t} ELSE {\n\t\tPRINT(i smaller than 15);\n\t};\n};\nPRINT(End of code);";
    const TextAfterChange = "countdown = 1000;\nFOR (j = 3 | j < 20 | j = j + 8) {\n\tcountdown = countdown - j;\n\tFOR (k = j | k < 20 | k = k + 4) {\n\t\tPRINT(k * j);\n\t};\n};\nPRINT(countdown);";

    // Check code editor content
    expect(screen.getByTestId("code-editor")).toHaveValue(TextBeforeChange)

    // Select another code snippet
    expect(screen.queryByTestId("selector-article")).toBeNull();
    userEvent.click(screen.getByTestId("selecton-button"));
    expect(screen.queryAllByTestId("selector-article")).toHaveLength(4);
    userEvent.click(screen.queryAllByTestId("selector-article")[3]);
    expect(screen.queryByTestId("selector-article")).toBeNull();

    // Check code editor content
    expect(screen.getByTestId("code-editor")).toHaveValue(TextAfterChange);
})

test("e2e (critical): check if code can be input and evaluated step by step", () => {

    const firstLine = "PRINT(Start of the code)";
    const outputText = "Start of the code";
    const secondLine = "i = 5";
    const [varName, varValue] = ["i", 5];

    render(<App/>);
    userEvent.click(screen.getByTestId("pop-up-close"));
    userEvent.click(screen.getByRole("button", {name: "Run One Line"}));
    userEvent.click(screen.getByRole("button", {name: "Run One Line"}));

    const { getByText } = within(screen.getByTestId("callstack"))
    expect(getByText(firstLine)).toBeInTheDocument()

    userEvent.click(screen.getByRole("button", {name: "Run One Line"}));

    // ! Check output for "PRINT(Start of the code)"
    userEvent.click(screen.getByRole("button", {name: "Run One Line"}));

    // ! Check if callstack empty

    userEvent.click(screen.getByRole("button", {name: "Run One Line"}));
    userEvent.click(screen.getByRole("button", {name: "Run One Line"}));

    expect(getByText(secondLine)).toBeInTheDocument()

    userEvent.click(screen.getByRole("button", {name: "Run One Line"}));

    // ! Check if execution context has i and 5
})