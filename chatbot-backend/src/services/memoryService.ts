import pool from '../db';

export const getUserIdByUsername = async (username: string): Promise<number> => {
  const userResult = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
  
  if (userResult.rows.length === 0) {
    const insertResult = await pool.query(
      'INSERT INTO users (username) VALUES ($1) RETURNING id',
      [username]
    );
    return insertResult.rows[0].id;
  } else {
    return userResult.rows[0].id;
  }
};

export const saveMessage = async (userId: number, message: string, sender: 'user' | 'bot') => {
  const query = 'INSERT INTO messages (user_id, message_text, sender, timestamp) VALUES ($1, $2, $3, NOW())';
  await pool.query(query, [userId, message, sender]);
};

export const getConversationHistory = async (userId: number) => {
  const query = 'SELECT message_text, sender, timestamp FROM messages WHERE user_id = $1 ORDER BY timestamp';
  const result = await pool.query(query, [userId]);
  return result.rows;
};

export const getLatestConversationHistory = async (userId: string, limit: number = 10) => {
  const query = `
    SELECT message_text, sender, timestamp 
    FROM messages 
    WHERE user_id = $1 
    ORDER BY timestamp DESC 
    LIMIT $2
  `;
  const result = await pool.query(query, [userId, limit]);
  return result.rows.reverse();
};
