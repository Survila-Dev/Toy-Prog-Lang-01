import './App.css';

import React from "react";
import NavBar from "./NavBar/NavBar"
import LexEnv from "./LexEnv/LexEnv"
import CallStack from "./CallStack/CallStack"
import Editor from "./Editor/Editor"
import Selector from "./Selector/Selector"
import Output from "./Output/Output"
import ControlPanel from './ControlPanel/ControlPanel';
import PopUpMessage from "./PopUpMessage/PopUpMessage"

import { FLCode } from "./FuncLang/dist/FLCode"
import { FLNodeBlock } from "./FuncLang/dist/FLNode/FLNodeBlock"

function App() {

  // -- STATE VARIABLES --
  const [triggerForEval, flipTriggerForEval] = React.useState(false);
  const [outConsList, updateOutConsList] = React.useState([])
  const [consListErrors, updateConsListErrors] = React.useState([])
  const [codeInAutoRun, updateCodeInAutoRun] = React.useState(false);
  const [setInterObj, changeSetInterObj] = React.useState();
  const [showPopUp, updateShowPopUp] = React.useState(true);
  const [whichPopUp, updateWhichPopUp] = React.useState("help");

  const [interpretorState, changeInterpretorState] = React.useState({
    globalLexEnv: {},
    globalStack: [],
    lineMarking: {
        currentEvalLine: 1,
        currentErrorLine: 3,
    },
    currentCode: new FLCode(
      "PRINT(Start of the code);\nFOR (i = 5 | i < 20 | i = i + 4) {\n\tIF (i >= 15) {\n\t\tPRINT(i larger than 15);\n\t} ELSE {\n\t\tPRINT(i smaller than 15);\n\t};\n};\nPRINT(End of code);",
      1000
    ),
    nominalStackSize: 0}
  )
  
  const [editorContent, changeEditorContent] =
    React.useState(interpretorState.currentCode.internalText);

  const [lineDragContent, changeLineDragContent] = React.useState(
    ["wrong line", "wrong code"]
  )

  // -- USE EFFECT CALLBACKS --
  React.useEffect(() => {
    // Initialization of the page
    document.title =  "Toy Programming Language";

    // Set up the local storage
    localStorage.setItem("snippet0", JSON.stringify(
      {
        name: "For Loop with If Condition",
        tags: ["FOR", "IF", "PRINT"],
        description: "A for loop with nested if condition with print command.",
        globalLexEnv: {},
        globalStack: [],
        lineMarking: {currentEvalLine: null, currentErrorLine: null},
        currentCode: new FLCode(
          "PRINT(Start of the code);\nFOR (i = 5 | i < 20 | i = i + 4) {\n\tIF (i >= 15) {\n\t\tPRINT(i larger than 15);\n\t} ELSE {\n\t\tPRINT(i smaller than 15);\n\t};\n};\nPRINT(End of code);", 100
        ),
        nominalStackSize: 0
      }
    ))

    localStorage.setItem("snippet1", JSON.stringify(
      {
        name: "Boolean, String and Number Variable",
        tags: ["BOOLEAN", "STRING", "PRINT"],
        description: "Two nested loops with print statement inside the nested for loops.",
        globalLexEnv: {},
        globalStack: [],
        lineMarking: {currentEvalLine: null, currentErrorLine: null},
        currentCode: new FLCode(
          "num01 = 40;\nnum02 = 56;\nmyString = hello;\nmyBool = 1;\n\nmyBool2 = (num02 == 56) & (num01 == 40);\nmyBool3 = (num02 == 56) | (num01 == 45);\nmyBool3 = !(num02 == 56);\nmyString2 = myString + _not_hello;\nnum03 = num02 * num02 / 15;", 69
        ),
        nominalStackSize: 0
      }
    ))

    localStorage.setItem("snippet2", JSON.stringify(
      {
        name: "While Loop",
        tags: ["WHILE", "BOOLEAN"],
        description: "A while loop with boolean and number variables.",
        globalLexEnv: {},
        globalStack: [],
        lineMarking: {currentEvalLine: null, currentErrorLine: null},
        currentCode: new FLCode(
          "boolVal = true;\nvar1 = 100;\nvar2 = 200;\nWHILE (boolVal) {\n\tvar1 = var1 + 5;\n\tvar2 = var2 - 5;\n\tboolVal = var1 <= var2;\n};", 100
        ),
        nominalStackSize: 0
      }
    ))

    localStorage.setItem("snippet3", JSON.stringify(
      {
        name: "Nested For Loops",
        tags: ["FOR WITHIN FOR"],
        description: "A for loop nested within a for loop.",
        globalLexEnv: {},
        globalStack: [],
        lineMarking: {currentEvalLine: null, currentErrorLine: null},
        currentCode: new FLCode(
          "countdown = 1000;\nFOR (j = 3 | j < 20 | j = j + 8) {\n\tcountdown = countdown - j;\n\tFOR (k = j | k < 20 | k = k + 4) {\n\t\tPRINT(k * j);\n\t};\n};\nPRINT(countdown);", 100
        ),
        nominalStackSize: 0
      }
    ))
    return (() => {
      // Clean up function for freeing up the local storage
      localStorage.clear()
    })
  }, [])

  React.useEffect(() => {
    // Run everytime the code is executed

    // Prepare the input data which is deep copy of the state
    const prevStateCopy = JSON.parse(JSON.stringify(interpretorState));
    const altTempLexEnv = {}
    Object.keys(prevStateCopy.globalLexEnv).forEach((key) => {
      altTempLexEnv[key] = prevStateCopy.globalLexEnv[key][0]
    })

    const altTempStack = []
    prevStateCopy.globalStack.forEach((el) => {
      altTempStack.push(el[1])
    })

    let outLexEnv;
    let outStack;
    let curConsOut;

    let errorLine = null;
    let curEvalLine = null;
    let curCode;

    try {
    // Input the data to the "code"
    if (interpretorState.nominalStackSize === interpretorState.globalStack.length ||
        (!altTempStack[altTempStack.length-1])) {
      
      // Check if current pos is null if so creat the new currentCode
      if (interpretorState.lineMarking.currentEvalLine === null) {

        console.log(editorContent);

        curCode = new FLCode(editorContent, 200);
        curEvalLine = null;
        changeInterpretorState((prevState) => {
          return {
            ...prevState,
            lineMarking: {currentEvalLine: null, currentErrorLine: null},
            currentCode: curCode
          }
        })
      } else {
        curCode = interpretorState.currentCode;
        curCode.currentLine = 1;
        curEvalLine = interpretorState.lineMarking.currentEvalLine;
      }
      console.log(curCode)
      curCode.runOneStep(
        curEvalLine,
        // interpretorState.lineMarking.currentEvalLine,
        altTempLexEnv,
        altTempStack)
      
      curConsOut = curCode.currentOutput;
      outLexEnv = JSON.parse(JSON.stringify(curCode.executionContext));
      outStack = JSON.parse(JSON.stringify(curCode.callStack));

      if (curConsOut) {
        updateOutConsList((prevValue) => {
          return [...prevValue, curConsOut]
        })
        updateConsListErrors((prevList) => {
          return [...prevList, false];
        })
      }

    } else {

      // Create block element and execute
      // here is something taking place

      // if (altTempStack[altTempStack.length-1]) {

        const tempNode = new FLNodeBlock("Block", altTempStack[altTempStack.length-1]);
        curConsOut = tempNode.run(altTempLexEnv);
        // curConsOut = curConsOutAll[1]
        
        altTempStack.pop()
        outLexEnv = JSON.parse(JSON.stringify(altTempLexEnv));
        outStack = JSON.parse(JSON.stringify(altTempStack));

        curCode = interpretorState.currentCode;
        curEvalLine = interpretorState.lineMarking.currentEvalLine;

        if (curConsOut[1]) {

          if (curConsOut[1].length !== 0) {
            updateOutConsList((prevValue) => {

              // const outputArray = [];
              // outputArray = outputArray.concat(prevValue);
              // outputArray = outputArray.concat(curConsOut);
              return [...prevValue, ...curConsOut[1]];
            })

            updateConsListErrors((prevList) => {

              const newList = [];
              for (let i = 0; i < curConsOut.length; i++) {
                newList.push(false)
              }
              return [...prevList, ...newList];
            })
          }
        }
      // }

      
    }

    let lexEnvForView = {};
    Object.keys(outLexEnv).forEach((key) => {
      lexEnvForView[key] = [outLexEnv[key], determineTheVarType(outLexEnv[key])]
    })

    let callStackForView = [];
    outStack.forEach((element) => {
      callStackForView.push(["", element])
    })

    changeInterpretorState(
      {
        globalLexEnv: lexEnvForView,
        globalStack: callStackForView,
        // lineMarking: {currentEvalLine: curEvalLine, currentErrorLine: errorLine},
        lineMarking: {currentEvalLine: curCode.currentLine, currentErrorLine: errorLine},
        currentCode: curCode,
        //currentCode: interpretorState.currentCode,
        nominalStackSize: interpretorState.nominalStackSize + (outStack.length - altTempStack.length)
      })

  } 
  catch (error) {

      // Error handling here

      // if (error === "no_variable_error") {
        // Stop automatic running, if it is on
        clearInterval(setInterObj);

        // Mark the line as error 
        errorLine = interpretorState.lineMarking.currentEvalLine;

        // Log to the console
        updateOutConsList((prevValue) => {
          return [...prevValue, `Error: ${error}`]})

        changeInterpretorState((prevState) => {
          return {
            ...prevState,
            lineMarking: {currentEvalLine: interpretorState.currentCode.currentLine, currentErrorLine: errorLine},
          }  
        })
        updateConsListErrors((prevList) => [...prevList, true])

      // }
    }
  }
    //Prepare the data to be output as state (also deep copy)
    
  , [triggerForEval])

  React.useEffect(() => {
    // Set the execution state of the code to start start
    changeInterpretorState((prevState) => {
      return {
        ...prevState,
        globalStack: [],
        lineMarking: {currentEvalLine: null, currentErrorLine: null},
        nominalStackSize: 0
      }  
    })
  }, [])

  // -- SUBROUTINES --
  function determineTheVarType(varValue) {

    let varType = "none"
    if (varValue === "") {
        varType = "none"
    } else if (varValue == 1 || varValue == 0) {
        varType = "boolean"
    } else if (!isNaN(varValue)) {
        varType = "number"
    } else {
        varType = "string"
    }
    return varType;
  }
  
  // -- HANDLE FUNCTIONS --
  function handleRunAuto(event) {

    const RUN_INTERVAL = 200;
    if (!codeInAutoRun) {

      let i = 0;
      const interObj = (setInterval(() => {
        flipTriggerForEval((prev) => !prev);
      }, RUN_INTERVAL))
      updateCodeInAutoRun(true);
      changeSetInterObj(interObj)
    }
  }

  function handleRunStop(event) {
    clearInterval(setInterObj);
    updateCodeInAutoRun(false);
  }

  

  function handleRunOneStep(event) {
    flipTriggerForEval((prev) => !prev);
  }

  function handleJumpToCodeStart(event) {
    // The same if textarea is changed
    clearInterval(setInterObj);
    updateCodeInAutoRun(false);
    
    changeInterpretorState((prevState) => {
      return {
        ...prevState,
        globalStack: [],
        lineMarking: {currentEvalLine: null, currentErrorLine: null},
        nominalStackSize: 0
        //!
      }  
    })
  }

  function handleClear(event) {
    updateOutConsList([])
    updateConsListErrors([])
  }

  return (
    <div className = "App">
      <NavBar
        updateShowPopUp = {updateShowPopUp}
        updateWhichPopUp = {updateWhichPopUp}
      />
      <div className="AppGrid">
          <div className = "leftside">
            <LexEnv
              lexEnv = {interpretorState.globalLexEnv}
              changeInterpretorState = {changeInterpretorState}/>
            <CallStack
              callStack = {interpretorState.globalStack}
              changeInterpretorState = {changeInterpretorState}
              lineDragContent = {lineDragContent}
              changeLineDragContent = {changeLineDragContent}  
            />
          </div>
          <div className = "rightside">
            <Selector
              updateEditorContent = {changeEditorContent}
              interpretorState = {interpretorState}
              updateInterpretorState = {changeInterpretorState}
              intervalObj = {setInterObj}
              updateCodeInAutoRun = {updateCodeInAutoRun}/>
            <Editor
              editorContent = {editorContent}
              changeEditorContent = {changeEditorContent}
              lineMarking = {interpretorState.lineMarking}
              changeLineDragContent = {changeLineDragContent} 
              intervalObj = {setInterObj}
              updateInterpretatorState = {changeInterpretorState}
            />
            <ControlPanel
              runOneStep = {handleRunOneStep}
              runAuto = {handleRunAuto}
              startAtCodeStart = {handleJumpToCodeStart}
              stopRun = {handleRunStop}
              handleClear = {handleClear}
              codeInAutoRun = {codeInAutoRun}
            />
            <Output
              outputList = {outConsList}
              errorsInList = {consListErrors}/>
          </div>
      </div>
      {showPopUp? <PopUpMessage
        whichPopUp = {whichPopUp}
        updateShowPopUp = {updateShowPopUp}
        /> : <></>}
    </div>
  );
}

export default App;
