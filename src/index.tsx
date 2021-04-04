import "@fontsource/raleway";
import ReactDOM from "react-dom";
import { App } from "./App";
import { DependencyContainer } from "./shared/containers/DependencyContainer";

ReactDOM.render(
  <DependencyContainer>
    <App />
  </DependencyContainer>,
  document.getElementById("root")
);
