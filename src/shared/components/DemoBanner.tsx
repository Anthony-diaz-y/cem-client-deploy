import React, { useState, useEffect } from 'react';
import { MOCK_MODE } from "../services/apiConnector";
import { switchDemoAccount, clearDemoData } from '../../shared/data/demoHelper';

const DemoBanner = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!MOCK_MODE) return null;

  const [accountType, setAccountType] = useState('Student');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentUser = localStorage.getItem('user');
      if (currentUser) {
        try {
          const parsed = JSON.parse(currentUser);
          setAccountType(parsed.accountType || 'Student');
        } catch (e) {
          console.error('Error parsing user data');
        }
      }
    }
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Collapsed state - floating button */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 animate-pulse"
        >
          <span className="text-xl">🎭</span>
          <span className="font-semibold">DEMO MODE</span>
        </button>
      )}

      {/* Expanded state - control panel */}
      {isExpanded && (
        <div className="bg-gradient-to-br from-purple-900 to-pink-900 text-white rounded-lg shadow-2xl p-4 w-72 border-2 border-purple-400">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎭</span>
              <h3 className="font-bold text-lg">Demo Mode</h3>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-white hover:text-gray-300 text-xl"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3">
            {/* Current account info */}
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <p className="text-xs text-gray-300 mb-1">Current Account:</p>
              <p className="font-semibold text-lg flex items-center gap-2">
                {accountType === 'Student' ? '👨‍🎓' : '👨‍🏫'}
                {accountType}
              </p>
            </div>

            {/* Switch account button */}
            <button
              onClick={switchDemoAccount}
              className="w-full bg-white text-purple-900 font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span>🔄</span>
              Switch to {accountType === 'Student' ? 'Instructor' : 'Student'}
            </button>

            {/* Info text */}
            <div className="text-xs text-gray-300 bg-white/5 rounded p-2">
              <p className="mb-1">✨ <strong>Demo Features:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>No backend required</li>
                <li>Sample courses & data</li>
                <li>All features unlocked</li>
              </ul>
            </div>

            {/* Clear demo data button */}
            <button
              onClick={clearDemoData}
              className="w-full bg-red-500/20 text-red-200 font-medium py-1.5 px-3 rounded hover:bg-red-500/30 transition-all duration-200 text-sm"
            >
              Clear Demo Data
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemoBanner;
