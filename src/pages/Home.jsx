import React, { useState, useRef, useEffect } from "react";
import routeImg from "../assets/images/route.png";
import { FiHome, FiSend, FiThumbsUp } from "react-icons/fi";
import { LuUser, LuEarth } from "react-icons/lu";
import { FaRegComment } from "react-icons/fa6";
import DefaultProfile from "../assets/images/default-profile.png";
import { CiBookmark, CiSearch, CiFaceSmile, CiImageOn } from "react-icons/ci";
import { RiUserAddLine } from "react-icons/ri";
import { TbUsers } from "react-icons/tb";
import { IoIosMenu } from "react-icons/io";
import { IoSettingsOutline, IoShareSocialOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

function timeAgo(dateString) {
  const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];
  for (const iv of intervals) {
    const n = Math.floor(seconds / iv.seconds);
    if (n >= 1) return `${n} ${iv.label}${n > 1 ? "s" : ""} ago`;
  }
  return "just now";
}

const getUserId = (user) => {
  if (!user) return null;
  if (typeof user === "object")
    return user._id ? String(user._id).trim() : null;
  return String(user).trim();
};

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  const [editingComment, setEditingComment] = useState({});
  const [editCommentText, setEditCommentText] = useState({});
  const [openMenuComment, setOpenMenuComment] = useState({});
  const [replies, setReplies] = useState({});
  const [loadingReplies, setLoadingReplies] = useState({});
  const [newReplies, setNewReplies] = useState({});
  const [replyImages, setReplyImages] = useState({});
  const [sendingReply, setSendingReply] = useState({});
  const [newComments, setNewComments] = useState({});
  const [commentImages, setCommentImages] = useState({});
  const [sendingComment, setSendingComment] = useState({});
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState({});
  const [loadingComments, setLoadingComments] = useState({});
  const [showComments, setShowComments] = useState({});
  const [activeButton, setActiveButton] = useState("feed");
  const [open, setOpen] = useState(false);

  const headerMenuRef = useRef(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (headerMenuRef.current && !headerMenuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (!e.target.closest("[data-comment-menu]")) {
        setOpenMenuComment({});
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    getAllPosts();
  }, []);

  const getAllPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      setLoading(true);
      const res = await fetch("https://route-posts.routemisr.com/posts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPosts(data.data.posts || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async (userId) => {
    if (!userId)
      return { name: "Unknown", username: "unknown", photo: DefaultProfile };
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://route-posts.routemisr.com/users/${userId}/profile`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const data = await res.json();
      return (
        data.data || {
          name: "Unknown",
          username: "unknown",
          photo: DefaultProfile,
        }
      );
    } catch {
      return { name: "Unknown", username: "unknown", photo: DefaultProfile };
    }
  };

  const getPostComments = async (postId, page = 1, limit = 10) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      setLoadingComments((prev) => ({ ...prev, [postId]: true }));

      const res = await fetch(
        `https://route-posts.routemisr.com/posts/${postId}/comments?page=${page}&limit=${limit}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const data = await res.json();
      const commentsData = data.data.comments || [];

      const commentsWithUser = await Promise.all(
        commentsData.map(async (cmt) => {
          if (cmt.user && typeof cmt.user === "object" && cmt.user.name) {
            return cmt;
          }

          const userId =
            typeof cmt.user === "object" ? cmt.user?._id : cmt.user;

          if (!userId) {
            return {
              ...cmt,
              user: {
                name: "Unknown",
                username: "unknown",
                photo: DefaultProfile,
              },
            };
          }

          const user = await fetchUserData(String(userId).trim());
          return { ...cmt, user };
        }),
      );

      setComments((prev) => ({ ...prev, [postId]: commentsWithUser }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingComments((prev) => ({ ...prev, [postId]: false }));
    }
  };

  const getCommentReplies = async (postId, commentId, page = 1, limit = 10) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      setLoadingReplies((prev) => ({ ...prev, [commentId]: true }));

      const res = await fetch(
        `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}/replies?page=${page}&limit=${limit}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const data = await res.json();
      const repliesData = data?.data?.replies || [];

      const repliesWithUser = await Promise.all(
        repliesData.map(async (reply) => {
          if (reply.user && typeof reply.user === "object" && reply.user.name) {
            return reply;
          }

          const userId =
            typeof reply.user === "object" ? reply.user?._id : reply.user;

          if (!userId) {
            return {
              ...reply,
              user: {
                name: "Unknown",
                username: "unknown",
                photo: DefaultProfile,
              },
            };
          }

          const user = await fetchUserData(String(userId).trim());
          return { ...reply, user };
        }),
      );

      setReplies((prev) => ({ ...prev, [commentId]: repliesWithUser }));
    } catch (error) {
      console.error("Error fetching replies:", error);
    } finally {
      setLoadingReplies((prev) => ({ ...prev, [commentId]: false }));
    }
  };

  const toggleComments = (postId) => {
    setShowComments((prev) => {
      const next = !prev[postId];
      if (next && !comments[postId]) getPostComments(postId);
      return { ...prev, [postId]: next };
    });
  };

  const handleClick = (name) => {
    setActiveButton(name);
  };

  const getButtonClass = (name) =>
    `mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-bold transition ${
      activeButton === name
        ? "bg-[#e7f3ff] text-[#1877f2]"
        : "text-slate-700 hover:bg-slate-100"
    }`;

  const createComment = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const content = newComments[postId];
      const image = commentImages[postId];
      if (!content && !image) return;

      setSendingComment((prev) => ({ ...prev, [postId]: true }));

      const formData = new FormData();
      if (content) formData.append("content", content);
      if (image) formData.append("image", image);

      await fetch(
        `https://route-posts.routemisr.com/posts/${postId}/comments`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        },
      );

      await getPostComments(postId);
      setNewComments((prev) => ({ ...prev, [postId]: "" }));
      setCommentImages((prev) => ({ ...prev, [postId]: null }));
    } catch (err) {
      console.error("Create comment error:", err);
    } finally {
      setSendingComment((prev) => ({ ...prev, [postId]: false }));
    }
  };

  const createReply = async (postId, commentId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const content = newReplies[commentId];
      const image = replyImages[commentId];
      if (!content && !image) return;

      setSendingReply((prev) => ({ ...prev, [commentId]: true }));

      const formData = new FormData();
      if (content) formData.append("content", content);
      if (image) formData.append("image", image);

      await fetch(
        `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}/replies`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        },
      );

      await getCommentReplies(postId, commentId);
      setNewReplies((prev) => ({ ...prev, [commentId]: "" }));
      setReplyImages((prev) => ({ ...prev, [commentId]: null }));
    } catch (error) {
      console.error("Create reply error:", error);
    } finally {
      setSendingReply((prev) => ({ ...prev, [commentId]: false }));
    }
  };

  const updateComment = async (postId, commentId, newText) => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !newText) return;

      setSendingComment((prev) => ({ ...prev, [commentId]: true }));

      const formData = new FormData();
      formData.append("content", newText);

      await fetch(
        `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        },
      );

      await getPostComments(postId);
      setEditingComment((prev) => ({ ...prev, [commentId]: false }));
    } catch (err) {
      console.error("Update comment error:", err);
    } finally {
      setSendingComment((prev) => ({ ...prev, [commentId]: false }));
    }
  };

  const deleteComment = async (postId, commentId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await fetch(
        `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      await getPostComments(postId);
    } catch (err) {
      console.error("Delete comment error:", err);
    }
  };

  const toggleCommentMenu = (e, commentId) => {
    e.stopPropagation();
    setOpenMenuComment((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const toggleLikePost = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !currentUserId) return;

      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post._id !== postId) return post;

          const alreadyLiked = post.likes?.some(
            (like) =>
              (typeof like === "object" ? like._id : like) === currentUserId,
          );

          const updatedLikes = alreadyLiked
            ? post.likes.filter(
                (like) =>
                  (typeof like === "object" ? like._id : like) !==
                  currentUserId,
              )
            : [...(post.likes || []), currentUserId];

          return { ...post, likes: updatedLikes };
        }),
      );

      const res = await fetch(
        `https://route-posts.routemisr.com/posts/${postId}/like`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const data = await res.json();

      if (data?.data?.likes) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId ? { ...post, likes: data.data.likes } : post,
          ),
        );
      }
    } catch (error) {
      console.error("Like error:", error);
      getAllPosts();
    }
  };

  const filteredPosts = posts.filter((post) => {
    const postUserId = getUserId(post.user);

    if (activeButton === "feed" || activeButton === "myPosts") {
      return postUserId === currentUserId;
    }

    if (activeButton === "community") {
      return postUserId !== currentUserId;
    }

    return true;
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.log("No token found");
          return;
        }

        const res = await fetch(
          "https://route-posts.routemisr.com/users/profile-data",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await res.json();
        console.log("PROFILE RESPONSE:", data);

        if (res.ok) {
          setProfile(data.data.user);
          setCurrentUserId(data.data.user._id);
        } else {
          console.log(data.message);
        }
      } catch (error) {
        console.error("Profile error:", error);
      }
    };

    fetchProfile();
  }, []);
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
              className="relative flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-sm font-extrabold transition sm:gap-2 sm:px-3.5 bg-white text-[#1f6fe5]"
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
              className="relative flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-sm font-extrabold transition sm:gap-2 sm:px-3.5 text-slate-600 hover:bg-white/90 hover:text-slate-900"
            >
              <FaRegComment className="text-lg" />
              <span className="hidden sm:inline">Notifications</span>
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
                src={DefaultProfile}
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

      <div className="mx-auto max-w-screen-xl">
        <div className="flex gap-4 px-4 py-4">
          <aside className="hidden w-60 shrink-0 lg:block">
            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <button
                onClick={() => handleClick("feed")}
                className={getButtonClass("feed")}
              >
                <FiHome /> Feed
              </button>
              <button
                onClick={() => handleClick("myPosts")}
                className={getButtonClass("myPosts")}
              >
                <LuUser /> My Posts
              </button>
              <button
                onClick={() => handleClick("community")}
                className={getButtonClass("community")}
              >
                <TbUsers /> Community
              </button>
              <button
                onClick={() => handleClick("saved")}
                className={getButtonClass("saved")}
              >
                <CiBookmark /> Saved
              </button>
            </div>
          </aside>

          <section className="min-w-0 flex-1">
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1 lg:hidden">
              {[
                { name: "feed", icon: <FiHome />, label: "Feed" },
                { name: "myPosts", icon: <LuUser />, label: "My Posts" },
                { name: "community", icon: <TbUsers />, label: "Community" },
                { name: "saved", icon: <CiBookmark />, label: "Saved" },
              ].map(({ name, icon, label }) => (
                <button
                  key={name}
                  onClick={() => handleClick(name)}
                  className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-bold transition ${
                    activeButton === name
                      ? "bg-[#e7f3ff] text-[#1877f2]"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {icon} {label}
                </button>
              ))}
            </div>

            <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <img
                  src={DefaultProfile}
                  alt="me"
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="font-bold text-slate-900">
                    {profile?.name || "User"}
                  </p>
                  <p className="text-xs text-slate-500">Public</p>
                </div>
              </div>
              <textarea
                placeholder="What's on your mind?"
                rows={3}
                className="mt-3 w-full resize-none rounded-xl bg-slate-50 p-3 text-sm outline-none placeholder:text-slate-500 focus:bg-white focus:ring-1 focus:ring-[#1877f2]"
              />
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-3">
                <div className="flex items-center gap-2">
                  <label className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">
                    <CiImageOn className="text-lg text-green-700" />
                    <span className="hidden sm:inline">Photo/video</span>
                    <input accept="image/*" className="hidden" type="file" />
                  </label>
                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
                  >
                    <CiFaceSmile className="text-lg text-orange-500" />
                    <span className="hidden sm:inline">Feeling/activity</span>
                  </button>
                </div>
                <button
                  disabled
                  className="flex items-center gap-2 rounded-lg bg-[#1877f2] px-5 py-2 text-sm font-extrabold text-white shadow-sm transition-colors hover:bg-[#166fe5] disabled:opacity-60"
                >
                  Post <FiSend />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                  Loading...
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
                  No posts yet.
                </div>
              ) : (
                filteredPosts.map((post) => {
                  const postUser =
                    typeof post.user === "object" ? post.user : {};
                  const postUserName = postUser.name || "Unknown";
                  const postUserPhoto = postUser.photo || DefaultProfile;
                  const postUserId = getUserId(post.user);
                  const isLiked = post.likes?.includes(currentUserId);

                  return (
                    <article
                      key={post._id}
                      className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                    >
                      <div className="p-4">
                        <div className="flex items-center gap-3">
                          <a
                            className="shrink-0"
                            href={`#/profile/${postUserId}`}
                          >
                            <img
                              alt={postUserName}
                              className="h-11 w-11 rounded-full object-cover"
                              src={postUserPhoto}
                            />
                          </a>
                          <div className="min-w-0 flex-1">
                            <a
                              className="truncate text-sm font-bold hover:underline"
                              href={`#/profile/${postUserId}`}
                            >
                              {postUserName}
                            </a>
                            <div className="flex items-center gap-1 text-xs text-slate-500">
                              @{postUserName} · {timeAgo(post.createdAt)} ·{" "}
                              <LuEarth /> Public
                            </div>
                          </div>
                        </div>
                        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">
                          {post.body}
                        </p>
                      </div>

                      {post.image && (
                        <div className="max-h-[620px] overflow-hidden border-y border-slate-200">
                          <button
                            type="button"
                            className="group relative block w-full cursor-zoom-in"
                          >
                            <img
                              alt="post"
                              className="w-full object-cover"
                              src={post.image}
                            />
                            <span className="pointer-events-none absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />
                          </button>
                        </div>
                      )}

                      <div className="px-4 pb-2 pt-3 text-sm text-slate-500">
                        <div className="flex flex-wrap items-center justify-between">
                          <span className="inline-flex items-center gap-1">
                            <FiThumbsUp className="h-4 w-4 rounded-full bg-[#1877f2] p-[2px] text-white" />
                            {post.likes?.length || 0} likes
                          </span>
                          <div className="flex items-center gap-3 text-xs sm:text-sm">
                            <span>{post.comments?.length || 0} comments</span>
                          </div>
                        </div>
                      </div>

                      <div className="mx-4 border-t border-slate-200" />
                      <div className="grid grid-cols-3 gap-1 p-1">
                        <button
                          onClick={() => toggleLikePost(post._id)}
                          className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-md p-2 text-xs font-semibold transition-colors hover:bg-slate-100 sm:gap-2 sm:text-sm ${
                            isLiked ? "text-[#1877f2]" : "text-slate-600"
                          }`}
                        >
                          <FiThumbsUp
                            className={`text-lg ${isLiked ? "fill-[#1877f2]" : ""}`}
                          />{" "}
                          Like
                        </button>
                        <button
                          onClick={() => toggleComments(post._id)}
                          className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-md p-2 text-xs font-semibold transition-colors hover:bg-slate-100 sm:gap-2 sm:text-sm ${
                            showComments[post._id]
                              ? "text-[#1877f2]"
                              : "text-slate-600"
                          }`}
                        >
                          <FaRegComment className="text-lg" /> Comment
                        </button>
                        <button className="flex cursor-pointer items-center justify-center gap-1.5 rounded-md p-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 sm:gap-2 sm:text-sm">
                          <IoShareSocialOutline className="text-lg" /> Share
                        </button>
                      </div>

                      {showComments[post._id] && (
                        <div className="border-t border-slate-200 bg-[#f7f8fa] px-4 py-4">
                          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-extrabold tracking-wide text-slate-700">
                                Comments
                              </p>
                              <span className="rounded-full bg-[#e7f3ff] px-2 py-0.5 text-[11px] font-bold text-[#1877f2]">
                                {comments[post._id]?.length || 0}
                              </span>
                            </div>
                            <select className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-[#1877f2] focus:bg-white">
                              <option value="relevant">Most relevant</option>
                              <option value="newest">Newest</option>
                            </select>
                          </div>

                          <div className="space-y-2">
                            {loadingComments[post._id] ? (
                              <p className="text-center text-sm text-slate-500">
                                Loading comments...
                              </p>
                            ) : Array.isArray(comments[post._id]) &&
                              comments[post._id].length > 0 ? (
                              comments[post._id].map((cmt) => (
                                <div
                                  key={cmt._id}
                                  className="flex items-start gap-2"
                                >
                                  <img
                                    alt={cmt.user?.name || "User"}
                                    className="mt-0.5 h-8 w-8 rounded-full object-cover"
                                    src={cmt.user?.photo || DefaultProfile}
                                  />
                                  <div className="min-w-0 flex-1">
                                    {editingComment[cmt._id] ? (
                                      <div className="flex items-center gap-2">
                                        <input
                                          className="w-full rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm"
                                          value={
                                            editCommentText[cmt._id] ??
                                            cmt.content
                                          }
                                          onChange={(e) =>
                                            setEditCommentText((prev) => ({
                                              ...prev,
                                              [cmt._id]: e.target.value,
                                            }))
                                          }
                                        />
                                        <button
                                          disabled={sendingComment[cmt._id]}
                                          onClick={() =>
                                            updateComment(
                                              post._id,
                                              cmt._id,
                                              editCommentText[cmt._id],
                                            )
                                          }
                                          className="rounded-full bg-[#1877f2] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#166fe5] disabled:opacity-60"
                                        >
                                          Save
                                        </button>
                                        <button
                                          onClick={() =>
                                            setEditingComment((prev) => ({
                                              ...prev,
                                              [cmt._id]: false,
                                            }))
                                          }
                                          className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="relative inline-block max-w-full rounded-2xl bg-[#f0f2f5] px-3 py-2">
                                        <p className="font-bold">
                                          {cmt.user?.name || "Unknown"}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                          @{cmt.user?.username || "unknown"}
                                        </p>
                                        <p className="mt-1 whitespace-pre-wrap text-sm text-slate-800">
                                          {cmt.content}
                                        </p>
                                      </div>
                                    )}
                                    <div className="mt-1.5 flex items-center gap-4 px-1">
                                      <span className="text-xs font-semibold text-slate-400">
                                        {timeAgo(cmt.createdAt)}
                                      </span>
                                      <button className="text-xs font-semibold text-slate-500 hover:underline">
                                        Like ({cmt.likes || 0})
                                      </button>
                                      <button
                                        onClick={() => {
                                          if (replies[cmt._id]) {
                                            setReplies((prev) => ({
                                              ...prev,
                                              [cmt._id]: undefined,
                                            }));
                                          } else {
                                            getCommentReplies(
                                              post._id,
                                              cmt._id,
                                            );
                                          }
                                        }}
                                        className="text-xs font-semibold text-slate-500 transition hover:text-[#1877f2] hover:underline"
                                      >
                                        Reply
                                      </button>

                                      {getUserId(cmt.user) ===
                                        currentUserId && (
                                        <div
                                          className="relative ml-auto"
                                          data-comment-menu
                                        >
                                          <button
                                            onClick={(e) =>
                                              toggleCommentMenu(e, cmt._id)
                                            }
                                            className="rounded-full p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                                          >
                                            <Ellipsis
                                              size={16}
                                              aria-hidden="true"
                                            />
                                          </button>

                                          {openMenuComment[cmt._id] && (
                                            <div className="absolute right-0 z-20 mt-1 w-32 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                                              <button
                                                onClick={() => {
                                                  setEditCommentText(
                                                    (prev) => ({
                                                      ...prev,
                                                      [cmt._id]: cmt.content,
                                                    }),
                                                  );
                                                  setEditingComment((prev) => ({
                                                    ...prev,
                                                    [cmt._id]: true,
                                                  }));
                                                  setOpenMenuComment(
                                                    (prev) => ({
                                                      ...prev,
                                                      [cmt._id]: false,
                                                    }),
                                                  );
                                                }}
                                                className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                              >
                                                <Pencil
                                                  size={13}
                                                  aria-hidden="true"
                                                />
                                                Edit
                                              </button>

                                              <button
                                                onClick={() => {
                                                  deleteComment(
                                                    post._id,
                                                    cmt._id,
                                                  );
                                                  setOpenMenuComment(
                                                    (prev) => ({
                                                      ...prev,
                                                      [cmt._id]: false,
                                                    }),
                                                  );
                                                }}
                                                className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50"
                                              >
                                                <Trash2
                                                  size={13}
                                                  aria-hidden="true"
                                                />
                                                Delete
                                              </button>
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>

                                    {loadingReplies[cmt._id] ? (
                                      <p className="mt-1 text-xs text-slate-400">
                                        Loading replies...
                                      </p>
                                    ) : (
                                      replies[cmt._id]?.length > 0 && (
                                        <div className="ml-6 mt-2 space-y-2 border-l border-slate-300 pl-4">
                                          {replies[cmt._id].map((reply) => (
                                            <div
                                              key={reply._id}
                                              className="flex items-start gap-2"
                                            >
                                              <img
                                                src={
                                                  reply.user?.photo ||
                                                  DefaultProfile
                                                }
                                                alt="user"
                                                className="h-7 w-7 rounded-full object-cover"
                                              />
                                              <div className="rounded-2xl bg-[#f0f2f5] px-3 py-2 text-sm">
                                                <p className="font-bold">
                                                  {reply.user?.name ||
                                                    "Unknown"}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                  @
                                                  {reply.user?.username ||
                                                    "unknown"}
                                                </p>
                                                <p className="mt-1">
                                                  {reply.content}
                                                </p>
                                                <span className="text-xs text-slate-400">
                                                  {timeAgo(reply.createdAt)}
                                                </span>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      )
                                    )}

                                    <div className="ml-10 mt-2 flex items-start gap-2">
                                      <img
                                        src={DefaultProfile}
                                        alt="me"
                                        className="h-7 w-7 rounded-full object-cover"
                                      />
                                      <div className="w-full rounded-2xl border border-slate-200 bg-[#f0f2f5] px-2 py-1">
                                        <textarea
                                          placeholder="Write a reply..."
                                          rows={1}
                                          value={newReplies[cmt._id] || ""}
                                          onChange={(e) =>
                                            setNewReplies((prev) => ({
                                              ...prev,
                                              [cmt._id]: e.target.value,
                                            }))
                                          }
                                          className="w-full resize-none bg-transparent px-2 py-1 text-sm outline-none"
                                        />
                                        <div className="flex items-center justify-between">
                                          <label className="cursor-pointer text-slate-500 hover:text-emerald-600">
                                            <CiImageOn size={16} />
                                            <input
                                              type="file"
                                              accept="image/*"
                                              className="hidden"
                                              onChange={(e) =>
                                                setReplyImages((prev) => ({
                                                  ...prev,
                                                  [cmt._id]: e.target.files[0],
                                                }))
                                              }
                                            />
                                          </label>
                                          <button
                                            onClick={() =>
                                              createReply(post._id, cmt._id)
                                            }
                                            disabled={sendingReply[cmt._id]}
                                            className="rounded-full bg-[#1877f2] p-2 text-white disabled:opacity-60"
                                          >
                                            <FiSend size={14} />
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-8 text-center">
                                <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#eef3ff] text-[#1877f2]">
                                  <FaRegComment className="text-2xl" />
                                </div>
                                <p className="text-lg font-extrabold text-slate-800">
                                  No comments yet
                                </p>
                                <p className="mt-1 text-sm font-medium text-slate-500">
                                  Be the first to comment.
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="mt-3 flex items-start gap-2">
                            <img
                              alt="Me"
                              className="h-9 w-9 rounded-full object-cover"
                              src={DefaultProfile}
                            />
                            <div className="w-full rounded-2xl border border-slate-200 bg-[#f0f2f5] px-2.5 py-1.5 focus-within:border-[#c7dafc] focus-within:bg-white">
                              <textarea
                                placeholder="Write a comment..."
                                rows={1}
                                value={newComments[post._id] || ""}
                                onChange={(e) =>
                                  setNewComments((prev) => ({
                                    ...prev,
                                    [post._id]: e.target.value,
                                  }))
                                }
                                className="max-h-[140px] min-h-[40px] w-full resize-none bg-transparent px-2 py-1.5 text-sm leading-5 outline-none placeholder:text-slate-500"
                              />
                              <div className="mt-1 flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                  <label className="inline-flex cursor-pointer items-center justify-center rounded-full p-2 text-slate-500 transition hover:bg-slate-200 hover:text-emerald-600">
                                    <CiImageOn size={16} />
                                    <input
                                      accept="image/*"
                                      className="hidden"
                                      type="file"
                                      onChange={(e) =>
                                        setCommentImages((prev) => ({
                                          ...prev,
                                          [post._id]: e.target.files[0],
                                        }))
                                      }
                                    />
                                  </label>
                                  <button className="inline-flex items-center justify-center rounded-full p-2 text-slate-500 transition hover:bg-slate-200 hover:text-amber-500">
                                    <CiFaceSmile size={16} />
                                  </button>
                                </div>
                                <button
                                  onClick={() => createComment(post._id)}
                                  disabled={sendingComment[post._id]}
                                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#1877f2] text-white shadow-sm transition hover:bg-[#166fe5] disabled:opacity-60"
                                >
                                  <FiSend size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })
              )}
            </div>
          </section>

          <aside className="hidden h-fit xl:sticky xl:top-[84px] xl:block">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <TbUsers className="text-blue-600" />
                  <h3 className="text-base font-extrabold text-slate-900">
                    Suggested Friends
                  </h3>
                </div>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">
                  5
                </span>
              </div>
              <div className="mb-3">
                <label className="relative block">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <CiSearch className="text-lg" />
                  </span>
                  <input
                    placeholder="Search friends..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-700 outline-none focus:border-[#1877f2] focus:bg-white"
                  />
                </label>
              </div>

              {[
                {
                  name: "Ahmed Bahnasy",
                  username: "bahnasy20222",
                  followers: 59,
                  photo:
                    "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/1771018057253-2285ec56-8e3c-4ea3-9ee4-c235037ffffe-Screenshot-2026-02-13-at-11.27.15---PM.png",
                },
                {
                  name: "Ahmed Abd Al-Muti",
                  username: "ahmedmutti",
                  followers: 37,
                  photo:
                    "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/1771038591307-b70f2a83-d052-400d-a8ea-5c601b51e262-WhatsApp-Image-2026-01-21-at-05.00.10.jpeg",
                },
                {
                  name: "Nourhan",
                  username: "nourhan",
                  followers: 22,
                  photo:
                    "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/1771068100123-c9bbeba4-0e5f-4246-811e-add6e4890e40-DSC07722.webp",
                },
                {
                  name: "Ahmed Bahnasy",
                  username: "bahnasy20222w2",
                  followers: 22,
                  photo:
                    "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png",
                },
                {
                  name: "Ahmed Abd Al-Muti",
                  username: "ahmedmut3ti",
                  followers: 20,
                  photo:
                    "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/1771071361223-3cf47f81-53bb-47d2-baae-783be7cc51e1-IMG-20251121-WA0041.webp",
                },
              ].map((friend) => (
                <div
                  key={friend.username}
                  className="mb-3 rounded-xl border border-slate-200 p-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <button
                      type="button"
                      className="flex min-w-0 items-center gap-2 rounded-lg px-1 py-1 text-left transition hover:bg-slate-50"
                    >
                      <img
                        alt={friend.name}
                        className="h-10 w-10 rounded-full object-cover"
                        src={friend.photo}
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-900 hover:underline">
                          {friend.name}
                        </p>
                        <p className="truncate text-xs text-slate-500">
                          @{friend.username}
                        </p>
                      </div>
                    </button>
                    <button className="inline-flex items-center gap-1 rounded-full bg-[#e7f3ff] px-3 py-1.5 text-xs font-bold text-[#1877f2] transition hover:bg-[#d8ebff]">
                      <RiUserAddLine /> Follow
                    </button>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5">
                      {friend.followers} followers
                    </span>
                  </div>
                </div>
              ))}

              <button className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100">
                View more
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
