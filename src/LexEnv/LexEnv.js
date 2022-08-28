// import "./LexEnv.css";

import React from "react"

function LexEnv({lexEnv, changeLexEnv}) {

    const [addNewEl, changeAddNewEl] = React.useState(["var0", "literal", "string"]);

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

    function determineTheVarType(varValue) {

        let varType = "none"
        if (varValue === "") {
            varType = "none"
        } else if (varValue === "true" || varValue === "false") {
            varType = "boolean"
        } else if (!isNaN(varValue)) {
            varType = "number"
        } else {
            varType = "string"
        }
        return varType;
    }

    function inputChanged(event) {
        const {name, value} = event.target;

        const varType = determineTheVarType(value);
        changeLexEnv((prevState) => {

            return {
                ...prevState,
                [name]: [value, varType]
            }
        })
    }

    function addNewLexEnvElement(event) {

        const varName = addNewEl[0];
        changeLexEnv((prevState) => {
            return ({
                ...prevState,
                [varName]: [addNewEl[1], determineTheVarType(addNewEl[1])]
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

        lexEnvComponents.push(
            <div className = "lexenvelement" id = {i} key = {i}>
                <span className = "LexEnvElName">
                    {lexEnvKeys[i]}
                </span>
                <span className = "LexEnvElType">
                    {lexEnv[lexEnvKeys[i]][1]}
                </span>
                <input
                    type = "text"
                    className = "LexEnvElLiteral"
                    name = {lexEnvKeys[i]}
                    value={lexEnv[lexEnvKeys[i]][0]}
                    onChange = {inputChanged}/>
                <button
                    name = {lexEnvKeys[i]}
                    onClick = {deleteButton}
                >
                    x
                </button>
            </div>
        )
    }

    return (
        <>
        <h2>Execution Context</h2>
        <div className = "lexenv">
            <div className = "lexenvvariables">
                {lexEnvComponents}
            </div>
            <div className = "lexenvaddnew">
                <input
                    type = "text"
                    className = "addNewLexEnvEl"
                    value = {addNewEl[0]}
                    onChange = {handleAddNewElNameChange}
                />
                <div></div>
                <input
                    type = "text"
                    className = "addNewLexEnvEl"
                    value = {addNewEl[1]}
                    onChange = {handleAddNewElLiteralChange}
                />
                <button onClick = {addNewLexEnvElement}>+</button>
            </div>
        </div>
        </>
    )
}

export default LexEnv;