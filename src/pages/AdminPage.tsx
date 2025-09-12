// src/pages/AdminPage.tsx
import { useState } from 'react';
import { Shield, Users } from 'lucide-react';
import { RolesList } from '../features/admin/components/RolesList';
import { UsersList } from '../features/admin/components/users/UsersList';
import { useAuth } from '../features/auth/hooks/useAuth';
import { Navigate } from 'react-router-dom';

export function AdminPage() {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'roles' | 'users'>('roles');

  // Solo administradores pueden acceder
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Tab Navigation */}
      <div className="mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('roles')}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
              activeTab === 'roles'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Shield className="w-4 h-4 mr-2" />
            Gestión de Roles
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
              activeTab === 'users'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Users className="w-4 h-4 mr-2" />
            Gestión de Usuarios
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'roles' && <RolesList />}
      {activeTab === 'users' && <UsersList />}
    </div>
  );
}

export default AdminPage;