import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RecentItemsManager } from '@/utils/recentItemsManager';

/**
 * Debug component to test and manage recent items deletion functionality
 * This component can be temporarily added to any page for testing
 */
export const RecentItemsDebug = () => {
  const [deletedItems, setDeletedItems] = useState<string[]>([]);

  useEffect(() => {
    setDeletedItems(RecentItemsManager.getDeletedItems());
  }, []);

  const refreshDeletedItems = () => {
    setDeletedItems(RecentItemsManager.getDeletedItems());
  };

  const clearAllDeleted = () => {
    RecentItemsManager.clearDeletedItems();
    refreshDeletedItems();
  };

  const restoreItem = (itemId: string) => {
    RecentItemsManager.restoreItem(itemId);
    refreshDeletedItems();
  };

  return (
    <Card className="p-4 m-4 bg-yellow-50 border-yellow-200">
      <h3 className="font-semibold mb-3 text-yellow-800">Recent Items Debug Panel</h3>
      
      <div className="space-y-2 mb-4">
        <p className="text-sm text-yellow-700">
          Deleted Recent Items Count: <strong>{deletedItems.length}</strong>
        </p>
        
        {deletedItems.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs text-yellow-600">Deleted Item IDs:</p>
            {deletedItems.map(itemId => (
              <div key={itemId} className="flex items-center justify-between bg-yellow-100 p-2 rounded text-xs">
                <span className="font-mono">{itemId}</span>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => restoreItem(itemId)}
                  className="h-6 px-2 text-xs"
                >
                  Restore
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex gap-2">
        <Button 
          size="sm" 
          variant="outline" 
          onClick={refreshDeletedItems}
          className="text-xs"
        >
          Refresh
        </Button>
        <Button 
          size="sm" 
          variant="destructive" 
          onClick={clearAllDeleted}
          className="text-xs"
          disabled={deletedItems.length === 0}
        >
          Clear All
        </Button>
      </div>
      
      <p className="text-xs text-yellow-600 mt-2">
        This debug panel shows which recent items have been permanently deleted by the user.
      </p>
    </Card>
  );
};