import React, { useState } from 'react';
import { CreditCard, AlertCircle, CheckCircle2, PauseCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

type Website = {
  id: string;
  name: string;
  plan?: string;
};

type Subscription = {
  id: string;
  plan: string;
  status: 'active' | 'paused' | 'expired';
  price: number;
  renewalDate: string;
  paymentMethod: {
    type: 'card';
    last4: string;
    expiry: string;
    brand: string;
  };
  assignedWebsite?: {
    id: string;
    name: string;
  };
};

export function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    {
      id: '1',
      plan: 'Professional',
      status: 'active',
      price: 99,
      renewalDate: '2025-02-20',
      paymentMethod: {
        type: 'card',
        last4: '4242',
        expiry: '12/25',
        brand: 'Visa'
      },
      assignedWebsite: {
        id: '1',
        name: 'My Portfolio'
      }
    },
    {
      id: '2',
      plan: 'Professional',
      status: 'paused',
      price: 99,
      renewalDate: '2024-03-15',
      paymentMethod: {
        type: 'card',
        last4: '1234',
        expiry: '09/24',
        brand: 'Mastercard'
      }
    }
  ]);

  // Mock websites data
  const [websites] = useState<Website[]>([
    { id: '1', name: 'My Portfolio', plan: 'Professional' },
    { id: '2', name: 'Business Landing Page' },
    { id: '3', name: 'Personal Blog' }
  ]);

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<string | null>(null);

  const handleUpdatePaymentMethod = (subscriptionId: string) => {
    // In a real app, this would open a payment modal
    alert('Update payment method functionality would go here');
  };

  const handlePauseSubscription = (subscriptionId: string) => {
    if (confirm('Are you sure you want to pause this subscription?')) {
      setSubscriptions(subscriptions.map(sub =>
        sub.id === subscriptionId
          ? { ...sub, status: 'paused' }
          : sub
      ));
    }
  };

  const handleResumeSubscription = (subscriptionId: string) => {
    setSubscriptions(subscriptions.map(sub =>
      sub.id === subscriptionId
        ? { ...sub, status: 'active' }
        : sub
    ));
  };

  const handleUnassignWebsite = (subscriptionId: string) => {
    if (confirm('Are you sure you want to unassign this website? The subscription will be available for other websites.')) {
      setSubscriptions(subscriptions.map(sub =>
        sub.id === subscriptionId
          ? { ...sub, assignedWebsite: undefined }
          : sub
      ));
    }
  };

  const handleAssignWebsite = (subscriptionId: string, websiteId: string, websiteName: string) => {
    setSubscriptions(subscriptions.map(sub =>
      sub.id === subscriptionId
        ? { ...sub, assignedWebsite: { id: websiteId, name: websiteName } }
        : sub
    ));
    setShowAssignModal(false);
    setSelectedSubscription(null);
  };

  const openAssignModal = (subscriptionId: string) => {
    setSelectedSubscription(subscriptionId);
    setShowAssignModal(true);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Subscriptions</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your website subscriptions and payment methods
          </p>
        </div>

        <div className="space-y-4">
          {subscriptions.map((subscription) => (
            <div
              key={subscription.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {subscription.plan} Plan
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      ${subscription.price}/year
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      subscription.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : subscription.status === 'paused'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {subscription.status === 'active' && (
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                    )}
                    {subscription.status === 'paused' && (
                      <PauseCircle className="h-4 w-4 mr-1" />
                    )}
                    {subscription.status === 'expired' && (
                      <AlertCircle className="h-4 w-4 mr-1" />
                    )}
                    {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Payment Method</h4>
                    <div className="mt-2 flex items-center">
                      <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">
                        {subscription.paymentMethod.brand} ending in {subscription.paymentMethod.last4}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Expires {subscription.paymentMethod.expiry}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Renewal Date</h4>
                    <p className="mt-2 text-sm text-gray-900">
                      {new Date(subscription.renewalDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {subscription.assignedWebsite ? (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700">Assigned Website</h4>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm text-gray-900">
                        {subscription.assignedWebsite.name}
                      </span>
                      <button
                        onClick={() => handleUnassignWebsite(subscription.id)}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Unassign
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4">
                    <button
                      onClick={() => openAssignModal(subscription.id)}
                      className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-700"
                    >
                      <ArrowRight className="h-4 w-4 mr-1" />
                      Assign to Website
                    </button>
                  </div>
                )}

                <div className="mt-6 flex gap-4">
                  <button
                    onClick={() => handleUpdatePaymentMethod(subscription.id)}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Update Payment Method
                  </button>
                  {subscription.status === 'active' ? (
                    <button
                      onClick={() => handlePauseSubscription(subscription.id)}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Pause Subscription
                    </button>
                  ) : (
                    <button
                      onClick={() => handleResumeSubscription(subscription.id)}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                    >
                      Resume Subscription
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Assign Plan Modal */}
      {showAssignModal && selectedSubscription && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Assign Plan to Website
              </h3>
              <div className="space-y-4">
                {websites
                  .filter(website => !website.plan)
                  .map(website => (
                    <button
                      key={website.id}
                      onClick={() => handleAssignWebsite(selectedSubscription, website.id, website.name)}
                      className="w-full text-left px-4 py-3 border rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <div className="font-medium text-gray-900">{website.name}</div>
                      <div className="text-sm text-gray-500">No active plan</div>
                    </button>
                  ))}
                <div className="flex justify-between pt-4 border-t">
                  <Link
                    to="/builder"
                    className="text-sm text-indigo-600 hover:text-indigo-700"
                  >
                    Create New Website
                  </Link>
                  <button
                    onClick={() => {
                      setShowAssignModal(false);
                      setSelectedSubscription(null);
                    }}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}