import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const createThumbnail = mutation({
    args: {
        title: v.string(),
        aImage: v.string(),
        bImage: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await ctx.auth.getUserIdentity();

        if (!user) {
            throw new Error('you must be logged in to create a thumbnail');
        }

        return await ctx.db.insert('thumbnails', {
            title: args.title,
            userId: user.subject,
            aImage: args.aImage,
            bImage: args.bImage,
            aVotes: 0,
            bVotes: 0,
            voteIds: [],
        });
    },
});

export const getThumbnail = query({
    args: {
        thumbnailId: v.id('thumbnails'),
    },
    handler: async (ctx, args) => {
        return ctx.db.get(args.thumbnailId);
    },
});

export const getThumbnailsForUser = query({
    args: {},
    handler: async (ctx, args) => {
        const user = await ctx.auth.getUserIdentity();

        if (!user) {
            return [];
        }

        return ctx.db
            .query('thumbnails')
            .filter((q) => q.eq(q.field('userId'), user.subject))
            .collect();
    },
});

export const voteOnThumbnail = mutation({
    args: {
        thumbnailId: v.id('thumbnails'),
        imageId: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = (await ctx.auth.getUserIdentity())?.subject;

        if (!userId) {
            throw new Error('you must be logged in to vote');
        }

        const thumbnail = await ctx.db.get(args.thumbnailId);

        if (!thumbnail) {
            throw new Error('invalid thumbnail id');
        }

        if (thumbnail.voteIds.includes(userId)) {
            throw new Error("you've already voted")
        }

        if (thumbnail.aImage === args.imageId) {
            thumbnail.aVotes++;
            await ctx.db.patch(thumbnail._id, {
                aVotes: thumbnail.aVotes,
                voteIds: [...thumbnail.voteIds, userId],
            });
        } else {
            thumbnail.bVotes++;
            await ctx.db.patch(thumbnail._id, {
                bVotes: thumbnail.bVotes,
                voteIds: [...thumbnail.voteIds, userId],
            });
        }
    },
});
