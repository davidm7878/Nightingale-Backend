import db from "#db/client";

export async function getAllComments() {
  const sql = `SELECT * FROM comments ORDER BY created_at DESC`;
  const { rows } = await db.query(sql);
  return rows;
}

export async function getCommentById(id) {
  const sql = `
    SELECT *
    FROM comments
    WHERE id = $1
    `;
  const {
    rows: [comment],
  } = await db.query(sql, [id]);
  return comment;
}

export async function getCommentsByPostId(postId) {
  const sql = `
    SELECT c.*, u.username
    FROM comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.post_id = $1
    ORDER BY c.created_at ASC
    `;
  const { rows } = await db.query(sql, [postId]);
  return rows;
}

export async function getCommentsByUserId(userId) {
  const sql = `
    SELECT *
    FROM comments
    WHERE user_id = $1
    ORDER BY created_at DESC
    `;
  const { rows } = await db.query(sql, [userId]);
  return rows;
}

export async function createComment(userId, postId, body) {
  const sql = `
    INSERT INTO comments
      (user_id, post_id, body)
    VALUES
      ($1, $2, $3)
    RETURNING *
    `;
  const {
    rows: [comment],
  } = await db.query(sql, [userId, postId, body]);
  return comment;
}

export async function updateComment(id, body) {
  const sql = `
    UPDATE comments
    SET body = $1
    WHERE id = $2
    RETURNING *
    `;
  const {
    rows: [comment],
  } = await db.query(sql, [body, id]);
  return comment;
}

export async function deleteComment(id) {
  const sql = `
    DELETE FROM comments
    WHERE id = $1
    RETURNING *
    `;
  const {
    rows: [comment],
  } = await db.query(sql, [id]);
  return comment;
}
