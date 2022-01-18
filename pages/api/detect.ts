import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export type LanguagePrediction = {
  success: boolean;
  language: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LanguagePrediction>,
) {
  const { code } = req.body;
  const guessLangResponse = await axios.post('https://figstack.uc.r.appspot.com/infer', {
    code: code || '',
  });

  const guessLang = guessLangResponse.data as LanguagePrediction;
  res.status(200).json(guessLang);
}
