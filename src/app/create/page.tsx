'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { UploadFileResponse } from '@xixixao/uploadstuff';
import { UploadButton } from '@xixixao/uploadstuff/react';
import '@xixixao/uploadstuff/react/styles.css';
import clsx from 'clsx';
import { useMutation } from 'convex/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { api } from '../../../convex/_generated/api';
import { getImageUrl } from '@/lib/utils';
import { useSession } from '@clerk/nextjs';
import { UpgradeButton } from '@/components/ui/upgrade-button';

const defaultErrorState = {
    title: '',
    imageA: '',
    imageB: '',
};

export default function CreatePage() {
    const generateUploadUrl = useMutation(api.files.generateUploadUrl);
    const createThumbnail = useMutation(api.thumbnails.createThumbnail);
    const [imageA, setImageA] = useState('');
    const [imageB, setImageB] = useState('');
    const [errors, setErrors] = useState(defaultErrorState);
    const { toast } = useToast();
    const router = useRouter();
    const session = useSession();

    return (
        <div className='mt-16'>
            <h1 className='text-4xl font-bold mb-8'>Create a Thumbnail Test</h1>

            <p className='text-lg max-w-md mb-8'>
                Create your test so that other people can vote on their favorite
                thumbnail and help you redesign or pick the best options.
            </p>

            <form
                onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const formData = new FormData(form);
                    const title = formData.get('title') as string;
                    let newErrors = {
                        ...defaultErrorState,
                    };
                    setErrors(() => newErrors);

                    if (!title) {
                        newErrors = {
                            ...newErrors,
                            title: 'please fill in this required field',
                        };
                    }

                    if (!imageA) {
                        newErrors = {
                            ...newErrors,
                            imageA: 'please fill in this required field',
                        };
                    }

                    if (!imageB) {
                        newErrors = {
                            ...newErrors,
                            imageB: 'please fill in this required field',
                        };
                    }

                    setErrors(newErrors);
                    const hasErrors = Object.values(newErrors).some(Boolean);

                    if (hasErrors) {
                        toast({
                            title: 'Form Errors',
                            description: 'Please fill fields on the page',
                            variant: 'destructive',
                        });
                        return;
                    }

                    try {
                        const thumbnailId = await createThumbnail({
                            aImage: imageA,
                            bImage: imageB,
                            title,
                            profileImage: session.session?.user.imageUrl,
                        });

                        router.push(`/thumbnails/${thumbnailId}`);
                    } catch (err) {
                        toast({
                            title: 'You ran out of free credits',
                            description: (
                                <div>
                                    You must <UpgradeButton /> to create more
                                    thumbnail tests
                                </div>
                            ),
                            variant: 'destructive',
                        });
                    }
                }}
            >
                <div className='flex flex-col gap-4 mb-8'>
                    <Label htmlFor='title'>Your Test Title</Label>
                    <Input
                        id='title'
                        name='title'
                        type='text'
                        placeholder='Label your test to make it easier to manage later'
                        className={clsx({
                            border: errors.title,
                            'border-red-500': errors.title,
                        })}
                    />
                    {errors.title && (
                        <div className='text-red-500'>{errors.title}</div>
                    )}
                </div>

                <div className='grid grid-cols-2 gap-8 mb-8'>
                    <div
                        className={clsx('flex flex-col gap-4 rounded p-2', {
                            border: errors.imageA,
                            'border-red-500': errors.imageA,
                        })}
                    >
                        <h2 className='text-2xl font-bold'>Test Image A</h2>

                        {imageA && (
                            <Image
                                width='200'
                                height='200'
                                alt='image test a'
                                src={getImageUrl(imageA)}
                            />
                        )}

                        <UploadButton
                            uploadUrl={generateUploadUrl}
                            fileTypes={['image/*']}
                            onUploadComplete={async (
                                uploaded: UploadFileResponse[]
                            ) => {
                                setImageA(
                                    (uploaded[0].response as any).storageId
                                );
                            }}
                            onUploadError={(error: unknown) => {
                                // Do something with the error.
                                alert(`ERROR! ${error}`);
                            }}
                        />

                        {errors.imageA && (
                            <div className='text-red-500'>{errors.imageA}</div>
                        )}
                    </div>
                    <div
                        className={clsx('flex flex-col gap-4 rounded p-2', {
                            border: errors.imageB,
                            'border-red-500': errors.imageB,
                        })}
                    >
                        <h2 className='text-2xl font-bold'>Test Image B</h2>

                        {imageB && (
                            <Image
                                width='200'
                                height='200'
                                alt='image test b'
                                src={getImageUrl(imageB)}
                            />
                        )}

                        <UploadButton
                            uploadUrl={generateUploadUrl}
                            fileTypes={['image/*']}
                            onUploadComplete={async (
                                uploaded: UploadFileResponse[]
                            ) => {
                                setImageB(
                                    (uploaded[0].response as any).storageId
                                );
                            }}
                            onUploadError={(error: unknown) => {
                                // Do something with the error.
                                alert(`ERROR! ${error}`);
                            }}
                        />

                        {errors.imageB && (
                            <div className='text-red-500'>{errors.imageB}</div>
                        )}
                    </div>
                </div>

                <Button>Create Thumbnail Test</Button>
            </form>
        </div>
    );
}
