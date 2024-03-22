-- CreateTable
CREATE TABLE "Business" (
    "id" SERIAL NOT NULL,
    "url" TEXT,
    "name" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20),
    "address" VARCHAR(200),
    "city" VARCHAR(200),
    "online" BOOLEAN DEFAULT false,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "Business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "url" VARCHAR(255),
    "able" BOOLEAN DEFAULT false,
    "path" VARCHAR(255),

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Business" ADD CONSTRAINT "Business_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
