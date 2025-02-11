import React from 'react';
import { Link } from 'react-router-dom';
import { Wand2, Globe, Rocket, Code, Palette, Users, Zap, Lock, ArrowRight } from 'lucide-react';

export function Home() {
  const features = [
    {
      icon: Wand2,
      title: 'AI-Powered Design',
      description: 'Create stunning websites in minutes with our advanced AI technology that understands your vision.'
    },
    {
      icon: Globe,
      title: 'Custom Domains',
      description: 'Connect your own domain and manage DNS settings with professional hosting features.'
    },
    {
      icon: Code,
      title: 'Code Export',
      description: 'Export clean, production-ready code in multiple frameworks including React, Vue, and Angular.'
    },
    {
      icon: Palette,
      title: 'Brand Management',
      description: 'Maintain consistent branding with custom colors, fonts, and AI-generated style suggestions.'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Work together seamlessly with role-based access control and real-time updates.'
    },
    {
      icon: Lock,
      title: 'Enterprise Security',
      description: 'Keep your data safe with advanced security features and regular backups.'
    }
  ];

  const plans = [
    {
      name: 'Free',
      price: 0,
      features: [
        'Generate website designs',
        'Preview in builder',
        'Basic customization',
        'Limited to 3 previews'
      ]
    },
    {
      name: 'Professional',
      price: 99,
      features: [
        'Unlimited generations',
        'Full customization',
        'Domain connection',
        'Export code',
        'Priority support'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: 299,
      features: [
        'Everything in Professional',
        'Custom branding',
        'API access',
        'Team collaboration',
        'Dedicated support'
      ]
    }
  ];

  return (
    <div className="space-y-32 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
              Build Beautiful Websites
              <span className="block text-indigo-600">Powered by AI</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
              Create stunning, responsive websites in minutes with our AI-powered website builder.
              No coding required.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Link
                to="/builder"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Zap className="h-5 w-5 mr-2" />
                Start Building
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                View Plans
              </Link>
            </div>
          </div>
          <div className="mt-20">
            <img
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2426&q=80"
              alt="Website builder interface"
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Everything You Need to Build Amazing Websites
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Our platform combines powerful features with ease of use to help you create
              professional websites quickly.
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                  <div className="relative bg-white p-6 rounded-lg">
                    <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">{feature.title}</h3>
                    <p className="mt-2 text-base text-gray-500">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Choose the plan that best fits your needs
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-white rounded-2xl shadow-xl p-8 ${
                  plan.popular ? 'ring-2 ring-indigo-600' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-6 -translate-y-1/2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-indigo-600 text-white">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                  <div className="mt-4">
                    <span className="text-4xl font-extrabold text-gray-900">
                      ${plan.price}
                    </span>
                    <span className="text-base font-medium text-gray-500">/year</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-8">
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
                <Link
                  to="/builder"
                  className={`w-full inline-flex items-center justify-center px-6 py-3 border text-base font-medium rounded-md ${
                    plan.popular
                      ? 'border-transparent text-white bg-indigo-600 hover:bg-indigo-700'
                      : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                  }`}
                >
                  Start Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Ready to Build Your Website?
            </h2>
            <p className="mt-4 text-xl text-indigo-100">
              Start creating your website today with our AI-powered builder.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link
                to="/builder"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
              >
                <Rocket className="h-5 w-5 mr-2" />
                Start Now
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white/10"
              >
                Select Your Plan
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}