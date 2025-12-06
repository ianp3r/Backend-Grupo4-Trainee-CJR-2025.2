-- CreateTable
CREATE TABLE "lojas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuario_id" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "logo_url" TEXT,
    "banner_url" TEXT,
    "sticker_url" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
