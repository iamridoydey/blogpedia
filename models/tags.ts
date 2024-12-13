import { model, Schema, Model } from "mongoose";
import { Tag } from "@/types"; // Assuming you have a Tag interface defined

// Extend the Model interface to include static methods
interface TagModel extends Model<Tag> {
  incrementUsage(tagName: string): Promise<Tag | null>;
  decrementUsage(tagName: string): Promise<Tag | null>;
}

// Define the Tag schema
const tagSchema = new Schema<Tag, TagModel>({
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

// Implement the static methods
tagSchema.statics.incrementUsage = async function (tagName: string) {
  const tag = await this.findOneAndUpdate(
    { tag: tagName.toLowerCase() },
    { $inc: { usage: 1 } },
    { new: true, upsert: true }
  );
  return tag;
};

tagSchema.statics.decrementUsage = async function (tagName: string) {
  const tag = await this.findOneAndUpdate(
    { tag: tagName.toLowerCase() },
    { $inc: { usage: -1 } },
    { new: true }
  );

  if (tag && tag.usage < 0) {
    tag.usage = 0;
    await tag.save();
  }

  return tag;
};

// Create the model with the extended interface
const TagModel = model<Tag, TagModel>("Tag", tagSchema);

export default TagModel;
