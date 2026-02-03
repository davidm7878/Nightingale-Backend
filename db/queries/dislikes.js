import db from "#db/client";

export async function getAllDislikes() {
  const sql = `SELECT * FROM dislikes`;
  const { rows } = await db.query(sql);
  return rows;
}

export async function getDislikeById(id) {
  const sql = `
    SELECT *
    FROM dislikes
    WHERE id = $1
    `;
  const {
    rows: [dislike],
  } = await db.query(sql, [id]);
  return dislike;
}

export async function getDislikesByPostId(postId) {
  const sql = `
    SELECT *
    FROM dislikes
    WHERE post_id = $1
    `;
  const { rows } = await db.query(sql, [postId]);
  return rows;
}

export async function getDislikesByUserId(userId) {
  const sql = `
    SELECT *
    FROM dislikes
    WHERE user_id = $1
    `;
  const { rows } = await db.query(sql, [userId]);
  return rows;
}

export async function getDislikeByUserAndPost(userId, postId) {
  const sql = `
    SELECT *
    FROM dislikes
    WHERE user_id = $1 AND post_id = $2
    `;
  const {
    rows: [dislike],
  } = await db.query(sql, [userId, postId]);
  return dislike;
}

export async function createDislike(userId, postId) {
  const sql = `
    INSERT INTO dislikes
      (user_id, post_id)
    VALUES
      ($1, $2)
    RETURNING *
    `;
  const {
    rows: [dislike],
  } = await db.query(sql, [userId, postId]);
  return dislike;
}

export async function deleteDislike(id) {
  const sql = `
    DELETE FROM dislikes
    WHERE id = $1
    RETURNING *
    `;
  const {
    rows: [dislike],
  } = await db.query(sql, [id]);
  return dislike;
}

export async function deleteDislikeByUserAndPost(userId, postId) {
  const sql = `
    DELETE FROM dislikes
    WHERE user_id = $1 AND post_id = $2
    RETURNING *
    `;
  const {
    rows: [dislike],
  } = await db.query(sql, [userId, postId]);
  return dislike;
}
