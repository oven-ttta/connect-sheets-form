import React from 'react';

const TestComponent: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-4 text-blue-600">
          YEC Business Network Form
        </h1>
        <p className="text-gray-600 text-center mb-6">
          ระบบกำลังทำงานปกติ
        </p>
        <div className="space-y-4">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            ✅ React ทำงานปกติ
          </div>
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
            ✅ TypeScript ทำงานปกติ
          </div>
          <div className="bg-purple-100 border border-purple-400 text-purple-700 px-4 py-3 rounded">
            ✅ Tailwind CSS ทำงานปกติ
          </div>
        </div>
        <div className="mt-6 text-center space-x-4">
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            รีเฟรชหน้า
          </button>
          <button 
            onClick={() => {
              // Change to use BusinessNetworkForm
              const event = new CustomEvent('switchToForm');
              window.dispatchEvent(event);
            }}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
          >
            ทดสอบฟอร์ม
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestComponent;
