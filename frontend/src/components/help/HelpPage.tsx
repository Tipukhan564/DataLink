import React, { useState } from 'react';
import Header from '../layout/Header';
import {
  HelpCircle, Book, MessageCircle, Phone, Mail, ChevronDown, ChevronRight,
  FileText, Users, Upload, CheckSquare, BarChart3, Settings, Search,
  ExternalLink, PlayCircle, Download,
} from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
}

interface Guide {
  title: string;
  description: string;
  icon: React.FC<{ className?: string }>;
  articles: string[];
}

const HelpPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqs: FAQ[] = [
    {
      question: 'How do I submit a customer update request?',
      answer: 'Navigate to "Customer Update" from the sidebar, click "New Update Request", fill in the required customer information across the three steps (Customer Info, Personal Details, Additional Info), and click Submit. The request will be queued for approval based on your organization\'s workflow rules.',
    },
    {
      question: 'What file format is supported for bulk uploads?',
      answer: 'The system supports Excel files (.xlsx, .xls) matching the standard template format. Download the template from the Bulk Upload page and ensure all required columns are filled. The system will validate each row before processing.',
    },
    {
      question: 'How long does the approval process take?',
      answer: 'Approval times vary based on workload and complexity. Simple updates are typically approved within 2-4 hours during business hours. Requests requiring additional verification may take 24-48 hours. You can track status in real-time from your dashboard.',
    },
    {
      question: 'What do the different request statuses mean?',
      answer: 'PENDING: Awaiting supervisor review. APPROVED: Approved and queued for processing. PROCESSING: Currently being executed in the database. COMPLETED: Successfully processed. REJECTED: Declined by supervisor (see comments). FAILED: Processing error occurred.',
    },
    {
      question: 'How can I track my submitted requests?',
      answer: 'From the Dashboard, you can see your recent submissions and their current status. For a complete history, go to Customer Update and use the search/filter options to find specific requests by CNIC, mobile number, or date range.',
    },
    {
      question: 'What should I do if a request fails?',
      answer: 'Check the error details in the request view. Common issues include invalid data formats, duplicate records, or database connectivity problems. Correct the issue and resubmit. If the problem persists, contact your supervisor or IT support.',
    },
    {
      question: 'Can I edit a request after submission?',
      answer: 'Requests in PENDING status can be modified by contacting your supervisor. Once a request is APPROVED or in a later stage, it cannot be edited. You would need to submit a new correction request.',
    },
    {
      question: 'How do I export reports?',
      answer: 'Go to Reports & Analytics, select your desired report type and date range, then click the Export button. Reports can be downloaded in Excel or PDF format. Scheduled reports can be configured in Settings.',
    },
  ];

  const guides: Guide[] = [
    {
      title: 'Getting Started',
      description: 'Learn the basics of the CDUP system',
      icon: Book,
      articles: ['System Overview', 'First Login Guide', 'Navigation Basics', 'Understanding Your Dashboard'],
    },
    {
      title: 'Customer Updates',
      description: 'Managing customer data updates',
      icon: Users,
      articles: ['Single Update Process', 'Form Field Guide', 'Validation Rules', 'Tracking Requests'],
    },
    {
      title: 'Bulk Operations',
      description: 'Processing multiple records',
      icon: Upload,
      articles: ['Template Download', 'File Preparation', 'Upload Process', 'Error Handling'],
    },
    {
      title: 'Approvals',
      description: 'For supervisors and approvers',
      icon: CheckSquare,
      articles: ['Approval Workflow', 'Review Guidelines', 'Bulk Approvals', 'Rejection Comments'],
    },
    {
      title: 'Reports',
      description: 'Analytics and reporting features',
      icon: BarChart3,
      articles: ['Report Types', 'Custom Date Ranges', 'Export Options', 'Scheduled Reports'],
    },
    {
      title: 'Administration',
      description: 'System configuration and users',
      icon: Settings,
      articles: ['User Management', 'Role Permissions', 'System Settings', 'Audit Logs'],
    },
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Header title="Help & Support" subtitle="Find answers, guides, and contact support" />

      <div className="p-6 max-w-6xl">
        {/* Search */}
        <div className="card p-6 mb-6 bg-gradient-to-r from-primary-500 to-primary-600">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-white mb-2">How can we help you?</h2>
            <p className="text-primary-100 mb-4">Search our knowledge base or browse topics below</p>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for help..."
                className="w-full pl-12 pr-4 py-3 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Guides */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Guides */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">User Guides</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {guides.map((guide, idx) => (
                  <div key={idx} className="card p-5 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <guide.icon className="w-5 h-5 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-gray-900 mb-1">{guide.title}</h4>
                        <p className="text-xs text-gray-500 mb-3">{guide.description}</p>
                        <ul className="space-y-1.5">
                          {guide.articles.map((article, aidx) => (
                            <li key={aidx}>
                              <a href="#" className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1">
                                <ChevronRight className="w-3 h-3" />
                                {article}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQs */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Frequently Asked Questions</h3>
              <div className="card divide-y divide-gray-100">
                {filteredFaqs.length > 0 ? (
                  filteredFaqs.map((faq, idx) => (
                    <div key={idx} className="p-4">
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                        className="w-full flex items-center justify-between text-left"
                      >
                        <span className="text-sm font-medium text-gray-900 pr-4">{faq.question}</span>
                        <ChevronDown
                          className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${
                            expandedFaq === idx ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {expandedFaq === idx && (
                        <p className="mt-3 text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">No matching questions found</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Contact & Resources */}
          <div className="space-y-6">
            {/* Contact Support */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-sm font-semibold text-gray-900">Contact Support</h3>
              </div>
              <div className="card-body space-y-4">
                <a href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Live Chat</p>
                    <p className="text-xs text-gray-500">Available 9 AM - 6 PM PKT</p>
                  </div>
                </a>
                <a href="mailto:support@cdup.com" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email Support</p>
                    <p className="text-xs text-gray-500">support@cdup.com</p>
                  </div>
                </a>
                <a href="tel:+924235123456" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Phone Support</p>
                    <p className="text-xs text-gray-500">+92 42 35123456</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Resources */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-sm font-semibold text-gray-900">Resources</h3>
              </div>
              <div className="card-body space-y-3">
                <a href="#" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-700">User Manual (PDF)</span>
                  </div>
                  <Download className="w-4 h-4 text-gray-400 group-hover:text-primary-600" />
                </a>
                <a href="#" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <PlayCircle className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-700">Video Tutorials</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-primary-600" />
                </a>
                <a href="#" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <Download className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-700">Bulk Upload Template</span>
                  </div>
                  <Download className="w-4 h-4 text-gray-400 group-hover:text-primary-600" />
                </a>
              </div>
            </div>

            {/* System Info */}
            <div className="card p-4">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">CDUP Version</p>
                <p className="text-sm font-semibold text-gray-900">v2.1.0</p>
                <p className="text-xs text-gray-400 mt-2">Last updated: January 2026</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
