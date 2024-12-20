import useLoginMode from "@/hooks/useLoginMode";
import usePfp from "@/hooks/usePfp";
import useUser from "@/hooks/useUser";
import System from "@/models/system";
import paths from "@/utils/paths";
import { userFromStorage } from "@/utils/request";
import { Person } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import AccountModal from "../AccountModal";
import { AUTH_TIMESTAMP, AUTH_TOKEN, AUTH_USER } from "@/utils/constants";

export default function UserButton() {
  const mode = useLoginMode();
  const { user } = useUser();
  const menuRef = useRef();
  const buttonRef = useRef();
  const [showMenu, setShowMenu] = useState(false);
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [supportEmail, setSupportEmail] = useState("");

  const handleClose = (event) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target) &&
      !buttonRef.current.contains(event.target)
    ) {
      setShowMenu(false);
    }
  };

  const handleOpenAccountModal = () => {
    setShowAccountSettings(true);
    setShowMenu(false);
  };

  useEffect(() => {
    if (showMenu) {
      document.addEventListener("mousedown", handleClose);
    }
    return () => document.removeEventListener("mousedown", handleClose);
  }, [showMenu]);

  useEffect(() => {
    const fetchSupportEmail = async () => {
      const supportEmail = await System.fetchSupportEmail();
      setSupportEmail(
        supportEmail?.email
          ? `mailto:${supportEmail.email}`
          : paths.mailToMintplex()
      );
    };
    fetchSupportEmail();
  }, []);

  if (mode === null) return null;
  return (
    <div className="relative ml-3">
      <button
        ref={buttonRef}
        onClick={() => setShowMenu(!showMenu)}
        type="button"
        className="uppercase transition-all duration-300 w-[35px] h-[35px] text-base font-semibold rounded-full flex items-center bg-theme-action-menu-bg hover:bg-theme-action-menu-item-hover justify-center text-white p-2 hover:border-slate-100 hover:border-opacity-50 border-transparent border"
      >
        {mode === "multi" ? <UserDisplay /> : <Person size={14} />}
      </button>

      {showMenu && (
        <div
          ref={menuRef}
          className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none"
        >
          <div className="flex flex-col gap-y-2 content-center">
            {mode === "multi" && !!user && (
              <button
                onClick={handleOpenAccountModal}
                className="block rounded-lg py-2 pl-0 pr-3 text-sm/7 font-semibold text-gray-900 hover:bg-gray-50"
              >
                My Profile
              </button>
            )}
            <a
              href={supportEmail}
              className="block justify-items-center rounded-lg py-2 pl-0 pr-3 text-sm/7 font-semibold text-gray-900 hover:bg-gray-50"
            >
              Support
            </a>
            <button
              onClick={() => {
                window.localStorage.removeItem(AUTH_USER);
                window.localStorage.removeItem(AUTH_TOKEN);
                window.localStorage.removeItem(AUTH_TIMESTAMP);
                window.location.replace(paths.home());
              }}
              type="button"
              className="block rounded-lg py-2 pl-0 pr-3 text-sm/7 font-semibold text-gray-900 hover:bg-gray-50"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
      {user && showAccountSettings && (
        <AccountModal
          user={user}
          hideModal={() => setShowAccountSettings(false)}
        />
      )}
    </div>
  );
}

function UserDisplay() {
  const { pfp } = usePfp();
  const user = userFromStorage();

  if (pfp) {
    return (
      <div className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
        <img
          src={pfp}
          alt="User profile picture"
          className="size-8 rounded-full"
        />
      </div>
    );
  }

  return user?.username?.slice(0, 2) || "AA";
}
