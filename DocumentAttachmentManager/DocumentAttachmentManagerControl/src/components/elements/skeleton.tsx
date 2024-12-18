import { cn } from '../../utils/shadcn-utils';
import type { HTMLAttributes } from 'react';
import React from 'react';

function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('animate-pulse rounded-md bg-primary/10', className)} {...props} />;
}

export { Skeleton };
