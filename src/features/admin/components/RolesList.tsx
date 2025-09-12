// ==============================================
// ARCHIVO: src/features/admin/components/RolesList.tsx
// Lista y gestión de roles
// ==============================================

import { useState } from 'react';
import { Plus, Edit, Trash2, Shield, Users } from 'lucide-react';
import { useRoles } from '../hooks/useRoles';
import { RoleForm } from './RoleForm';
import type { Role } from '../hooks/useRoles';

export function RolesList() {
  const { 
    roles, 
    loading, 
    error, 
    createRole, 
    updateRole, 
    deleteRole, 
    setError 
  } = useRoles();
  
  const [showForm, setShowForm] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | undefined>();
  const [actionLoading, setActionLoading] = useState(false);

  const handleCreate = () => {
    setEditingRole(undefined);
    setShowForm(true);
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setShowForm(true);
  };

  const handleDelete = async (role: Role) => {
    const confirmed = confirm(`¿Estás seguro de eliminar el rol "${role.nombre}"?`);
    if (!confirmed) return;

    setActionLoading(true);
    const success = await deleteRole(role.id);
    setActionLoading(false);
    
    if (!success) {
      // El error ya se maneja en el hook
    }
  };

  const handleSave = async (data: any) => {
    setActionLoading(true);
    let success = false;
    
    if (editingRole) {
      success = await updateRole(editingRole.id, data);
    } else {
      success = await createRole(data);
    }
    
    setActionLoading(false);
    return success;
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingRole(undefined);
    setError(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Roles</h2>
          <p className="text-gray-600">Administra los roles y permisos del sistema</p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Rol
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <div key={role.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <Shield className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <h3 className="font-semibold text-gray-900 capitalize">
                    {role.nombre}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Users className="w-3 h-3 mr-1" />
                    Rol del sistema
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-1">
                <button
                  onClick={() => handleEdit(role)}
                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                  title="Editar rol"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(role)}
                  disabled={actionLoading}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                  title="Eliminar rol"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              {role.descripcion}
            </p>
            
            <div className="text-xs text-gray-400">
              Creado: {new Date(role.created_at).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {roles.length === 0 && !loading && (
        <div className="text-center py-12">
          <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No hay roles configurados</p>
          <button
            onClick={handleCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Crear primer rol
          </button>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <RoleForm
          role={editingRole}
          onSave={handleSave}
          onCancel={handleCloseForm}
          loading={actionLoading}
        />
      )}
    </div>
  );
}
