'use client';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl p-8 md:p-12">
        <div className="text-center">
          <div className="mb-8">
            <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
              <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Electricity Theft Detection System
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Punjab State Power Corporation Ltd
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              🎉 Backend Setup Complete!
            </h2>
            <p className="text-gray-700 mb-6">
              Your full-stack electricity theft detection system is ready to use.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-semibold text-lg mb-3 flex items-center">
                  <span className="bg-green-100 text-green-600 rounded-full w-8 h-8 flex items-center justify-center mr-3">✓</span>
                  Features Enabled
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✅ Database with Prisma ORM</li>
                  <li>✅ JWT Authentication</li>
                  <li>✅ Email Notifications</li>
                  <li>✅ WhatsApp Integration</li>
                  <li>✅ Theft Detection Algorithm</li>
                  <li>✅ Alert Management System</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-semibold text-lg mb-3 flex items-center">
                  <span className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-3">📡</span>
                  API Endpoints
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>🔐 POST /api/auth/login</li>
                  <li>🚨 GET /api/alerts</li>
                  <li>🗺️ GET /api/regions</li>
                  <li>📊 POST /api/readings</li>
                  <li>👥 GET /api/users</li>
                  <li>🔔 GET /api/notifications</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-lg mb-3 text-yellow-800">
              📋 Next Steps to Deploy
            </h3>
            <ol className="text-left space-y-3 text-sm text-yellow-900">
              <li>1. Set up PostgreSQL database (local or Vercel Postgres)</li>
              <li>2. Configure environment variables in <code className="bg-yellow-100 px-2 py-1 rounded">.env</code> file</li>
              <li>3. Run <code className="bg-yellow-100 px-2 py-1 rounded">npm run db:push</code> to create tables</li>
              <li>4. Run <code className="bg-yellow-100 px-2 py-1 rounded">npm run db:seed</code> to add sample data</li>
              <li>5. Build your dashboard frontend or use the API with Postman</li>
              <li>6. Deploy to Vercel with one click!</li>
            </ol>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">6</div>
              <div className="text-sm text-gray-600">Sample Regions</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-3xl font-bold text-yellow-600">4</div>
              <div className="text-sm text-gray-600">User Roles</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-3xl font-bold text-green-600">100%</div>
              <div className="text-sm text-gray-600">API Coverage</div>
            </div>
          </div>

          <div className="space-y-3">
            <a 
              href="/api/regions"
              target="_blank"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Test API: View Regions Endpoint
            </a>
            <div className="text-sm text-gray-500">
              Default login: admin@pspcl.gov.in / password123
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-500 text-sm">
            📖 Check <code className="bg-gray-100 px-2 py-1 rounded">README.md</code> for complete documentation
          </p>
        </div>
      </div>
    </div>
  );
}
