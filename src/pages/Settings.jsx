import { FiHome } from "react-icons/fi";
import { LuUser } from "react-icons/lu";
import { FaRegComment } from "react-icons/fa6";
import DefaultProfile from "../assets/Images/default-profile.png";
import { IoIosMenu } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import routeImg from "../assets/Images/route.png";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { VscKey } from "react-icons/vsc";

export default function Settings() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.newPassword !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://route-posts.routemisr.com/users/change-password",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            password: formData.currentPassword,
            newPassword: formData.newPassword,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      localStorage.setItem("token", data.token);

      setSuccess("Password updated successfully ");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);
  return (
    <div id="root">
      <div className="min-h-screen bg-[#f0f2f5]">
        <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-2 py-1.5 sm:gap-3 sm:px-3">
            <div className="flex items-center gap-3">
              <img
                alt="Route Posts"
                className="h-9 w-9 rounded-xl object-cover"
                src={routeImg}
              />
              <p className="hidden text-xl font-extrabold text-slate-900 sm:block">
                Route Posts
              </p>
            </div>
            <nav className="flex min-w-0 items-center gap-1 overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50/90 px-1 py-1 sm:px-1.5">
              <a
                aria-current="page"
                className="relative flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-sm font-extrabold transition sm:gap-2 sm:px-3.5 text-slate-600 hover:bg-white/90 hover:text-slate-900"
                href="/home"
                data-discover="true"
              >
                <span className="relative">
                  <FiHome className="text-lg" />
                </span>
                <span className="hidden sm:inline">Feed</span>
                <span className="sr-only sm:hidden">Feed</span>
              </a>
              <a
                className="relative flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-sm font-extrabold transition sm:gap-2 sm:px-3.5 text-slate-600 hover:bg-white/90 hover:text-slate-900"
                href="/profile"
                data-discover="true"
              >
                <span className="relative">
                  <LuUser className="text-lg" />
                </span>
                <span className="hidden sm:inline">Profile</span>
                <span className="sr-only sm:hidden">Profile</span>
              </a>
              <a
                className="relative flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-sm font-extrabold transition sm:gap-2 sm:px-3.5 text-slate-600 hover:bg-white/90 hover:text-slate-900"
                href="#/notifications"
                data-discover="true"
              >
                <span className="relative">
                  <FaRegComment className="text-lg" />
                </span>
                <span className="hidden sm:inline">Notifications</span>
                <span className="sr-only sm:hidden">Notifications</span>
              </a>
            </nav>
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2 py-1.5 transition hover:bg-slate-100"
              >
                <img
                  alt="Joycie Gerges"
                  className="h-8 w-8 rounded-full object-cover"
                  src={DefaultProfile}
                />
                <span className="hidden max-w-[140px] truncate text-sm font-semibold text-slate-800 md:block">
                  Joycie Gerges
                </span>
                <IoIosMenu />
              </button>

              {open && (
                <div className="absolute right-0 z-50 mt-2 w-52 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                  <Link to="/profile">
                    <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                      <LuUser />
                      Profile
                    </button>
                  </Link>
                  <Link to="/settings">
                    <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                      <IoSettingsOutline />
                      Settings
                    </button>
                  </Link>
                  <div className="my-1 border-t border-slate-200" />
                  <Link to="/login">
                    <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50">
                      Logout
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>
        <div className="mx-auto max-w-7xl px-3 py-3.5">
          <main className="min-w-0">
            <div className="mx-auto max-w-2xl">
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-5 flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#e7f3ff] text-[#1877f2]">
                    <VscKey className="text-lg" />
                  </span>
                  <div>
                    <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
                      Change Password
                    </h1>
                    <p className="text-sm text-slate-500">
                      Keep your account secure by using a strong password.
                    </p>
                  </div>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-bold text-slate-700">
                      Current password
                    </span>
                    <input
                      type="password"
                      name="currentPassword"
                      placeholder="Enter current password"
                      value={formData.currentPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          currentPassword: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#1877f2] focus:bg-white"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-bold text-slate-700">
                      New password
                    </span>
                    <input
                      type="password"
                      name="newPassword"
                      placeholder="Enter new password"
                      value={formData.newPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          newPassword: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#1877f2] focus:bg-white"
                    />
                    <span className="mt-1 block text-xs text-slate-500">
                      At least 8 characters with uppercase, lowercase, number,
                      and special character.
                    </span>
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-bold text-slate-700">
                      Confirm new password
                    </span>
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Re-enter new password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#1877f2] focus:bg-white"
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex w-full items-center justify-center rounded-xl bg-[#1877f2] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#166fe5] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Updating..." : "Update password"}
                  </button>
                  {error && (
                    <p className="text-sm text-rose-600 text-center">{error}</p>
                  )}

                  {success && (
                    <p className="text-sm text-green-600 text-center">
                      {success}
                    </p>
                  )}
                </form>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
