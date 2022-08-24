import React from "react"

function LexEnv({lexEnv, changeLexEnv}) {

    const [addNewEl, changeAddNewEl] = React.useState(["var0", "literal"]);

    let lexEnvComponents = []
    const lexEnvKeys = Object.keys(lexEnv);
    const lexEnvValues = [];

    function handleAddNewElNameChange(event) {
        const {value} = event.target;
        changeAddNewEl((prevValue) => {
            return [value, prevValue[1]]
        });
    }

    function handleAddNewElLiteralChange(event) {
        const {value} = event.target;
        changeAddNewEl((prevValue) => {
            return [prevValue[0], value]
        });
    }

    function inputChanged(event) {
        const {name, value} = event.target;

        changeLexEnv((prevState) => {

            return {
                ...prevState,
                [name]: value
            }
        })
    }

    function addNewLexEnvElement(event) {

        const varName = addNewEl[0];
        changeLexEnv((prevState) => {
            return ({
                ...prevState,
                [varName]: addNewEl[1]
            })
        })

        // Check what variable name the input for new element should have
        const curNumber = 0;
        const lexEnvKeys = Object.keys(lexEnv);

        let newName = "";
        for (let i = 0; i < 1000; i++) {
            newName = `var${i}`;
            if (!lexEnvKeys.includes(newName) && newName !== varName) {
                break
            }
        }
        changeAddNewEl((prevValue) => {
            return [newName, prevValue[1]]
        });
    }

    function deleteButton(event) {
        const {name} = event.target;

        changeLexEnv((prevState) => {
            const newState = prevState;
            delete newState[name];
            return ({...newState});
        })

    }
    
    for (let i = 0; i < lexEnvKeys.length; i++) {

        if (typeof lexEnv[lexEnvKeys[i]] === "boolean") {
            if (lexEnv[lexEnvKeys[i]]) {
                lexEnvValues.push("true");
            } else {
                lexEnvValues.push("false");
            }
        } else {
            lexEnvValues.push(lexEnv[lexEnvKeys[i]]);
        }

        lexEnvComponents.push(
            <div className = "LexEnvElement" id = {i} key = {i}>
                <span className = "LexEnvElName">
                    {lexEnvKeys[i]}
                </span>
                <span className = "LexEnvElType">
                    {typeof lexEnv[lexEnvKeys[i]]}
                </span>
                <input
                    type = "text"
                    className = "LexEnvElLiteral"
                    name = {lexEnvKeys[i]}
                    value={lexEnvValues[i]}
                    onChange = {inputChanged}/>
                <button
                    name = {lexEnvKeys[i]}
                    onClick = {deleteButton}
                >
                    Delete
                </button>
            </div>
        )
    }

    return (
        <div className = "LexEnv">
            {lexEnvComponents}
            <input
                type = "text"
                className = "addNewLexEnvEl"
                value = {addNewEl[0]}
                onChange = {handleAddNewElNameChange}
            />
            <input
                type = "text"
                className = "addNewLexEnvEl"
                value = {addNewEl[1]}
                onChange = {handleAddNewElLiteralChange}
            />
            <button onClick = {addNewLexEnvElement}>Add new element</button>
            {JSON.stringify(addNewEl)}
        </div>
    )
}

export default LexEnv;