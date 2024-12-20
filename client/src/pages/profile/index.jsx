import { useAppStore } from "@/store";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { AvatarImage ,Avatar} from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { ADD_PROFILE_IMAGE_ROUTE, REMOVE_PROFILE_IMAGE_ROUTE, UPDATE_PROFILE_ROUTE } from "@/utils/constants";

const HOST = "http://localhost:3001"; // Replace with the actual base URL


const Profile = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState( "");
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const [loading, setLoading] = useState(false);
  const fileInputRef= useRef(null);
  const colors = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500"];


  const handleFileInputClick = ()=>{
    fileInputRef.current.click();
  }


  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    
    if (!file) {
      console.error("No file selected");
      toast.error("Please select a file to upload.");
      return;
    }
  
    console.log("Selected file:", file);
  
    const formData = new FormData();
    formData.append("profile-image", file); // Adjust the field name if required by the server

    console.log("FormData content:");
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value); // Verify FormData contents
    }
  
    const response = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE, formData, {
      withCredentials: true, // Ensure this is necessary
      headers: {
        'Content-Type': 'multipart/form-data', // Optional; axios sets this automatically
      },
    });
    
  
      if (response.status === 200 && response.data.image) {
        setUserInfo({ ...userInfo, image: response.data.image });
        toast.success("Image updated successfully");
      } else {
        toast.error(response.data?.message || "Failed to upload the image.");
      }
    
  };
  
  

  const handleDeleteImage = async () => {
    try {
      const response = await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE, { withCredentials: true });
  
      if (response.status === 200) {
        setUserInfo({ ...userInfo, image: null });  // Update userInfo state with image set to null
        toast.success("Image deleted successfully.");
        setImage(null);  // Remove image from local state to reflect UI changes
      } else {
        toast.error("Failed to delete the image. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while deleting the image.");
    }
  };
  

  useEffect(() => {
    // Check if userInfo exists and has the necessary properties
    if (userInfo) {
      if (userInfo.profileSetup) {
        setFirstName(userInfo.firstName);
        setLastName(userInfo.lastName);
        setSelectedColor(userInfo.selectedColor);
      }
      if (userInfo.image) {
        setImage(`${HOST}/${userInfo.image}`); // Make sure HOST is correctly defined
      }
    }
  }, [userInfo]); // Re-run effect when userInfo changes
  

  const validateProfile = () => {
    if (!firstName || !lastName) {
      toast.error("First and last names are required");
      return false;
    }
    return true;
  };

  const updateProfile = async () => {
    if (!validateProfile()) {
      return;
    }

    setLoading(true);

    try {
      const response = await apiClient.post(
        UPDATE_PROFILE_ROUTE,
        { firstName, lastName, color: selectedColor },
        { withCredentials: true }
      );

      if (response.status === 200 && response.data) {
        setUserInfo({ ...response.data });
        toast.success("Profile updated successfully.");
        navigate("/chat");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred while updating the profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = () =>{
    if(userInfo.profileSetup){
      navigate("/chat");
    }else{
      toast.error("Please Setup your Profile.");
    }
   
  }

  return (
    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 w-screen h-screen flex items-center justify-center p-5">
      <div className="bg-white/20 p-10 rounded-lg shadow-full w-full max-w-md flex flex-col items-center gap-6">
        {/* Back Icon */}
        <IoArrowBack
          className="text-4xl text-white cursor-pointer absolute top-10 left-10"
          onClick={() => handleNavigation()}
        />
        
        {/* Title */}
        <h2 className="text-white text-3xl font-semibold mb-6">Update Profile</h2>

        {/* Avatar Section */}
        <div
          className="relative flex flex-col items-center"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <div className="relative h-48 w-48 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
            {image ? (
              <Avatar className="w-full h-full rounded-full">
              <AvatarImage
                src={image}
                alt="profile"
                className="object-cover w-full h-full rounded-full"
              />
              </Avatar>
            ) : (
              <div
                className={`uppercase h-full w-full flex items-center justify-center text-5xl font-bold ${getColor(
                  selectedColor
                )}`}
              >
                {firstName
                  ? firstName[0].toUpperCase()
                  : userInfo.email[0].toUpperCase()}
              </div>
            )}
            {hovered && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer"
                onClick={image ? handleDeleteImage : handleFileInputClick}
              >
                {image ? (
                  <FaTrash className="text-white text-4xl" />
                ) : (
                  <FaPlus className="text-white text-4xl" />
                )}
                <Input type="file" ref={fileInputRef} className="hidden" onChange={handleImageUpload} name="profile-image" accept=".png, .jpg, .jpeg,.svg, .webp" />
              </div>
            )}
          </div>

          {/* Name Display */}
          <p className="text-white text-2xl font-semibold mt-4">{`${firstName} ${lastName}`}</p>
        </div>

        {/* Input Section */}
        <div className="flex flex-col gap-6 w-full bg-[#2c2e3b] p-8 rounded-lg">
          <Input
            placeholder="Email"
            type="email"
            disabled
            value={userInfo.email}
            className="rounded-lg p-4 bg-gray-700 text-white border-none"
          />
          <Input
            placeholder="First Name"
            type="text"
            onChange={(e) => setFirstName(e.target.value)}
            value={firstName}
            className="rounded-lg p-4 bg-gray-700 text-white border-none"
          />
          <Input
            placeholder="Last Name"
            type="text"
            onChange={(e) => setLastName(e.target.value)}
            value={lastName}
            className="rounded-lg p-4 bg-gray-700 text-white border-none"
          />
          <div className="flex gap-5 justify-center">
            {colors.map((color, index) => (
              <div
                key={index}
                className={`${color} h-10 w-10 rounded-full cursor-pointer transition-all duration-300 ${
                  selectedColor === index ? "ring-2 ring-white" : ""
                }`}
                onClick={() => setSelectedColor(index)}
              ></div>
            ))}
          </div>
          <Button
            onClick={updateProfile}
            className="mt-6 bg-blue-500 text-white rounded-lg py-4"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Details"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
