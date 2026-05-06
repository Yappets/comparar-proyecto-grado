// src/pages/authentication/reset-password/ResetPassword.tsx

import React, { useEffect, useState } from "react";
import ResetPasswordMobile from "./ResetPasswordMobile";
import ResetPasswordDesktop from "./ResetPasswordDesktop";

const ResetPassword: React.FC = () => {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile ? <ResetPasswordMobile /> : <ResetPasswordDesktop />;
};

export default ResetPassword;