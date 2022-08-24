import './App.css';

import React from "react";
import NavBar from "./NavBar/NavBar"
import LexEnv from "./LexEnv/LexEnv"
import CallStack from "./CallStack/CallStack"
import Editor from "./Editor/Editor"
import Selector from "./Selector/Selector"
import Output from "./Output/Output"
import ControlPanel from './ControlPanel/ControlPanel';

function App() {

  const [globalLexEnv, changeGlobalLexEnv] = React.useState(
    {"a": 6, "b": "Eimantas", "c": true}
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

  return (
    <div className="App">
        <NavBar/>
        <LexEnv lexEnv = {globalLexEnv} changeLexEnv = {changeGlobalLexEnv}/>
        <CallStack
          callStack = {globalStack}
          changeCallStack = {changeGlobalStack}
          lineDragContent = {lineDragContent}
          changeLineDragContent = {changeLineDragContent}  
        />
        <Selector/>
        <Editor
          editorContent = {editorContent}
          changeEditorContent = {changeEditorContent}
          lineMarking = {lineMarking}
          changeLineDragContent = {changeLineDragContent} 
        />
        <ControlPanel/>
        <Output/>

        <div>
          {JSON.stringify(lineDragContent)}
          {JSON.stringify(editorContent.split("\n").length)}
        </div>

    </div>
  );
}

export default App;
