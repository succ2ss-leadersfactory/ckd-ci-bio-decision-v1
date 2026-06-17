import React, { type ReactNode } from 'react';

type SafeStepBoundaryProps = {
  stepTitle: string;
  onSkip?: () => void;
  children: ReactNode;
};

type SafeStepBoundaryState = {
  hasError: boolean;
  message: string;
};

export class SafeStepBoundary extends React.Component<SafeStepBoundaryProps, SafeStepBoundaryState> {
  state: SafeStepBoundaryState = {
    hasError: false,
    message: '',
  };

  static getDerivedStateFromError(error: unknown): SafeStepBoundaryState {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : '알 수 없는 화면 오류가 발생했습니다.',
    };
  }

  componentDidUpdate(previousProps: SafeStepBoundaryProps) {
    if (previousProps.stepTitle !== this.props.stepTitle && this.state.hasError) {
      this.setState({ hasError: false, message: '' });
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="space-y-4 rounded-3xl border border-rose-200 bg-white p-5 shadow-sm">
        <div className="rounded-2xl bg-rose-50 p-4 text-rose-900">
          <p className="text-lg font-black">{this.props.stepTitle} 화면을 불러오지 못했습니다.</p>
          <p className="mt-2 text-sm leading-6">
            저장된 실습 데이터 또는 브라우저 캐시 때문에 이 단계 화면이 멈췄을 수 있습니다. 아래 버튼으로 화면을 다시 시도하거나, 교육 진행을 위해 다음 단계로 넘어갈 수 있습니다.
          </p>
          {this.state.message ? <p className="mt-2 rounded-xl bg-white p-3 text-xs font-bold text-rose-700">오류 정보: {this.state.message}</p> : null}
        </div>
        <div className="flex flex-col gap-2 md:flex-row">
          <button
            type="button"
            className="min-h-12 rounded-2xl border px-4 py-3 text-sm font-black text-slate-700"
            onClick={() => this.setState({ hasError: false, message: '' })}
          >
            이 단계 다시 불러오기
          </button>
          {this.props.onSkip ? (
            <button
              type="button"
              className="min-h-12 rounded-2xl bg-cyan-700 px-4 py-3 text-sm font-black text-white"
              onClick={this.props.onSkip}
            >
              임시로 다음 단계로 이동
            </button>
          ) : null}
        </div>
      </div>
    );
  }
}
