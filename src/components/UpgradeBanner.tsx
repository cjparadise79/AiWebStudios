import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

type UpgradeBannerProps = {
  message?: string;
};

export function UpgradeBanner({ message = "Some features may be limited. Upgrade your plan for full access." }: UpgradeBannerProps) {
  return (
    <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Sparkles className="h-5 w-5 text-indigo-400" />
          <p className="ml-3 text-sm text-indigo-700">{message}</p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
        >
          View Plans
        </Link>
      </div>
    </div>
  );
}