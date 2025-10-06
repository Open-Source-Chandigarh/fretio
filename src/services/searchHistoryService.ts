import { supabase } from "@/integrations/supabase/client";

interface SearchHistoryEntry {
  user_id: string;
  query: string;
  filters?: Record<string, any>;
  results_count?: number;
}

class SearchHistoryService {
  private static instance: SearchHistoryService;
  private debounceTimer: NodeJS.Timeout | null = null;
  
  private constructor() {}
  
  static getInstance(): SearchHistoryService {
    if (!SearchHistoryService.instance) {
      SearchHistoryService.instance = new SearchHistoryService();
    }
    return SearchHistoryService.instance;
  }
  
  /**
   * Add a search query to the history with debouncing
   */
  async addSearchQuery(entry: SearchHistoryEntry): Promise<void> {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    
    this.debounceTimer = setTimeout(async () => {
      try {
        // Check if the same query was made recently (within last hour)
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
        
        const { data: recentSearch } = await supabase
          .from("search_history")
          .select("id")
          .eq("user_id", entry.user_id)
          .eq("query", entry.query)
          .gte("created_at", oneHourAgo)
          .single();
        
        // If not found in recent searches, add it
        if (!recentSearch) {
          await supabase.from("search_history").insert({
            user_id: entry.user_id,
            query: entry.query,
            filters: entry.filters,
            results_count: entry.results_count,
          });
          
          // Clean up old search history (keep only last 50 entries per user)
          await this.cleanupOldSearchHistory(entry.user_id);
        }
      } catch (error) {
        console.error("Error adding search to history:", error);
      }
    }, 1000); // 1 second debounce
  }
  
  /**
   * Get user's search history
   */
  async getUserSearchHistory(userId: string, limit: number = 10): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from("search_history")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching search history:", error);
      return [];
    }
  }
  
  /**
   * Get popular searches across all users
   */
  async getPopularSearches(limit: number = 10): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from("search_history")
        .select("query, count")
        .order("count", { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching popular searches:", error);
      return [];
    }
  }
  
  /**
   * Delete a specific search from history
   */
  async deleteSearchHistoryItem(userId: string, searchId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("search_history")
        .delete()
        .eq("id", searchId)
        .eq("user_id", userId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error deleting search history item:", error);
      return false;
    }
  }
  
  /**
   * Clear all search history for a user
   */
  async clearUserSearchHistory(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("search_history")
        .delete()
        .eq("user_id", userId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error clearing search history:", error);
      return false;
    }
  }
  
  /**
   * Clean up old search history entries
   */
  private async cleanupOldSearchHistory(userId: string): Promise<void> {
    try {
      // Get all search history for the user
      const { data: allSearches } = await supabase
        .from("search_history")
        .select("id, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      
      if (allSearches && allSearches.length > 50) {
        // Keep only the most recent 50 entries
        const idsToDelete = allSearches.slice(50).map(search => search.id);
        
        await supabase
          .from("search_history")
          .delete()
          .in("id", idsToDelete);
      }
    } catch (error) {
      console.error("Error cleaning up search history:", error);
    }
  }
  
  /**
   * Get search suggestions based on partial query
   */
  async getSearchSuggestions(userId: string, partialQuery: string): Promise<string[]> {
    try {
      if (!partialQuery || partialQuery.length < 2) return [];
      
      const { data, error } = await supabase
        .from("search_history")
        .select("query")
        .eq("user_id", userId)
        .ilike("query", `${partialQuery}%`)
        .order("created_at", { ascending: false })
        .limit(5);
      
      if (error) throw error;
      
      // Remove duplicates and return unique queries
      const uniqueQueries = Array.from(new Set(data?.map(item => item.query) || []));
      return uniqueQueries;
    } catch (error) {
      console.error("Error fetching search suggestions:", error);
      return [];
    }
  }
}

export default SearchHistoryService.getInstance();
