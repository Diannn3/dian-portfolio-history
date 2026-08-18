import { Component, type ReactNode } from 'react';

interface Props { children: ReactNode; fallback: ReactNode; }
interface State { failed: boolean; }

export default class SplineErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };
  static getDerivedStateFromError(): State { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}
