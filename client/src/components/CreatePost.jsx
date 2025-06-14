import React, { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { readFileAsDataURL } from "@/lib/utils";
import { Post_API } from "@/utils/constant";
import { setPosts } from "@/redux/postSlice";
import { GoogleGenerativeAI } from "@google/generative-ai";

const CreatePost = ({ open, setOpen }) => {
  const imageRef = useRef();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);

  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [caption, setCaption] = useState("");
  const [imageDescription, setImageDescription] = useState("");
  const [selectedTone, setSelectedTone] = useState("Poetic");
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const tones = ["Funny", "Poetic", "Informative", "Emotional"];

  const tonePrompts = {
    Funny:
      "Generate a witty and humorous Instagram caption under 30 words. Add 1–2 funny emojis and 1–2 trending hashtags.",
    Poetic:
      "Generate a poetic Instagram caption in the style of William Shakespeare. Max 30 words. Include 1–2 deep poetic emojis and 1–2 relevant hashtags.",
    Informative:
      "Generate an informative Instagram caption under 30 words using the following image details: ",
    Emotional:
      "Generate a deeply emotional Instagram caption that evokes feelings. Max 30 words. Include 1–2 heart-touching emojis and 1–2 relevant hashtags.",
  };

  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

  // Handle image upload + preview
  const fileChangeHandler = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    const previewDataURL = await readFileAsDataURL(selectedFile);
    setImagePreview(previewDataURL);
  };

  // Generate AI caption using Gemini AI
  const generateAICaption = async () => {
    if (selectedTone === "Informative" && !imageDescription.trim()) {
      toast.error("Please describe the image for informative captions.");
      return;
    }

    setAiLoading(true);

    try {
      const model = genAI.getGenerativeModel({
        model: "models/gemini-2.0-flash",
      });

      let prompt = tonePrompts[selectedTone];
      if (selectedTone === "Informative") {
        prompt += `${imageDescription.trim()}. Include 1–2 emojis and relevant hashtags.`;
      }

      const result = await model.generateContent([prompt]);

      // Extract caption text from result
      let aiCaption = null;

      if (typeof result.response?.text === "function") {
        aiCaption = await result.response.text();
      } else if (result.response?.candidates?.length > 0) {
        aiCaption = result.response.candidates[0].content;
      }

      if (aiCaption) {
        setCaption(aiCaption.trim());
        toast.success("AI Caption generated!");
      } else {
        throw new Error("No caption returned from AI");
      }
    } catch (error) {
      console.error("AI Caption Error:", error);
      toast.error("Failed to generate caption");
    } finally {
      setAiLoading(false);
    }
  };

  // Create post handler
  const createPostHandler = async () => {
    if (!caption.trim()) {
      toast.error("Caption cannot be empty");
      return;
    }

    const formData = new FormData();
    formData.append("caption", caption);
    if (file) formData.append("image", file);

    setLoading(true);
    try {
      const res = await axios.post(`${Post_API}/addpost`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        dispatch(setPosts([res.data.post, ...posts]));
        toast.success(res.data.message);
        setOpen(false);
        // Reset all fields
        setCaption("");
        setFile(null);
        setImagePreview("");
        setImageDescription("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Post creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="max-h-[80vh] overflow-y-auto mx-auto"
        style={{ minWidth: "320px" }}
      >
        <DialogHeader className="text-center font-semibold">Create Post</DialogHeader>

        {/* User Info */}
        <div className="flex items-center gap-3 mb-3">
          <Avatar>
            <AvatarImage src={user?.profilePicture} alt={user?.username} />
            <AvatarFallback>{user?.username?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-xs">{user?.username}</h1>
          </div>
        </div>

        {/* Tone Selector */}
        <div className="mb-3">
          <label className="text-sm font-medium">Select Caption Tone</label>
          <select
            value={selectedTone}
            onChange={(e) => setSelectedTone(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md bg-white text-sm"
          >
            {tones.map((tone) => (
              <option key={tone} value={tone}>
                {tone}
              </option>
            ))}
          </select>
        </div>

        {/* Image Description (only for Informative) */}
        {selectedTone === "Informative" && (
          <div className="mb-3">
            <label className="text-sm font-medium">Describe the image</label>
            <Textarea
              value={imageDescription}
              onChange={(e) => setImageDescription(e.target.value)}
              placeholder="Describe your image..."
              rows={3}
              className="mt-1"
            />
          </div>
        )}

        {/* Caption Textarea (always visible) */}
        <Textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Write a caption..."
          rows={5}
          className="focus-visible:ring-transparent border-none mb-3"
        />

        {/* Generate AI Caption Button */}
        <Button
          onClick={generateAICaption}
          disabled={aiLoading || (selectedTone === "Informative" && !imageDescription.trim())}
        >
          {aiLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate AI Caption"
          )}
        </Button>

        {/* Image Preview */}
        {imagePreview && (
          <div className="w-full h-64 flex items-center justify-center bg-gray-100 rounded-md overflow-hidden mt-4 mb-4">
            <img src={imagePreview} alt="preview" className="h-full w-full object-contain" />
          </div>
        )}

        {/* Hidden Image Input */}
        <input
          ref={imageRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={fileChangeHandler}
        />

        {/* Upload Image Button */}
        <Button
          variant="link"
          onClick={() => imageRef.current.click()}
          className="w-fit mx-auto text-black hover:text-blue-500 transition-colors duration-200"
        >
          Upload Image
        </Button>

        {/* Post Button */}
        {imagePreview && (
          <>
            {loading ? (
              <Button disabled className="w-full mt-4">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button onClick={createPostHandler} className="w-full mt-4">
                Post
              </Button>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
