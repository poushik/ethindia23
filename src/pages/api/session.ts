import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET': {
            return getPosts(req, res);
        }
        case 'POST': {
            return addPost(req, res);
        }
        case 'PUT': {
            return updatePost(req, res);
        }
        case 'DELETE': {
            return deletePost(req, res);
        }
        default: {
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    }
}

// Getting all posts.
async function getPosts(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { db } = await connectToDatabase();
            const posts = await db
            .collection('session')
            .find({})
            .sort({ published: -1 })
            .toArray();
        return res.json({
            message: JSON.parse(JSON.stringify(posts)),
            success: true,
        });
    } catch (error) {
        return res.json({
            message: error,
            success: false,
        });
    }
}

// Adding a new post
async function addPost(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { db } = await connectToDatabase();
        await db.collection('session').insertOne(JSON.parse(req.body));
        return res.json({
            message: 'Session added successfully',
            success: true,
        });
    } catch (error) {
        return res.json({
            message: error,
            success: false,
        });
    }
}

// Updating a post
async function updatePost(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { db } = await connectToDatabase();
        await db.collection('session').updateOne(
            {
                _id: new ObjectId(req.body),
            },
            { $set: { published: true } }
        );
        return res.json({
            message: 'Session updated successfully',
            success: true,
        });
    } catch (error) {
        return res.json({
            message: error,
            success: false,
        });
    }
}

// deleting a post
async function deletePost(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { db } = await connectToDatabase();
        await db.collection('session').deleteOne({
            _id: new ObjectId(req.body),
        });
        return res.json({
            message: 'Session deleted successfully',
            success: true,
        });
    } catch (error) {
        return res.json({
            message: error,
            success: false,
        });
    }
}