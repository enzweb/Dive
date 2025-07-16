@@ .. @@
   findByQrCode(qrCode: string): User | undefined {
     const stmt = this.db.prepare('SELECT * FROM users WHERE qr_code = ?');
     return stmt.get(qrCode) as User | undefined;
   }
+
+  findByNfcId(nfcId: string): User | undefined {
+    // Rechercher par NFC ID (peut être stocké dans qr_code ou un champ dédié)
+    const stmt = this.db.prepare('SELECT * FROM users WHERE qr_code = ? OR nfc_id = ?');
+    return stmt.get(nfcId, nfcId) as User | undefined;
+  }