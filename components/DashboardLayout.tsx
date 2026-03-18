import React from 'react';

const DashboardLayout = () => {
  return (
    <div className="flex flex-col lg:flex-row">
      <aside className="bg-gray-800 text-white w-full lg:w-1/4 p-4 lg:sticky lg:top-0 transition-transform transform lg:translate-x-0 lg:translate-x-0">
        <h2 className="text-2xl font-bold">Sidebar</h2>
        {/* Sidebar content */}
      </aside>
      <main className="flex-1 p-4">
        <header className="flex justify-between items-center bg-gray-100 p-4 shadow">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <div className="relative">
            <button className="bg-blue-500 text-white rounded px-4 py-2">User Profile</button>
            {/* Dropdown for user profile options can go here */}
          </div>
        </header>
        <div className="mt-4"> {/* Main content area */}
          <h2 className="text-xl font-semibold">Main Content</h2>
          {/* Add your components here */}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;