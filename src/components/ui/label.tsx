import * as React from 'react';
import { cn } from '@/lib/utils';

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export const Label = ({ className, ...props }: LabelProps) => (
    <label
        className={cn('text-xs font-semibold tracking-wide text-ink-2 uppercase', className)}
        {...props}
    />
);
