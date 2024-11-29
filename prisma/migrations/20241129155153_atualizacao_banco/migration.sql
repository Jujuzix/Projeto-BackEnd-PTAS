/*
  Warnings:

  - Added the required column `n_mesa` to the `Reserva` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Reserva" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "n_mesa" INTEGER NOT NULL,
    "data_reserva" DATETIME NOT NULL,
    "n_pessoas" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL
);
INSERT INTO "new_Reserva" ("data_reserva", "id", "n_pessoas", "tipo") SELECT "data_reserva", "id", "n_pessoas", "tipo" FROM "Reserva";
DROP TABLE "Reserva";
ALTER TABLE "new_Reserva" RENAME TO "Reserva";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
