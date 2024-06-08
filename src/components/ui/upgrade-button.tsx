'use client';

import { useAction } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useRouter } from 'next/navigation';
import { Button } from './button';

export function UpgradeButton() {
    const pay = useAction(api.stripe.pay);
    const router = useRouter();

    async function handleUpgradeClick() {
        const url = await pay();
        router.push(url);
    }

    return (
        <Button
            variant='secondary'
            onClick={handleUpgradeClick}
        >
            Upgrade
        </Button>
    );
}
