/**
 * Notification Service for Team Join Requests
 * Handles creating notifications for users when their requests are accepted/rejected
 */
import { supabase } from '@/integrations/supabase/client';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  read: boolean;
  created_at: string;
}

class NotificationService {
  /**
   * Create a notification for a user
   */
  async createNotification(
    userId: string,
    title: string,
    message: string,
    type: 'success' | 'info' | 'warning' | 'error' = 'info'
  ): Promise<boolean> {
    try {
      console.log('📢 Creating notification:', { userId, title, type });

      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          title,
          message,
          type,
          read: false
        });

      if (error) {
        console.error('❌ Error creating notification:', error);
        return false;
      }

      console.log('✅ Notification created successfully');
      return true;
    } catch (error) {
      console.error('❌ Error in createNotification:', error);
      return false;
    }
  }

  /**
   * Create notification for accepted join request
   */
  async notifyJoinRequestAccepted(userId: string, teamName: string): Promise<boolean> {
    return await this.createNotification(
      userId,
      'Join Request Accepted! 🎉',
      `Your request to join "${teamName}" has been accepted. Welcome to the team!`,
      'success'
    );
  }

  /**
   * Create notification for rejected join request
   */
  async notifyJoinRequestRejected(userId: string, teamName: string): Promise<boolean> {
    return await this.createNotification(
      userId,
      'Join Request Update',
      `Your request to join "${teamName}" was not accepted this time. Keep exploring other teams!`,
      'info'
    );
  }

  /**
   * Create notification for new join request (for team owner)
   */
  async notifyNewJoinRequest(teamOwnerId: string, requesterName: string, teamName: string): Promise<boolean> {
    return await this.createNotification(
      teamOwnerId,
      'New Join Request 📨',
      `${requesterName} wants to join your team "${teamName}". Check your join requests to respond.`,
      'info'
    );
  }

  /**
   * Get notifications for a user
   */
  async getUserNotifications(userId: string, limit: number = 10): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('❌ Error fetching notifications:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('❌ Error in getUserNotifications:', error);
      return [];
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) {
        console.error('❌ Error marking notification as read:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('❌ Error in markAsRead:', error);
      return false;
    }
  }
}

// Export singleton instance
export const notificationService = new NotificationService();