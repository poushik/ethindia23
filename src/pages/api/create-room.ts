import type { NextApiRequest, NextApiResponse } from 'next';

type CreateRoomRequestBody = {
  title: string;
  hostWallets: string[];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { title, hostWallets } = req.body as CreateRoomRequestBody;

  const response = await fetch('https://iriko.testing.huddle01.com/api/v1/create-room', {
    method: 'POST',
    body: JSON.stringify({ title, hostWallets }),
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.HUDDLE_API_KEY as string,
    },
  });

  const data = await response.json();
  res.status(response.status).json(data);
}
