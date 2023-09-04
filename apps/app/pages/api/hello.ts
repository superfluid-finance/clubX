import type { NextApiRequest, NextApiResponse } from "next";

interface ResponseData {
  message: string;
}

const handler = (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
): void => {
  res.status(200).json({ message: "Hello from Next.js!" });
};

export default handler;
