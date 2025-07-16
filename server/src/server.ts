@@ .. @@
 import express from 'express';
 import cors from 'cors';
 import { DatabaseManager } from './database/database';
 import apiRoutes from './routes/api';
 import qrRoutes from './routes/qr';
+import nfcRoutes from './routes/nfc';

 const app = express();
@@ .. @@
 // Routes
 app.use('/api', apiRoutes);
 app.use('/api/qr', qrRoutes);
+app.use('/api/nfc', nfcRoutes);

 // Health check