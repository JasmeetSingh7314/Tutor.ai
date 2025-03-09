const { getRewards } = require("../services/modelEndpoints");

class ProgressController {
  constructor(ProgressModel, UserModel) {
    this.Progress = ProgressModel;
    this.User = UserModel;
  }

  async addXP(req, res) {
    const { userId, xpEarned } = req.body;

    try {
      let progress = await this.Progress.findOne({ userId });
      let user = await this.User.findById(userId);
      // console.log(user);

      if (!progress) {
        progress = new this.Progress({
          userId,
          xp: 0,
          level: 1,
          tier: "Beginner",
          lessonsCompleted: 0,
          xpRequiredForNextLevel: 100,
          achievements: [],
        });
      }

      progress.xp += xpEarned;

      // Check if the user has enough XP to level up
      while (progress.xp >= progress.xpRequiredForNextLevel) {
        progress.level += 1; // Increase level
        progress.xp -= progress.xpRequiredForNextLevel;
        progress.xpRequiredForNextLevel = 10 * Math.pow(progress.level, 2);
      }
      if (progress.level > 5 && user.knownWords.length > 20) {
        progress.tier = "Intermediate";
      } else if (progress.level > 10 && user.knownWords.length > 100) {
        progress.tier = "Advanced";
      }
      let rewardResult;
      const rewardLevels = [1, 5, 10, 50, 100];
      if (
        rewardLevels.includes(progress.level) &&
        !progress.rewardedLevels.includes(progress.level)
      ) {
        const address = user.walletAddress;
        const name = user.fullName;
        const level = progress.level.toString();
        const title = progress.tier;

        rewardResult = await getRewards(address, name, level, title);

        console.log("The result:", rewardResult);

        if (rewardResult.result && rewardResult.status) {
          progress.rewardedLevels.push(progress.level);
        }
      }
      await progress.save();

      res.status(200).json({
        success: true,
        message: "XP added successfully",
        data: progress,
        hash: rewardResult?.result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getLessonNFT(req, res) {
    const { userId, title } = req.body;
    console.log(userId, title);
    try {
      let progress = await this.Progress.findOne({ userId });
      let user = await this.User.findById(userId);
      const address = user.walletAddress;
      const name = user.fullName;
      const level = progress.level.toString();

      const rewardResult = await getRewards(address, name, level, title);

      console.log("The result:", rewardResult);

      res.status(200).json({
        success: true,
        message: "Lesson nft generation successful",
        data: progress,
        hash: rewardResult?.result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getProgress(req, res) {
    const { userId } = req.params;

    try {
      let progress = await this.Progress.findOne({ userId });
      let user = await this.User.findOne({ userId });
      console.log(user);

      if (!progress) {
        progress = new this.Progress({
          userId,
          xp: 0,
          level: 1,
          tier: "Beginner",
          lessonsCompleted: 0,
          xpRequiredForNextLevel: 100,
          achievements: [],
        });

        await progress.save();
      }

      console.log(user);

      res.status(200).json({
        success: true,
        message: "Progress retrieved successfully",
        data: progress,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = ProgressController;
