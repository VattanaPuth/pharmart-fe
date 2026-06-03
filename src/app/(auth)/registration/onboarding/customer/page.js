"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const CustomerOnboardingPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/user/account"); 
  }, [router]);

  return null;
};

export default CustomerOnboardingPage;