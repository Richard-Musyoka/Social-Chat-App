import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";

const MessageBar = () => {
  const emojiRef = useRef();
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [message, setMessage] = useState("");

  // Handles clicks outside the emoji picker
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPickerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handles adding emoji to the input
  const handleAddEmoji = (emoji) => {
    setMessage((prevMessage) => prevMessage + emoji.emoji);
  };

  // Handles sending the message
  const handleSendMessage = async () => {
    if (message.trim() !== "") {
      console.log("Message sent:", message);
      // Add functionality to send the message (e.g., API call or socket emit)
      setMessage(""); // Clear the input after sending
    } else {
      console.log("Cannot send an empty message.");
    }
  };

  return (
    <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6">
      <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-3 sm:gap-5 pr-3 sm:pr-5">
        {/* Input Field */}
        <input
          type="text"
          className="flex-1 p-3 sm:p-5 bg-transparent rounded-md focus:outline-none"
          placeholder="Enter Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        {/* Attachment Button */}
        <button
          className="text-neutral-500 focus:outline-none hover:text-white duration-300 transition-all"
        >
          <GrAttachment className="text-xl sm:text-2xl" />
        </button>

        {/* Emoji Picker Button */}
        <div className="relative" ref={emojiRef}>
          <button
            className="text-neutral-500 focus:outline-none hover:text-white duration-300 transition-all"
            onClick={() => setEmojiPickerOpen(!emojiPickerOpen)}
          >
            <RiEmojiStickerLine className="text-xl sm:text-2xl" />
          </button>
          {emojiPickerOpen && (
            <div className="absolute bottom-16 right-0 z-50">
              <EmojiPicker
                theme="dark"
                onEmojiClick={handleAddEmoji}
                autoFocusSearch={false}
              />
            </div>
          )}
        </div>
        </div>

        {/* Send Button */}
        <button
          className="bg-[#8417ff] rounded-md flex items-center justify-center p-3 sm:p-5 hover:bg-[#741bda] duration-300 transition-all"
          onClick={handleSendMessage}
        >
          <IoSend className="text-xl sm:text-2xl text-white" />
        </button>
      </div>
  );
};

export default MessageBar;