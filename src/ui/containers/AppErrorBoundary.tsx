import React from "react";
import { MsupplyMan } from "../components/icons";

interface AppErrorBoundaryProps {}
interface AppErrorBoundaryState {
  error: Error | null;
}

export class AppErrorBoundary extends React.Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  constructor(props: AppErrorBoundaryProps) {
    super(props);

    this.state = {
      error: null,
    };
  }

  componentDidCatch(error: Error) {
    this.setState({ error });
  }

  render() {
    const { children } = this.props;
    const { error } = this.state;

    return !error ? children : <MsupplyMan />;
  }
}
