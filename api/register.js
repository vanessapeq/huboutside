import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, email, birth_year, location } = req.body;

    if (!name || !email || !birth_year || !location) {
        return res.status(400).json({ error: 'Faltam campos obrigatórios' });
    }

    try {
        const sql = neon(process.env.DATABASE_URL);

        // Create table if it doesn't exist (only first time)
        await sql`
      CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        birth_year INTEGER NOT NULL,
        location TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

        // Insert lead
        await sql`
      INSERT INTO leads (name, email, birth_year, location)
      VALUES (${name}, ${email}, ${birth_year}, ${location})
      ON CONFLICT (email) DO NOTHING;
    `;

        return res.status(200).json({ message: 'Lead registrado com sucesso' });
    } catch (error) {
        console.error('Database Error:', error);
        return res.status(500).json({ error: 'Erro ao conectar ao banco de dados' });
    }
}
