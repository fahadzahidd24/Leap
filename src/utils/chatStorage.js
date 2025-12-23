import AsyncStorage from "@react-native-async-storage/async-storage";

export const getChatKey = (userId1, userId2) => {
  // Ensure consistent ordering
  const sortedIds = [userId1, userId2].sort();
  return `chat_${sortedIds[0]}_${sortedIds[1]}`;
};

export const loadMessages = async (userId1, userId2) => {
  const key = getChatKey(userId1, userId2);
  const stored = await AsyncStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
};

export const saveMessage = async (userId1, userId2, message) => {
  const key = getChatKey(userId1, userId2);
  const existing = await loadMessages(userId1, userId2);
  const updated = [...existing, message];
  await AsyncStorage.setItem(key, JSON.stringify(updated));
  return updated;
};
