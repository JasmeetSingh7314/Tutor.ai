const { Schema } = require("mongoose");

const progress = Schema({
  createdBy: { type: Schema.Types.ObjectId, ref: "users" },
  level:{type:Number},
  tier:{type:String},
  
});
