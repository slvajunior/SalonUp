import { Component } from "react";

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Erro:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-message">
          <h2>Ocorreu um erro</h2>
          <button onClick={() => window.location.reload()}>Recarregar</button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;