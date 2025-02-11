import React, { useState } from 'react';
import { Globe, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UpgradeBanner } from '../UpgradeBanner';

type Domain = {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'error';
  records: DNSRecord[];
};

type DNSRecord = {
  id: string;
  type: 'A' | 'CNAME' | 'MX' | 'TXT';
  name: string;
  value: string;
  ttl: number;
};

export function DomainSettings() {
  const { subscription } = useAuth();
  const isPro = subscription?.plan === 'Professional' || subscription?.plan === 'Enterprise';
  const [domains, setDomains] = useState<Domain[]>([
    {
      id: '1',
      name: 'example.com',
      status: 'active',
      records: [
        {
          id: '1',
          type: 'A',
          name: '@',
          value: '76.76.21.21',
          ttl: 3600
        }
      ]
    }
  ]);
  const [newDomain, setNewDomain] = useState('');

  const handleAddDomain = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would verify domain ownership
    const domain: Domain = {
      id: Date.now().toString(),
      name: newDomain,
      status: 'pending',
      records: []
    };
    setDomains([...domains, domain]);
    setNewDomain('');
  };

  const handleRemoveDomain = (id: string) => {
    setDomains(domains.filter(domain => domain.id !== id));
  };

  const handleVerifyDomain = (id: string) => {
    setDomains(domains.map(domain =>
      domain.id === id ? { ...domain, status: 'active' } : domain
    ));
  };

  return (
    <div className="space-y-8">
      {!isPro && (
        <UpgradeBanner message="Upgrade to Professional plan to connect custom domains." />
      )}
      
      <div>
        <h2 className="text-2xl font-bold flex items-center">
          <Globe className="mr-2" />
          Domain Settings
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Manage your custom domains and DNS settings
        </p>
      </div>

      <form onSubmit={handleAddDomain} className="bg-gray-50 p-4 rounded-lg">
        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="domain" className="block text-sm font-medium text-gray-700">
              Add New Domain
            </label>
            <input
              type="text"
              id="domain"
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="yourdomain.com"
              required
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Domain
            </button>
          </div>
        </div>
      </form>

      <div className="bg-white shadow overflow-hidden rounded-md">
        <ul className="divide-y divide-gray-200">
          {domains.map((domain) => (
            <li key={domain.id} className="px-6 py-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">{domain.name}</h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        domain.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : domain.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {domain.status.charAt(0).toUpperCase() + domain.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    {domain.status === 'pending' && (
                      <button
                        onClick={() => handleVerifyDomain(domain.id)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200"
                      >
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Verify
                      </button>
                    )}
                    <button
                      onClick={() => handleRemoveDomain(domain.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {domain.status === 'active' && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">DNS Records</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">TTL</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {domain.records.map((record) => (
                            <tr key={record.id}>
                              <td className="px-3 py-2 text-sm">{record.type}</td>
                              <td className="px-3 py-2 text-sm">{record.name}</td>
                              <td className="px-3 py-2 text-sm font-mono">{record.value}</td>
                              <td className="px-3 py-2 text-sm">{record.ttl}s</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}