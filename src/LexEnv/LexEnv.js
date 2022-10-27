import "./LexEnv.css";
import iconPlus from "./134224_add_plus_new_icon.svg";
import iconX from "./8666595_x_icon.svg";

import React from "react"

function LexEnv({lexEnv, changeInterpretorState}) {

    const [addNewEl, changeAddNewEl] = React.useState(["var0", "literal", "string"]);
    const IDPREPEND = "lexenvinput"
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
        } else if (!isNaN(varValue)) {
            varType = "number"
            if (varValue == 1 || varValue == 0) {
                varType = "boolean";
            }
        } else {
            varType = "string"
        }
        return varType;
    }

    function inputChanged(event) {
        const {name, value} = event.target;

        const varType = determineTheVarType(value);

        changeInterpretorState((prevState) => {
            const newLexEnv = {...prevState.globalLexEnv};
            return {
                ...prevState,
                globalLexEnv: {
                    ...newLexEnv,
                    [name]: [value, varType]}}
        })
    }

    function addNewLexEnvElement(event) {

        const varName = addNewEl[0];

        changeInterpretorState((prevState) => {
            const newLexEnv = {...prevState.globalLexEnv};
            return {
                ...prevState,
                globalLexEnv: {
                    ...newLexEnv,
                    [varName]: [addNewEl[1], determineTheVarType(addNewEl[1])]}}
        })

        // Check what variable name the input for new element name should have
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

        changeInterpretorState((prevState) => {
            const newLexEnv = {...prevState.globalLexEnv};
            delete newLexEnv[name];
            return {
                ...prevState,
                globalLexEnv: {...newLexEnv}
        }})
    }

    function handleArrowKeyDown(event) {
        
        function calcNewId(currentId, delta) {
            let no = parseInt(currentId.substring(IDPREPEND.length, currentId.length))
            no += delta;
            if (no === -1) no = 0;
            if (no === Object.keys(lexEnv).length) return "next";
            
            return (IDPREPEND + no)
        }

        if (event.key === "ArrowDown") {
            const nextId = calcNewId(event.target.id, 1);
            console.log(nextId);
            if (nextId === "next") {
                document.getElementsByClassName("addNewLexEnvEl")[0].select();
            } else {
                document.getElementById(nextId).select();
            }

        } else if (event.key === "ArrowUp") {
            const nextId = calcNewId(event.target.id, -1);
            document.getElementById(nextId).select();

        }
    }

    function handleKeyPressDownAdd(event) {
        if (event.key === "Enter") {
            addNewLexEnvElement();
        } else if (event.key === "ArrowUp") {
            const idToUse = IDPREPEND + (Object.keys(lexEnv).length - 1)
            document.getElementById(idToUse).select();
        }
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
                    id = {`lexenvinput${i}`}
                    className = "LexEnvElLiteral"
                    name = {lexEnvKeys[i]}
                    value={lexEnv[lexEnvKeys[i]][0]}
                    onChange = {inputChanged}
                    onKeyDown = {handleArrowKeyDown}/>
                <button
                    className = "button_icon"
                    name = {lexEnvKeys[i]}
                    onClick = {deleteButton}
                >
                    
                    <img className = "leftside__icon__x" src={iconX} alt="x"/>
                </button>
            </div>
        )
    }

    return (
        <div className ="lexenvwithtitle">
            <div className = "lexenv__header">
                <h2>Execution Context</h2>
                <p class="h2_sub">Add, change and delete variables</p>
            </div>
        <div className = "lexenv">
            <div className = "lexencolnames">
                <span className = "lexenvcolname">
                    Var.
                </span>
                <span className = "lexenvcolname">
                    Type
                </span>
                <span className = "lexenvcolname">
                    Value
                </span>
            </div>
            <div className = "lexenvvariables">
                {lexEnvComponents}
            </div>
            <div className = "lexenvaddnew">
                <input
                    type = "text"
                    className = "addNewLexEnvEl"
                    value = {addNewEl[0]}
                    onChange = {handleAddNewElNameChange}
                    onKeyDown = {handleKeyPressDownAdd}
                />
                <div>
                    {determineTheVarType(addNewEl[1])}
                </div>
                <input
                    type = "text"
                    className = "addNewLexEnvEl"
                    value = {addNewEl[1]}
                    onChange = {handleAddNewElLiteralChange}
                    onKeyDown = {handleKeyPressDownAdd}
                />
                <button
                    className = "button_icon__plus calltoaction button_icon"
                    onClick = {addNewLexEnvElement}
                >
                    <img
                        className = "leftside__icon__plus"
                        src={iconPlus}
                        alt="+"/>
                </button>
            </div>

        </div>
        </div>
    )
}

export default LexEnv;