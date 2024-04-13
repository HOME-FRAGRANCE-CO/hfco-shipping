import { cn } from '@/lib/utils';
import { LoaderIcon } from 'lucide-react';

export const Loader = ({ className }: { className?: string }) => {
    return (
        <LoaderIcon
            className={cn(
                'size-5 animate-spin text-muted-foreground',
                className,
            )}
        ></LoaderIcon>
    );
};
