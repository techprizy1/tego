import React, { useState, useEffect } from 'react';
import { Loader2, FileText, AlertCircle, Building2, History, LogOut, CheckCircle, ArrowRight, Shield, Zap, Clock, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';
import { generateInvoiceData } from './services/openai';
import { InvoicePDF } from './components/InvoicePDF';
import { InvoiceData, CompanyProfile } from './types/invoice';
import { supabase } from './lib/supabase';
import { MyInvoices } from './components/MyInvoices';
import { Auth } from './components/Auth';
import { LandingPage } from './components/LandingPage';

// List of Indian states
const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 
  'West Bengal', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry'
];

function App() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showMyInvoices, setShowMyInvoices] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<CompanyProfile>({
    name: '',
    address: '',
    email: '',
    phone: '',
    logo: '',
    state: ''
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey || apiKey === 'your-openai-api-key-here') {
      setApiKeyError('Please set your OpenAI API key in the .env file');
    } else {
      setApiKeyError(null);
    }

    const savedProfile = localStorage.getItem('companyProfile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Error signing out');
    } else {
      toast.success('Signed out successfully');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    try {
      setLoading(true);
      const data = await generateInvoiceData(prompt);
      const mergedData = {
        ...data,
        company: profile
      };
      setInvoiceData(mergedData);

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error: saveError } = await supabase
        .from('invoices')
        .insert({
          invoice_data: mergedData,
          invoice_number: mergedData.invoiceNumber,
          total_amount: mergedData.total,
          client_name: mergedData.client.name,
          user_id: user.id
        });

      if (saveError) {
        console.error('Error saving invoice:', saveError);
        toast.error('Failed to save invoice to database');
      } else {
        toast.success('Invoice generated and saved successfully!');
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message || 'Failed to generate invoice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.state) {
      toast.error('Please select your state');
      return;
    }
    localStorage.setItem('companyProfile', JSON.stringify(profile));
    setShowProfile(false);
    toast.success('Company profile saved successfully!');
  };

  if (!session) {
    return <LandingPage />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <FileText className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">AI Invoice Generator</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setShowMyInvoices(!showMyInvoices);
                setShowProfile(false);
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <History className="w-4 h-4" />
              My Invoices
            </button>
            <button
              onClick={() => {
                setShowProfile(!showProfile);
                setShowMyInvoices(false);
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Building2 className="w-4 h-4" />
              Company Profile
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>

        {showProfile && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Company Profile</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <select
                    id="state"
                    value={profile.state}
                    onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select State</option>
                    {INDIAN_STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-1">
                    Logo URL (optional)
                  </label>
                  <input
                    type="url"
                    id="logo"
                    value={profile.logo}
                    onChange={(e) => setProfile({ ...profile, logo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/logo.png"
                  />
                </div>
                <div className="col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    id="address"
                    value={profile.address}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowProfile(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        )}

        {showMyInvoices ? (
          <MyInvoices />
        ) : (
          <>
            {apiKeyError && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-yellow-400 mr-2" />
                  <p className="text-sm text-yellow-700">
                    {apiKeyError}. Get your API key at{' '}
                    <a
                      href="https://platform.openai.com/account/api-keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium underline hover:text-yellow-800"
                    >
                      platform.openai.com
                    </a>
                  </p>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
                    Describe your invoice
                  </label>
                  <textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Example: Create an invoice for web development services for client John Doe from Karnataka, including 40 hours of frontend development at ₹7500/hour and 20 hours of backend development at ₹8500/hour"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !!apiKeyError}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin mr-2" />
                      Generating Invoice...
                    </>
                  ) : (
                    'Generate Invoice'
                  )}
                </button>
              </form>
            </div>

            {invoiceData && (
              <div className="mb-6">
                <InvoicePDF data={invoiceData} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;