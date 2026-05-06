// src/pages/authentication/forgot-password/ForgotPassword.tsx

import React, { useEffect, useState } from "react";
import ForgotPasswordMobile from "./ForgotPasswordMobile";
import ForgotPasswordDesktop from "./ForgotPasswordDesktop";

const ForgotPassword: React.FC = () => {
  // mejor práctica: función inicial
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isMobile
    ? <ForgotPasswordMobile />
    : <ForgotPasswordDesktop />;
};

export default ForgotPassword;