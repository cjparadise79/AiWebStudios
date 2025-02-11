import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, File, Image, Code, ChevronRight, Edit, Check, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

type ProcessedFile = {
  name: string;
  type: string;
  content: string;
  preview?: string;
};

export function Preview() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const fromDashboard = location.state?.from === 'dashboard';
  const website = location.state?.website;
  
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [websiteTitle, setWebsiteTitle] = useState(website?.name || 'Untitled Website');
  
  // Get files from location state or from localStorage
  const [files, setFiles] = useState<ProcessedFile[]>(() => {
    if (location.state?.files) {
      return location.state.files;
    }
    // Try to get files from localStorage
    const websites = JSON.parse(localStorage.getItem('websites') || '[]');
    const website = websites.find((w: any) => w.id === id);
    return website?.files || [];
  });

  const [selectedFile, setSelectedFile] = useState<ProcessedFile | null>(
    files.find(file => 
      file.type === 'text/html' || 
      file.name.toLowerCase().endsWith('.html') ||
      file.name.toLowerCase().endsWith('.htm')
    ) || null
  );
  const [processedHtml, setProcessedHtml] = useState<string>('');

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return Image;
    if (type === 'text/html') return Code;
    return File;
  };

  const handleNavigateBack = () => {
    if (fromDashboard) {
      navigate('/account', { replace: true });
    } else {
      navigate('/builder', { replace: true });
    }
  };

  useEffect(() => {
    if (selectedFile && !selectedFile.type.startsWith('image/')) {
      let html = selectedFile.content;
      
      // Create a map of image files
      const imageFiles = new Map(
        files
          .filter(f => f.type.startsWith('image/'))
          .map(f => [f.name.toLowerCase(), f])
      );

      // Replace image sources in HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      
      // Process all img tags
      tempDiv.querySelectorAll('img').forEach(img => {
        const src = img.getAttribute('src');
        if (src) {
          // Get the filename from the src path
          const filename = src.split('/').pop()?.toLowerCase();
          if (filename && imageFiles.has(filename)) {
            img.src = imageFiles.get(filename)!.content;
          }
        }
      });

      // Process all elements with background-image
      tempDiv.querySelectorAll('*').forEach(el => {
        const style = (el as HTMLElement).style;
        if (style.backgroundImage) {
          const matches = style.backgroundImage.match(/url\(['"]?([^'"]+)['"]?\)/);
          if (matches) {
            const filename = matches[1].split('/').pop()?.toLowerCase();
            if (filename && imageFiles.has(filename)) {
              style.backgroundImage = `url('${imageFiles.get(filename)!.content}')`;
            }
          }
        }
      });

      setProcessedHtml(tempDiv.innerHTML);
    }
  }, [selectedFile, files]);

  const handleSaveTitle = () => {
    if (id) {
      const websites = JSON.parse(localStorage.getItem('websites') || '[]');
      const updatedWebsites = websites.map((w: any) => 
        w.id === id ? { ...w, name: websiteTitle } : w
      );
      localStorage.setItem('websites', JSON.stringify(updatedWebsites));
      setIsEditingTitle(false);
    }
  };

  // Check if website has an active plan
  const hasActivePlan = website?.plan === 'professional' || website?.plan === 'enterprise';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {isEditingTitle ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={websiteTitle}
                        onChange={(e) => setWebsiteTitle(e.target.value)}
                        className="border-b border-gray-300 focus:border-indigo-500 focus:ring-0 bg-transparent"
                        autoFocus
                      />
                      <button
                        onClick={handleSaveTitle}
                        className="text-green-600 hover:text-green-700"
                      >
                        <Check className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setIsEditingTitle(false)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      {websiteTitle}
                      <button
                        onClick={() => setIsEditingTitle(true)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </h2>
              </div>
              {!hasActivePlan && (
                <Link
                  to={`/pricing?websiteId=${id}`}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Upgrade to Publish
                </Link>
              )}
            </div>
            <p className="mt-2 text-gray-600">
              {hasActivePlan 
                ? 'Your website is ready to be published.'
                : 'This is a preview of your website. To publish and customize, please subscribe to a paid plan.'}
            </p>
          </div>

          <div className="flex">
            {/* File Sidebar */}
            <div className="w-64 border-r border-gray-200 bg-gray-50">
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Files</h3>
                <div className="space-y-1">
                  {files.map((file, index) => {
                    const FileIcon = getFileIcon(file.type);
                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedFile(file)}
                        className={`w-full flex items-center px-2 py-1.5 text-sm rounded-md ${
                          selectedFile === file
                            ? 'bg-indigo-50 text-indigo-700'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <FileIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{file.name}</span>
                        {selectedFile === file && (
                          <ChevronRight className="h-4 w-4 ml-auto flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Preview Area */}
            <div className="flex-1">
              {selectedFile ? (
                selectedFile.type.startsWith('image/') ? (
                  <div className="aspect-[16/9] bg-gray-800 flex items-center justify-center">
                    <img
                      src={selectedFile.content}
                      alt={selectedFile.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                ) : (
                  <div 
                    className="w-full aspect-[16/9] bg-white overflow-auto"
                    dangerouslySetInnerHTML={{ __html: processedHtml || selectedFile.content }}
                  />
                )
              ) : (
                <div className="aspect-[16/9] bg-gray-100 flex items-center justify-center">
                  <p className="text-gray-500">Select a file to preview</p>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 flex justify-center space-x-4">
            <button
              onClick={handleNavigateBack}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {fromDashboard ? 'Back to Dashboard' : 'Back to Builder'}
            </button>
            {!hasActivePlan && (
              <Link
                to={`/pricing?websiteId=${id}`}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Select Your Plan
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}