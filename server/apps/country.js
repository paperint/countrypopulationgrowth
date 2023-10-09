import { pool } from "../utils/db.js";
import { Router } from "express";

const countryRouter = Router();

countryRouter.post("/topcountry", async (req, res) => {
  const { year } = req.body;
  try {
    const result = await pool.query(
      `
      SELECT *
      FROM country
      WHERE
          year = $1
          And countryname not like '%Asia%'
          And countryname not like '%World%'
          And countryname not like '%developed%'
          And countryname not like '%countries%'
          And countryname not like '%(UN)%'
      ORDER BY population desc
      limit 12
    `,
      [year]
    );
    return res.status(200).json({
      data: result.rows,
      message: `The server successfully processed your request. Here's the data you asked for.`,
    });
  } catch (error) {
    console.log("Error from get data:", error);
    return res.status(401).json({ message: `Error from get data.` });
  }
});

countryRouter.post("/world", async (req, res) => {
  const { year } = req.body;
  try {
    const result = await pool.query(
      `select
          *
         from
          country
         where
          year = $1
          and countryname = 'World'
        `,
      [year]
    );
    return res.status(200).json({
      data: result.rows[0],
      message: `The server successfully processed your request. Here's the data you asked for.`,
    });
  } catch (error) {
    console.log("Error from get data:", error);
    return res.status(401).json({ message: `Error from get data.` });
  }
});

export default countryRouter;

// const result = await pool.query(
//   `
//       SELECT *
//       FROM country
//       WHERE
//           year = $1
//           And countryname not like '%Asia%'
//           And countryname not like '%World%'
//           And countryname not like '%developed%'
//           And countryname not like '%countries%'
//           And countryname not like '%(UN)%'
//       ORDER BY population desc
//       limit 12
//     `,
//   [year]
// );
