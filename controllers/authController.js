const pool = require('../db');        // o './db' según tu ruta real
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  const { correo, password, rol } = req.body;

  try {
    // Normaliza entradas (por si vienen con espacios o mayúsculas)
    const correoN = (correo || '').trim().toLowerCase();
    const rolN = (rol || '').trim().toLowerCase();

    // LOGS temporales para depurar (borra luego)
    console.log('[LOGIN] body:', { correo, rol });
    console.log('[LOGIN] normalizado:', { correoN, rolN });

    // Consulta explícita con esquema y forzando comparación en minúsculas
    const sql = `
      SELECT id, nombre, correo, password, rol, activo
      FROM asistenciaqr.usuarios
      WHERE LOWER(correo) = $1 AND LOWER(rol) = $2
      LIMIT 1;
    `;
    const result = await pool.query(sql, [correoN, rolN]);

    if (result.rows.length === 0) {
      console.log('[LOGIN] No encontró usuario');
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const usuario = result.rows[0];

    if (usuario.activo === false) {
      return res.status(403).json({
        message: 'Tu cuenta ha sido desactivada. Contacta a Dirección.',
      });
    }

    const ok = await bcrypt.compare(password, usuario.password);
    if (!ok) {
      console.log('[LOGIN] Password no coincide');
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = { login };
