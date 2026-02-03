import db from "#db/client";

export async function getAllLikes() {
  const sql = `SELECT * FROM likes`;
  const { rows } = await db.query(sql);
  return rows;
}

export async function getLikeById(id) {
  const sql = `
    SELECT *
    FROM likes
    WHERE id = $1
    `;
  const {
    rows: [like],
  } = await db.query(sql, [id]);
  return like;
}

export async function getLikesByPostId(postId) {
  const sql = `
    SELECT *
    FROM likes
    WHERE post_id = $1
    `;
  const { rows } = await db.query(sql, [postId]);
  return rows;
}

export async function getLikesByUserId(userId) {
  const sql = `
    SELECT *
    FROM likes
    WHERE user_id = $1
    `;
  const { rows } = await db.query(sql, [userId]);
  return rows;
}

export async function getLikeByUserAndPost(userId, postId) {
  const sql = `
    SELECT *
    FROM likes
    WHERE user_id = $1 AND post_id = $2
    `;
  const {
    rows: [like],
  } = await db.query(sql, [userId, postId]);
  return like;
}

export async function createLike(userId, postId) {
  const sql = `
    INSERT INTO likes
      (user_id, post_id)
    VALUES
      ($1, $2)
    RETURNING *
    `;
  const {
    rows: [like],
  } = await db.query(sql, [userId, postId]);
  return like;
}

export async function deleteLike(id) {
  const sql = `
    DELETE FROM likes
    WHERE id = $1
    RETURNING *
    `;
  const {
    rows: [like],
  } = await db.query(sql, [id]);
  return like;
}

export async function deleteLikeByUserAndPost(userId, postId) {
  const sql = `
    DELETE FROM likes
    WHERE user_id = $1 AND post_id = $2
    RETURNING *
    `;
  const {
    rows: [like],
  } = await db.query(sql, [userId, postId]);
  return like;
}
