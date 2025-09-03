"use client";

import { useEffect, useState } from "react";
import { getCookie } from "../server actions/cookies-actions";
import { CurrentUser } from "../commons/types";

export default function useAuth() {
  const [currentUser, setCurrentUser] = useState<CurrentUser>(null);
  const isAuthorized = () => !!currentUser;

  useEffect(() => {
    (async () => {
      try {
        const currentUserCookie = await getCookie("currentUser");
        if (!currentUserCookie) return;
        console.log("Current user cookie: ", currentUserCookie,);
        setCurrentUser(JSON.parse(currentUserCookie));
    } catch {
        // ignore
      }
    })();
  }, []);

  return {
    isAuthorized,
    currentUser,
  };
}
