'use client';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from '@/components/ui/card';
import { getImageUrl } from '@/lib/utils';
import { useQuery } from 'convex/react';
import { formatDistance } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '../../../convex/_generated/api';

export default function DashboardPage() {
    const thumbnails = useQuery(api.thumbnails.getThumbnailsForUser);

    const sortedThumbnails = [...(thumbnails ?? [])].reverse();

    return (
        <div className='mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8'>
            {sortedThumbnails?.map((thumbnail) => (
                <Card key={thumbnail._id}>
                    <CardHeader>
                        <Image
                            src={getImageUrl(thumbnail.aImage)}
                            width='600'
                            height='600'
                            alt='thumbnail image'
                        />
                    </CardHeader>
                    <CardContent>
                        <p>{thumbnail.title}</p>
                        <p>
                            {formatDistance(
                                new Date(thumbnail._creationTime).toISOString(),
                                new Date(),
                                { addSuffix: true }
                            )}
                        </p>
                        <p>votes: {thumbnail.aVotes + thumbnail.bVotes}</p>
                    </CardContent>
                    <CardFooter>
                        <Button
                            asChild
                            className='w-full'
                        >
                            <Link href={`/thumbnails/${thumbnail._id}`}>
                                View Results
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}
