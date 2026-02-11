-- CreateTable
CREATE TABLE "Deal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "businessContact" TEXT NOT NULL DEFAULT '',
    "businessEmail" TEXT NOT NULL DEFAULT '',
    "estimatedValue" REAL NOT NULL,
    "monthlyProcessing" REAL NOT NULL DEFAULT 0,
    "probability" INTEGER NOT NULL DEFAULT 20,
    "stage" TEXT NOT NULL DEFAULT 'New Opportunity',
    "notes" TEXT NOT NULL DEFAULT '',
    "partnerId" TEXT NOT NULL,
    "camId" TEXT,
    "whopMerchantId" TEXT,
    "firstPaymentDate" DATETIME,
    "closedAt" DATETIME,
    "closedReason" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Deal_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Deal_camId_fkey" FOREIGN KEY ("camId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DealActivity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dealId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DealActivity_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "Deal" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DealActivity_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CamAssignment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "camId" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CamAssignment_camId_fkey" FOREIGN KEY ("camId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CamAssignment_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Bounty" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "target" REAL NOT NULL,
    "reward" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "BountyProgress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bountyId" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "current" REAL NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BountyProgress_bountyId_fkey" FOREIGN KEY ("bountyId") REFERENCES "Bounty" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "BountyProgress_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "link" TEXT,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Partner" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT NOT NULL DEFAULT '',
    "coverImage" TEXT NOT NULL DEFAULT '',
    "tagline" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "partnerType" TEXT NOT NULL,
    "categories" TEXT NOT NULL,
    "industries" TEXT NOT NULL,
    "featuredWhops" TEXT NOT NULL,
    "caseStudies" TEXT NOT NULL,
    "reviews" TEXT NOT NULL,
    "avgRating" REAL NOT NULL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "priceRange" TEXT NOT NULL,
    "location" TEXT NOT NULL DEFAULT '',
    "timezone" TEXT NOT NULL DEFAULT '',
    "languages" TEXT NOT NULL,
    "responseTime" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "website" TEXT NOT NULL DEFAULT '',
    "calendlyLink" TEXT,
    "internalNotes" TEXT NOT NULL DEFAULT '',
    "internalTags" TEXT NOT NULL,
    "whopContactPerson" TEXT NOT NULL DEFAULT '',
    "lastEngagementDate" TEXT NOT NULL DEFAULT '',
    "recommendedFor" TEXT NOT NULL,
    "tier" TEXT NOT NULL DEFAULT 'Bronze',
    "totalRevenue" REAL NOT NULL DEFAULT 0,
    "totalDeals" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Partner_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Partner" ("avgRating", "calendlyLink", "caseStudies", "categories", "contactEmail", "coverImage", "createdAt", "description", "featuredWhops", "id", "industries", "internalNotes", "internalTags", "languages", "lastEngagementDate", "location", "logo", "name", "partnerType", "priceRange", "recommendedFor", "responseTime", "reviewCount", "reviews", "slug", "tagline", "timezone", "updatedAt", "userId", "website", "whopContactPerson") SELECT "avgRating", "calendlyLink", "caseStudies", "categories", "contactEmail", "coverImage", "createdAt", "description", "featuredWhops", "id", "industries", "internalNotes", "internalTags", "languages", "lastEngagementDate", "location", "logo", "name", "partnerType", "priceRange", "recommendedFor", "responseTime", "reviewCount", "reviews", "slug", "tagline", "timezone", "updatedAt", "userId", "website", "whopContactPerson" FROM "Partner";
DROP TABLE "Partner";
ALTER TABLE "new_Partner" RENAME TO "Partner";
CREATE UNIQUE INDEX "Partner_userId_key" ON "Partner"("userId");
CREATE UNIQUE INDEX "Partner_slug_key" ON "Partner"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "CamAssignment_camId_partnerId_key" ON "CamAssignment"("camId", "partnerId");

-- CreateIndex
CREATE UNIQUE INDEX "BountyProgress_bountyId_partnerId_key" ON "BountyProgress"("bountyId", "partnerId");
