import React, { useState, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Code2, Sparkles, MonitorSmartphone, User, CreditCard, Settings, LogOut, LayoutDashboard } from 'lucide-react';
import { RobotIcon } from './RobotIcon';
import { useAuth } from '../context/AuthContext';

export function Header() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isLoginPage = location.pathname === '/account/login';
  const authButtonText = isLoginPage ? 'Sign Up' : 'Sign In';
  const authButtonLink = isLoginPage ? '/account/signup' : '/account/login';

  const handleMenuClick = useCallback((path: string) => {
    setIsMenuOpen(false);
    navigate(path, { replace: true });
  }, [navigate]);

  const handleSignOut = useCallback(async () => {
    try {
      setIsMenuOpen(false);
      await signOut();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }, [signOut, navigate]);

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <RobotIcon className="h-8 w-8" />
            <h1 className="text-2xl font-bold text-gray-900">AI Website Builder</h1>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-gray-900">
              Home
            </Link>
            <Link to="/pricing" className="text-gray-700 hover:text-gray-900">
              Pricing
            </Link>
            <Link to="/builder" className="text-gray-700 hover:text-gray-900">
              Builder
            </Link>
          </nav>
          
          <div className="flex items-center space-x-8">
            <div className="hidden lg:flex space-x-4">
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <Sparkles className="h-4 w-4" />
                <span>AI-Powered</span>
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <Code2 className="h-4 w-4" />
                <span>Custom Code</span>
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <MonitorSmartphone className="h-4 w-4" />
                <span>Responsive</span>
              </div>
            </div>
            
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
                >
                  <User className="h-5 w-5" />
                  <span>{user.email}</span>
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 w-48 mt-1 bg-white rounded-md shadow-lg py-1 z-50">
                    <button
                      onClick={() => handleMenuClick('/account')}
                      className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                    >
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Dashboard
                    </button>
                    <button
                      onClick={() => handleMenuClick('/account/settings')}
                      className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Account Settings
                    </button>
                    <button
                      onClick={() => handleMenuClick('/account/subscriptions')}
                      className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Subscriptions
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to={authButtonLink}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                {authButtonText}
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}