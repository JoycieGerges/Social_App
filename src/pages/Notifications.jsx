import routeImg from "../assets/Images/route.png";
import { FiHome } from "react-icons/fi";
import { LuUser, LuCheckCheck } from "react-icons/lu";
import { FaRegComment } from "react-icons/fa6";
import DefaultProfile from "../assets/Images/default-profile.png";
import { IoIosMenu } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import axios from "axios";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [unreadCount, setUnreadCount] = useState(0);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const headerMenuRef = useRef(null);
  const [open, setOpen] = useState(false);

  const getConfig = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };


  useEffect(() => {
    function handleClickOutside(e) {
      if (headerMenuRef.current && !headerMenuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

 
  const getNotifications = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        "https://route-posts.routemisr.com/notifications",
        getConfig()
      );
      const notifs = data?.data?.notifications || [];
      setNotifications(notifs);
      setUnreadCount(notifs.filter((n) => !n.isRead).length);
    } catch (error) {
      console.log("Error fetching notifications:", error.response || error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getNotifications();
  }, []);

 
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await fetch(
          "https://route-posts.routemisr.com/users/profile-data",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        if (res.ok) setProfile(data?.data?.user);
      } catch (error) {
        console.error("Profile error:", error);
      }
    };
    fetchProfile();
  }, []);


  const markAsRead = async (id) => {
    try {
      await axios.patch(
        `https://route-posts.routemisr.com/notifications/${id}/read`,
        {},
        getConfig()
      );
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (error) {
      console.log(error);
    }
  };


  const markAllAsRead = async () => {
    try {
      await axios.patch(
        "https://route-posts.routemisr.com/notifications/read-all",
        {},
        getConfig()
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredNotifications =
    filter === "unread"
      ? notifications.filter((n) => !n.isRead)
      : notifications;

  return (
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
              href="/home"
              className="relative flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-sm font-extrabold transition sm:gap-2 sm:px-3.5 text-slate-600 hover:bg-white/90 hover:text-slate-900"
            >
              <FiHome className="text-lg" />
              <span className="hidden sm:inline">Feed</span>
            </a>
            <a
              href="/profile"
              className="relative flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-sm font-extrabold transition sm:gap-2 sm:px-3.5 text-slate-600 hover:bg-white/90 hover:text-slate-900"
            >
              <LuUser className="text-lg" />
              <span className="hidden sm:inline">Profile</span>
            </a>
            <a
              href="/notifications"
              className="relative flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-sm font-extrabold transition sm:gap-2 sm:px-3.5 bg-white text-[#1f6fe5]"
            >
              <FaRegComment className="text-lg" />
              <span className="hidden sm:inline">Notifications</span>
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </a>
          </nav>

          <div className="relative" ref={headerMenuRef}>
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2 py-1.5 transition hover:bg-slate-100"
            >
              <img
                alt="Profile"
                className="h-8 w-8 rounded-full object-cover"
                src={profile?.photo || DefaultProfile}
              />
              <span className="hidden max-w-[140px] truncate text-sm font-semibold text-slate-800 md:block">
                {profile?.name || "User"}
              </span>
              <IoIosMenu />
            </button>

            {open && (
              <div className="absolute right-0 z-50 mt-2 w-52 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                <Link to="/profile">
                  <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                    <LuUser /> Profile
                  </button>
                </Link>
                <Link to="/settings">
                  <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                    <IoSettingsOutline /> Settings
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
        <main>
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm sm:rounded-2xl">

   
            <div className="border-b border-slate-200 p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black text-slate-900 sm:text-2xl">
                    Notifications
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Realtime updates for likes, comments, shares, and follows.
                  </p>
                </div>
                <button
                  onClick={markAllAsRead}
                  disabled={!unreadCount}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  <LuCheckCheck />
                  Mark all as read
                </button>
              </div>

        
              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={() => setFilter("all")}
                  className={`rounded-full px-4 py-1.5 text-sm font-bold transition ${
                    filter === "all"
                      ? "bg-[#1877f2] text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter("unread")}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold transition ${
                    filter === "unread"
                      ? "bg-[#1877f2] text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  Unread
                  <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-[#1877f2]">
                    {unreadCount}
                  </span>
                </button>
              </div>
            </div>

            <div className="space-y-2 p-3 sm:p-4">
              {loading ? (
                <p className="py-8 text-center text-sm text-slate-500">
                  Loading notifications...
                </p>
              ) : filteredNotifications.length === 0 ? (
                <p className="py-8 text-center text-sm text-slate-500">
                  No notifications
                </p>
              ) : (
                filteredNotifications.map((n) => (
                  <article
                    key={n._id}
                    className={`group relative flex gap-3 rounded-xl border p-3 transition sm:rounded-2xl sm:p-4 ${
                      !n.isRead
                        ? "border-[#dbeafe] bg-[#edf4ff] hover:bg-[#e7f3ff]"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        alt={n.sender?.name || "User"}
                        className="h-11 w-11 rounded-full object-cover"
                        src={n.sender?.photo || DefaultProfile}
                      />
                      <span className="absolute -bottom-1 -right-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white ring-2 ring-white text-[#1877f2]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"></path>
                        </svg>
                      </span>
                    </div>

                 
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-1.5 sm:gap-2">
                        <p className="text-sm leading-6 text-slate-800">
                          <span className="font-extrabold">
                            {n.sender?.name || "User"}
                          </span>{" "}
                          {n.message}
                        </p>
                        <span className="text-xs font-semibold text-slate-500">
                          {n.timeAgo}
                        </span>
                      </div>

                      {n.details && (
                        <p className="mt-0.5 text-sm text-slate-600">{n.details}</p>
                      )}

                      <div className="mt-2 flex items-center gap-2">
                        {n.isRead ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20 6 9 17l-5-5"></path>
                            </svg>
                            Read
                          </span>
                        ) : (
                          <button
                            onClick={() => markAsRead(n._id)}
                            className="inline-flex items-center gap-1.5 rounded-md bg-white px-2.5 py-1 text-xs font-bold text-[#1877f2] ring-1 ring-[#dbeafe] transition hover:bg-[#e7f3ff]"
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}