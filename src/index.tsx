import "@fontsource/raleway";
import ReactDOM from "react-dom";
import { App } from "./App";
import { DependencyContainer } from "./ui/containers/DependencyContainer";

ReactDOM.render(
  <DependencyContainer>
    <App />
  </DependencyContainer>,
  document.getElementById("root")
);
