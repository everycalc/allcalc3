
import React from 'react';

const OfflineNotice: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black/80 z-[100] flex flex-col items-center justify-center p-4 text-white text-center animate-fade-in">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636a9 9 0 010 12.728m-12.728 0a9 9 0 010-12.728m12.728 0L5.636 18.364m12.728 0L5.636 5.636" />
      </svg>
      <h2 className="text-2xl font-bold mb-2">You're Offline</h2>
      <p>Please check your internet connection to continue using the app.</p>
    </div>
  );
};

export default OfflineNotice;