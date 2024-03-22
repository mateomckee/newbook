import type { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(req: VercelRequest, res: VercelResponse) {
    const query = req.query;
    const { name = 'World' } = req.query
    return res.json({
        message: `Hello ${name}!`,
    })
}