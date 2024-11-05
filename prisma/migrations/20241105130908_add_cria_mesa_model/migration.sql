-- CreateTable
CREATE TABLE "criaMesa" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "codigo" TEXT NOT NULL,
    "n_pessoas" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "criaMesa_codigo_key" ON "criaMesa"("codigo");
