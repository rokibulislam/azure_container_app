import { app } from './app.js';
import { config } from './config.js';

app.listen(config.port, () => {
  console.log(`API listening on port ${config.port}`);
  console.log(`Server running at http://localhost:${config.port}`);
});


