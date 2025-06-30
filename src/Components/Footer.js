import { Mail, Twitter, Facebook, Instagram, Github, Linkedin } from 'lucide-react';
import logo from '../assets/taskily.png';

export default function Footer() {
  return (
    <footer className="bg-gray-100 pt-16 pb-8">
      {/* Newsletter section */}
      <div className="bg-gray-900 text-white rounded-3xl mx-8 mb-12 p-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold mb-2">STAY UP TO DATE WITH</h2>
          <h2 className="text-2xl font-semibold">TASKILY UPDATES</h2>
          <p className="text-gray-300 mt-2">Get productivity tips and feature updates delivered to your inbox</p>
        </div>
        <div className="flex flex-col space-y-3">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="email"
              placeholder="Enter your email address"
              className="pl-12 pr-6 py-3 rounded-full w-80 text-black outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="bg-blue-600 text-white py-3 px-8 rounded-full font-medium hover:bg-blue-700 transition-colors">
            Subscribe to Newsletter
          </button>
        </div>
      </div>

      {/* Footer links */}
      <div className="px-8 grid grid-cols-5 gap-8 mb-8">
        {/* Logo and Social links */}
        <div>
          <div className="flex items-center space-x-3 mb-6">
            <img 
              src={logo} 
              alt="Taskily Logo" 
              className="h-8 w-auto rounded-lg object-contain"
            />
            <span className="text-xl font-bold text-gray-900">Taskily</span>
          </div>
          <p className="text-gray-600 mb-4 text-sm">
            Streamline your workflow and boost productivity with our comprehensive task management platform.
          </p>
          <div className="flex space-x-4">
            <div className="bg-white p-2 rounded-full shadow-sm cursor-pointer hover:shadow-md transition-shadow">
              <Twitter className="text-gray-600 hover:text-blue-500" size={20} />
            </div>
            <div className="bg-white p-2 rounded-full shadow-sm cursor-pointer hover:shadow-md transition-shadow">
              <Facebook className="text-gray-600 hover:text-blue-600" size={20} />
            </div>
            <div className="bg-white p-2 rounded-full shadow-sm cursor-pointer hover:shadow-md transition-shadow">
              <Instagram className="text-gray-600 hover:text-pink-500" size={20} />
            </div>
            <div className="bg-white p-2 rounded-full shadow-sm cursor-pointer hover:shadow-md transition-shadow">
              <Linkedin className="text-gray-600 hover:text-blue-700" size={20} />
            </div>
            <div className="bg-white p-2 rounded-full shadow-sm cursor-pointer hover:shadow-md transition-shadow">
              <Github className="text-gray-600 hover:text-gray-900" size={20} />
            </div>
          </div>
        </div>

        {/* Product */}
        <div>
          <h3 className="font-semibold mb-4 text-gray-900">PRODUCT</h3>
          <ul className="space-y-3 text-gray-600">
            <li className="cursor-pointer hover:text-blue-600 transition-colors">Task Management</li>
            <li className="cursor-pointer hover:text-blue-600 transition-colors">Project Planning</li>
            <li className="cursor-pointer hover:text-blue-600 transition-colors">Team Collaboration</li>
            <li className="cursor-pointer hover:text-blue-600 transition-colors">Time Tracking</li>
            <li className="cursor-pointer hover:text-blue-600 transition-colors">Analytics</li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="font-semibold mb-4 text-gray-900">COMPANY</h3>
          <ul className="space-y-3 text-gray-600">
            <li className="cursor-pointer hover:text-blue-600 transition-colors">About Us</li>
            <li className="cursor-pointer hover:text-blue-600 transition-colors">Careers</li>
            <li className="cursor-pointer hover:text-blue-600 transition-colors">Press</li>
            <li className="cursor-pointer hover:text-blue-600 transition-colors">Blog</li>
            <li className="cursor-pointer hover:text-blue-600 transition-colors">Contact</li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="font-semibold mb-4 text-gray-900">SUPPORT</h3>
          <ul className="space-y-3 text-gray-600">
            <li className="cursor-pointer hover:text-blue-600 transition-colors">Help Center</li>
            <li className="cursor-pointer hover:text-blue-600 transition-colors">Documentation</li>
            <li className="cursor-pointer hover:text-blue-600 transition-colors">API Reference</li>
            <li className="cursor-pointer hover:text-blue-600 transition-colors">Community</li>
            <li className="cursor-pointer hover:text-blue-600 transition-colors">Status Page</li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="font-semibold mb-4 text-gray-900">LEGAL</h3>
          <ul className="space-y-3 text-gray-600">
            <li className="cursor-pointer hover:text-blue-600 transition-colors">Privacy Policy</li>
            <li className="cursor-pointer hover:text-blue-600 transition-colors">Terms of Service</li>
            <li className="cursor-pointer hover:text-blue-600 transition-colors">Cookie Policy</li>
            <li className="cursor-pointer hover:text-blue-600 transition-colors">Security</li>
            <li className="cursor-pointer hover:text-blue-600 transition-colors">GDPR</li>
          </ul>
        </div>
      </div>

      {/* Bottom section */}
      <div className="px-8 pt-8 border-t border-gray-300 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img 
            src={logo} 
            alt="Taskily Logo" 
            className="h-6 w-auto rounded object-contain"
          />
          <p className="text-gray-600">© 2024 Taskily. All Rights Reserved.</p>
        </div>
        
        <div className="flex space-x-4">
          <div className="bg-white border border-gray-200 rounded-full px-3 py-2 shadow-sm">
            <span className="text-blue-600 font-bold text-sm">Secure</span>
          </div>
          <div className="bg-white border border-gray-200 rounded-full px-3 py-2 shadow-sm">
            <span className="text-green-600 font-bold text-sm">GDPR</span>
          </div>
          <div className="bg-white border border-gray-200 rounded-full px-3 py-2 shadow-sm">
            <span className="text-purple-600 font-bold text-sm">SOC2</span>
          </div>
          <div className="bg-white border border-gray-200 rounded-full px-3 py-2 shadow-sm">
            <span className="text-orange-600 font-bold text-sm">ISO</span>
          </div>
        </div>
      </div>
    </footer>
  );
}