import React, { useState, useEffect } from 'react';
import App from './App.tsx';

const ErrorCatcher = () => {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleRejection = (event: PromiseRejectionEvent) => {
      setError(event.reason?.message || String(event.reason));
    };
    window.addEventListener('unhandledrejection', handleRejection);
    return () => window.removeEventListener('unhandledrejection', handleRejection);
  }, []);

  return (
    <>
      {error && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, background: 'red', color: 'white', zIndex: 9999, padding: '20px', fontWeight: 'bold' }}>
          FIREBASE ERROR: {error}
          <button onClick={() => setError(null)} style={{ marginLeft: '20px', background: 'white', color: 'red', padding: '5px' }}>Dismiss</button>
        </div>
      )}
      <App />
    </>
  );
};

export default ErrorCatcher;
