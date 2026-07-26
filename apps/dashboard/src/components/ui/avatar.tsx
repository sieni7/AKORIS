import * as React from 'react';
import { cn } from '../../lib/utils';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  fallback?: string;
  src?: string;
  alt?: string;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(({ className, fallback, src, alt, ...props }, ref) => (
  <div ref={ref} className={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', className)} {...props}>
    {src ? (
      <img src={src} alt={alt ?? ''} className="aspect-square h-full w-full" />
    ) : (
      <div className="flex h-full w-full items-center justify-center rounded-full bg-muted text-xs font-medium uppercase">
        {fallback ?? '?'}
      </div>
    )}
  </div>
));
Avatar.displayName = 'Avatar';

export { Avatar };
