import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  title: string;
  category_id: string;
  sell_price: number | null;
  rent_price_per_day: number | null;
  condition: string;
  seller_id: string;
  views_count: number;
  created_at: string;
}

interface UserInteraction {
  user_id: string;
  product_id: string;
  interaction_type: 'view' | 'favorite' | 'purchase' | 'message';
  interaction_count?: number;
  last_interaction?: string;
}

interface RecommendationScore {
  product_id: string;
  score: number;
  reason: string;
}

class RecommendationService {
  private static instance: RecommendationService;
  
  private constructor() {}
  
  static getInstance(): RecommendationService {
    if (!RecommendationService.instance) {
      RecommendationService.instance = new RecommendationService();
    }
    return RecommendationService.instance;
  }
  
  /**
   * Get personalized recommendations for a user
   */
  async getPersonalizedRecommendations(
    userId: string,
    limit: number = 10
  ): Promise<Product[]> {
    try {
      // Get user's interactions
      const userInteractions = await this.getUserInteractions(userId);
      
      // Get user's preferences based on their activity
      const preferences = await this.analyzeUserPreferences(userId, userInteractions);
      
      // Generate recommendation scores
      const scores = await this.generateRecommendationScores(
        userId,
        preferences,
        userInteractions
      );
      
      // Get top products based on scores
      const productIds = scores
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(s => s.product_id);
      
      // Fetch product details
      const { data: products, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (name),
          profiles (full_name, room_number),
          product_images (image_url, is_primary)
        `)
        .in('id', productIds)
        .eq('status', 'available');
      
      if (error) throw error;
      
      // Sort products according to recommendation scores
      return this.sortProductsByRecommendationScore(products || [], scores);
    } catch (error) {
      console.error('Error getting personalized recommendations:', error);
      return [];
    }
  }
  
  /**
   * Get similar products based on content-based filtering
   */
  async getSimilarProducts(
    productId: string,
    limit: number = 6
  ): Promise<Product[]> {
    try {
      // Get the reference product
      const { data: referenceProduct, error: refError } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();
      
      if (refError || !referenceProduct) throw refError;
      
      // Find similar products based on multiple criteria
      const { data: similarProducts, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (name),
          profiles (full_name, room_number),
          product_images (image_url, is_primary)
        `)
        .neq('id', productId)
        .eq('status', 'available')
        .eq('category_id', referenceProduct.category_id)
        .limit(limit * 2); // Get more to filter later
      
      if (error) throw error;
      
      // Score and rank similar products
      const scoredProducts = this.scoreSimilarProducts(
        referenceProduct,
        similarProducts || []
      );
      
      // Return top similar products
      return scoredProducts.slice(0, limit);
    } catch (error) {
      console.error('Error getting similar products:', error);
      return [];
    }
  }
  
  /**
   * Get products that users also viewed
   */
  async getUsersAlsoViewed(
    productId: string,
    currentUserId: string,
    limit: number = 6
  ): Promise<Product[]> {
    try {
      // Get users who viewed this product
      const { data: viewers, error: viewersError } = await supabase
        .from('viewed_products')
        .select('user_id')
        .eq('product_id', productId)
        .neq('user_id', currentUserId)
        .limit(50);
      
      if (viewersError || !viewers?.length) return [];
      
      const viewerIds = viewers.map(v => v.user_id);
      
      // Get other products viewed by these users
      const { data: alsoViewed, error } = await supabase
        .from('viewed_products')
        .select('product_id, count')
        .in('user_id', viewerIds)
        .neq('product_id', productId)
        .order('count', { ascending: false })
        .limit(limit * 2);
      
      if (error || !alsoViewed?.length) return [];
      
      const productIds = alsoViewed.map(v => v.product_id);
      
      // Fetch product details
      const { data: products } = await supabase
        .from('products')
        .select(`
          *,
          categories (name),
          profiles (full_name, room_number),
          product_images (image_url, is_primary)
        `)
        .in('id', productIds)
        .eq('status', 'available')
        .limit(limit);
      
      return products || [];
    } catch (error) {
      console.error('Error getting users also viewed:', error);
      return [];
    }
  }
  
  /**
   * Track user interactions for recommendations
   */
  async trackInteraction(
    userId: string,
    productId: string,
    interactionType: 'view' | 'favorite' | 'purchase' | 'message'
  ): Promise<void> {
    try {
      const weight = this.getInteractionWeight(interactionType);
      
      // Store interaction in the database
      await supabase.from('user_interactions').insert({
        user_id: userId,
        product_id: productId,
        interaction_type: interactionType,
        weight: weight,
      });
    } catch (error) {
      console.error('Error tracking interaction:', error);
    }
  }
  
  /**
   * Get trending products based on recent activity
   */
  async getTrendingProducts(limit: number = 10): Promise<Product[]> {
    try {
      // Calculate trending score based on views, favorites, and recency
      const { data: products, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (name),
          profiles (full_name, room_number),
          product_images (image_url, is_primary),
          favorites (count),
          viewed_products (count)
        `)
        .eq('status', 'available')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) // Last 7 days
        .order('views_count', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      
      return products || [];
    } catch (error) {
      console.error('Error getting trending products:', error);
      return [];
    }
  }
  
  /**
   * Private helper methods
   */
  private async getUserInteractions(userId: string): Promise<UserInteraction[]> {
    try {
      const { data, error } = await supabase
        .from('user_interactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user interactions:', error);
      return [];
    }
  }
  
  private async analyzeUserPreferences(
    userId: string,
    interactions: UserInteraction[]
  ) {
    const preferences = {
      categories: new Map<string, number>(),
      priceRange: { min: 0, max: 0 },
      conditions: new Map<string, number>(),
      sellers: new Map<string, number>(),
    };
    
    // Analyze interactions to build preference profile
    for (const interaction of interactions) {
      const weight = this.getInteractionWeight(interaction.interaction_type);
      
      // Get product details
      const { data: product } = await supabase
        .from('products')
        .select('category_id, sell_price, condition, seller_id')
        .eq('id', interaction.product_id)
        .single();
      
      if (product) {
        // Update category preferences
        const currentCategoryScore = preferences.categories.get(product.category_id) || 0;
        preferences.categories.set(product.category_id, currentCategoryScore + weight);
        
        // Update condition preferences
        const currentConditionScore = preferences.conditions.get(product.condition) || 0;
        preferences.conditions.set(product.condition, currentConditionScore + weight);
        
        // Update price range
        if (product.sell_price) {
          preferences.priceRange.max = Math.max(preferences.priceRange.max, product.sell_price);
          preferences.priceRange.min = preferences.priceRange.min === 0 
            ? product.sell_price 
            : Math.min(preferences.priceRange.min, product.sell_price);
        }
      }
    }
    
    return preferences;
  }
  
  private async generateRecommendationScores(
    userId: string,
    preferences: any,
    userInteractions: UserInteraction[]
  ): Promise<RecommendationScore[]> {
    const scores: RecommendationScore[] = [];
    
    // Get candidate products
    const { data: products } = await supabase
      .from('products')
      .select('id, category_id, sell_price, condition, seller_id, views_count, created_at')
      .eq('status', 'available')
      .limit(200);
    
    if (!products) return scores;
    
    // Calculate scores for each product
    for (const product of products) {
      // Skip if user already interacted with this product
      if (userInteractions.some(i => i.product_id === product.id)) {
        continue;
      }
      
      let score = 0;
      let reasons: string[] = [];
      
      // Category match score
      const categoryScore = preferences.categories.get(product.category_id) || 0;
      if (categoryScore > 0) {
        score += categoryScore * 0.4;
        reasons.push('matches_category_preference');
      }
      
      // Condition match score
      const conditionScore = preferences.conditions.get(product.condition) || 0;
      if (conditionScore > 0) {
        score += conditionScore * 0.2;
        reasons.push('matches_condition_preference');
      }
      
      // Price range match score
      if (product.sell_price && 
          product.sell_price >= preferences.priceRange.min * 0.8 &&
          product.sell_price <= preferences.priceRange.max * 1.2) {
        score += 0.2;
        reasons.push('within_price_range');
      }
      
      // Popularity score
      if (product.views_count > 50) {
        score += 0.1;
        reasons.push('popular_item');
      }
      
      // Recency score
      const daysOld = (Date.now() - new Date(product.created_at).getTime()) / (1000 * 60 * 60 * 24);
      if (daysOld < 7) {
        score += 0.1;
        reasons.push('recently_listed');
      }
      
      if (score > 0) {
        scores.push({
          product_id: product.id,
          score: score,
          reason: reasons.join(','),
        });
      }
    }
    
    return scores;
  }
  
  private scoreSimilarProducts(reference: any, candidates: any[]): any[] {
    return candidates
      .map(product => {
        let score = 0;
        
        // Same category (already filtered, but for scoring)
        score += 0.3;
        
        // Similar price range
        if (reference.sell_price && product.sell_price) {
          const priceDiff = Math.abs(reference.sell_price - product.sell_price);
          const priceRatio = priceDiff / reference.sell_price;
          if (priceRatio < 0.2) score += 0.3;
          else if (priceRatio < 0.5) score += 0.2;
          else if (priceRatio < 1) score += 0.1;
        }
        
        // Same condition
        if (reference.condition === product.condition) {
          score += 0.2;
        }
        
        // Popularity
        if (product.views_count > 10) {
          score += 0.1;
        }
        
        // Different seller (to provide variety)
        if (reference.seller_id !== product.seller_id) {
          score += 0.1;
        }
        
        return { ...product, similarity_score: score };
      })
      .sort((a, b) => b.similarity_score - a.similarity_score);
  }
  
  private sortProductsByRecommendationScore(
    products: any[],
    scores: RecommendationScore[]
  ): any[] {
    const scoreMap = new Map(scores.map(s => [s.product_id, s.score]));
    return products.sort((a, b) => {
      const scoreA = scoreMap.get(a.id) || 0;
      const scoreB = scoreMap.get(b.id) || 0;
      return scoreB - scoreA;
    });
  }
  
  private getInteractionWeight(interactionType: string): number {
    const weights = {
      view: 1,
      favorite: 3,
      message: 4,
      purchase: 5,
    };
    return weights[interactionType] || 1;
  }
}

export default RecommendationService.getInstance();
