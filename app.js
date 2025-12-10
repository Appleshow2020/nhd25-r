class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">오류가 발생했습니다</h1>
            <button onClick={() => window.location.reload()} className="btn btn-primary">
              새로고침
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  try {
    const [screen, setScreen] = React.useState('start');
    const [correctCount, setCorrectCount] = React.useState(0);
    const [usedProblems, setUsedProblems] = React.useState([]);

    const handleStart = () => {
      setCorrectCount(0);
      setUsedProblems([]);
      setScreen('quiz');
    };

    const handleCorrect = () => {
      setCorrectCount(prev => prev + 1);
      setScreen('double');
    };

    const handleFail = () => {
      setScreen('fail');
    };

    const handleContinue = () => {
      setScreen('quiz');
    };

    const handleStop = () => {
      setScreen('roulette');
    };

    const handleRouletteComplete = () => {
      setScreen('result');
    };

    const handleBackToStart = () => {
      setScreen('start');
    };

    const handleAdmin = () => {
      const password = prompt('비밀번호를 입력하세요:');
      if (password === '74568') {
        setScreen('admin');
      } else if (password !== null) {
        alert('비밀번호가 틀렸습니다.');
      }
    };



    return (
      <div className="min-h-screen math-pattern" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}} data-name="app" data-file="app.js">
        {screen === 'start' && <StartScreen onStart={handleStart} onAdmin={handleAdmin} />}
        {screen === 'quiz' && (
          <QuizScreen 
            onCorrect={handleCorrect} 
            onFail={handleFail}
            usedProblems={usedProblems}
            setUsedProblems={setUsedProblems}
          />
        )}
        {screen === 'double' && (
          <DoubleScreen 
            correctCount={correctCount}
            onContinue={handleContinue}
            onStop={handleStop}
          />
        )}
        {screen === 'result' && (
          <ResultScreen 
            correctCount={correctCount}
            onBackToStart={handleBackToStart}
          />
        )}
        {screen === 'fail' && (
          <ResultScreen 
            isFail={true}
            onBackToStart={handleBackToStart}
          />
        )}
        {screen === 'roulette' && (
          <RouletteScreen 
            spinCount={correctCount}
            onComplete={handleRouletteComplete}
          />
        )}
        {screen === 'admin' && <AdminScreen onBack={handleBackToStart} />}
      </div>
    );
  } catch (error) {
    console.error('App component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);