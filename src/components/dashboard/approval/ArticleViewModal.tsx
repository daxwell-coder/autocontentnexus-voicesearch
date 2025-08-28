import React from 'react';
import { X, Calendar, User, FileText, BarChart3, Hash, Clock } from 'lucide-react';

interface ArticleData {
  id: number;
  title: string;
  content_body: string;
  content_type: string;
  status: string;
  author: string;
  created_at: string;
  published_at?: string;
  seo_data?: {
    meta_description?: string;
    keywords?: string[];
    seo_score?: number;
  };
  engagement_metrics?: {
    word_count?: number;
    reading_time?: number;
    readability_score?: number;
  };
}

interface ArticleViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: ArticleData | null;
  isLoading?: boolean;
}

const ArticleViewModal: React.FC<ArticleViewModalProps> = ({
  isOpen,
  onClose,
  article,
  isLoading = false
}) => {
  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1.5 rounded-full text-sm font-medium";
    switch (status.toLowerCase()) {
      case 'pending_approval':
        return `${baseClasses} bg-yellow-100 text-yellow-800 border border-yellow-200`;
      case 'approved':
        return `${baseClasses} bg-green-100 text-green-800 border border-green-200`;
      case 'rejected':
        return `${baseClasses} bg-red-100 text-red-800 border border-red-200`;
      case 'published':
        return `${baseClasses} bg-blue-100 text-blue-800 border border-blue-200`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 border border-gray-200`;
    }
  };

  const formatStatus = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  const getWordCount = (content: string) => {
    return content.trim().split(/\s+/).length;
  };

  const renderContent = (content: string) => {
    // Simple markdown-like rendering for better readability
    const paragraphs = content.split('\n\n').filter(p => p.trim());
    
    return paragraphs.map((paragraph, index) => {
      // Handle headers
      if (paragraph.startsWith('## ')) {
        return (
          <h2 key={index} className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b border-gray-200">
            {paragraph.substring(3)}
          </h2>
        );
      }
      if (paragraph.startsWith('### ')) {
        return (
          <h3 key={index} className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            {paragraph.substring(4)}
          </h3>
        );
      }
      if (paragraph.startsWith('#### ')) {
        return (
          <h4 key={index} className="text-lg font-semibold text-gray-800 mt-5 mb-2">
            {paragraph.substring(5)}
          </h4>
        );
      }
      
      // Handle bullet points
      if (paragraph.includes('\n- ') || paragraph.includes('\n* ')) {
        const lines = paragraph.split('\n');
        const listItems = lines.filter(line => line.trim().startsWith('- ') || line.trim().startsWith('* '));
        const beforeList = lines.filter(line => !line.trim().startsWith('- ') && !line.trim().startsWith('* ')).join('\n');
        
        return (
          <div key={index} className="my-4">
            {beforeList && <p className="text-gray-700 leading-relaxed mb-3">{beforeList}</p>}
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              {listItems.map((item, i) => (
                <li key={i} className="leading-relaxed">
                  {item.replace(/^[*-] /, '')}
                </li>
              ))}
            </ul>
          </div>
        );
      }
      
      // Regular paragraphs
      return (
        <p key={index} className="text-gray-700 leading-relaxed mb-6 text-lg">
          {paragraph}
        </p>
      );
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="bg-gray-50 px-8 py-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <h1 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
                {article ? article.title : 'Loading Article...'}
              </h1>
              {article && (
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <User className="h-4 w-4" />
                    <span>{article.author}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(article.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FileText className="h-4 w-4" />
                    <span>{article.content_type}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Hash className="h-4 w-4" />
                    <span>{getWordCount(article.content_body)} words</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    <span>{calculateReadingTime(article.content_body)}</span>
                  </div>
                  {article.seo_data?.seo_score && (
                    <div className="flex items-center gap-1.5">
                      <BarChart3 className="h-4 w-4" />
                      <span className={`font-medium ${
                        article.seo_data.seo_score >= 80 ? 'text-green-600' :
                        article.seo_data.seo_score >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        SEO: {article.seo_data.seo_score}%
                      </span>
                    </div>
                  )}
                </div>
              )}
              {article && (
                <div className="mt-3 flex items-center gap-3">
                  <div className={getStatusBadge(article.status)}>
                    {formatStatus(article.status)}
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors flex-shrink-0"
              aria-label="Close article viewer"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-8 py-8">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading article content...</span>
              </div>
            ) : article ? (
              <article className="prose prose-lg max-w-none">
                <div className="content-body text-justify">
                  {renderContent(article.content_body)}
                </div>
              </article>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Article Not Found</h3>
                <p className="text-gray-600">The requested article could not be loaded.</p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {article && (
                <span>
                  Article ID: {article.id} • 
                  {getWordCount(article.content_body)} words • 
                  {calculateReadingTime(article.content_body)}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleViewModal;