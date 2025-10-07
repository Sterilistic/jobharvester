import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface PaginationProps {
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
  variant?: 'default' | 'vertical';
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  hasNextPage,
  hasPrevPage,
  onPageChange,
  totalItems,
  itemsPerPage = 10,
  variant = 'default',
}) => {
  const handlePrevPage = () => {
    if (hasPrevPage) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (hasNextPage) {
      onPageChange(currentPage + 1);
    }
  };

  const getPageInfo = () => {
    if (!totalItems || !itemsPerPage) return null;
    
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);
    
    return `Showing ${startItem}-${endItem} of ${totalItems} items`;
  };

  if (variant === 'vertical') {
    return (
      <Card className="mt-6">
        <CardContent className="p-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="text-sm text-muted-foreground text-center">
              {getPageInfo()}
            </div>
            
            <div className="flex flex-col items-center space-y-3">
              <Button
                variant="outline"
                size="lg"
                onClick={handlePrevPage}
                disabled={!hasPrevPage}
                className="w-32 h-12 flex items-center justify-center space-x-2"
              >
                <span>↑</span>
                <span>Previous</span>
              </Button>
              
              <div className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
                Page {currentPage}
              </div>
              
              <Button
                variant="outline"
                size="lg"
                onClick={handleNextPage}
                disabled={!hasNextPage}
                className="w-32 h-12 flex items-center justify-center space-x-2"
              >
                <span>Next</span>
                <span>↓</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <div className="text-sm text-muted-foreground">
          {getPageInfo()}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevPage}
            disabled={!hasPrevPage}
          >
            ← Previous
          </Button>
          
          <div className="px-3 py-1 bg-primary text-primary-foreground rounded-md text-sm font-medium">
            Page {currentPage}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={!hasNextPage}
          >
            Next →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Pagination;
