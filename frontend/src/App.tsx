import { useState, useEffect } from 'react';
import PostGeneratorUI from './components/PostGeneratorUI';
import AnalyticsDashboard from './components/AnalyticsDashboard';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const onLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', onLocationChange);
    return () => window.removeEventListener('popstate', onLocationChange);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  return (
    <>
      {currentPath === '/analytics' ? (
        <AnalyticsDashboard onBack={() => navigateTo('/')} />
      ) : (
        <PostGeneratorUI onAnalyticsClick={() => navigateTo('/analytics')} />
      )}
    </>
  );
}

export default App;
