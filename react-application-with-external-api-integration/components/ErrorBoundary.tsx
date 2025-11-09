'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import Link from 'next/link';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component to catch and handle React errors gracefully
 * Prevents the entire app from crashing when an error occurs
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console for debugging
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI or use provided fallback
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-zinc-950 to-zinc-900 p-8">
          <div className="max-w-2xl w-full">
            <div className="bg-zinc-900 border-2 border-red-600/30 rounded-xl p-8 text-center">
              <div className="mb-6">
                <svg
                  className="w-24 h-24 mx-auto text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>

              <h1 className="text-3xl font-bold text-red-500 mb-4">
                🎬 Something Went Wrong
              </h1>

              <p className="text-zinc-300 mb-6">
                We encountered an unexpected error. Don&apos;t worry, this happens sometimes!
              </p>

              {this.state.error && (
                <details className="mb-6 text-left bg-zinc-950 p-4 rounded-lg border border-zinc-800">
                  <summary className="cursor-pointer text-sm text-zinc-400 hover:text-zinc-300 font-semibold mb-2">
                    Error Details (for developers)
                  </summary>
                  <pre className="text-xs text-red-400 overflow-x-auto mt-2">
                    {this.state.error.message}
                  </pre>
                </details>
              )}

              <div className="flex gap-3 justify-center flex-wrap">
                <button
                  onClick={() => this.setState({ hasError: false, error: null })}
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-lg hover:from-red-500 hover:to-red-600 transition-all glow-red border border-red-500/30"
                >
                  Try Again
                </button>

                <Link
                  href="/"
                  className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all glow-gold"
                >
                  🎬 Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
