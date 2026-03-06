import { FiHome, FiSend, FiUsers, FiFileText } from "react-icons/fi";
import { LuUser , LuExpand } from "react-icons/lu";
import { FaRegComment, FaUsers } from "react-icons/fa6";
import DefaultProfile from "../assets/images/default-profile.png";
import { IoIosMenu } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import routeImg from "../assets/images/route.png";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { CiCamera, CiMail, CiBookmark } from "react-icons/ci";
import { FaRegTrashAlt } from "react-icons/fa";


export default function Profile() {
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [profile, setProfile] = useState(null);
  const modalFileInputRef = useRef(null);
  

  const handleUploadPhoto = async (file) => {
  try {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("photo", file);

    const response = await fetch(
      "https://route-posts.routemisr.com/users/upload-photo",
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const data = await response.json();
    console.log("UPLOAD RESPONSE:", data); 

  
    const user = data?.data?.user || null;
    const photo = user?.photo || null;

    if (response.ok && user) {
      setProfile(user);
      setProfileImage(photo);
    } else {
      alert(data.message || "Upload failed ");
    }
  } catch (error) {
    console.error("Upload error:", error);
    alert("Something went wrong ");
  }
};


  const handleCameraClick = () => {
    setShowModal(true);
  };

  const handleModalFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImageFile(file);
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleSavePhoto = async () => {
    if (selectedImageFile) {
      await handleUploadPhoto(selectedImageFile);
    }
    setShowModal(false);
    setSelectedImage(null);
    setSelectedImageFile(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedImage(null);
    setSelectedImageFile(null);
  };

  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

const token = localStorage.getItem("token");
console.log("TOKEN:", token);

useEffect(() => {
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(
        "https://route-posts.routemisr.com/users/profile-data",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      console.log("PROFILE RESPONSE:", data);

      const user = data?.data?.user || null;
      const photo = user?.photo || null;

      if (res.ok && user) {
        setProfile(user);
        setProfileImage(photo);
      } else {
        console.log(data.message || "Failed to fetch profile");
      }
    } catch (error) {
      console.error("Profile error:", error);
    }
  };

  fetchProfile();
}, []);



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
              >
                <span className="relative">
                  <FiHome className="text-lg" />
                </span>
                <span className="hidden sm:inline">Feed</span>
                <span className="sr-only sm:hidden">Feed</span>
              </a>
              <a
                className="relative flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-sm font-extrabold transition sm:gap-2 sm:px-3.5 bg-white text-[#1f6fe5]"
                href="/profile"
              >
                <span className="relative">
                  <LuUser className="text-lg" />
                </span>
                <span className="hidden sm:inline">Profile</span>
                <span className="sr-only sm:hidden">Profile</span>
              </a>
              <a
                className="relative flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-sm font-extrabold transition sm:gap-2 sm:px-3.5 text-slate-600 hover:bg-white/90 hover:text-slate-900"
                href="/notifications"
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
                   src={profileImage || "/default-avatar.png"}
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
            <div className="space-y-5 sm:space-y-6">
              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,.06)] sm:rounded-[28px]">
                <div className="group/cover relative h-44 bg-[linear-gradient(112deg,#0f172a_0%,#1e3a5f_36%,#2b5178_72%,#5f8fb8_100%)] sm:h-52 lg:h-60">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_24%,rgba(255,255,255,.14)_0%,rgba(255,255,255,0)_36%)]" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_86%_12%,rgba(186,230,253,.22)_0%,rgba(186,230,253,0)_44%)]" />
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/25 to-transparent" />

              
                  <div className="pointer-events-none absolute right-2 top-2 z-10 flex max-w-[90%] flex-wrap items-center justify-end gap-1.5 opacity-100 transition duration-200 sm:right-3 sm:top-3 sm:max-w-none sm:gap-2 sm:opacity-0 sm:group-hover/cover:opacity-100 sm:group-focus-within/cover:opacity-100">
                    <button
                      type="button"
                      className="pointer-events-auto inline-flex items-center gap-1 rounded-lg bg-black/45 px-2 py-1 text-[11px] font-bold text-white backdrop-blur transition hover:bg-black/60 sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-xs"
                    >
                    <LuExpand />
                      View cover
                    </button>
                    <label className="pointer-events-auto inline-flex cursor-pointer items-center gap-1 rounded-lg bg-black/45 px-2 py-1 text-[11px] font-bold text-white backdrop-blur transition hover:bg-black/60 sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-xs">
                    <CiCamera/>
                      Change cover
                      <input accept="image/*" className="hidden" type="file" />
                    </label>
                    <button
                      type="button"
                      className="pointer-events-auto inline-flex items-center gap-1 rounded-lg bg-black/45 px-2 py-1 text-[11px] font-bold text-white backdrop-blur transition hover:bg-black/60 disabled:cursor-not-allowed disabled:opacity-60 sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-xs"
                    >
                 <FaRegTrashAlt/>
                 Remove
                    </button>
                  </div>
                </div>

                <div className="relative -mt-12 px-3 pb-5 sm:-mt-16 sm:px-8 sm:pb-6">
                  <div className="rounded-3xl border border-white/60 bg-white/92 p-5 backdrop-blur-xl sm:p-7">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex items-end gap-4">
                       
                          <div className="group/avatar relative shrink-0">
                            <img
                              alt="Joycie Gerges"
                              className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-md ring-2 ring-[#dbeafe]"
                               src={profileImage || "/default-avatar.png"} 
                            />
                            <button
                              type="button"
                              onClick={handleCameraClick}
                              className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-[#1877f2] text-white shadow transition hover:bg-[#166fe5]"
                            >
                              <CiCamera />
                            </button>
                          </div>

                          <div className="min-w-0 pb-1">
                            <h2 className="truncate text-2xl font-black tracking-tight text-slate-900 sm:text-4xl">
                             {profile?.name || "User"}
                            </h2>
                            <p className="mt-1 text-lg font-semibold text-slate-500 sm:text-xl">
                          
                             @{profile?.username}
                            </p>
                            <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#d7e7ff] bg-[#eef6ff] px-3 py-1 text-xs font-bold text-[#0b57d0]">
                              <FiUsers />
                              Route Posts member
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid w-full grid-cols-3 gap-2 lg:w-[520px]">
                        <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-center sm:px-4 sm:py-4">
                          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 sm:text-xs">
                            Followers
                          </p>
                          <p className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">
                            0
                          </p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-center sm:px-4 sm:py-4">
                          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 sm:text-xs">
                            Following
                          </p>
                          <p className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">
                            0
                          </p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-center sm:px-4 sm:py-4">
                          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 sm:text-xs">
                            Bookmarks
                          </p>
                          <p className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">
                            0
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-4 lg:grid-cols-[1.3fr_.7fr]">
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <h3 className="text-sm font-extrabold text-slate-800">
                          About
                        </h3>
                        <div className="mt-3 space-y-2 text-sm text-slate-600">
                          <p className="flex items-center gap-2">
                            <CiMail />
                            {profile?.email}
                          </p>
                          <p className="flex items-center gap-2">
                            <FiUsers />
                            Active on Route Posts
                          </p>
                        </div>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                        <div className="rounded-2xl border border-[#dbeafe] bg-[#f6faff] px-4 py-3">
                          <p className="text-xs font-bold uppercase tracking-wide text-[#1f4f96]">
                            My posts
                          </p>
                          <p className="mt-1 text-2xl font-black text-slate-900">
                            0
                          </p>
                        </div>
                        <div className="rounded-2xl border border-[#dbeafe] bg-[#f6faff] px-4 py-3">
                          <p className="text-xs font-bold uppercase tracking-wide text-[#1f4f96]">
                            Saved posts
                          </p>
                          <p className="mt-1 text-2xl font-black text-slate-900">
                            0
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                  <div className="grid w-full grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1.5 sm:inline-flex sm:w-auto sm:gap-0">
                    <button className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition bg-white text-[#1877f2] shadow-sm">
                      <FiFileText />
                      My Posts
                    </button>
                    <button className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition text-slate-600 hover:text-slate-900">
                      <CiBookmark />
                      Saved
                    </button>
                  </div>
                  <span className="rounded-full bg-[#e7f3ff] px-3 py-1 text-xs font-bold text-[#1877f2]">
                    0
                  </span>
                </div>
                <div className="space-y-3">
                 <section className="space-y-4">

  <div className="space-y-3">
    {profileImage ? (
      <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_6px_rgba(15,23,42,.05)] transition hover:shadow-sm">
        <div className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <img
                alt={profile?.name}
                className="h-10 w-10 rounded-full object-cover"
                src={profileImage}
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-extrabold text-slate-900">{profile?.name}</p>
                <p className="truncate text-xs font-semibold text-slate-500">@{profile?.username}</p>
              </div>
            </div>
            <button className="rounded-md px-2 py-1 text-xs font-bold text-[#1877f2] transition hover:bg-[#e7f3ff]">
              View details
            </button>
          </div>
          <div className="pt-3">
            <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-slate-800">
              updated profile picture.
            </p>
          </div>
        </div>
        <div className="border-y border-slate-200 bg-slate-950/95">
          <button type="button" className="group relative flex w-full cursor-zoom-in items-center justify-center">
            <img
              alt="post"
              className="max-h-[560px] w-auto max-w-full object-contain"
              src={profileImage}
            />
            <span className="pointer-events-none absolute inset-0 bg-black/0 transition group-hover:bg-black/10"></span>
          </button>
        </div>
      </article>
    ) : (
      <p className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
        You have not posted yet.
      </p>
    )}
  </div>
</section>
                </div>
              </section>

         
              {showModal && (
                <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 p-4">
                  <div className="w-full max-w-[560px] rounded-2xl border border-slate-200 bg-white p-4 shadow-xl sm:p-5">
                    <div className="mb-3">
                      <h3 className="text-lg font-extrabold text-slate-900">
                        Adjust profile photo
                      </h3>
                      <p className="text-sm text-slate-500">
                        Choose a photo and use zoom for perfect framing.
                      </p>
                    </div>

           
                    <div className="mx-auto w-full max-w-[340px] overflow-x-auto pb-1">
                      <div className="relative h-[320px] w-[320px] touch-none overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200 flex items-center justify-center">
                        {selectedImage ? (
                          <img
                            alt="Crop preview"
                            className="w-full h-full object-cover"
                            src={selectedImage}
                          />
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-slate-400">
                            <CiCamera className="text-5xl" />
                            <span className="text-sm font-semibold">
                              No image selected
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 flex justify-center">
                      <label className="cursor-pointer inline-flex items-center gap-2 rounded-lg border border-[#1877f2] px-4 py-2 text-sm font-bold text-[#1877f2] transition hover:bg-[#eef6ff]">
                        <CiCamera />
                        Choose Photo
                        <input
                          ref={modalFileInputRef}
                          accept="image/*"
                          className="hidden"
                          type="file"
                          onChange={handleModalFileChange}
                        />
                      </label>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                        <span>Zoom</span>
                        <span>1.00x</span>
                      </div>
                      <input
                        min={1}
                        max={3}
                        step="0.01"
                        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-[#1877f2]"
                        type="range"
                        defaultValue={1}
                      />
                    </div>

                    <div className="mt-4">
                      <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">
                        Post privacy
                      </p>
                      <select className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-[#1877f2]">
                        <option value="public">Public</option>
                        <option value="following">Followers</option>
                        <option value="only_me">Only me</option>
                      </select>
                    </div>

                    <div className="mt-5 flex items-center justify-end gap-2">
                  
                      <button
                        type="button"
                        onClick={handleCloseModal}
                        className="inline-flex items-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                    
                      <button
                        type="button"
                        onClick={handleSavePhoto}
                        disabled={!selectedImageFile}
                        className="inline-flex items-center rounded-lg bg-[#1877f2] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#166fe5] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Save photo
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}