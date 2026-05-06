// src/pages/profile/Profile.tsx
import React from "react";
import ProfileMobile from "./ProfileMobile";
import ProfileDesktop from "./ProfileDesktop";

const Profile: React.FC = () => {

  const isMobile = window.innerWidth < 768;

  return isMobile ? <ProfileMobile /> : <ProfileDesktop />;
};

export default Profile;