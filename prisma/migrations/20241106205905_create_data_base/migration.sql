-- CreateTable
CREATE TABLE "Usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "tipo" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "usuarioAdm" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "tipo" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "reservaMesas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome_reserva" TEXT NOT NULL,
    "data_reserva" DATETIME NOT NULL,
    "n_pessoas" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "criaMesa" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "codigo" TEXT NOT NULL,
    "n_pessoas" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "usuarioAdm_email_key" ON "usuarioAdm"("email");

-- CreateIndex
CREATE UNIQUE INDEX "criaMesa_codigo_key" ON "criaMesa"("codigo");
