-- Warnings:

-- You are about to drop the `reservaMesas` table. If the table is not empty, all the data it contains will be lost.

-- Backup existing data if needed (uncomment if you want to do this)
-- CREATE TABLE "reservaMesas_backup" AS SELECT * FROM "reservaMesas";

-- Drop the existing table if it exists
PRAGMA foreign_keys=off;
DROP TABLE IF EXISTS "reservaMesas";
PRAGMA foreign_keys=on;

-- Create the new table
CREATE TABLE "reservaMesas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome_reserva" TEXT NOT NULL,
    "data_reserva" DATETIME NOT NULL,
    "n_pessoas" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL
);
