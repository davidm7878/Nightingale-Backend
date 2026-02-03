import db from "#db/client";

export async function getAllRatings() {
  const { rows } = await db.query("SELECT * FROM ratings");
  return rows;
}

export async function getRatingById(id) {
  const { rows } = await db.query("SELECT * FROM ratings WHERE id = $1", [id]);
  return rows[0];
}

export async function getRatingsByHospitalId(hospital_id) {
  const { rows } = await db.query(
    "SELECT * FROM ratings WHERE hospital_id = $1",
    [hospital_id],
  );
  return rows;
}

export async function getRatingsByUserId(user_id) {
  const { rows } = await db.query("SELECT * FROM ratings WHERE user_id = $1", [
    user_id,
  ]);
  return rows;
}

export async function getAverageRatingForHospital(hospital_id) {
  const { rows } = await db.query(
    "SELECT AVG(rating_value) as average_rating, COUNT(*) as total_ratings FROM ratings WHERE hospital_id = $1",
    [hospital_id],
  );
  return rows[0];
}

export async function createRating(user_id, hospital_id, rating_value) {
  const { rows } = await db.query(
    "INSERT INTO ratings (user_id, hospital_id, rating_value) VALUES ($1, $2, $3) RETURNING *",
    [user_id, hospital_id, rating_value],
  );
  return rows[0];
}

export async function updateRating(id, rating_value) {
  const { rows } = await db.query(
    "UPDATE ratings SET rating_value = $1 WHERE id = $2 RETURNING *",
    [rating_value, id],
  );
  return rows[0];
}

export async function deleteRating(id) {
  const { rows } = await db.query(
    "DELETE FROM ratings WHERE id = $1 RETURNING *",
    [id],
  );
  return rows[0];
}
