@@ .. @@
   findByQrCode(qrCode: string): Asset | undefined {
     const stmt = this.db.prepare('SELECT * FROM assets WHERE qr_code = ?');
     return stmt.get(qrCode) as Asset | undefined;
   }
+
+  findByNfcId(nfcId: string): Asset | undefined {
+    // Rechercher par NFC ID (peut être stocké dans qr_code ou un champ dédié)
+    const stmt = this.db.prepare('SELECT * FROM assets WHERE qr_code = ? OR nfc_id = ?');
+    return stmt.get(nfcId, nfcId) as Asset | undefined;
+  }