import React from 'react';
import { Skeleton } from '../elements/skeleton';
import ErrorBoundary from '../error-boundary';

export const DocumentListSkeleton = () => {
  console.log('🚀 ~ DocumentListSkeleton :');

  return (
    <ErrorBoundary fallback={<div>Failed to load skeleton</div>}>
      <div className='flex items-center justify-between py-2 border-b last:border-b-0'>
        <Skeleton className='h-4 w-[40%]' />
        <div className='flex space-x-2'>
          <Skeleton className='h-8 w-24' />
          <Skeleton className='h-8 w-16' />
          <Skeleton className='h-8 w-8' />
        </div>
      </div>
    </ErrorBoundary>
  );
};
