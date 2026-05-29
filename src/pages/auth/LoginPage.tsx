import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowLeft, X } from "lucide-react";
import { useAuth } from "../../hooks";
import { validateAuthResponse } from "../../helpers/DebugHelper";
import { PageBackground } from "../../components/ui/index";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Divider, useToast } from "../../components/ui/Misc";
import { Layout } from "../../layout";
import { useAppSelector } from "../../app/index";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loading, error, clearErrorMessage } = useAuth();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  console.log('🔍 LoginPage - Auth State:', { isAuthenticated, user });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { addToast } = useToast();

  // Debug: Log user state changes
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('🔍 LoginPage - Auth State Updated:', {
        isAuthenticated,
        user,
        loading,
        error,
        userRole: user?.role
      });
    }
  }, [isAuthenticated, user, loading, error]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect to dashboard if admin, else to home
      console.log('✅ User authenticated, redirecting...', { role: user.role });
      if (user.role === "ADMIN") {
        navigate("/admin/dashboard", { replace: true });
      } else if (user.role === "USER") {
        navigate("/", { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      return;
    }

    try {
      console.log('🔐 Attempting login with email:', email);
      const result = await login({ email, password });
      
      console.log('📥 Login result:', result);
      
      // Check if login was successful
      if (result?.payload) {
        const validation = validateAuthResponse(result.payload);
        console.log('✔️ Auth response validation:', validation);
        
        if (validation.valid) {
          addToast({ message: "Login successful, redirecting...", type: "success" });
        } else {
          console.error('❌ Auth response validation failed:', validation.error);
          addToast({ message: validation.error || "Login failed", type: "error" });
        }
      } else if (result?.error) {
        console.error('❌ Login failed:', result.error);
      }
    } catch (err) {
      console.error("🔥 Login error:", err);
      addToast({ message: "Login failed", type: "error" });
    }
  };

  return (
    <PageBackground>
      <Layout title="Login - Basit Mobile Zone">
        <div className="min-h-screen w-full flex flex-col justify-center items-center px-4 py-16">
          {/* Card */}
          <div className="w-full max-w-md">
            {/* Glow */}
            <div className="absolute -inset-1 bg-gradient-to-br from-yellow-400/10 via-purple-600/10 to-blue-600/10 rounded-3xl blur-2xl pointer-events-none" />

            <Card padding="lg" className="relative">
              <Card.Header>
                <div className="text-center space-y-1">
                  <Badge variant="purple" dot>
                    Welcome Back
                  </Badge>
                  <h1 className="text-2xl font-black text-white mt-2">Login</h1>
                  <p className="text-gray-400 text-sm">
                    Enter your credentials to continue
                  </p>
                </div>
              </Card.Header>

              <Card.Body>
                <form onSubmit={handleLogin} className="space-y-4 mt-2">
                  {/* Error Alert */}
                  {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center justify-between w-full gap-3">
                      <span className="text-red-400 text-sm font-medium">{error}</span>
                      <button
                        type="button"
                        onClick={clearErrorMessage}
                        className="text-red-400 hover:text-red-300 text-xs"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}

                  {/* Email Input */}
                  <Input
                    label="Email Address"
                    type="email"
                    helper="Email Address"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    prefix={<Mail size={18} className="text-gray-400" />}
                    disabled={loading}
                    required
                  />

                  {/* Password Input */}
                  <Input
                    label="Password"
                    type="password"
                    helper="Password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    prefix={<Lock size={18} className="text-gray-400" />}
                    disabled={loading}
                    required
                  />

                  {/* Remember & Forgot */}
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 text-gray-400 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border border-white/20 bg-white/5 accent-purple-500 cursor-pointer"
                      />
                      Remember me
                    </label>
                    <a
                      href="#"
                      className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors"
                    >
                      Forgot password?
                    </a>
                  </div>

                  {/* Login Button */}
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={loading}
                    disabled={loading}
                    className="mt-2"
                  >
                    {loading ? "Logging in..." : "Login"}
                  </Button>
                </form>

                <Divider label="or" className="my-6" />

                {/* Social logins - Disabled for now */}
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="dark" size="md" fullWidth disabled>
                    Google
                  </Button>
                  <Button variant="dark" size="md" fullWidth disabled>
                    GitHub
                  </Button>
                </div>
              </Card.Body>

              <Card.Footer>
                <p className="text-center text-sm text-gray-400">
                  Don't have an account?{" "}
                  <a
                    href="/signup"
                    className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors"
                  >
                    Sign up here
                  </a>
                </p>
              </Card.Footer>
            </Card>
          </div>

          {/* Back to home */}
          <button
            onClick={() => navigate("/")}
            className="mt-6 text-gray-500 text-sm hover:text-gray-300 transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft size={16} /> Back to Home
          </button>
        </div>
      </Layout>
    </PageBackground>
  );
};

export default LoginPage;