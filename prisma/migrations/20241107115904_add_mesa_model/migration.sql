/*
  Warnings:

  - You are about to drop the `criaMesa` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reservaMesas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `usuarioAdm` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "criaMesa";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "reservaMesas";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "usuarioAdm";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Reserva" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome_reserva" TEXT NOT NULL,
    "data_reserva" DATETIME NOT NULL,
    "n_pessoas" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Mesa" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "codigo" TEXT NOT NULL,
    "n_pessoas" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Mesa_codigo_key" ON "Mesa"("codigo");
