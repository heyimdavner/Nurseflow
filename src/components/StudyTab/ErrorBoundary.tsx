import React, { Component, ErrorInfo, ReactNode } from 'react';
export class ErrorBoundary extends Component<{children: ReactNode, fallback?: ReactNode}, {hasError: boolean, error: Error | null}> {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error: Error) { return { hasError: true, error }; }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) { console.error('ErrorBoundary caught error:', error, errorInfo); }
  render() { if (this.state.hasError) return <div style={{padding: 20, color: 'red', background: 'white'}}><h1>StudyTab Crash</h1><pre>{this.state.error?.toString()}</pre></div>; return (this as any).props.children; }
}