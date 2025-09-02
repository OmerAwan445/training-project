import React, { useEffect, useState } from "react";
import { CurrentUser } from "../posts/utils/types";
import { getCookie } from "../server actions/cookies-actions";

export default function useAuth() {
  const [currentUser, setCurrentUser] = useState<CurrentUser>(null);
  const isAuthorized = () => !!currentUser;

  console.log("Current user: ", currentUser);
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
