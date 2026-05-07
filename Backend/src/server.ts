import 'dotenv/config'; 

import app from "./app.js";

const PORT = 5000;   // optional: use process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});