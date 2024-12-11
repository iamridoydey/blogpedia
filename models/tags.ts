import { Tag } from "@/types";
import { model, Schema } from "mongoose";

//Tag schema
const tagSchema = new Schema<Tag>({
  tag: {
    type: String,
    required: true,
    unique: true,
    lowercase: true, 
  },
  usage: {
    type: Number,
    required: true,
    default: 0,
  },
});

// Atomic update for incrementing the usage count when a tag is used
tagSchema.statics.incrementUsage = async function(tagName: string) {
  const tag = await this.findOneAndUpdate(
    { tag: tagName.toLowerCase() },
    // Increment usage by 1
    { $inc: { usage: 1 } },
    { new: true, upsert: true }
  );
  return tag;
};

// Atomic update for decrementing the usage count when a tag is removed
tagSchema.statics.decrementUsage = async function(tagName: string) {
  const tag = await this.findOneAndUpdate(
    { tag: tagName.toLowerCase() },
    // Decrement usage by 1
    { $inc: { usage: -1 } },
    { new: true }
  );

  // If usage drops below 0, we reset it to 0 to avoid negative values
  if (tag && tag.usage < 0) {
    tag.usage = 0;
    await tag.save();
  }

  return tag;
};

const TagModel = model<Tag>("Tag", tagSchema);

export default TagModel;