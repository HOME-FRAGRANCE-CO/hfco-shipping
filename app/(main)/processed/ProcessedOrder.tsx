'use client';

import { deleteConsignment } from '@/actions/history';
import { Button } from '@/components/ui/button';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
export const ProcessedOrder = () => {
    const [pending, startTransition] = useTransition();
    const consignment = '2424382039026';

    const handleDeleteClick = async () => {
        if (pending) return;
        startTransition(async () => {
            deleteConsignment(consignment)
                .then(() => {
                    toast.success('Consignment deleted');
                })
                .catch((error: Error) => {
                    toast.error('Failed to delete consignment', {
                        description: error.message,
                    });
                });
        });
    };

    return <Button onClick={handleDeleteClick}>Delete Consignment</Button>;
};
