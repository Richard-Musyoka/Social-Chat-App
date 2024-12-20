import { useState } from "react";
import { toast } from "sonner";
import Background from "@/assets/login2.png";
import Victory from "@/assets/Victory.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { apiClient } from "@/lib/api-client";
import { LOGIN_ROUTES, SIGNUP_ROUTES } from "@/utils/constants";
import { Eye, EyeOff } from "lucide-react"; // Add icons for toggling visibility
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";

const Auth = () => {
  const navigate= useNavigate();
  const {setUserInfo} = useAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

  const validateLogin = () => {
    if (!email.trim()) {
      toast.error("Please enter a valid email");
      return false;
    }
    if (!password.trim()) {
      toast.error("Please enter a password");
      return false;
    }
    return true;
  };

  const validateSignup = () => {
    if (!email.trim()) {
      toast.error("Please enter a valid email");
      return false;
    }
    if (!password.trim()) {
      toast.error("Please enter a password");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateLogin()) return;
  
    setLoading(true);
    try {
      const { data } = await apiClient.post(LOGIN_ROUTES, { email, password },{withCredentials:true});
      if (data.user.id) {
        setUserInfo(data.user);
        navigate(data.user.profileSetup ? "/chat" : "/profile");
        toast.success("Login successful!");
      }
    } catch (error) {
      console.error("Login error:", error.response || error.message);
      toast.error(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validateSignup()) return;

    setLoading(true);
    try {
      const response = await apiClient.post(
        SIGNUP_ROUTES,
        { email, password },
        { withCredentials: true }
      );
      if(response.status==201){
        setUserInfo(response.data.user);
        navigate("/profile");
      }
      toast.success("Signup successful! Please log in.");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setActiveTab("login");
    } catch (error) {
      toast.error("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
      <div className="h-[80vh] bg-white shadow-lg w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2 overflow-hidden">
        <div className="hidden xl:flex justify-center items-center bg-gradient-to-br from-blue-500 to-indigo-500">
          <img src={Background} alt="background login" className="h-[80%] object-contain" />
        </div>

        <div className="flex flex-col items-center justify-center w-full px-6 py-8">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="flex items-center justify-center mb-4">
              <h1 className="text-5xl font-bold text-gray-800">Welcome</h1>
              <img src={Victory} alt="Victory Emoji" className="h-[50px] ml-3" />
            </div>
            <p className="font-medium text-gray-600">
              Fill in the details to get started with the best chat app!
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="flex justify-center gap-4 border-b pb-2 mb-6">
              <TabsTrigger value="login" className="px-4 py-2 font-medium">
                Login
              </TabsTrigger>
              <TabsTrigger value="signup" className="px-4 py-2 font-medium">
                Signup
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="p-6">
                <div className="relative mb-4">
                  <Input
                    id="email"
                    type="email"
                    className="w-full p-2 border rounded-lg"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>
                <div className="relative mb-4">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="w-full p-2 border rounded-lg"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                  />
                  <div
                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full py-2 px-4 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="p-6">
                <div className="relative mb-4">
                  <Input
                    id="email"
                    type="email"
                    className="w-full p-2 border rounded-lg"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>
                <div className="relative mb-4">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="w-full p-2 border rounded-lg"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                  />
                  <div
                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </div>
                </div>
                <div className="relative mb-4">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    className="w-full p-2 border rounded-lg"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                  />
                  <div
                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full py-2 px-4 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600"
                  disabled={loading}
                >
                  {loading ? "Signing up..." : "Signup"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Auth;
