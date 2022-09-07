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

function App() {

  const [globalLexEnv, changeGlobalLexEnv] = React.useState(
    {
      "a": [6, "number"],
      "b": ["Eimantas", "string"],
      "c": [true, "boolean"]}
  )
  const [editorContent, changeEditorContent] =
    React.useState("Hello first line \nSecond liner")

  const [globalStack, changeGlobalStack] = React.useState(
    [
      ["name1", "code1"],
      ["name2", "code2"],
      ["name3", "code3"],
      ["name4", "code4"],
    ]
  )

  const [lineDragContent, changeLineDragContent] = React.useState(
    ["wrong line", "wrong code"]
  )

  const [lineMarking, changeLineMarking] = React.useState({
    currentEvalLine: 2,
    currentErrorLine: 3,
  })

  const [inRun, changeInRun] = React.useState(false);
  const [setInterObj, changeSetInterObj] = React.useState();

  function handleRunAuto(event) {

    changeSetInterObj(setInterval(() => {
      
      changeLineMarking((prevValue) => {
          return ({...prevValue, currentEvalLine: prevValue.currentEvalLine + 1})
        })
    }, 1000))

  }

  function handleRunStop(event) {
    clearInterval(setInterObj);
  }

  function handleRunOneStep(event) {
    // Place holder for runing one step in FL
    changeLineMarking((prevValue) => {
      return ({...prevValue, currentEvalLine: prevValue.currentEvalLine + 1})
    })
  }

  function handleRunToBreak(event) {

  }

  function handleJumpToCodeStart(event) {

  }

  const showPopUp = false;

  return (
    <div className = "App">
      <NavBar
        runIn = {inRun ? "inRun: true" : "inRun: false"}
      />
      
      <div className="AppGrid">
        
          <div className = "leftside">
            <LexEnv lexEnv = {globalLexEnv} changeLexEnv = {changeGlobalLexEnv}/>
            <CallStack
              callStack = {globalStack}
              changeCallStack = {changeGlobalStack}
              lineDragContent = {lineDragContent}
              changeLineDragContent = {changeLineDragContent}  
            />
          </div>
          <div className = "rightside">
            <Selector/>
            <Editor
              editorContent = {editorContent}
              changeEditorContent = {changeEditorContent}
              lineMarking = {lineMarking}
              changeLineDragContent = {changeLineDragContent} 
            />
            <ControlPanel
              runOneStep = {handleRunOneStep}
              runAuto = {handleRunAuto}
              runToBreakPoint = {handleRunToBreak}
              startAtCodeStart = {handleJumpToCodeStart}
              stopRun = {handleRunStop}
            />
            <Output/>
          </div>

          
      </div>
      {showPopUp? <PopUpMessage/> : <></>}
    </div>
  );
}

export default App;
