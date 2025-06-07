import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { store } from './store';
import { auth } from './config/firebase';
import { setUser, clearUser } from './store/authSlice';
import { setUser as setTaskUser } from './store/taskSlice';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AuthModal from './components/AuthModal';

function App() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userData = {
          uid: user.uid,
          email: user.email!,
          displayName: user.displayName || user.email!.split('@')[0],
          photoURL: user.photoURL,
        };
        store.dispatch(setUser(userData));
        store.dispatch(setTaskUser(userData));
        setIsAuthenticated(true);
      } else {
        store.dispatch(clearUser());
        store.dispatch(setTaskUser(null));
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Provider store={store}>
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Task Management Dashboard</h1>
            <p className="text-gray-600 mb-8">Organize your work and boost productivity</p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors"
            >
              Get Started
            </button>
          </div>
          
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
          />
        </div>
      </Provider>
    );
  }

  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-100 flex">
        <Sidebar />
        <Dashboard />
      </div>
    </Provider>
  );
}

export default App;