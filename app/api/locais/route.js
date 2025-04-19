import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

export async function POST(req) {
  try {
    const body = await req.json();
    const { locais } = body;

    const conn = await mysql.createConnection(dbConfig);

    for (const item of locais) {
      const [result] = await conn.execute(
        'INSERT INTO locais (endereco, nome, telefone, detalhes) VALUES (?, ?, ?, ?)',
        [item.valor, item.dados.nome, item.dados.telefone, item.dados.detalhes]
      );
    }

    await conn.end();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao salvar locais:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
