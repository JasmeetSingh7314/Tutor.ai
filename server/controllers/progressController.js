class ProgressController {
  constructor(ProgressModel, UserModel) {
    this.Progress = ProgressModel;
    this.User = UserModel;
  }

  async addXP(req, res) {
    const { userID, xpEarned } = req.body;

    try {
      let progress = await this.Progress.findOne({ userID });

      if (!progress) {
        progress = new this.Progress({
          userID,
          xp: 0,
          level: 1,
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
        progress.xpRequiredForNextLevel = 100 * Math.pow(progress.level, 2);
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
    const { userID } = req.params;

    try {
      let progress = await this.Progress.findOne({ userID });

      if (!progress) {
        progress = new this.Progress({
          userID,
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
