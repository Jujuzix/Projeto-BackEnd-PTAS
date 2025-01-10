-- CreateTable
CREATE TABLE "Usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "tipo" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Reserva" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuario_id" INTEGER NOT NULL,
    "n_mesa" INTEGER NOT NULL,
    "data_reserva" DATETIME NOT NULL,
    "n_pessoas" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL,
    "n_pessoas_sentando" INTEGER NOT NULL,
    CONSTRAINT "Reserva_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Reserva_n_mesa_fkey" FOREIGN KEY ("n_mesa") REFERENCES "Mesa" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Mesa" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "n_mesa" INTEGER NOT NULL,
    "n_pessoas" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Mesa_n_mesa_key" ON "Mesa"("n_mesa");
