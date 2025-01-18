import { useInputValidation } from "6pp";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { useAuth } from "@/utils/AuthContext";
import { emailValidator } from "@/utils/validators";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const email = useInputValidation("", emailValidator);
  const password = useInputValidation("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const envEmail = import.meta.env.VITE_ADMIN_LOGIN_EMAIL;
    const envPassword = import.meta.env.VITE_ADMIN_LOGIN_PASSWORD;

    if (email.value === envEmail && password.value === envPassword) {
      try {
        const response = await fetch('https://project-backend-1-93ag.onrender.com/api/auth/admin-api/admin-user-login/admin-login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: email.value, password: password.value }),
        });

        const data = await response.json();
        console.log( data.token)
        localStorage.setItem('token', data.token);
     

        if (data.success) {
          // Store email in localStorage for MFA verification
          localStorage.setItem('tempEmail', email.value);
          // login();
          //  navigate('/');
          // // Always redirect to MFA page - the page will handle both setup and verification
          navigate('/mfa');
        } else {
          toast.error('Invalid credentials');
        }
      } catch (error) {
        console.error('Login error:', error);
        toast.error('An error occurred during login');
      }
    } else {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="flex items-center justify-center pt-[4rem]">
      <Card className="bg-transparent w-full max-w-md rounded-lg mb-[60px] border-none dark">
        <CardHeader>
          <CardTitle className="text-center text-[28px] font-medium">
            Login Account
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="email"
                  className="block text-sm text-[#9d9d9d] font-normal py-1"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  className="w-full h-12 pl-3 rounded-lg !text-[#9d9d9d] !placeholder-[#9d9d9d] bg-transparent border-[#e0effe] focus:border-none"
                  value={email.value}
                  onChange={email.changeHandler}
                  required
                />
                {email.error && (
                  <span className="text-red-500 text-xs">{email.error}</span>
                )}
              </div>
              <div>
                <Label
                  htmlFor="password"
                  className="block text-sm text-[#9d9d9d] font-normal py-1"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full h-12 pl-3 pr-10 rounded-lg !text-[#9d9d9d] !placeholder-[#9d9d9d] !bg-transparent border-[#e0effe] focus:border-none"
                    value={password.value}
                    onChange={password.changeHandler}
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 px-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-[#9d9d9d]" />
                    ) : (
                      <Eye className="w-5 h-5 text-[#9d9d9d]" />
                    )}
                  </button>
                </div>
                {password.error && (
                  <span className="text-red-500 text-xs">{password.error}</span>
                )}
              </div>
            </div>

            <Button
              type="submit"
              variant="login"
              className="w-full text-sm font-normal mt-8"
            >
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppLayout()(Login);