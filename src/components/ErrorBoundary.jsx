import { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('UI error boundary:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center px-6 text-center bg-ivory dark:bg-deep text-deep dark:text-cream">
          <p className="text-gold text-[10px] tracking-[0.35em] uppercase mb-4">Something went wrong</p>
          <h1 className="font-serif text-3xl mb-6">We will restore the experience shortly</h1>
          <button
            type="button"
            className="btn-gold"
            onClick={() => window.location.reload()}
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
