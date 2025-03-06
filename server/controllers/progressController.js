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
      console.log(userId);
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

      await progress.save();

      res.status(200).json({
        success: true,
        message: "XP added successfully",
        data: progress,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // async mintNFT(userID, level) {
  //   try {
  //     const user = await this.User.findById(userID);

  //     if (!user) {
  //       throw new Error("User not found");
  //     }

  //     console.log(`NFT minted for user ${userID} at level ${level}`);
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async getProgress(req, res) {
    const { userId } = req.params;
    console.log(userId);

    try {
      let progress = await this.Progress.findOne({ userId });

      if (!progress) {
        progress = new this.Progress({
          userId,
          xp: 0,
          level: 1,
          lessonsCompleted: 0,
          xpRequiredForNextLevel: 100,
          achievements: [],
        });

        await progress.save();
      }

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
