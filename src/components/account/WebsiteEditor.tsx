import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Layout, Image, Type, Settings, ArrowLeft } from 'lucide-react';

type Section = {
  id: string;
  type: 'hero' | 'features' | 'pricing' | 'contact';
  content: Record<string, any>;
};

export function WebsiteEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sections, setSections] = useState<Section[]>([
    {
      id: '1',
      type: 'hero',
      content: {
        title: 'Welcome to Our Website',
        subtitle: 'Create something amazing',
        ctaText: 'Get Started'
      }
    }
  ]);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // In a real app, this would save to your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Simulate successful save
      alert('Changes saved successfully!');
    } catch (error) {
      alert('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/account')}
                className="inline-flex items-center text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Editor Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
              <h3 className="font-medium text-gray-900">Page Sections</h3>
              <div className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                      activeSection === section.id
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {section.type.charAt(0).toUpperCase() + section.type.slice(1)} Section
                  </button>
                ))}
                <button
                  onClick={() => {
                    const newSection: Section = {
                      id: Date.now().toString(),
                      type: 'features',
                      content: {
                        title: 'Features',
                        items: []
                      }
                    };
                    setSections([...sections, newSection]);
                    setActiveSection(newSection.id);
                  }}
                  className="w-full text-left px-3 py-2 rounded-md text-sm text-indigo-600 hover:bg-indigo-50"
                >
                  + Add New Section
                </button>
              </div>
            </div>
          </div>

          {/* Main Editor */}
          <div className="col-span-9">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {activeSection ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                      Edit Section
                    </h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSections(sections.filter(s => s.id !== activeSection));
                          setActiveSection(null);
                        }}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Delete Section
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    {/* Section specific controls would go here */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Title
                        </label>
                        <input
                          type="text"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          value={sections.find(s => s.id === activeSection)?.content.title || ''}
                          onChange={(e) => {
                            setSections(sections.map(s => 
                              s.id === activeSection 
                                ? { ...s, content: { ...s.content, title: e.target.value } }
                                : s
                            ));
                          }}
                        />
                      </div>
                      {/* Add more controls based on section type */}
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Preview</h4>
                      {/* Section preview would go here */}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Layout className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No Section Selected</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Select a section from the sidebar to edit its content
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}