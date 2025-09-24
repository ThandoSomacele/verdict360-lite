import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/database';

export const GET: RequestHandler = async () => {
  try {
    // Check if tables exist
    const tables = await db.raw(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    // Try to count rows in conversations table
    let conversationCount = 0;
    let messagesCount = 0;
    let hasConversationsTable = false;
    let hasMessagesTable = false;

    try {
      const result = await db('conversations').count('* as count');
      conversationCount = parseInt(result[0]?.count || '0');
      hasConversationsTable = true;
    } catch (e: any) {
      // Table might not exist
    }

    try {
      const result = await db('messages').count('* as count');
      messagesCount = parseInt(result[0]?.count || '0');
      hasMessagesTable = true;
    } catch (e: any) {
      // Table might not exist
    }

    return json({
      success: true,
      tables: tables.rows.map((r: any) => r.table_name),
      hasConversationsTable,
      hasMessagesTable,
      conversationCount,
      messagesCount
    });
  } catch (error: any) {
    return json({
      success: false,
      error: 'Schema check failed',
      details: error.message
    });
  }
};