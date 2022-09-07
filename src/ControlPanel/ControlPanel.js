import "./ControlPanel.css"

import React from "react";

function ControlPanel({runOneLine, runAuto}) {
    return (
        <div className = "controlpanel">
            <div>
                <button className = "calltoaction" onClick = {runAuto}>RUN</button>
                <button>RUN to Break Point</button>
                <button onClick = {runOneLine}>RUN One Line</button>
                <button>Start at the Beginning</button>
            </div>
            <div>
                <button>Clear</button>
            </div>
        </div>
    )
}

export default ControlPanel;