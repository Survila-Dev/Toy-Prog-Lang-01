import "./ControlPanel.css"

import React from "react";

function ControlPanel({runOneStep, runAuto, runToBreakPoint, startAtCodeStart, stopRun, handleClear}) {
    return (
        <div className = "controlpanel">
            <div>
                <button className = "calltoaction" onClick = {runAuto}>RUN</button>
                <button onClick = {stopRun}>STOP</button>
                <button onClick = {runOneStep}>RUN One Line</button>
                <button onClick = {startAtCodeStart}>Start at the Beginning</button>
                
            </div>
            <div>
                <button onClick = {handleClear}>Clear</button>
            </div>
        </div>
    )
}

export default ControlPanel;