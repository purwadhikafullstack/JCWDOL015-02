// file: /api/findNearestOutlet.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { findNearestOutlet } from '@/lib/outletLib';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { userAddressId } = req.body;

  try {
    const result = await findNearestOutlet(userAddressId);

    if (result.nearestOutlet) {
      res.status(200).json({
        ok: true,
        message: 'Nearest outlet found',
        data: result,
      });
    } else {
      res.status(404).json({
        ok: false,
        message: 'No nearest outlet found',
      });
    }
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: (error as Error).message,
    });
  }
}
