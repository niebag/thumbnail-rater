'use client';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from '@/components/ui/card';
import { getImageUrl } from '@/lib/utils';
import { usePaginatedQuery, useQuery } from 'convex/react';
import { formatDistance } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '../../../convex/_generated/api';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Doc } from '../../../convex/_generated/dataModel';
import { useSession } from '@clerk/nextjs';

export default function ExplorePage() {
    const {
        results: thumbnails,
        status,
        loadMore,
    } = usePaginatedQuery(
        api.thumbnails.getRecentThumbnails,
        {},
        { initialNumItems: 10 }
    );

    const session = useSession();

    function hasVoted(thumbnail: Doc<'thumbnails'>) {
        if (!session.session) return false;
        return thumbnail.voteIds.includes(session.session.user.id);
    }

    return (
        <div>
            <div className='mb-12 mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8'>
                {thumbnails?.map((thumbnail) => (
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
                            <div className='flex gap-4 items-center mb-2'>
                                <Avatar>
                                    <AvatarImage
                                        src={thumbnail.profileImage}
                                    ></AvatarImage>
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>

                                <div>
                                    <p>{thumbnail.name}</p>
                                    <p>
                                        {formatDistance(
                                            new Date(
                                                thumbnail._creationTime
                                            ).toISOString(),
                                            new Date(),
                                            { addSuffix: true }
                                        )}
                                    </p>
                                </div>
                            </div>
                            <p>{thumbnail.title}</p>

                            <p>votes: {thumbnail.aVotes + thumbnail.bVotes}</p>
                        </CardContent>
                        <CardFooter>
                            <Button
                                variant={
                                    hasVoted(thumbnail) ? 'outline' : 'default'
                                }
                                asChild
                                className='w-full'
                            >
                                <Link href={`/thumbnails/${thumbnail._id}`}>
                                    {hasVoted(thumbnail)
                                        ? 'View Results'
                                        : 'Vote'}
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
            <Button
                className='w-full mb-24'
                disabled={status !== 'CanLoadMore'}
                onClick={() => {
                    loadMore(10);
                }}
            >
                Load More
            </Button>
        </div>
    );
}
