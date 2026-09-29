/**
 * Mock implementation of Push Notifications.
 * In production, this would integrate with OneSignal or Firebase Cloud Messaging.
 */

export const sendPushNotification = async (userId: string, title: string, message: string) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  console.log(`[PUSH MOCK] To User: ${userId}`);
  console.log(`[PUSH MOCK] Title: ${title}`);
  console.log(`[PUSH MOCK] Message: ${message}`);
  
  return true;
};
