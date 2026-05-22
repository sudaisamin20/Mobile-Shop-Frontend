import { useState } from "react";
import { PageBackground } from "../../components/ui/index";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Divider } from "../../components/ui/Misc";
import { Layout } from "../../layout";

const SignupPage = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agreed, setAgreed] = useState(false);

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required.";
    if (!form.email.includes("@")) e.email = "Enter a valid email.";
    if (form.phone.length < 10) e.phone = "Enter a valid phone number.";
    if (form.password.length < 6)
      e.password = "Password must be at least 6 characters.";
    if (form.password !== form.confirm) e.confirm = "Passwords do not match.";
    if (!agreed) e.agreed = "You must accept the terms.";
    return e;
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    // TODO: wire up your registration logic here
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <PageBackground>
      <Layout title="Signup - BMC">
        <div className="min-h-screen w-full flex flex-col justify-center items-center px-4 py-16">
          {/* Card */}
          <div className="w-full max-w-md">
            <div className="absolute -inset-1 bg-linear-to-br from-yellow-400/10 via-purple-600/10 to-blue-600/10 rounded-3xl blur-2xl pointer-events-none" />

            <Card padding="lg" className="relative">
              <Card.Header>
                <div className="text-center space-y-1">
                  <Badge variant="yellow" dot>
                    New Account
                  </Badge>
                  <h1 className="text-2xl font-black text-white mt-2">
                    Create Account
                  </h1>
                  <p className="text-gray-400 text-sm">
                    Join thousands of happy customers
                  </p>
                </div>
              </Card.Header>

              <Card.Body>
                <form onSubmit={handleSignup} className="space-y-4 mt-2">
                  <Input
                    label="Full Name"
                    type="text"
                    placeholder="Basit Khan"
                    value={form.fullName}
                    onChange={set("fullName")}
                    prefix="👤"
                    error={errors.fullName}
                    required
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={set("email")}
                    prefix="✉️"
                    error={errors.email}
                    required
                  />
                  <Input
                    label="Phone Number"
                    type="tel"
                    placeholder="0300-1234567"
                    value={form.phone}
                    onChange={set("phone")}
                    prefix="📞"
                    error={errors.phone}
                    required
                  />
                  <Input
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={set("password")}
                    prefix="🔒"
                    error={errors.password}
                    hint="Minimum 6 characters"
                    required
                  />
                  <Input
                    label="Confirm Password"
                    type="password"
                    placeholder="••••••••"
                    value={form.confirm}
                    onChange={set("confirm")}
                    prefix="🔑"
                    error={errors.confirm}
                    required
                  />

                  {/* Terms */}
                  <div className="space-y-1">
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded border border-white/20 bg-white/5 accent-purple-500 cursor-pointer flex-shrink-0"
                      />
                      <span className="text-gray-400 text-sm leading-relaxed">
                        I agree to the{" "}
                        <a
                          href="#"
                          className="text-yellow-400 hover:text-yellow-300 font-medium"
                        >
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a
                          href="#"
                          className="text-yellow-400 hover:text-yellow-300 font-medium"
                        >
                          Privacy Policy
                        </a>
                      </span>
                    </label>
                    {errors.agreed && (
                      <p className="text-xs text-red-400 flex items-center gap-1 pl-7">
                        ⚠ {errors.agreed}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    variant="secondary"
                    size="lg"
                    fullWidth
                    loading={loading}
                    className="mt-1"
                  >
                    Create Account
                  </Button>
                </form>

                <Divider label="or sign up with" className="my-6" />

                <div className="grid grid-cols-2 gap-3">
                  <Button variant="dark" size="md" iconLeft="🌐" fullWidth>
                    Google
                  </Button>
                  <Button variant="dark" size="md" iconLeft="📘" fullWidth>
                    Facebook
                  </Button>
                </div>
              </Card.Body>

              <Card.Footer>
                <p className="text-center text-gray-500 text-sm">
                  Already have an account?{" "}
                  <a
                    href="/login"
                    className="text-yellow-400 hover:text-yellow-300 font-semibold transition-colors"
                  >
                    Sign In
                  </a>
                </p>
              </Card.Footer>
            </Card>
          </div>

          <a
            href="/"
            className="mt-6 text-gray-500 text-sm hover:text-gray-300 transition-colors flex items-center gap-1.5"
          >
            ← Back to Home
          </a>
        </div>
      </Layout> 
    </PageBackground>
  );
};

export default SignupPage;
