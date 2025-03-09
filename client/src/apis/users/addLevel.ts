import { getProgress } from "./getProgress";

export const addLevel = async (
  userId: string,
  level: string,
) => {
  try {
    const latestProgress = await getProgress(userId);
    const newLevel = latestProgress.data.level;
    console.log("Level progress:", newLevel);
    if (newLevel > level) {
      return {
        levelUp: true,
        newLevel: newLevel,
        oldLevel: level,

      };
    } else if (newLevel === level) {
      return {
        levelUp: false,

      };
    }
  } catch (err) {
    console.error(err);
    throw new Error("Error in getting progress");
  }
};
