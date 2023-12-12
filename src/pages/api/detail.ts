import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET': {
            return getPost(req, res);
        }
        default: {
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    }
}

// Getting a post.
async function getPost(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { db } = await connectToDatabase();
      const posts = await db
        .collection('session')
        .findOne({creator: req.query.creator, tokenid: req.query.tokenid});
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