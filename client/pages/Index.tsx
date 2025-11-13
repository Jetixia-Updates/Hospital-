import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Activity, Users, Calendar, Shield, Zap, BarChart3 } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const features = [
    {
      icon: Users,
      title: "Patient Management",
      description: "Comprehensive patient profiles and medical histories",
    },
    {
      icon: Calendar,
      title: "Appointment Scheduling",
      description: "Easy booking and management of medical appointments",
    },
    {
      icon: Activity,
      title: "Clinical Records",
      description: "Secure storage and access to medical records",
    },
    {
      icon: Zap,
      title: "Lab Integration",
      description: "Streamlined lab test management and results",
    },
    {
      icon: Shield,
      title: "Secure & Compliant",
      description: "HIPAA-compliant data handling and encryption",
    },
    {
      icon: BarChart3,
      title: "Analytics & Reports",
      description: "Real-time insights and comprehensive reporting",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg font-bold">+</span>
            </div>
            <span className="font-bold text-xl text-gray-900">Hospital Management System</span>
          </div>
          <div className="flex gap-4">
            {isLoggedIn ? (
              <Button
                onClick={() => navigate("/dashboard")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => navigate("/login")}
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => navigate("/register")}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-teal-50" />
        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Modern Healthcare Management
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Streamline your hospital operations with our comprehensive management system. From patient care to equipment tracking, everything in one place.
              </p>
              <div className="flex gap-4">
                <Button
                  onClick={() => navigate("/register")}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Start Free Trial
                </Button>
                <Button
                  onClick={() => navigate("/login")}
                  size="lg"
                  variant="outline"
                >
                  Sign In
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-400 to-teal-400 rounded-2xl h-96 opacity-20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Activity className="w-32 h-32 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600">Everything you need to manage your hospital efficiently</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <Icon className="w-12 h-12 text-blue-600 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-teal-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Hospital?</h2>
          <p className="text-xl text-blue-50 mb-8">
            Join hospitals worldwide using our system to improve patient care and operational efficiency.
          </p>
          <Button
            onClick={() => navigate("/register")}
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100"
          >
            Create Your Account
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">+</span>
                </div>
                <span className="font-bold text-white">Hospital System</span>
              </div>
              <p className="text-sm">Modern healthcare management for the digital age.</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8">
            <p className="text-center text-sm">© 2024 Hospital Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
