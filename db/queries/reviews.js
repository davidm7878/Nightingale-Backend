import db from "#db/client";

export async function createReview(userId, hospitalId, body) {
  const sql = `
    INSERT INTO reviews
      (user_id, hospital_id, body)
    VALUES
      ($1, $2, $3)
    RETURNING *
    `;
  const {
    rows: [review],
  } = await db.query(sql, [userId, hospitalId, body]);
  return review;
}

export async function getReviewById(id) {
  const sql = `
    SELECT *
    FROM reviews
    WHERE id = $1
    `;
  const {
    rows: [review],
  } = await db.query(sql, [id]);
  return review;
}

export async function getReviewsByUserId(userId) {
  const sql = `
    SELECT *
    FROM reviews
    WHERE user_id = $1
    `;
  const { rows } = await db.query(sql, [userId]);
  return rows;
}

export async function getReviewsByHospitalId(hospitalId) {
  const sql = `
    SELECT *
    FROM reviews
    WHERE hospital_id = $1
    `;
  const { rows } = await db.query(sql, [hospitalId]);
  return rows;
}

export async function getAllReviews() {
  const sql = `SELECT * FROM reviews`;
  const { rows } = await db.query(sql);
  return rows;
}

export async function updateReview(id, body) {
  const sql = `
    UPDATE reviews
    SET body = $1
    WHERE id = $2
    RETURNING *
    `;
  const {
    rows: [review],
  } = await db.query(sql, [body, id]);
  return review;
}

export async function deleteReviewById(id) {
  const sql = `
    DELETE FROM reviews
    WHERE id = $1
    RETURNING id;
  `;
  const result = await db.query(sql, [id]);
  return result.rows[0];
}
