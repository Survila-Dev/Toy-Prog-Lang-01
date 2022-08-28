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

  const lineMarking = {
    currentEvalLine: 2,
    currentErrorLine: 3,
  }

  const showPopUp = false;

  return (
    <div className = "App">
      <NavBar/>
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
            <ControlPanel/>
            <Output/>
          </div>

          
      </div>
      {showPopUp? <PopUpMessage/> : <></>}
    </div>
  );
}

export default App;
