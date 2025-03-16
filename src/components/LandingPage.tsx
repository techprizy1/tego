import React from 'react';
import { FileText, CheckCircle, ArrowRight, Shield, Zap, Clock, CreditCard } from 'lucide-react';
import { Auth } from './Auth';

export function LandingPage() {
  const [showAuth, setShowAuth] = React.useState(false);

  const features = [
    {
      icon: <Zap className="w-6 h-6 text-blue-500" />,
      title: 'AI-Powered Generation',
      description: 'Create professional invoices instantly using natural language prompts'
    },
    {
      icon: <Shield className="w-6 h-6 text-green-500" />,
      title: 'Secure Storage',
      description: 'All your invoices are safely stored and easily accessible'
    },
    {
      icon: <Clock className="w-6 h-6 text-purple-500" />,
      title: 'Save Time',
      description: 'Reduce invoice creation time from hours to seconds'
    },
    {
      icon: <CreditCard className="w-6 h-6 text-orange-500" />,
      title: 'Professional Templates',
      description: 'Beautiful, customizable invoice templates for your business'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Freelance Designer',
      content: 'This AI invoice generator has completely transformed how I handle my billing. It\'s incredibly intuitive and saves me hours each week.',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    {
      name: 'Michael Chen',
      role: 'Tech Consultant',
      content: 'The AI understanding of service descriptions is remarkable. It generates accurate invoices from simple descriptions, making my billing process effortless.',
      image: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white z-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="py-20 lg:py-32">
            <div className="text-center">
              <div className="flex justify-center items-center mb-8">
                <FileText className="w-16 h-16 text-blue-600" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                AI-Powered Invoice Generation
                <span className="block text-blue-600">Made Simple</span>
              </h1>
              <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                Create professional invoices in seconds using natural language. Let AI handle the calculations while you focus on your business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setShowAuth(true)}
                  className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:text-lg"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
                <a
                  href="#features"
                  className="inline-flex items-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 md:text-lg"
                >
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Everything you need to manage invoices
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Powerful features to help you create and manage invoices effortlessly
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="relative group bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg opacity-0 group-hover:opacity-100 transition duration-300 blur" />
                <div className="relative bg-white p-6 rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Loved by businesses worldwide
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Here's what our users have to say about their experience
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center mb-6">
                  <img
                    className="w-12 h-12 rounded-full"
                    src={testimonial.image}
                    alt={testimonial.name}
                  />
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Ready to streamline your invoicing?
            </h2>
            <p className="mt-4 text-xl text-blue-100">
              Join thousands of businesses using our AI-powered invoice generator
            </p>
            <button
              onClick={() => setShowAuth(true)}
              className="mt-8 inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 md:text-lg"
            >
              Get Started Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-end">
              <button
                onClick={() => setShowAuth(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <Auth />
          </div>
        </div>
      )}
    </div>
  );
}