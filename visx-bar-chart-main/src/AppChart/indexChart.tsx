import React from "react";
import ReactDOM from "react-dom";
import AppChart from "./AppChart";
import { createGlobalStyle } from "styled-components";
import { QueryClient, QueryClientProvider } from "react-query";

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

const queryClient = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <GlobalStyle />
      <AppChart />
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById("rootChart")
);
