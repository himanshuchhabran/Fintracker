
import React, { useState } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import VerifyOTP from './components/verifyOTP';

function App() {
  const [activeForm, setActiveForm] = useState('login');
  const [emailToVerify, setEmailToVerify] = useState('');

  const handleRegisterSuccess = (email) => {
    setEmailToVerify(email);
    setActiveForm('verify');
  };

  const handleVerificationSuccess = () => {
    setEmailToVerify('');
    setActiveForm('login');
  };

  // This function correctly decides which form to show
  const renderForm = () => {
    switch (activeForm) {
      case 'register':
        return <Register onRegisterSuccess={handleRegisterSuccess} onSwitchForm={() => setActiveForm('login')} />;
      case 'verify':
        return <VerifyOTP email={emailToVerify} onVerificationSuccess={handleVerificationSuccess} />;
      case 'login':
      default:
        return <Login onSwitchForm={() => setActiveForm('register')} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 shadow-2xl rounded-2xl overflow-hidden bg-white">
        
        {/* Left Side: Branding & Illustration */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-8 sm:p-12 flex-col justify-center items-center text-white hidden md:flex">
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto mb-6 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2" />
            </svg>
            <h1 className="text-4xl font-bold mb-3">Mudra-Plan</h1>
            <p className="text-emerald-100 text-lg">Your journey to financial freedom starts here. Secure, simple, and smart investment planning.</p>
          </div>
        </div>

        {/* Right Side: Forms */}
        <div className="p-8 sm:p-12">
          <div className="w-full max-w-md mx-auto">
            
            {/* Hide tabs on the OTP verification screen for a cleaner UI */}
            {activeForm !== 'verify' && (
              <div className="flex border-b border-gray-200 mb-8">
                <button
                  onClick={() => setActiveForm('login')}
                  className={`w-1/2 py-4 text-center font-semibold transition-colors duration-300 ${activeForm === 'login' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-gray-500 hover:text-emerald-500'}`}
                >
                  Login
                </button>
                <button
                  onClick={() => setActiveForm('register')}
                  className={`w-1/2 py-4 text-center font-semibold transition-colors duration-300 ${activeForm === 'register' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-gray-500 hover:text-emerald-500'}`}
                >
                  Register
                </button>
              </div>
            )}
            
            {/* CORRECTED: Call the renderForm function to display the correct component */}
            {renderForm()}

          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
