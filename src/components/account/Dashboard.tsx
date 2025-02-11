import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Edit, Trash2, Globe, Settings, Plus, Upload, X, FileText, Folder, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

type Website = {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'published';
  lastModified: string;
  plan: 'free' | 'professional' | 'enterprise';
  thumbnail?: string;
  type?: string;
  files?: ProcessedFile[];
};

type ProcessedFile = {
  name: string;
  type: string;
  content: string;
};

export function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  
  const [websites, setWebsites] = useState<Website[]>(() => {
    const savedWebsites = localStorage.getItem('websites');
    return savedWebsites ? JSON.parse(savedWebsites) : [
      {
        id: '1',
        name: 'My Portfolio',
        description: 'Personal portfolio website showcasing my work',
        status: 'published',
        lastModified: '2024-02-20T10:00:00Z',
        plan: 'professional',
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80'
      }
    ];
  });

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadType, setUploadType] = useState<'standard' | 'wordpress'>('standard');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [websiteToDelete, setWebsiteToDelete] = useState<string | null>(null);
  const [editingWebsiteId, setEditingWebsiteId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const generateThumbnail = useCallback(async (files: ProcessedFile[]) => {
    const indexFile = files.find(f => f.name.toLowerCase() === 'index.html') ||
                     files.find(f => f.name.toLowerCase() === 'home.html') ||
                     files.find(f => f.name.toLowerCase().endsWith('.html'));
    
    if (!indexFile) return null;

    try {
      // Create a temporary container
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.top = '-9999px';
      container.style.left = '-9999px';
      container.style.width = '1024px';
      container.style.height = '768px';
      document.body.appendChild(container);

      // Process HTML content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = indexFile.content;

      // Create a map of image files
      const imageFiles = new Map(
        files
          .filter(f => f.type.startsWith('image/'))
          .map(f => [f.name.toLowerCase(), f])
      );

      // Process all img tags
      tempDiv.querySelectorAll('img').forEach(img => {
        const src = img.getAttribute('src');
        if (src) {
          const filename = src.split('/').pop()?.toLowerCase();
          if (filename && imageFiles.has(filename)) {
            img.src = imageFiles.get(filename)!.content;
          }
        }
      });

      // Process elements with background images
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

      // Add processed content to container
      container.innerHTML = tempDiv.innerHTML;

      // Use html2canvas to capture the rendered content
      return new Promise<string | null>((resolve) => {
        setTimeout(async () => {
          try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 1024;
            canvas.height = 768;

            if (ctx) {
              // Draw background
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(0, 0, canvas.width, canvas.height);

              // Create a data URL from the container's content
              const svgData = `
                <svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}">
                  <foreignObject width="100%" height="100%">
                    <div xmlns="http://www.w3.org/1999/xhtml">
                      ${container.innerHTML}
                    </div>
                  </foreignObject>
                </svg>
              `;

              const img = new Image();
              img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;

              img.onload = () => {
                ctx.drawImage(img, 0, 0);
                document.body.removeChild(container);
                resolve(canvas.toDataURL('image/png'));
              };

              img.onerror = () => {
                document.body.removeChild(container);
                resolve(null);
              };
            } else {
              document.body.removeChild(container);
              resolve(null);
            }
          } catch (error) {
            console.error('Error generating thumbnail:', error);
            document.body.removeChild(container);
            resolve(null);
          }
        }, 500);
      });
    } catch (error) {
      console.error('Error in thumbnail generation:', error);
      return null;
    }
  }, []);

  useEffect(() => {
    const updateWebsiteThumbnails = async () => {
      const updatedWebsites = await Promise.all(
        websites.map(async (website) => {
          if (website.files && (!website.thumbnail || website.thumbnail.startsWith('https://images.unsplash.com'))) {
            const thumbnail = await generateThumbnail(website.files);
            return { ...website, thumbnail: thumbnail || website.thumbnail };
          }
          return website;
        })
      );

      setWebsites(updatedWebsites);
      localStorage.setItem('websites', JSON.stringify(updatedWebsites));
    };

    updateWebsiteThumbnails();
  }, [generateThumbnail, websites]);

  const handleDeleteWebsite = useCallback((id: string) => {
    setWebsiteToDelete(id);
    setShowDeleteConfirm(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (websiteToDelete) {
      try {
        setWebsites(prevWebsites => {
          const updatedWebsites = prevWebsites.filter(website => website.id !== websiteToDelete);
          localStorage.setItem('websites', JSON.stringify(updatedWebsites));
          return updatedWebsites;
        });
      } catch (error) {
        console.error('Error deleting website:', error);
      }
      setShowDeleteConfirm(false);
      setWebsiteToDelete(null);
    }
  }, [websiteToDelete]);

  const handleRename = (websiteId: string, newName: string) => {
    if (!newName.trim()) return;

    setWebsites(prevWebsites => {
      const updatedWebsites = prevWebsites.map(website =>
        website.id === websiteId
          ? { ...website, name: newName.trim(), lastModified: new Date().toISOString() }
          : website
      );
      localStorage.setItem('websites', JSON.stringify(updatedWebsites));
      return updatedWebsites;
    });
    setEditingWebsiteId(null);
  };

  const processFiles = async (files: FileList | File[]) => {
    const processedFiles: ProcessedFile[] = [];
    const fileArray = Array.from(files);
    
    fileArray.sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      if (aName === 'index.html') return -1;
      if (bName === 'index.html') return 1;
      if (aName === 'home.html') return -1;
      if (bName === 'home.html') return 1;
      if (aName.endsWith('.html') && !bName.endsWith('.html')) return -1;
      if (!aName.endsWith('.html') && bName.endsWith('.html')) return 1;
      return 0;
    });

    const htmlFiles = fileArray.filter(file => 
      file.type === 'text/html' || 
      file.name.toLowerCase().endsWith('.html') ||
      file.name.toLowerCase().endsWith('.htm') ||
      file.name.toLowerCase().endsWith('.php')
    );

    if (htmlFiles.length === 0 && uploadType === 'standard') {
      alert('Please include at least one HTML or PHP file.');
      return;
    }

    if (uploadType === 'wordpress') {
      const hasWpConfig = fileArray.some(file => file.name === 'wp-config.php');
      if (!hasWpConfig) {
        alert('For WordPress sites, please include wp-config.php and other WordPress files.');
        return;
      }
    }

    for (const file of fileArray) {
      const content = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        if (file.type.startsWith('image/')) {
          reader.readAsDataURL(file);
        } else {
          reader.readAsText(file);
        }
        reader.onload = () => resolve(reader.result as string);
      });

      processedFiles.push({
        name: file.name,
        type: file.type || 'text/plain',
        content
      });
    }

    const mainFile = htmlFiles.find(f => 
      f.name.toLowerCase() === 'index.html' ||
      f.name.toLowerCase() === 'home.html'
    ) || htmlFiles[0] || fileArray[0];

    const website: Website = {
      id: Date.now().toString(),
      name: mainFile.name.replace(/\.[^/.]+$/, ''),
      description: `Imported ${uploadType === 'wordpress' ? 'WordPress ' : ''}website`,
      status: 'draft',
      lastModified: new Date().toISOString(),
      plan: 'free',
      type: 'import',
      files: processedFiles,
      thumbnail: await generateThumbnail(processedFiles)
    };

    const updatedWebsites = [...websites, website];
    setWebsites(updatedWebsites);
    localStorage.setItem('websites', JSON.stringify(updatedWebsites));

    navigate(`/preview/${website.id}`, {
      state: {
        files: processedFiles,
        from: 'dashboard',
        website
      }
    });

    setShowUploadModal(false);
    setSelectedFiles([]);
    setUploadType('standard');
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setSelectedFiles(Array.from(files));
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setSelectedFiles(Array.from(files));
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Websites</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage and edit your websites
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Upload className="h-4 w-4 mr-2" />
            Import Site
          </button>
          <Link
            to="/builder"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Website
          </Link>
        </div>
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Import Website</h3>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedFiles([]);
                  setUploadType('standard');
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4 mb-4">
                <button
                  onClick={() => setUploadType('standard')}
                  className={`flex-1 p-4 rounded-lg border-2 ${
                    uploadType === 'standard'
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <FileText className="h-6 w-6 mb-2" />
                  <h4 className="font-medium">Standard Website</h4>
                  <p className="text-sm text-gray-500">
                    Upload HTML, PHP, and asset files
                  </p>
                </button>
                <button
                  onClick={() => setUploadType('wordpress')}
                  className={`flex-1 p-4 rounded-lg border-2 ${
                    uploadType === 'wordpress'
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Folder className="h-6 w-6 mb-2" />
                  <h4 className="font-medium">WordPress Site</h4>
                  <p className="text-sm text-gray-500">
                    Upload WordPress files and assets
                  </p>
                </button>
              </div>

              <div
                ref={dropZoneRef}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center ${
                  isDragging
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                  multiple
                  accept=".html,.htm,.php,.css,.js,.jpg,.jpeg,.png,.gif,.svg,application/x-wordpress"
                />
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  Drag and drop your files here, or{' '}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-indigo-600 hover:text-indigo-500"
                  >
                    browse
                  </button>
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {uploadType === 'standard'
                    ? 'Supports HTML, PHP, CSS, JavaScript, and image files'
                    : 'Upload your WordPress files including wp-config.php'}
                </p>
              </div>

              {selectedFiles.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Selected Files ({selectedFiles.length})
                  </h4>
                  <div className="max-h-40 overflow-y-auto">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-2"
                      >
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="text-sm text-gray-600">{file.name}</span>
                        </div>
                        <button
                          onClick={() => {
                            const newFiles = [...selectedFiles];
                            newFiles.splice(index, 1);
                            setSelectedFiles(newFiles);
                          }}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setSelectedFiles([]);
                    setUploadType('standard');
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={() => processFiles(selectedFiles)}
                  disabled={selectedFiles.length === 0}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Upload and Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Website</h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete this website? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setWebsiteToDelete(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {websites.map((website) => (
          <div
            key={website.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="aspect-video bg-gray-100 relative">
              {website.thumbnail ? (
                <img
                  src={website.thumbnail}
                  alt={website.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-50">
                  <Globe className="h-8 w-8 text-gray-400" />
                </div>
              )}
              <div className="absolute top-2 right-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    website.status === 'published'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {website.status.charAt(0).toUpperCase() + website.status.slice(1)}
                </span>
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  {editingWebsiteId === website.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="flex-1 px-2 py-1 text-lg border-b border-gray-300 focus:border-indigo-500 focus:ring-0"
                        autoFocus
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleRename(website.id, editingName);
                          }
                        }}
                      />
                      <button
                        onClick={() => handleRename(website.id, editingName)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <Check className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setEditingWebsiteId(null)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-gray-900">{website.name}</h3>
                      <button
                        onClick={() => {
                          setEditingWebsiteId(website.id);
                          setEditingName(website.name);
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  <p className="mt-1 text-sm text-gray-500">{website.description}</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  {website.plan.charAt(0).toUpperCase() + website.plan.slice(1)}
                </span>
              </div>
              
              <p className="mt-2 text-xs text-gray-500">
                Last modified: {new Date(website.lastModified).toLocaleDateString()}
              </p>

              <div className="mt-4 flex gap-2">
                <Link
                  to={`/preview/${website.id}`}
                  state={{ from: 'dashboard' }}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  View Site
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
                <Link
                  to={`/account/website/${website.id}/edit`}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Edit className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => handleDeleteWebsite(website.id)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {websites.length === 0 && (
        <div className="text-center py-12">
          <Globe className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No websites yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating your first website
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Upload className="h-4 w-4 mr-2" />
              Import Site
            </button>
            <Link
              to="/builder"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Website
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}