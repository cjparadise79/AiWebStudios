import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Loader2 } from 'lucide-react';
import { generateWebsiteCode, analyzeUserPrompt } from '../services/ai';
import { useAuth } from '../context/AuthContext';

type Message = {
  type: 'user' | 'bot';
  content: string;
  code?: string;
};

type ProcessedFile = {
  name: string;
  type: string;
  content: string;
};

export function Builder() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([{
    type: 'bot',
    content: "Hi! I'm your AI website builder assistant. Tell me about the website you want to create, and I'll help you build it. For example, you could say 'Create a modern portfolio website' or 'Build an e-commerce site for a bakery'."
  }]);
  const [isLoading, setIsLoading] = useState(false);
  const [previewCount, setPreviewCount] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    if (!user) {
      navigate('/account/login', { state: { from: '/builder' } });
      return;
    }

    if (previewCount >= 3) {
      setMessages(prev => [...prev, {
        type: 'bot',
        content: "You've reached the limit of free previews. Please upgrade to continue generating websites."
      }]);
      navigate('/pricing');
      return;
    }

    setIsLoading(true);
    const userPrompt = prompt;
    setPrompt('');

    setMessages(prev => [...prev, { type: 'user', content: userPrompt }]);

    try {
      const analysis = await analyzeUserPrompt(userPrompt);
      setMessages(prev => [...prev, { type: 'bot', content: analysis }]);

      const code = await generateWebsiteCode(userPrompt);
      
      const website = {
        id: Date.now().toString(),
        userId: user.id,
        name: `AI Generated Website ${previewCount + 1}`,
        description: userPrompt,
        status: 'draft',
        lastModified: new Date().toISOString(),
        plan: 'free',
        type: 'builder',
        files: [{
          name: 'index.html',
          type: 'text/html',
          content: code
        }]
      };

      const savedWebsites = localStorage.getItem('websites');
      const allWebsites = savedWebsites ? JSON.parse(savedWebsites) : [];
      const updatedWebsites = [...allWebsites, website];
      localStorage.setItem('websites', JSON.stringify(updatedWebsites));

      setMessages(prev => [...prev, {
        type: 'bot',
        content: "I've generated the website code based on your description. Here's what I created:",
        code
      }]);

      setPreviewCount(prev => prev + 1);
      
      navigate(`/preview/${website.id}`, {
        state: { 
          files: website.files,
          from: 'builder',
          website
        },
        replace: true
      });
    } catch (error) {
      setMessages(prev => [...prev, {
        type: 'bot',
        content: error instanceof Error ? error.message : "An unexpected error occurred. Please try again."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-lg min-h-[600px] flex flex-col">
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.type === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.type === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {message.content}
                {message.code && (
                  <div className="mt-4 bg-gray-800 text-gray-200 p-4 rounded-md overflow-x-auto">
                    <pre className="text-sm">
                      <code>{message.code}</code>
                    </pre>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="border-t p-4">
          <div className="flex space-x-4">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the website you want to create..."
              className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              {isLoading ? 'Generating...' : 'Send'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}