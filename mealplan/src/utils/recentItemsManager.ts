/**
 * Utility service to manage deleted recent items in local storage
 * Ensures that once a user deletes a recent item, it won't reappear
 */

const DELETED_RECENT_ITEMS_KEY = 'deletedRecentItems';

export class RecentItemsManager {
  /**
   * Add an item ID to the deleted items list
   */
  static markAsDeleted(itemId: string): void {
    const deletedItems = this.getDeletedItems();
    if (!deletedItems.includes(itemId)) {
      deletedItems.push(itemId);
      localStorage.setItem(DELETED_RECENT_ITEMS_KEY, JSON.stringify(deletedItems));
    }
  }

  /**
   * Get all deleted item IDs
   */
  static getDeletedItems(): string[] {
    try {
      const stored = localStorage.getItem(DELETED_RECENT_ITEMS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn('Failed to parse deleted recent items from localStorage:', error);
      return [];
    }
  }

  /**
   * Check if an item is marked as deleted
   */
  static isDeleted(itemId: string): boolean {
    return this.getDeletedItems().includes(itemId);
  }

  /**
   * Filter out deleted items from a list of recent items
   */
  static filterDeletedItems<T extends { id: string }>(items: T[]): T[] {
    const deletedItems = this.getDeletedItems();
    return items.filter(item => !deletedItems.includes(item.id));
  }

  /**
   * Clear all deleted items history
   */
  static clearDeletedItems(): void {
    localStorage.removeItem(DELETED_RECENT_ITEMS_KEY);
  }

  /**
   * Remove a specific item from the deleted list (restore it)
   */
  static restoreItem(itemId: string): void {
    const deletedItems = this.getDeletedItems();
    const updatedItems = deletedItems.filter(id => id !== itemId);
    localStorage.setItem(DELETED_RECENT_ITEMS_KEY, JSON.stringify(updatedItems));
  }
}