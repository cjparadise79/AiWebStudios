import React, { useState } from 'react';
import { Palette, Upload, Sliders, RefreshCw, Wand2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UpgradeBanner } from '../UpgradeBanner';

type ColorScheme = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
};

type Font = {
  name: string;
  url: string;
};

export function BrandingSettings() {
  const { subscription } = useAuth();
  const isEnterprise = subscription?.plan === 'Enterprise';
  const [colors, setColors] = useState<ColorScheme>({
    primary: '#4F46E5',
    secondary: '#818CF8',
    accent: '#F59E0B',
    background: '#FFFFFF',
    text: '#111827'
  });

  const [fonts, setFonts] = useState<{ heading: Font; body: Font }>({
    heading: { name: 'Inter', url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' },
    body: { name: 'Inter', url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' }
  });

  const [logo, setLogo] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleColorChange = (key: keyof ColorScheme, value: string) => {
    setColors(prev => ({ ...prev, [key]: value }));
  };

  const handleFontChange = (type: 'heading' | 'body', fontName: string) => {
    const fontUrl = `https://fonts.googleapis.com/css2?family=${fontName.replace(' ', '+')}&display=swap`;
    setFonts(prev => ({
      ...prev,
      [type]: { name: fontName, url: fontUrl }
    }));
  };

  const handleGenerateAIBranding = async () => {
    setIsGenerating(true);
    try {
      // In a real app, this would call the OpenAI API to generate branding suggestions
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      const aiColors: ColorScheme = {
        primary: '#3B82F6',
        secondary: '#60A5FA',
        accent: '#F59E0B',
        background: '#FFFFFF',
        text: '#1F2937'
      };
      setColors(aiColors);
    } catch (error) {
      console.error('Error generating branding:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8">
      {!isEnterprise && (
        <UpgradeBanner message="Upgrade to Enterprise plan to customize your brand settings." />
      )}
      
      <div>
        <h2 className="text-2xl font-bold flex items-center">
          <Palette className="mr-2" />
          Brand Settings
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Customize your website's branding and visual identity
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg space-y-8">
        <div>
          <h3 className="text-lg font-medium mb-4">Logo</h3>
          <div className="flex items-center space-x-6">
            <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-white">
              {logo ? (
                <img src={logo} alt="Logo" className="max-w-full max-h-full object-contain" />
              ) : (
                <Upload className="h-8 w-8 text-gray-400" />
              )}
            </div>
            <div>
              <label className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer">
                <Upload className="h-4 w-4 mr-2" />
                Upload Logo
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleLogoUpload}
                />
              </label>
              <p className="mt-2 text-xs text-gray-500">
                Recommended size: 512x512px. Max file size: 2MB.
              </p>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Color Scheme</h3>
            <button
              onClick={handleGenerateAIBranding}
              disabled={isGenerating}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Wand2 className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
              {isGenerating ? 'Generating...' : 'Generate AI Colors'}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {Object.entries(colors).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                  {key}
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={value}
                    onChange={(e) => handleColorChange(key as keyof ColorScheme, e.target.value)}
                    className="h-8 w-8 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleColorChange(key as keyof ColorScheme, e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Preview</h4>
            <div className="space-y-2">
              <div className="h-8 rounded" style={{ backgroundColor: colors.primary }}></div>
              <div className="h-8 rounded" style={{ backgroundColor: colors.secondary }}></div>
              <div className="h-8 rounded" style={{ backgroundColor: colors.accent }}></div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Typography</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Heading Font
              </label>
              <select
                value={fonts.heading.name}
                onChange={(e) => handleFontChange('heading', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option>Inter</option>
                <option>Roboto</option>
                <option>Open Sans</option>
                <option>Montserrat</option>
                <option>Playfair Display</option>
              </select>
              <div className="mt-2 p-4 bg-white rounded border">
                <p className="text-2xl" style={{ fontFamily: fonts.heading.name }}>
                  The quick brown fox jumps over the lazy dog
                </p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Body Font
              </label>
              <select
                value={fonts.body.name}
                onChange={(e) => handleFontChange('body', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option>Inter</option>
                <option>Roboto</option>
                <option>Open Sans</option>
                <option>Source Sans Pro</option>
                <option>Lato</option>
              </select>
              <div className="mt-2 p-4 bg-white rounded border">
                <p style={{ fontFamily: fonts.body.name }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Palette className="h-4 w-4 mr-2" />
            Save Brand Settings
          </button>
        </div>
      </div>
    </div>
  );
}