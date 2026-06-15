"use client";
import React from "react";

export default class DevErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: any; info: any }
> {
  constructor(props: any) {
    super(props);
    this.state = { error: null, info: null };
  }

  static getDerivedStateFromError(error: any) {
    return { error, info: null };
  }

  componentDidCatch(error: any, info: any) {
    // Log full error and component stack
    console.error("DevErrorBoundary caught error:", error);
    console.error("DevErrorBoundary component stack:", info?.componentStack);
    this.setState({ error, info });
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 20, background: "#fff6f6", color: "#7a1f1f" }}>
          <h2 style={{ marginTop: 0 }}>Dev Error Boundary</h2>
          <p><strong>Error:</strong></p>
          <pre style={{ whiteSpace: "pre-wrap", overflowX: "auto" }}>
            {String(this.state.error)}
          </pre>
          <p><strong>Stack / Component stack:</strong></p>
          <pre style={{ whiteSpace: "pre-wrap", overflowX: "auto" }}>
            {this.state.error?.stack ?? this.state.info?.componentStack ?? "No stack available"}
          </pre>
        </div>
      );
    }
    return this.props.children as any;
  }
}
