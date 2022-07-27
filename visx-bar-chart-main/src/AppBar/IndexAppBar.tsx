import React from "react";
import ReactDOM from "react-dom";
import { createGlobalStyle } from "styled-components";
import AppBar from "./AppBar";

const GlobalStyle = createGlobalStyle`
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segeo UI', 'Roboto', 'Oxygen',
}
html, body, #root {
  height: 100%;
}
`;

ReactDOM.render(
  <React.StrictMode>
    <>
      <GlobalStyle />
      <AppBar />
    </>
  </React.StrictMode>,
  document.getElementById("root")
);
