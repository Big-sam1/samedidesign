import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangleIcon, RefreshCwIcon, Trash2Icon } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleClearCache = () => {
    try {
      localStorage.removeItem('samedidesign.products.v1');
      localStorage.removeItem('samedidesign.blog.v1');
      localStorage.removeItem('samedidesign.content.v1');
    } catch {}
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <div className="max-w-md w-full rounded-2xl bg-white border border-red-200 p-6 shadow-sm text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-red-50 text-red-600 mb-4">
              <AlertTriangleIcon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {this.props.fallbackTitle || 'Something went wrong'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              An unexpected error occurred while rendering this section. You can reload or reset the local cache.
            </p>
            {this.state.error?.message && (
              <div className="rounded-lg bg-red-50 p-2.5 text-[11px] text-red-800 font-mono mb-4 text-left break-all">
                {this.state.error.message}
              </div>
            )}
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={this.handleReload}
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition"
              >
                <RefreshCwIcon className="h-3.5 w-3.5" />
                Reload Page
              </button>
              <button
                onClick={this.handleClearCache}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                <Trash2Icon className="h-3.5 w-3.5 text-slate-400" />
                Reset Cache
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
