import { Request, Response } from 'express';

const getReports = async (req: Request, res: Response) => {
  const { outlet, startDate, endDate } = req.query;
  res.json(Report);
};

export { getReports };
