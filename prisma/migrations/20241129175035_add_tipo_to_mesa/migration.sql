/*
  Warnings:

  - Added the required column `tipo` to the `Mesa` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Mesa" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "n_mesa" INTEGER NOT NULL,
    "n_pessoas" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL
);
INSERT INTO "new_Mesa" ("id", "n_mesa", "n_pessoas") SELECT "id", "n_mesa", "n_pessoas" FROM "Mesa";
DROP TABLE "Mesa";
ALTER TABLE "new_Mesa" RENAME TO "Mesa";
CREATE UNIQUE INDEX "Mesa_n_mesa_key" ON "Mesa"("n_mesa");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
