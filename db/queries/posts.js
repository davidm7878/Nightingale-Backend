import db from "#db/client";

export async function getAllPosts() {
  const sql = `SELECT * FROM posts`;
  const { rows } = await db.query(sql);
  return rows;
}

export async function getPostById(id) {
  const sql = `
    SELECT *
    FROM posts
    WHERE id = $1
    `;
  const {
    rows: [post],
  } = await db.query(sql, [id]);
  return post;
}

export async function getPostsByUserId(userId) {
  const sql = `
    SELECT *
    FROM posts
    WHERE user_id = $1
    `;
  const { rows } = await db.query(sql, [userId]);
  return rows;
}

export async function createPost(userId, body) {
  const sql = `
    INSERT INTO posts
      (user_id, body)
    VALUES
      ($1, $2)
    RETURNING *
    `;
  const {
    rows: [post],
  } = await db.query(sql, [userId, body]);
  return post;
}

export async function updatePost(id, body) {
  const sql = `
    UPDATE posts
    SET body = $1
    WHERE id = $2
    RETURNING *
    `;
  const {
    rows: [post],
  } = await db.query(sql, [body, id]);
  return post;
}

export async function deletePost(id) {
  const sql = `
    DELETE FROM posts
    WHERE id = $1
    RETURNING *
    `;
  const {
    rows: [post],
  } = await db.query(sql, [id]);
  return post;
}
