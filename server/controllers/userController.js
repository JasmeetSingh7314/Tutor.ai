class UserHandler {
  constructor(userModel) {
    this.User = userModel;
  }

  async createUser(req, res) {
    try {
      const {
        fullName,
        email,
        walletAddress,
        profileImage,
        targetLanguage,
        preference,
        nativeLanguage,
        priorExperience,
        knownWords,
        weaknesses,
      } = req.body;

      const existingUser = await this.User.findOne({
        $or: [{ email }, { walletAddress }],
      });

      if (existingUser) {
        return res.status(201).json({
          success: false,
          message: "User already exists",
          data: existingUser,
        });
      }
      const newUser = await this.User.create({
        fullName,
        email,
        walletAddress,
        profileImage,
        preference,
        targetLanguage,
        nativeLanguage,
        priorExperience,
        knownWords,
        weaknesses,
      });
      res.status(201).json({
        success: true,
        message: "User created successfully",
        data: newUser,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getUserDetails(req, res) {
    try {
      const address = req.params.walletAddress;
      const userData = await this.User.findOne({ walletAddress: address });

      res.status(200).json({
        success: true,
        message: "User data fetched successfully",
        data: userData,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async updateUser(req, res) {
    try {
      const id = req.params.id;
      const {
        fullName,
        email,
        targetLanguage,
        nativeLanguage,
        priorExperience,
        preference,
        profileImage,
        reviewWords,
        knownWords,
        weaknesses,
      } = req.body;
      console.log(
        fullName,
        email,
        targetLanguage,
        nativeLanguage,
        priorExperience,
        preference,
        knownWords
      );
      const updatedUser = await this.User.findByIdAndUpdate(id, {
        $set: {
          fullName: fullName,
          email: email,
          targetLanguage: targetLanguage,
          nativeLanguage: nativeLanguage,
          priorExperience: priorExperience,
          preference: preference,
          profileImage: profileImage,
          reviewWords: reviewWords,
          weaknesses: weaknesses,
        },

        $push: { knownWords: { $each: knownWords } },
      });
      res.status(201).json({
        success: true,
        message: "User updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = UserHandler;
