import React from "react"
import ReactDOM from "react-dom"
import StreamlitAgora from "./StreamlitAgora"
import { Provider as StyletronProvider } from 'styletron-react';
import { Client as Styletron } from 'styletron-engine-atomic';

const engine = new Styletron();

ReactDOM.render(
  <React.StrictMode>
    <StyletronProvider value={engine}>
      <StreamlitAgora />
    </StyletronProvider>
  </React.StrictMode>,
  document.getElementById("root")
)
