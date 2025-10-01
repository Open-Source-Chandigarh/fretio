// Notification Service - Multi-channel notification system
import { supabase } from '@/integrations/supabase/client';

export type NotificationType = 'message' | 'product' | 'review' | 'system' | 'promotion' | 'order';
export type NotificationChannel = 'in-app' | 'email' | 'push';
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface NotificationPayload {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  priority?: NotificationPriority;
  channels?: NotificationChannel[];
  metadata?: Record<string, any>;
  actionUrl?: string;
  imageUrl?: string;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  inApp: boolean;
  messageNotifications: boolean;
  productNotifications: boolean;
  reviewNotifications: boolean;
  systemNotifications: boolean;
  promotionNotifications: boolean;
  orderNotifications: boolean;
}

class NotificationService {
  private static instance: NotificationService;

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Send a notification to a user
   */
  async send(payload: NotificationPayload): Promise<{ success: boolean; error?: string }> {
    try {
      // Check user's notification preferences
      const preferences = await this.getUserPreferences(payload.userId);
      
      if (!preferences) {
        return { success: false, error: 'User preferences not found' };
      }

      // Check if user wants this type of notification
      if (!this.shouldSendNotification(payload.type, preferences)) {
        console.log(`User ${payload.userId} has disabled ${payload.type} notifications`);
        return { success: true }; // Not an error, just respecting preferences
      }

      const channels = payload.channels || ['in-app'];
      const priority = payload.priority || 'medium';

      // Always create in-app notification if included
      if (channels.includes('in-app') && preferences.inApp) {
        await this.sendInAppNotification(payload);
      }

      // Send email if requested and enabled
      if (channels.includes('email') && preferences.email) {
        await this.sendEmailNotification(payload);
      }

      // Send push if requested and enabled
      if (channels.includes('push') && preferences.push) {
        await this.sendPushNotification(payload);
      }

      return { success: true };
    } catch (error) {
      console.error('Error sending notification:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Send in-app notification
   */
  private async sendInAppNotification(payload: NotificationPayload): Promise<void> {
    const { error } = await supabase.from('notifications').insert({
      user_id: payload.userId,
      type: payload.type,
      title: payload.title,
      message: payload.message,
      priority: payload.priority || 'medium',
      metadata: payload.metadata || {},
      action_url: payload.actionUrl,
      image_url: payload.imageUrl,
      is_read: false,
    });

    if (error) {
      console.error('Error creating in-app notification:', error);
      throw error;
    }
  }

  /**
   * Send email notification (integration point for email service)
   */
  private async sendEmailNotification(payload: NotificationPayload): Promise<void> {
    // TODO: Integrate with email service (SendGrid, AWS SES, etc.)
    console.log('📧 Email notification queued:', {
      to: payload.userId,
      subject: payload.title,
      body: payload.message,
    });

    // For now, log the email. In production, integrate with actual email service
    // Example:
    // await emailService.send({
    //   to: user.email,
    //   subject: payload.title,
    //   html: payload.message,
    //   templateId: 'notification-template'
    // });
  }

  /**
   * Send push notification (integration point for push service)
   */
  private async sendPushNotification(payload: NotificationPayload): Promise<void> {
    // TODO: Integrate with push notification service (Firebase, OneSignal, etc.)
    console.log('🔔 Push notification queued:', {
      to: payload.userId,
      title: payload.title,
      body: payload.message,
    });

    // Example Firebase integration:
    // const messaging = getMessaging();
    // await messaging.send({
    //   notification: {
    //     title: payload.title,
    //     body: payload.message
    //   },
    //   token: userDeviceToken
    // });
  }

  /**
   * Get user's notification preferences
   */
  async getUserPreferences(userId: string): Promise<NotificationPreferences | null> {
    const { data, error } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching notification preferences:', error);
      // Return default preferences if not found
      if (error.code === 'PGRST116') {
        return this.getDefaultPreferences();
      }
      return null;
    }

    return data as NotificationPreferences;
  }

  /**
   * Update user's notification preferences
   */
  async updatePreferences(
    userId: string,
    preferences: Partial<NotificationPreferences>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: userId,
          ...preferences,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Check if notification should be sent based on user preferences
   */
  private shouldSendNotification(type: NotificationType, preferences: NotificationPreferences): boolean {
    switch (type) {
      case 'message':
        return preferences.messageNotifications;
      case 'product':
        return preferences.productNotifications;
      case 'review':
        return preferences.reviewNotifications;
      case 'system':
        return preferences.systemNotifications;
      case 'promotion':
        return preferences.promotionNotifications;
      case 'order':
        return preferences.orderNotifications;
      default:
        return true;
    }
  }

  /**
   * Get default notification preferences
   */
  private getDefaultPreferences(): NotificationPreferences {
    return {
      email: true,
      push: false,
      inApp: true,
      messageNotifications: true,
      productNotifications: true,
      reviewNotifications: true,
      systemNotifications: true,
      promotionNotifications: true,
      orderNotifications: true,
    };
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', notificationId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Delete a notification
   */
  async delete(notificationId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.from('notifications').delete().eq('id', notificationId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting notification:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Get unread notification count for a user
   */
  async getUnreadCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }

    return count || 0;
  }

  /**
   * Batch send notifications to multiple users
   */
  async sendBatch(payloads: NotificationPayload[]): Promise<{ success: boolean; errors: string[] }> {
    const errors: string[] = [];

    for (const payload of payloads) {
      const result = await this.send(payload);
      if (!result.success && result.error) {
        errors.push(result.error);
      }
    }

    return {
      success: errors.length === 0,
      errors,
    };
  }
}

export const notificationService = NotificationService.getInstance();
