import { motion } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';
import { LogOut, CheckCircle } from 'lucide-react';

export default function ClientDashboard() {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Client Portal</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">Welcome, {user?.name}</span>
              <button
                onClick={() => logout()}
                className="p-2 text-gray-400 hover:text-gray-500"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-lg font-medium text-gray-900 mb-4">Pending Approvals</h2>
          
          <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
            <div className="text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">All caught up</h3>
              <p className="mt-1 text-sm text-gray-500">
                You don't have any posts waiting for approval.
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
