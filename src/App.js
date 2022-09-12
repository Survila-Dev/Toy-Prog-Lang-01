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
  const [outConsList, updateOutConsList] = React.useState(["First line", "Second line"])

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

    try {
    // Input the data to the "code"
    if (interpretorState.nominalStackSize === interpretorState.globalStack.length) {
      const curCode = interpretorState.currentCode;
      
      curCode.runOneStep(
        interpretorState.lineMarking.currentEvalLine,
        altTempLexEnv,
        altTempStack)
      
      curConsOut = curCode.currentOutput;
      outLexEnv = JSON.parse(JSON.stringify(curCode.executionContext));
      outStack = JSON.parse(JSON.stringify(curCode.callStack));

      if (curConsOut) {
        updateOutConsList((prevValue) => {
          return [...prevValue, curConsOut]
        })
      }

    } else {
      // Create block element and execute
      const tempNode = new FLNodeBlock("Block", altTempStack[altTempStack.length-1]);
      curConsOut = tempNode.run(altTempLexEnv);
      
      altTempStack.pop()
      outLexEnv = JSON.parse(JSON.stringify(altTempLexEnv));
      outStack = JSON.parse(JSON.stringify(altTempStack));

      if (curConsOut.length !== 0) {
        updateOutConsList((prevValue) => {
          console.log("Console output length")
          // console.log(prevValue)
          // const outputArray = [];
          // outputArray = outputArray.concat(prevValue);
          // outputArray = outputArray.concat(curConsOut);
          console.log([...prevValue, ...curConsOut[1]]);
          return [...prevValue, ...curConsOut[1]];
        })
      }


    }} catch (error) {

      // Error handling here

      if (error === "no_variable_error") {
        // Stop automatic running, if it is on

        // Mark the line as error

        // Log to the console

      }
    }

    

    // Prepare the data to be output as state (also deep copy)
    
    
    console.log(interpretorState.nominalStackSize);

    let lexEnvForView = {};
    Object.keys(outLexEnv).forEach((key) => {
      lexEnvForView[key] = [outLexEnv[key], determineTheVarType(outLexEnv[key])]
    })

    let callStackForView = [];
    outStack.forEach((element) => {
      callStackForView.push(["", element])
    })

    // console.log("=================================")
    // console.log("PrevState Deep Copy")
    // console.log(prevStateCopy)
    // console.log("LEXENV:")
    // console.log(interpretorState.globalLexEnv)
    // console.log(altTempLexEnv)
    // console.log(outLexEnv)
    // console.log(lexEnvForView)
    // console.log("STACK:")
    // console.log(interpretorState.globalStack)
    // console.log(altTempStack)
    // console.log(outStack)
    // console.log(callStackForView)

    changeInterpretorState(
      {
        globalLexEnv: lexEnvForView,
        globalStack: callStackForView,
        lineMarking: {currentEvalLine: interpretorState.currentCode.currentLine, currentErrorLine: null},
        currentCode: interpretorState.currentCode,
        nominalStackSize: interpretorState.nominalStackSize + (outStack.length - altTempStack.length)})
    
  }, [triggerForEval])

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
        currentEvalLine: null,
        currentErrorLine: null,
    },
    currentCode: new FLCode(
      "Ei = 6;\nPRINT(2);\nTu = 12;\nc = Ei+Ka;",
      1000
    ),
    nominalStackSize: 0}
  )
  
  const [editorContent, changeEditorContent] =
    React.useState(interpretorState.currentCode.internalText);

  const [lineDragContent, changeLineDragContent] = React.useState(
    ["wrong line", "wrong code"]
  )
  
  const [setInterObj, changeSetInterObj] = React.useState();

  function handleRunAuto(event) {

    let i = 0;
    const interObj = (setInterval(() => {
      flipTriggerForEval((prev) => !prev);
    }, 500))

    changeSetInterObj(interObj)
  }

  function handleRunStop(event) {
    clearInterval(setInterObj);
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

  }

  function handleClear(event) {
    updateOutConsList([])
  }

  const showPopUp = false;

  return (
    <div className = "App">
      <NavBar/>
      
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
            <Selector/>
            <Editor
              editorContent = {editorContent}
              changeEditorContent = {changeEditorContent}
              lineMarking = {interpretorState.lineMarking}
              changeLineDragContent = {changeLineDragContent} 
            />
            <ControlPanel
              runOneStep = {handleRunOneStep}
              runAuto = {handleRunAuto}
              runToBreakPoint = {handleRunToBreak}
              startAtCodeStart = {handleJumpToCodeStart}
              stopRun = {handleRunStop}
              handleClear = {handleClear}
            />
            <Output
              outputList = {outConsList}/>
          </div>

          
      </div>
      {showPopUp? <PopUpMessage/> : <></>}
    </div>
  );
}

export default App;
