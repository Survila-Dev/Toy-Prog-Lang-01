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
function App() {

  // Refactor the state variable to one: globalLexEnv, globalStack, lineMarking
  const [testState, updateTestState] = React.useState(false);

  React.useEffect(() => {
    console.log("useEffect fired!")

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

    
    // Input the data to the "code"
    const curCode = interpretorState.currentCode;
    curCode.runOneStep(
      interpretorState.lineMarking.currentEvalLine,
      altTempLexEnv,
      altTempStack)

    // Prepare the data to be output as state (also deep copy)
    const outLexEnv = JSON.parse(JSON.stringify(curCode.executionContext));
    const outStack = JSON.parse(JSON.stringify(curCode.callStack));

    // Adapt global lexenv and callstack for front end
    let lexEnvForView = {};
    Object.keys(outLexEnv).forEach((key) => {
      lexEnvForView[key] = [outLexEnv[key], determineTheVarType(outLexEnv[key])]
    })

    let callStackForView = [];
    outStack.forEach((element) => {
      callStackForView.push(["", element])
    })

    console.log("=================================")
    console.log("PrevState Deep Copy")
    console.log(prevStateCopy)
    console.log("LEXENV:")
    console.log(interpretorState.globalLexEnv)
    console.log(altTempLexEnv)
    console.log(outLexEnv)
    console.log(lexEnvForView)
    console.log("STACK:")
    console.log(interpretorState.globalStack)
    console.log(altTempStack)
    console.log(outStack)
    console.log(callStackForView)

    changeInterpretorState(
      {
        globalLexEnv: lexEnvForView,
        globalStack: callStackForView,
        lineMarking: {currentEvalLine: interpretorState.currentCode.currentLine, currentErrorLine: null},
        currentCode: interpretorState.currentCode})
    
  }, [testState])

  const [interpretorState, changeInterpretorState] = React.useState({
    globalLexEnv: {},
        // "a": [6, "number"],
        // "b": ["Eimantas", "string"],
        // "c": [true, "boolean"]},
    globalStack: [],
    //     ["name1", "code1"],
    //     ["name2", "code2"],
    //     ["name3", "code3"],
    //     ["name4", "code4"],
    // ],
    lineMarking: {
        currentEvalLine: null,
        currentErrorLine: null,
    },
    currentCode: new FLCode(
      "Ei = 6;\nTu = 12;\nc = Ei-Ka;",
      1000
    )}
  )

  // const [globalLexEnv, changeGlobalLexEnv] = React.useState(
  //   {
  //     "a": [6, "number"],
  //     "b": ["Eimantas", "string"],
  //     "c": [true, "boolean"]}
  // )
  // const curCode = new FLCode(
  //   "a = 6;\nb = 12;\nPRINT(b);\nc = a+b;\nPRINT(c*c+b);",
  //   1000
  // );
  // const [currentCode, changeCurrentCode] = React.useState(new FLCode(
  //   "Ei = 6;\nTu = 12;\nc = Ei+Tu;",
  //   1000
  // ))
  
  
  const [editorContent, changeEditorContent] =
    React.useState(interpretorState.currentCode.internalText);

  // const [globalStack, changeGlobalStack] = React.useState(
  //   [
  //     ["name1", "code1"],
  //     ["name2", "code2"],
  //     ["name3", "code3"],
  //     ["name4", "code4"],
  //   ]
  // )

  const [lineDragContent, changeLineDragContent] = React.useState(
    ["wrong line", "wrong code"]
  )

  // const [lineMarking, changeLineMarking] = React.useState({
  //   currentEvalLine: 2,
  //   currentErrorLine: 3,
  // })

  const [inRun, changeInRun] = React.useState(false);
  const [setInterObj, changeSetInterObj] = React.useState();

  // One React.useState for the whole FL data structure

  function handleRunAuto(event) {

    changeInRun(true);

    let i = 0;
    const interObj = (setInterval(() => {
      
      let curLine = 0;
      const noOfLines = editorContent.split("\n").length;
      i++;
      console.log(interpretorState.lineMarking.currentEvalLine + i)
      console.log(noOfLines)

      if (interpretorState.lineMarking.currentEvalLine + i === noOfLines) {
        clearInterval(interObj);
      }

      // changeLineMarking((prevValue) => {
      //   curLine = prevValue.currentEvalLine;
      //   console.log(`current line from status func: ` + curLine)
      //   return ({...prevValue, currentEvalLine: prevValue.currentEvalLine + 1})
      // })
      changeInterpretorState((prevState) => {
        curLine = prevState.lineMarking.currentEvalLine;
        console.log(`current line from status func: ` + curLine)

        return {
          ...prevState,
          lineMarking: {...prevState.lineMarking, currentEvalLine: prevState.lineMarking.currentEvalLine + 1}
      }})

      
        
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
    
    console.log("CLICKED!")
    changeInterpretorState((prevState) => {

      // Prepare the input data which is deep copy of the state
      const prevStateCopy = JSON.parse(JSON.stringify(prevState));
      const altTempLexEnv = {}
      Object.keys(prevStateCopy.globalLexEnv).forEach((key) => {
        altTempLexEnv[key] = prevStateCopy.globalLexEnv[key][0]
      })
      const altTempStack = []
      prevStateCopy.globalStack.forEach((el) => {
        altTempStack.push(el[1])
      })

      
      // Input the data to the "code"
      prevState.currentCode.runOneStep(
        prevState.lineMarking.currentEvalLine,
        altTempLexEnv,
        altTempStack)

      // Prepare the data to be output as state (also deep copy)
      const outLexEnv = JSON.parse(JSON.stringify(prevState.currentCode.executionContext));
      const outStack = JSON.parse(JSON.stringify(prevState.currentCode.callStack));

      // Adapt global lexenv and callstack for front end
      let lexEnvForView = {};
      Object.keys(outLexEnv).forEach((key) => {
        lexEnvForView[key] = [outLexEnv[key], determineTheVarType(outLexEnv[key])]
      })

      let callStackForView = [];
      outStack.forEach((element) => {
        callStackForView.push(["", element])
      })

      console.log("=================================")
      console.log("PrevState Deep Copy")
      console.log(prevStateCopy)
      console.log("LEXENV:")
      console.log(prevState.globalLexEnv)
      console.log(altTempLexEnv)
      console.log(outLexEnv)
      console.log(lexEnvForView)
      console.log("STACK:")
      console.log(prevState.globalStack)
      console.log(altTempStack)
      console.log(outStack)
      console.log(callStackForView)

      return ({
        ...prevState,
        globalLexEnv: lexEnvForView,
        globalStack: callStackForView,
        lineMarking: {currentEvalLine: prevState.currentCode.currentLine, currentErrorLine: null},
        currentCode: prevState.currentCode
    })})
  }

  function handleRunToBreak(event) {

  }

  function handleJumpToCodeStart(event) {

  }

  function handleClear(event) {
    updateTestState((prev) => !prev);
  }

  const showPopUp = false;

  return (
    <div className = "App">
      <NavBar
        runIn = {inRun ? "inRun: true" : "inRun: false"}
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
            <Output/>
          </div>

          
      </div>
      {showPopUp? <PopUpMessage/> : <></>}
    </div>
  );
}

export default App;
