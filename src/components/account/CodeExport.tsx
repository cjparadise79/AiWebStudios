import React, { useState } from 'react';
import { Code, Download, Eye, Copy } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UpgradeBanner } from '../UpgradeBanner';

type ExportFormat = 'react' | 'vue' | 'angular' | 'html';
type ExportOptions = {
  includeAssets: boolean;
  includeDependencies: boolean;
  minified: boolean;
};

export function CodeExport() {
  const { subscription } = useAuth();
  const isPro = subscription?.plan === 'Professional' || subscription?.plan === 'Enterprise';
  const [format, setFormat] = useState<ExportFormat>('react');
  const [options, setOptions] = useState<ExportOptions>({
    includeAssets: true,
    includeDependencies: true,
    minified: false
  });
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // In a real app, this would generate and download the code
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate export
      console.log('Exporting code:', { format, options });
      
      // Simulate file download
      const element = document.createElement('a');
      element.href = URL.createObjectURL(new Blob(['Example code export'], { type: 'text/plain' }));
      element.download = `website-export-${format}.zip`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } catch (error) {
      console.error('Error exporting code:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const previewCode = `// Example ${format.toUpperCase()} code
import React from 'react';

export function App() {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold">Your Website</h1>
      {/* Generated components */}
    </div>
  );
}`;

  return (
    <div className="space-y-8">
      {!isPro && (
        <UpgradeBanner message="Upgrade to Professional plan to export your website code." />
      )}
      
      <div>
        <h2 className="text-2xl font-bold flex items-center">
          <Code className="mr-2" />
          Export Code
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Export your website code in different formats
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {(['react', 'vue', 'angular', 'html'] as ExportFormat[]).map((f) => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                className={`px-4 py-3 border rounded-lg text-sm font-medium ${
                  format === f
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Export Options</h3>
          <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-3">
            {Object.entries(options).map(([key, value]) => (
              <div key={key} className="flex items-center">
                <input
                  id={key}
                  type="checkbox"
                  checked={value}
                  onChange={(e) => setOptions(prev => ({ ...prev, [key]: e.target.checked }))}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor={key} className="ml-2 text-sm text-gray-700 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className={`h-4 w-4 mr-2 ${isExporting ? 'animate-spin' : ''}`} />
            {isExporting ? 'Exporting...' : 'Export Code'}
          </button>
        </div>
      </div>

      <div className="bg-gray-900 rounded-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h3 className="text-sm font-medium text-white">Code Preview</h3>
          <button
            onClick={() => navigator.clipboard.writeText(previewCode)}
            className="text-gray-400 hover:text-gray-300"
          >
            <Copy className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4 overflow-x-auto">
          <pre className="text-sm text-gray-300">
            <code>{previewCode}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}