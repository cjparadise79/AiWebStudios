import React, { useState } from 'react';
import { Users, UserPlus, Shield, Trash2, Mail, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UpgradeBanner } from '../UpgradeBanner';

type TeamMember = {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
  status: 'active' | 'pending';
  lastActive?: string;
};

type Permission = {
  id: string;
  name: string;
  description: string;
  roles: ('admin' | 'editor' | 'viewer')[];
};

const permissions: Permission[] = [
  {
    id: 'edit_website',
    name: 'Edit Website',
    description: 'Can make changes to the website design and content',
    roles: ['admin', 'editor']
  },
  {
    id: 'manage_team',
    name: 'Manage Team',
    description: 'Can invite and manage team members',
    roles: ['admin']
  },
  {
    id: 'manage_domains',
    name: 'Manage Domains',
    description: 'Can add and configure domain settings',
    roles: ['admin']
  },
  {
    id: 'export_code',
    name: 'Export Code',
    description: 'Can export website code and assets',
    roles: ['admin', 'editor']
  },
  {
    id: 'view_analytics',
    name: 'View Analytics',
    description: 'Can view website analytics and reports',
    roles: ['admin', 'editor', 'viewer']
  }
];

export function TeamManagement() {
  const { subscription } = useAuth();
  const isEnterprise = subscription?.plan === 'Enterprise';
  const [members, setMembers] = useState<TeamMember[]>([
    {
      id: '1',
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin',
      status: 'active',
      lastActive: '2024-02-20T10:00:00Z'
    }
  ]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<TeamMember['role']>('editor');
  const [showPermissions, setShowPermissions] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [error, setError] = useState('');

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!inviteEmail.trim()) {
      setError('Please enter an email address');
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newMember: TeamMember = {
        id: Date.now().toString(),
        email: inviteEmail,
        name: '',
        role: inviteRole,
        status: 'pending'
      };
      
      setMembers(prev => [...prev, newMember]);
      setInviteEmail('');
      // In a real app, this would send an email invitation
    } catch (error) {
      setError('Failed to send invitation. Please try again.');
    }
  };

  const handleRoleChange = async (memberId: string, newRole: TeamMember['role']) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setMembers(prev => prev.map(member =>
        member.id === memberId ? { ...member, role: newRole } : member
      ));
    } catch (error) {
      setError('Failed to update role. Please try again.');
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setMembers(prev => prev.filter(member => member.id !== memberId));
    } catch (error) {
      setError('Failed to remove team member. Please try again.');
    }
  };

  const resendInvitation = async (email: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In a real app, this would resend the invitation email
      alert(`Invitation resent to ${email}`);
    } catch (error) {
      setError('Failed to resend invitation. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {!isEnterprise && (
        <UpgradeBanner message="Upgrade to Enterprise plan to enable team collaboration." />
      )}
      
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Team Management</h2>
        <button
          onClick={() => setShowPermissions(!showPermissions)}
          className="text-sm text-indigo-600 hover:text-indigo-500"
        >
          {showPermissions ? 'Hide Permissions' : 'View Permissions'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <p className="ml-3 text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {showPermissions && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4">Role Permissions</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Permission
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Admin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Editor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Viewer
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {permissions.map((permission) => (
                  <tr key={permission.id}>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{permission.name}</p>
                        <p className="text-sm text-gray-500">{permission.description}</p>
                      </div>
                    </td>
                    {(['admin', 'editor', 'viewer'] as const).map((role) => (
                      <td key={role} className="px-6 py-4">
                        {permission.roles.includes(role) ? (
                          <Shield className="h-5 w-5 text-green-500" />
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      <form onSubmit={handleInvite} className="bg-white p-6 rounded-lg shadow-sm space-y-4">
        <h3 className="text-lg font-medium">Invite Team Member</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="colleague@example.com"
            />
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              id="role"
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as TeamMember['role'])}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Send Invitation
        </button>
      </form>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4">Team Members</h3>
        <div className="space-y-4">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <Users className="h-6 w-6 text-indigo-600" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {member.name || member.email}
                  </p>
                  <p className="text-sm text-gray-500">
                    {member.status === 'pending' ? (
                      <span className="flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        Invitation Pending
                      </span>
                    ) : (
                      `Last active: ${new Date(member.lastActive || '').toLocaleDateString()}`
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={member.role}
                  onChange={(e) => handleRoleChange(member.id, e.target.value as TeamMember['role'])}
                  className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  disabled={member.status === 'pending'}
                >
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </select>
                {member.status === 'pending' ? (
                  <button
                    onClick={() => resendInvitation(member.email)}
                    className="text-indigo-600 hover:text-indigo-500"
                  >
                    Resend
                  </button>
                ) : null}
                <button
                  onClick={() => handleRemoveMember(member.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}