-- CreateTable
CREATE TABLE "HabitCheckIn" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "habitId" TEXT NOT NULL,
    "day" TIMESTAMP(3) NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HabitCheckIn_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HabitCheckIn_userId_day_idx" ON "HabitCheckIn"("userId", "day");

-- CreateIndex
CREATE INDEX "HabitCheckIn_habitId_day_idx" ON "HabitCheckIn"("habitId", "day");

-- CreateIndex
CREATE UNIQUE INDEX "HabitCheckIn_userId_habitId_day_key" ON "HabitCheckIn"("userId", "habitId", "day");

-- AddForeignKey
ALTER TABLE "HabitCheckIn" ADD CONSTRAINT "HabitCheckIn_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HabitCheckIn" ADD CONSTRAINT "HabitCheckIn_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "Habit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
