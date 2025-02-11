import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Zap, Globe, Rocket } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SquarePayment } from './SquarePayment';

const plans = [
  {
    name: 'Free Preview',
    price: 0,
    displayPrice: '$0',
    period: '',
    features: [
      'Generate website designs',
      'Preview in builder',
      'Basic customization',
      'Limited to 3 previews'
    ],
    icon: Zap,
    buttonText: 'Start Building',
    route: '/builder'
  },
  {
    name: 'Professional',
    price: 99,
    displayPrice: '$99',
    period: '/year',
    features: [
      'Unlimited generations',
      'Full customization',
      'Domain connection',
      'Export code',
      'Priority support'
    ],
    icon: Globe,
    buttonText: 'Get Professional',
    priceId: 'professional'
  },
  {
    name: 'Enterprise',
    price: 299,
    displayPrice: '$299',
    period: '/year',
    features: [
      'Everything in Professional',
      'Custom branding',
      'API access',
      'Team collaboration',
      'Dedicated support'
    ],
    icon: Rocket,
    buttonText: 'Contact Sales',
    priceId: 'enterprise'
  }
];

export function Pricing() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePlanSelect = async (plan: typeof plans[0]) => {
    if (!plan.priceId) {
      navigate(plan.route);
      return;
    }

    if (!user) {
      navigate('/account/login', { state: { from: location.pathname + location.search } });
      return;
    }

    // For Professional plan, skip payment and directly upgrade
    if (plan.priceId === 'professional') {
      const websiteId = new URLSearchParams(location.search).get('websiteId');
      if (websiteId) {
        const websites = JSON.parse(localStorage.getItem('websites') || '[]');
        const updatedWebsites = websites.map((website: any) => 
          website.id === websiteId 
            ? { 
                ...website, 
                plan: plan.name.toLowerCase(), 
                status: 'published',
                lastModified: new Date().toISOString()
              }
            : website
        );
        localStorage.setItem('websites', JSON.stringify(updatedWebsites));
      }
      navigate('/account');
      return;
    }

    // For Enterprise plan, show payment
    setSelectedPlan(plan);
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    setIsLoading(false);
    setShowPayment(false);
    
    // Update the website's plan in localStorage if we came from preview
    const websiteId = new URLSearchParams(location.search).get('websiteId');
    if (websiteId && selectedPlan) {
      const websites = JSON.parse(localStorage.getItem('websites') || '[]');
      const updatedWebsites = websites.map((website: any) => 
        website.id === websiteId 
          ? { ...website, plan: selectedPlan.name.toLowerCase(), status: 'published' }
          : website
      );
      localStorage.setItem('websites', JSON.stringify(updatedWebsites));
    }

    // Navigate to dashboard
    navigate('/account');
  };

  const handlePaymentError = (error: string) => {
    setIsLoading(false);
    alert(error);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Choose Your Plan
        </h2>
        <p className="mt-4 text-xl text-gray-600">
          Start building beautiful websites with AI today
        </p>
      </div>

      {showPayment && selectedPlan ? (
        <div className="mt-16 max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Subscribe to {selectedPlan.name}
          </h3>
          <SquarePayment
            amount={selectedPlan.price}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
          <button
            onClick={() => setShowPayment(false)}
            className="mt-4 w-full bg-gray-200 text-gray-700 rounded-lg py-3 px-4 hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.name}
                className="relative bg-white rounded-2xl shadow-xl p-8 flex flex-col"
              >
                <div className="flex-1">
                  <div className="inline-flex p-3 rounded-lg bg-indigo-100">
                    <Icon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-gray-900">
                    {plan.name}
                  </h3>
                  <div className="mt-4">
                    <span className="text-4xl font-extrabold text-gray-900">
                      {plan.displayPrice}
                    </span>
                    <span className="text-base font-medium text-gray-500">
                      {plan.period}
                    </span>
                  </div>
                  <ul className="mt-6 space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-6 w-6 text-green-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <p className="ml-3 text-base text-gray-700">{feature}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={() => handlePlanSelect(plan)}
                  disabled={isLoading}
                  className="mt-8 w-full bg-indigo-600 text-white rounded-lg py-3 px-4 hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Processing...' : plan.buttonText}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}