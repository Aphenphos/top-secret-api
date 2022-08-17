const pool = require('../utils/pool');

class Secret {
  id;
  title;
  content;
  created_at;

  constructor(row) {
    this.id = row.id;
    this.title = row.title;
    this.content = row.content;
    this.created_at = row.created_at;
  }

  static async getAll() {
    const { rows } = await pool.query('select * from secrets');
    return rows.map((item) => new Secret(item));
  }
}

module.exports = Secret;
