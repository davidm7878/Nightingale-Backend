import db from "#db/client";

export async function createHospital(name, street, city, state) {
  const sql = `
    INSERT INTO hospitals
      (name, street, city, state)
    VALUES
      ($1, $2, $3, $4)
    RETURNING *
    `;
  const {
    rows: [hospital],
  } = await db.query(sql, [name, street, city, state]);
  return hospital;
}

export async function getHospitalByName(name) {
  const sql = `
    SELECT *
    FROM hospitals
    WHERE name = $1
    `;
  const {
    rows: [hospital],
  } = await db.query(sql, [name]);
  return hospital;
}

export async function getAllHospitals() {
  const sql = `SELECT * FROM hospitals`;
  const { rows } = await db.query(sql);
  return rows;
}

export async function getHospitalById(id) {
  const sql = `
    SELECT *
    FROM hospitals
    WHERE id = $1
    `;
  const {
    rows: [hospital],
  } = await db.query(sql, [id]);
  return hospital;
}

export async function getHospitalsByCity(city) {
  const sql = `
    SELECT *
    FROM hospitals
    WHERE city = $1
    `;
  const { rows } = await db.query(sql, [city]);
  return rows;
}

export async function getHospitalsByState(state) {
  const sql = `
    SELECT *
    FROM hospitals
    WHERE state = $1
    `;
  const { rows } = await db.query(sql, [state]);
  return rows;
}

export async function updateHospital(id, name, street, city, state) {
  const sql = `
    UPDATE hospitals
    SET name = $1, street = $2, city = $3, state = $4
    WHERE id = $5
    RETURNING *
    `;
  const {
    rows: [hospital],
  } = await db.query(sql, [name, street, city, state, id]);
  return hospital;
}

export async function deleteHospital(id) {
  const sql = `
    DELETE FROM hospitals
    WHERE id = $1
    RETURNING *
    `;
  const {
    rows: [hospital],
  } = await db.query(sql, [id]);
  return hospital;
}
