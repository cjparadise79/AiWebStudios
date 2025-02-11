import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Settings, CreditCard, History, Users, Globe, Code, Palette, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Account() {
  const location = useLocation();
  const { subscription } = useAuth();
  const isPro = subscription?.plan === 'Professional' || subscription?.plan === 'Enterprise';
  const isEnterprise = subscription?.plan === 'Enterprise';

  const navigation = [
    { name: 'Dashboard', href: '/account', icon: LayoutDashboard },
    { name: 'Settings', href: '/account/settings', icon: Settings },
    { name: 'Subscriptions', href: '/account/subscriptions', icon: CreditCard },
    ...(isPro ? [
      { name: 'Domains', href: '/account/domains', icon: Globe },
      { name: 'Export Code', href: '/account/export', icon: Code }
    ] : []),
    ...(isEnterprise ? [
      { name: 'Team', href: '/account/team', icon: Users },
      { name: 'Branding', href: '/account/branding', icon: Palette }
    ] : [])
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
        <aside className="py-6 px-2 sm:px-6 lg:col-span-3 lg:py-0 lg:px-0">
          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-900 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon
                    className={`mr-3 h-6 w-6 flex-shrink-0 ${
                      isActive ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="space-y-6 sm:px-6 lg:col-span-9 lg:px-0">
          <div className="bg-white shadow rounded-lg">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}