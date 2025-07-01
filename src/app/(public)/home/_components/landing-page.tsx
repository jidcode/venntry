"use client";

import { useState } from "react";

// Navbar Component
const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Toggle mobile menu visibility
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 md:px-10 xl:px-16 flex items-center justify-between h-16 lg:h-20">
        {/* Logo and App Name */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            {/* SVG Icon for InventoryPro */}
            <svg
              className="w-5 h-5 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-secondary">InventoryPro</span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex space-x-6">
          <a
            href="#features"
            className="text-gray-600 hover:text-accent transition-colors"
          >
            Features
          </a>
          <a
            href="#benefits"
            className="text-gray-600 hover:text-accent transition-colors"
          >
            Benefits
          </a>
          <a
            href="#pricing"
            className="text-gray-600 hover:text-accent transition-colors"
          >
            Pricing
          </a>
          <a
            href="#contact"
            className="text-gray-600 hover:text-accent transition-colors"
          >
            Contact
          </a>
        </nav>

        {/* Login Button and Mobile Menu Toggle */}
        <div className="flex items-center space-x-4">
          <button className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent/90 transition-colors">
            Login
          </button>
          <button className="md:hidden" onClick={toggleMobileMenu}>
            {/* Hamburger Icon */}
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg py-4">
          <nav className="flex flex-col items-center space-y-4">
            <a
              href="#features"
              className="text-gray-600 hover:text-accent transition-colors"
              onClick={toggleMobileMenu}
            >
              Features
            </a>
            <a
              href="#benefits"
              className="text-gray-600 hover:text-accent transition-colors"
              onClick={toggleMobileMenu}
            >
              Benefits
            </a>
            <a
              href="#pricing"
              className="text-gray-600 hover:text-accent transition-colors"
              onClick={toggleMobileMenu}
            >
              Pricing
            </a>
            <a
              href="#contact"
              className="text-gray-600 hover:text-accent transition-colors"
              onClick={toggleMobileMenu}
            >
              Contact
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

// Hero Section Component
const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 py-20 lg:py-32">
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="container mx-auto px-4 md:px-10 xl:px-16 text-center relative z-10">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent leading-tight">
            Simplify Your Inventory, Amplify Your Business
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Seamlessly manage your inventory and streamline warehouse workflows
            with a platform designed to save time, cut costs, and enhance
            decision-making at every step.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
            <button className="bg-accent text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-accent/90 transform hover:scale-105 transition-all duration-200 shadow-lg">
              Get Started Free
            </button>
            <button className="border-2 border-accent text-accent px-8 py-4 rounded-lg text-lg font-semibold hover:bg-accent hover:text-white transition-all duration-200">
              Watch Demo
            </button>
          </div>
        </div>

        {/* Floating Dashboard Preview */}
        <div className="mt-16 relative animate-float">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-4xl mx-auto border">
            {/* Traffic light dots */}
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            </div>
            <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-accent rounded-lg mx-auto mb-4 flex items-center justify-center">
                  {/* Checkmark icon */}
                  <svg
                    className="w-8 h-8 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-600 font-medium">Dashboard Preview</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Feature Card Component (reusable)
const FeatureCard = ({ icon, bgColor, iconColor, title, description }: any) => {
  return (
    <div className="feature-card bg-white p-8 rounded-xl shadow-lg border hover:shadow-xl transition-all duration-300">
      <div
        className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center mb-6`}
      >
        {/* Dynamically rendered SVG icon */}
        <svg
          className={`w-6 h-6 ${iconColor}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {icon}
        </svg>
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

// Features Section Component
const FeaturesSection = () => {
  const features = [
    {
      title: "Real-time Tracking",
      description:
        "Monitor inventory levels in real-time with automatic updates and low-stock alerts.",
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      ),
    },
    {
      title: "Multi-user Access",
      description:
        "Collaborate with your team with role-based permissions and access controls.",
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
        />
      ),
    },
    {
      title: "Advanced Analytics",
      description:
        "Get insights with detailed reports and analytics to make data-driven decisions.",
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      ),
    },
    {
      title: "Mobile App",
      description:
        "Manage inventory on-the-go with our mobile app for iOS and Android devices.",
      bgColor: "bg-red-100",
      iconColor: "text-red-600",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      ),
    },
    {
      title: "Barcode Scanning",
      description:
        "Streamline operations with built-in barcode scanning and QR code support.",
      bgColor: "bg-yellow-100",
      iconColor: "text-yellow-600",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      ),
    },
    {
      title: "API Integration",
      description:
        "Connect with your existing tools and systems through our robust API.",
      bgColor: "bg-indigo-100",
      iconColor: "text-indigo-600",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      ),
    },
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-10 xl:px-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
            Powerful Features for Modern Inventory Management
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to manage your inventory efficiently and scale
            your business operations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              bgColor={feature.bgColor}
              iconColor={feature.iconColor}
              icon={feature.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// Benefit Item Component (reusable)
const BenefitItem = ({ title, description }: any) => {
  return (
    <div className="flex items-start space-x-4">
      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
        {/* Checkmark icon for benefits */}
        <svg
          className="w-4 h-4 text-white"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

// Benefits Section Component
const BenefitsSection = () => {
  const benefits = [
    {
      title: "Reduce Costs by 30%",
      description:
        "Eliminate overstocking and stockouts with intelligent forecasting and automated reorder points.",
    },
    {
      title: "Save 10 Hours Per Week",
      description:
        "Automate manual processes and reduce time spent on inventory management tasks.",
    },
    {
      title: "99.9% Accuracy",
      description:
        "Maintain precise inventory records with real-time tracking and validation.",
    },
  ];

  return (
    <section id="benefits" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-10 xl:px-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-6">
              Transform Your Business Operations
            </h2>
            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <BenefitItem
                  key={index}
                  title={benefit.title}
                  description={benefit.description}
                />
              ))}
            </div>
          </div>

          {/* Analytics Dashboard Mockup */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-2">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg h-48 mb-6 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-4xl font-bold mb-2">📊</div>
                  <p className="text-lg">Analytics Dashboard</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Items</span>
                  <span className="font-semibold">1,247</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Low Stock Alerts</span>
                  <span className="font-semibold text-red-500">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Revenue This Month</span>
                  <span className="font-semibold text-green-500">$24,580</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Pricing Card Component (reusable)
const PricingCard = ({
  planName,
  price,
  priceUnit,
  features,
  isPopular,
}: any) => {
  return (
    <div
      className={`bg-white p-8 rounded-xl border-2 ${
        isPopular
          ? "border-accent text-white bg-accent transform scale-105 shadow-xl relative"
          : "border-gray-200 hover:border-accent"
      } transition-all duration-300`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-semibold">
          Most Popular
        </div>
      )}
      <div className="text-center mb-8">
        <h3
          className={`text-xl font-semibold mb-2 ${
            isPopular ? "text-white" : ""
          }`}
        >
          {planName}
        </h3>
        <div
          className={`text-3xl font-bold mb-1 ${isPopular ? "text-white" : ""}`}
        >
          ${price}
        </div>
        <p className={`${isPopular ? "text-accent-light" : "text-gray-600"}`}>
          {priceUnit}
        </p>
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((feature: any, index: any) => (
          <li key={index} className="flex items-center">
            {/* Checkmark icon for features */}
            <svg
              className={`w-5 h-5 ${
                isPopular ? "text-green-300" : "text-green-500"
              } mr-3`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className={`${isPopular ? "text-white" : "text-gray-600"}`}>
              {feature}
            </span>
          </li>
        ))}
      </ul>
      <button
        className={`w-full px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
          isPopular
            ? "bg-white text-accent hover:bg-gray-100"
            : "border-2 border-accent text-accent hover:bg-accent hover:text-white"
        }`}
      >
        {isPopular ? "Start Free Trial" : "Get Started"}
      </button>
    </div>
  );
};

// Pricing Section Component
const PricingSection = () => {
  const plans = [
    {
      name: "Starter",
      price: "0",
      unit: "per month",
      features: ["Up to 100 items", "Basic reporting", "Email support"],
      isPopular: false,
    },
    {
      name: "Professional",
      price: "29",
      unit: "per month",
      features: [
        "Up to 1,000 items",
        "Advanced analytics",
        "Multi-user access",
        "Priority support",
      ],
      isPopular: true,
    },
    {
      name: "Enterprise",
      price: "99",
      unit: "per month",
      features: [
        "Unlimited items",
        "Custom integrations",
        "Dedicated account manager",
        "24/7 phone support",
      ],
      isPopular: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-10 xl:px-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
            Choose Your Plan
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Start free and scale as you grow. No hidden fees, cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <PricingCard
              key={index}
              planName={plan.name}
              price={plan.price}
              priceUnit={plan.unit}
              features={plan.features}
              isPopular={plan.isPopular}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// Contact Section Component
const ContactSection = () => {
  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-10 xl:px-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
          Get in Touch
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
          Have questions or need a custom solution? Reach out to our sales team.
        </p>
        <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg border">
          <form className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-left text-gray-700 text-sm font-medium mb-2"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-left text-gray-700 text-sm font-medium mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-left text-gray-700 text-sm font-medium mb-2"
              >
                Message
              </label>
              <textarea
                id="message"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="Tell us about your needs..."
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent/90 transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer className="bg-secondary text-white py-10">
      <div className="container mx-auto px-4 md:px-10 xl:px-16 text-center">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-lg font-bold">InventoryPro</div>
          <nav className="flex space-x-6">
            <a href="#features" className="hover:text-accent transition-colors">
              Features
            </a>
            <a href="#benefits" className="hover:text-accent transition-colors">
              Benefits
            </a>
            <a href="#pricing" className="hover:text-accent transition-colors">
              Pricing
            </a>
            <a href="#contact" className="hover:text-accent transition-colors">
              Contact
            </a>
          </nav>
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} InventoryPro. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

// Main App Component
export default function App() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <BenefitsSection />
      <PricingSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
