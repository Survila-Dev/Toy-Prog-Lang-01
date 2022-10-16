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

  const [triggerForEval, flipTriggerForEval] = React.useState(false);
  const [outConsList, updateOutConsList] = React.useState([])
  const [consListErrors, updateConsListErrors] = React.useState([])

  React.useEffect(() => {
    // Initialization of the page
    document.title =  "Toy Programming Language";

    // Set up the local storage
    localStorage.setItem("snippet0", JSON.stringify(
      {
        name: "For Loop with If Condition",
        tags: ["FOR", "IF", "PRINT"],
        description: "A for loop with nested if condition using multiple variables and print command.",
        globalLexEnv: {},
        globalStack: [],
        lineMarking: {currentEvalLine: null, currentErrorLine: null},
        currentCode: new FLCode(
          "k = 2; \nFOR (i = 0 | i < 20 | i = i + 3) "+
          "{\n\tc = i + k;\n\tIF (i > 10) {\n\t\tPRINT(i);\n\t}\n\tPRINT(i);\n};\nd = i + k + c * 2;", 100
        ),
        nominalStackSize: 0
      }
    ))

    localStorage.setItem("snippet1", JSON.stringify(
      {
        name: "Two Nested For Loops",
        tags: ["FOR", "PRINT"],
        description: "Two nested loops with print statement inside the nested for loops.",
        globalLexEnv: {},
        globalStack: [],
        lineMarking: {currentEvalLine: null, currentErrorLine: null},
        currentCode: new FLCode(
          "k = 2;\nFOR (i = 0 | i < 10 | i = i + 1) {\n\t" +
          "FOR (j = 0 | j < 10 | j = j + 1) {\n\t\tPRINT(j * i);\n\t\t};};", 69
        ),
        nominalStackSize: 0
      }
    ))

    localStorage.setItem("snippet3", JSON.stringify(
      {
        globalLexEnv: {},
        globalStack: [],
        lineMarking: {currentEvalLine: null, currentErrorLine: null},
        currentCode: new FLCode(
          "i = 2; \nWHILE (i < 20) {\nc = i;\n b = 12;\ni = i + 3;\n};\nd = 16;", 69
        ),
        nominalStackSize: 0
      }
    ))

    localStorage.setItem("snippet4", JSON.stringify(
      {
        globalLexEnv: {},
        globalStack: [],
        lineMarking: {currentEvalLine: null, currentErrorLine: null},
        currentCode: new FLCode(
          "i = 2; \nWHILE (i < 20) {\nc = i;\n b = 12;\ni = i + 3;\n};\nd = 16;", 69
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

    // try {
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

      // !This one is executing on empty text
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
  // catch (error) {

  //     // Error handling here

  //     if (error === "no_variable_error") {
  //       // Stop automatic running, if it is on
  //       clearInterval(setInterObj);

  //       // Mark the line as error 
  //       errorLine = interpretorState.lineMarking.currentEvalLine;

  //       // Log to the console
  //       updateOutConsList((prevValue) => {
  //         return [...prevValue, `Error: ${error} in ${errorLine} line`]})
  //       changeInterpretorState((prevState) => {
  //         return {
  //           ...prevState,
  //           lineMarking: {currentEvalLine: interpretorState.currentCode.currentLine, currentErrorLine: errorLine},
  //         }  
  //       })
  //       updateConsListErrors((prevList) => [...prevList, true])

  //     }
  //   }

    

    // Prepare the data to be output as state (also deep copy)
    
    
    
  , [triggerForEval])

  const [interpretorState, changeInterpretorState] = React.useState({
    globalLexEnv: {},
        // "a": [6, "number"],
        // "b": ["Eimantas", "string"],
        // "c": [true, "boolean"]},
    globalStack: [],
    //     ["name1", "code1"],
    //     ["name4", "code4"],
    // ],
    lineMarking: {
        currentEvalLine: 1,
        currentErrorLine: 3,
    },
    currentCode: new FLCode(
      "i = 2; \nWHILE (i < 20) {\nc = i;\n b = 12;\ni = i + 3;\n};\nd = 16;",
      1000
    ),
    nominalStackSize: 0}
  )
  
  const [editorContent, changeEditorContent] =
    React.useState(interpretorState.currentCode.internalText);

  const [lineDragContent, changeLineDragContent] = React.useState(
    ["wrong line", "wrong code"]
  )
  
  const [codeInAutoRun, updateCodeInAutoRun] = React.useState(false);
  const [setInterObj, changeSetInterObj] = React.useState();
  const [showPopUp, updateShowPopUp] = React.useState(true);
  const [whichPopUp, updateWhichPopUp] = React.useState("help");

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

  function handleRunOneStep(event) {
    flipTriggerForEval((prev) => !prev);
  }

  function handleRunToBreak(event) {

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
            <LexEnv lexEnv = {interpretorState.globalLexEnv} changeInterpretorState = {changeInterpretorState}/>
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
              runToBreakPoint = {handleRunToBreak}
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
