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
        return res.status(400).json({
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

  async updateUser(req, res) {
    try {
      const id = req.params.id;
      const { profileImage, reviewWords, knownWords, weaknesses } = req.body;

      const updatedUser = await this.User.findByIdAndUpdate(
        id,
        {
          profileImage,
          reviewWords,
          knownWords,
          weaknesses,
        }
        // (error, updatedUser) => {
        //   if (error) {
        //     console.log("error updating user", err);
        //   } else {
        //     console.log("Updated user:", updatedUser);
        //   }
        // }
      );
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
