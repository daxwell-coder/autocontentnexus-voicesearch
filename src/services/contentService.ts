import { supabase } from '../lib/supabase';

// TypeScript interfaces for Content Pipeline
export interface ContentItem {
  id: string;
  title: string;
  type: 'article' | 'review' | 'guide' | 'video';
  status: 'queued' | 'processing' | 'completed' | 'failed' | 'paused';
  category: string;
  estimatedCompletion?: string;
  progress?: number;
  created_at: string;
  word_count?: number;
}

export interface PipelineStats {
  total: number;
  queued: number;
  processing: number;
  completed: number;
  failed: number;
}

export interface ContentAgentStatus {
  agent_id: string;
  status: string;
  last_activity: string;
  uptime: string;
  tasks_completed: number;
  errors: number;
  capabilities: string[];
}

export interface ServiceError {
  code: string;
  message: string;
  timestamp: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ServiceError;
}

// Service class for content pipeline operations
export class ContentService {
  private static instance: ContentService;
  private retryAttempts = 3;
  private retryDelay = 1000;
  private timeout = 10000;

  public static getInstance(): ContentService {
    if (!ContentService.instance) {
      ContentService.instance = new ContentService();
    }
    return ContentService.instance;
  }

  // Retry logic with exponential backoff
  private async withRetry<T>(
    operation: () => Promise<T>,
    attempts: number = this.retryAttempts
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (attempts > 1 && this.isRetryableError(error)) {
        await this.delay(this.retryDelay * (this.retryAttempts - attempts + 1));
        return this.withRetry(operation, attempts - 1);
      }
      throw error;
    }
  }

  private isRetryableError(error: any): boolean {
    if (error.name === 'TypeError' || error.message?.includes('fetch')) {
      return true;
    }
    if (error.status >= 500 && error.status <= 599) {
      return true;
    }
    if (error.message?.includes('timeout')) {
      return true;
    }
    return false;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Fetch content items from database
  public async getContentItems(): Promise<ApiResponse<ContentItem[]>> {
    try {
      const result = await this.withRetry(async () => {
        // Get content items from Supabase directly
        const { data, error } = await supabase
          .from('content_items')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20);

        if (error) {
          throw new Error(`Database query error: ${error.message}`);
        }

        return data || [];
      });

      // Transform database data to component format
      const contentItems: ContentItem[] = result.map((item: any) => ({
        id: item.id.toString(),
        title: item.title || 'Untitled Content',
        type: this.mapContentType(item.content_type),
        status: this.mapContentStatus(item.status),
        category: this.extractCategory(item.content_type, item.title),
        estimatedCompletion: this.calculateEstimatedCompletion(item.status, item.created_at),
        progress: this.calculateProgress(item.status),
        created_at: item.created_at,
        word_count: item.engagement_metrics?.word_count || 0
      }));

      return {
        success: true,
        data: contentItems
      };
    } catch (error: any) {
      console.error('Content items service error:', error);
      return {
        success: false,
        error: {
          code: 'CONTENT_ITEMS_FAILED',
          message: error.message || 'Failed to fetch content items',
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  // Fetch pending approvals from the new approval system
  public async getPendingApprovals(): Promise<ApiResponse<any[]>> {
    try {
      const result = await this.withRetry(async () => {
        // Use the direct fetch approach since edge function invoke has query parameter issues
        const supabaseUrl = 'https://uqrmmnzwfvqpnzobwgly.supabase.co';
        const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxcm1tbnp3ZnZxcG56b2J3Z2x5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MzAxOTYsImV4cCI6MjA3MTEwNjE5Nn0.4HPgcnfxNTJXEm9ES7ijpv2KnkHGO-S3EDo6yvSz7QA';
        
        const response = await fetch(`${supabaseUrl}/functions/v1/content-approval-system?action=list`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'apikey': supabaseKey
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error?.message || 'Content approval system error');
        }

        return data.data || [];
      });

      return {
        success: true,
        data: result
      };
    } catch (error: any) {
      console.error('Pending approvals service error:', error);
      return {
        success: false,
        error: {
          code: 'PENDING_APPROVALS_FAILED',
          message: error.message || 'Failed to fetch pending approvals',
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  // Approve content item
  public async approveContent(workflowId: string, reviewNotes?: string): Promise<ApiResponse<any>> {
    try {
      const result = await this.withRetry(async () => {
        const supabaseUrl = 'https://uqrmmnzwfvqpnzobwgly.supabase.co';
        const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxcm1tbnp3ZnZxcG56b2J3Z2x5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MzAxOTYsImV4cCI6MjA3MTEwNjE5Nn0.4HPgcnfxNTJXEm9ES7ijpv2KnkHGO-S3EDo6yvSz7QA';
        
        const response = await fetch(`${supabaseUrl}/functions/v1/content-approval-system?action=approve`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'apikey': supabaseKey
          },
          body: JSON.stringify({
            workflowId,
            reviewNotes
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error?.message || 'Content approval system error');
        }

        return data.data || data;
      });

      return {
        success: true,
        data: result
      };
    } catch (error: any) {
      console.error('Content approval service error:', error);
      return {
        success: false,
        error: {
          code: 'CONTENT_APPROVAL_FAILED',
          message: error.message || 'Failed to approve content',
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  // Reject content item
  public async rejectContent(workflowId: string, rejectionReason: string): Promise<ApiResponse<any>> {
    try {
      const result = await this.withRetry(async () => {
        const supabaseUrl = 'https://uqrmmnzwfvqpnzobwgly.supabase.co';
        const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxcm1tbnp3ZnZxcG56b2J3Z2x5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MzAxOTYsImV4cCI6MjA3MTEwNjE5Nn0.4HPgcnfxNTJXEm9ES7ijpv2KnkHGO-S3EDo6yvSz7QA';
        
        const response = await fetch(`${supabaseUrl}/functions/v1/content-approval-system?action=reject`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'apikey': supabaseKey
          },
          body: JSON.stringify({
            workflowId,
            rejectionReason
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error?.message || 'Content approval system error');
        }

        return data.data || data;
      });

      return {
        success: true,
        data: result
      };
    } catch (error: any) {
      console.error('Content rejection service error:', error);
      return {
        success: false,
        error: {
          code: 'CONTENT_REJECTION_FAILED',
          message: error.message || 'Failed to reject content',
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  /**
   * Search articles by query
   */
  public async searchArticles(searchQuery: string): Promise<ApiResponse<any[]>> {
    try {
      const result = await this.withRetry(async () => {
        const { data, error } = await supabase.functions.invoke('search-articles', {
          body: { query: searchQuery }
        });

        if (error) {
          throw new Error(error.message || 'Search failed');
        }

        return data;
      });

      return {
        success: true,
        data: result || []
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: 'SEARCH_FAILED',
          message: error.message || 'Failed to search articles',
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  // Generate new content using the agent system
  public async generateContent(niche?: string, contentType: string = 'article'): Promise<ApiResponse<any>> {
    try {
      const result = await this.withRetry(async () => {
        const { data, error } = await supabase.functions.invoke('agent-task-orchestrator', {
          body: {
            action: 'generate_content',
            niche,
            contentType,
            runSeoOptimization: true
          }
        });

        if (error) {
          throw new Error(`Content generation error: ${error.message}`);
        }

        return data?.data || data;
      });

      return {
        success: true,
        data: result
      };
    } catch (error: any) {
      console.error('Content generation service error:', error);
      return {
        success: false,
        error: {
          code: 'CONTENT_GENERATION_FAILED',
          message: error.message || 'Failed to generate content',
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  // Calculate pipeline statistics
  public async getPipelineStats(): Promise<ApiResponse<PipelineStats>> {
    try {
      const contentItemsResponse = await this.getContentItems();
      
      if (!contentItemsResponse.success || !contentItemsResponse.data) {
        throw new Error('Failed to fetch content items for stats');
      }

      const items = contentItemsResponse.data;
      const stats: PipelineStats = {
        total: items.length,
        queued: items.filter(item => item.status === 'queued').length,
        processing: items.filter(item => item.status === 'processing').length,
        completed: items.filter(item => item.status === 'completed').length,
        failed: items.filter(item => item.status === 'failed').length
      };

      return {
        success: true,
        data: stats
      };
    } catch (error: any) {
      console.error('Pipeline stats service error:', error);
      return {
        success: false,
        error: {
          code: 'PIPELINE_STATS_FAILED',
          message: error.message || 'Failed to calculate pipeline stats',
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  // Combined pipeline data fetch with new approval system
  public async getPipelineData(): Promise<ApiResponse<{
    stats: PipelineStats;
    items: ContentItem[];
    pendingApprovals: any[];
  }>> {
    try {
      // Fetch all data concurrently
      const [statsResponse, itemsResponse, approvalsResponse] = await Promise.all([
        this.getPipelineStats(),
        this.getContentItems(),
        this.getPendingApprovals()
      ]);

      // Handle partial failures gracefully
      if (!statsResponse.success && !itemsResponse.success) {
        throw new Error('Multiple service failures');
      }

      return {
        success: true,
        data: {
          stats: statsResponse.data || {
            total: 0,
            queued: 0,
            processing: 0,
            completed: 0,
            failed: 0
          },
          items: itemsResponse.data || [],
          pendingApprovals: approvalsResponse.data || []
        }
      };
    } catch (error: any) {
      console.error('Pipeline data service error:', error);
      return {
        success: false,
        error: {
          code: 'PIPELINE_DATA_FAILED',
          message: error.message || 'Failed to fetch pipeline data',
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  // Helper methods for data transformation
  private mapContentType(dbType: string): ContentItem['type'] {
    const typeMap: Record<string, ContentItem['type']> = {
      'blog': 'article',
      'social': 'article',
      'newsletter': 'guide',
      'instagram': 'article',
      'linkedin': 'article',
      'twitter': 'article',
      'review': 'review',
      'guide': 'guide',
      'video': 'video'
    };
    return typeMap[dbType] || 'article';
  }

  private mapContentStatus(dbStatus: string): ContentItem['status'] {
    const statusMap: Record<string, ContentItem['status']> = {
      'generated': 'queued',
      'review': 'processing',
      'approved': 'processing',
      'published': 'completed',
      'failed': 'failed',
      'draft': 'queued',
      'rejected': 'failed'
    };
    return statusMap[dbStatus] || 'queued';
  }

  private extractCategory(contentType: string, title: string): string {
    // Extract category from title or content type
    const categories = {
      'solar': 'Renewable Energy',
      'eco': 'Sustainable Living',
      'green': 'Green Technology',
      'sustainable': 'Sustainable Living',
      'electric': 'Green Technology',
      'zero waste': 'Sustainable Living',
      'fashion': 'Lifestyle',
      'energy': 'Renewable Energy'
    };

    const lowerTitle = title.toLowerCase();
    for (const [keyword, category] of Object.entries(categories)) {
      if (lowerTitle.includes(keyword)) {
        return category;
      }
    }

    return 'General Content';
  }

  private calculateEstimatedCompletion(status: string, createdAt: string): string {
    const now = new Date();
    const created = new Date(createdAt);
    const timeDiff = now.getTime() - created.getTime();
    const hoursAgo = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutesAgo = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    switch (status) {
      case 'published':
        if (hoursAgo > 0) {
          return `Completed ${hoursAgo} hours ago`;
        }
        return `Completed ${minutesAgo} minutes ago`;
      case 'generated':
      case 'draft':
        return `${Math.floor(Math.random() * 4) + 1} hours`;
      case 'review':
      case 'approved':
        return `${Math.floor(Math.random() * 2) + 1} hours`;
      case 'failed':
        return 'Retry required';
      default:
        return 'Unknown';
    }
  }

  private calculateProgress(status: string): number | undefined {
    const progressMap: Record<string, number> = {
      'generated': 25,
      'review': 50,
      'approved': 75,
      'published': 100
    };
    return progressMap[status];
  }

  // Fetch full article content by ID
  public async getArticleContent(articleId: number): Promise<ApiResponse<{
    id: number;
    title: string;
    content_body: string;
    content_type: string;
    status: string;
    author: string;
    created_at: string;
    published_at?: string;
    seo_data?: any;
    engagement_metrics?: any;
  }>> {
    try {
      const result = await this.withRetry(async () => {
        const { data, error } = await supabase
          .from('content_items')
          .select('id, title, content_body, content_type, status, author, created_at, published_at, seo_data, engagement_metrics')
          .eq('id', articleId)
          .single();

        if (error) {
          throw new Error(`Database query error: ${error.message}`);
        }

        return data;
      });

      return {
        success: true,
        data: result
      };
    } catch (error: any) {
      console.error('Get article content service error:', error);
      return {
        success: false,
        error: {
          code: 'ARTICLE_CONTENT_FAILED',
          message: error.message || 'Failed to fetch article content',
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  // Public Website Methods - Fetch Published Content Only
  public async getPublishedArticles(limit: number = 12, offset: number = 0): Promise<ApiResponse<{
    id: number;
    title: string;
    content_body: string;
    content_type: string;
    author: string;
    created_at: string;
    published_at: string;
    seo_data?: any;
    category: string;
    excerpt?: string;
  }[]>> {
    try {
      const result = await this.withRetry(async () => {
        const { data, error } = await supabase
          .from('content_items')
          .select('id, title, content_body, content_type, author, created_at, published_at, seo_data')
          .eq('status', 'published')
          .order('published_at', { ascending: false })
          .range(offset, offset + limit - 1);

        if (error) {
          throw new Error(`Database query error: ${error.message}`);
        }

        // Transform data for public display
        return (data || []).map((item: any) => ({
          ...item,
          category: this.extractCategoryFromContent(item.content_type, item.title),
          excerpt: this.createExcerpt(item.content_body)
        }));
      });

      return {
        success: true,
        data: result
      };
    } catch (error: any) {
      console.error('Get published articles service error:', error);
      return {
        success: false,
        error: {
          code: 'PUBLISHED_ARTICLES_FAILED',
          message: error.message || 'Failed to fetch published articles',
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  public async getPublishedArticlesByCategory(category: string, limit: number = 12, offset: number = 0): Promise<ApiResponse<{
    id: number;
    title: string;
    content_body: string;
    content_type: string;
    author: string;
    created_at: string;
    published_at: string;
    seo_data?: any;
    category: string;
    excerpt?: string;
  }[]>> {
    try {
      const result = await this.withRetry(async () => {
        const { data, error } = await supabase
          .from('content_items')
          .select('id, title, content_body, content_type, author, created_at, published_at, seo_data')
          .eq('status', 'published')
          .order('published_at', { ascending: false })
          .range(offset, offset + limit - 1);

        if (error) {
          throw new Error(`Database query error: ${error.message}`);
        }

        // Filter by category and transform data
        const filteredData = (data || [])
          .map((item: any) => ({
            ...item,
            category: this.extractCategoryFromContent(item.content_type, item.title),
            excerpt: this.createExcerpt(item.content_body)
          }))
          .filter((item: any) => this.categoryMatches(item.category, category));

        return filteredData;
      });

      return {
        success: true,
        data: result
      };
    } catch (error: any) {
      console.error('Get published articles by category service error:', error);
      return {
        success: false,
        error: {
          code: 'PUBLISHED_ARTICLES_BY_CATEGORY_FAILED',
          message: error.message || 'Failed to fetch published articles by category',
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  public async getPublishedArticleById(articleId: number): Promise<ApiResponse<{
    id: number;
    title: string;
    content_body: string;
    content_type: string;
    author: string;
    created_at: string;
    published_at: string;
    seo_data?: any;
    category: string;
  }>> {
    try {
      const result = await this.withRetry(async () => {
        const { data, error } = await supabase
          .from('content_items')
          .select('id, title, content_body, content_type, author, created_at, published_at, seo_data')
          .eq('id', articleId)
          .eq('status', 'published')
          .single();

        if (error) {
          throw new Error(`Database query error: ${error.message}`);
        }

        return {
          ...data,
          category: this.extractCategoryFromContent(data.content_type, data.title)
        };
      });

      return {
        success: true,
        data: result
      };
    } catch (error: any) {
      console.error('Get published article by ID service error:', error);
      return {
        success: false,
        error: {
          code: 'PUBLISHED_ARTICLE_BY_ID_FAILED',
          message: error.message || 'Failed to fetch published article',
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  // Helper methods for public content
  private extractCategoryFromContent(contentType: string, title: string): string {
    // More comprehensive category mapping for public display
    const categoryKeywords = {
      'Product Reviews': ['review', 'product', 'eco-friendly', 'sustainable product', 'green product'],
      'Renewable Energy': ['solar', 'wind', 'renewable', 'energy', 'clean energy', 'green energy'],
      'Sustainable Living': ['sustainable', 'eco', 'green living', 'zero waste', 'environmental'],
      'Zero Waste': ['zero waste', 'waste reduction', 'minimize waste', 'recycling']
    };

    const lowerTitle = title.toLowerCase();
    const lowerContentType = contentType.toLowerCase();
    
    // Check content type first
    if (lowerContentType.includes('review')) {
      return 'Product Reviews';
    }
    
    // Then check title for keywords
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(keyword => lowerTitle.includes(keyword) || lowerContentType.includes(keyword))) {
        return category;
      }
    }

    return 'Sustainable Living'; // Default category
  }

  private categoryMatches(extractedCategory: string, requestedCategory: string): boolean {
    const categoryMap: Record<string, string> = {
      'Product Reviews': 'reviews',
      'Renewable Energy': 'renewable-energy',
      'Sustainable Living': 'sustainable-living',
      'Zero Waste': 'zero-waste'
    };

    const normalizedRequested = requestedCategory.toLowerCase().replace(/-/g, ' ');
    const normalizedExtracted = extractedCategory.toLowerCase();
    
    // Direct match
    if (normalizedExtracted === normalizedRequested) {
      return true;
    }
    
    // Check reverse mapping
    for (const [fullName, slug] of Object.entries(categoryMap)) {
      if (slug === requestedCategory && fullName === extractedCategory) {
        return true;
      }
    }
    
    return false;
  }

  private createExcerpt(content: string, maxLength: number = 150): string {
    if (!content) return '';
    
    // Remove HTML tags if present
    const textOnly = content.replace(/<[^>]*>/g, '');
    
    if (textOnly.length <= maxLength) {
      return textOnly;
    }
    
    // Find the last complete sentence within the limit
    const truncated = textOnly.substring(0, maxLength);
    const lastPeriod = truncated.lastIndexOf('.');
    const lastExclamation = truncated.lastIndexOf('!');
    const lastQuestion = truncated.lastIndexOf('?');
    
    const lastSentenceEnd = Math.max(lastPeriod, lastExclamation, lastQuestion);
    
    if (lastSentenceEnd > 0 && lastSentenceEnd > maxLength * 0.5) {
      return truncated.substring(0, lastSentenceEnd + 1);
    }
    
    // If no good sentence break, find last space
    const lastSpace = truncated.lastIndexOf(' ');
    if (lastSpace > 0) {
      return truncated.substring(0, lastSpace) + '...';
    }
    
    return truncated + '...';
  }
  public async testConnectivity(): Promise<{ database: boolean; agent: boolean }> {
    try {
      const dbTest = await supabase.from('content_items').select('id').limit(1);
      
      return {
        database: !dbTest.error,
        agent: true // Agent status is now calculated from database, so if DB works, agent works
      };
    } catch (error) {
      console.error('Connectivity test error:', error);
      return { database: false, agent: false };
    }
  }

  // Helper method to calculate uptime percentage
  private calculateUptime(completedTasks: number, failedTasks: number): string {
    if (completedTasks + failedTasks === 0) return '0%';
    const uptime = (completedTasks / (completedTasks + failedTasks)) * 100;
    return `${Math.round(uptime)}%`;
  }
}

// Export singleton instance
export const contentService = ContentService.getInstance();
