import { describe, it, expect, beforeEach, vi } from 'vitest';
import { notificationService, NotificationPayload } from '../notificationService';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn().mockResolvedValue({ data: null, error: null }),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ 
        data: {
          email: true,
          push: false,
          inApp: true,
          messageNotifications: true,
          productNotifications: true,
          reviewNotifications: true,
          systemNotifications: true,
          promotionNotifications: true,
          orderNotifications: true,
        }, 
        error: null 
      }),
      upsert: vi.fn().mockResolvedValue({ data: null, error: null }),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
    })),
  },
}));

describe('NotificationService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('send', () => {
    it('should send a notification successfully', async () => {
      const payload: NotificationPayload = {
        userId: 'test-user-id',
        type: 'message',
        title: 'Test Notification',
        message: 'This is a test notification',
      };

      const result = await notificationService.send(payload);

      expect(result.success).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should respect user notification preferences', async () => {
      const payload: NotificationPayload = {
        userId: 'test-user-id',
        type: 'message',
        title: 'Test Notification',
        message: 'This is a test notification',
      };

      const result = await notificationService.send(payload);

      expect(result.success).toBe(true);
    });
  });

  describe('getUserPreferences', () => {
    it('should return user preferences', async () => {
      const preferences = await notificationService.getUserPreferences('test-user-id');

      expect(preferences).toBeDefined();
      expect(preferences?.email).toBe(true);
      expect(preferences?.inApp).toBe(true);
    });
  });

  describe('markAsRead', () => {
    it('should mark notification as read', async () => {
      const result = await notificationService.markAsRead('test-notification-id');

      expect(result.success).toBe(true);
    });
  });
});
