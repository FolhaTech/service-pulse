-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Responsible" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Channel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Survey" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "SurveyResponse" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "protocol" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "responsibleId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "surveyId" TEXT NOT NULL,
    "contactedAt" DATETIME NOT NULL,
    "sentAt" DATETIME,
    "answeredAt" DATETIME,
    "status" TEXT NOT NULL,
    "score" INTEGER,
    "scoreLabel" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SurveyResponse_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SurveyResponse_responsibleId_fkey" FOREIGN KEY ("responsibleId") REFERENCES "Responsible" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SurveyResponse_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SurveyResponse_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "Survey" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Responsible_name_key" ON "Responsible"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Channel_name_key" ON "Channel"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SurveyResponse_protocol_key" ON "SurveyResponse"("protocol");

-- CreateIndex
CREATE INDEX "SurveyResponse_contactId_idx" ON "SurveyResponse"("contactId");

-- CreateIndex
CREATE INDEX "SurveyResponse_responsibleId_idx" ON "SurveyResponse"("responsibleId");

-- CreateIndex
CREATE INDEX "SurveyResponse_channelId_idx" ON "SurveyResponse"("channelId");

-- CreateIndex
CREATE INDEX "SurveyResponse_surveyId_idx" ON "SurveyResponse"("surveyId");

-- CreateIndex
CREATE INDEX "SurveyResponse_status_idx" ON "SurveyResponse"("status");

-- CreateIndex
CREATE INDEX "SurveyResponse_contactedAt_idx" ON "SurveyResponse"("contactedAt");
