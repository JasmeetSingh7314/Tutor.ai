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
        levelOfFluencyInTargetLanguage,
        nativeLanguage,
      } = req.body;

      const existingUser = await this.User.findOne({
        $or: [{ email }, { walletAddress }],
      });

      if (existingUser) {
        return res
          .status(400)
          .json({ success: false, message: "User already exists" });
      }
      const newUser = await this.User.create({
        fullName,
        email,
        walletAddress,
        profileImage,
        preference,
        targetLanguage,
        levelOfFluencyInTargetLanguage,
        nativeLanguage,
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
}

module.exports = UserHandler;
