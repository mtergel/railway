import { AuthUserContext } from "next-firebase-auth";
import { useTheme } from "next-themes";

interface UserButtonProps {
  user: AuthUserContext;
}

export const UserButton: React.FC<UserButtonProps> = ({ user }) => {
  const { theme, setTheme } = useTheme();
  return (
    <button
      type="button"
      className="flex items-center rounded-full border border-gray-400 px-1 py-1 ring-primary-400
        focus:ring-2
        focus:outline-none
        transition-all"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <span className="rounded-full relative flex-shrink-0 align-top w-4 h-4 border-0">
        <img
          src={user.photoURL}
          alt="profile"
          className="w-full h-full object-cover rounded-full select-none"
          draggable="false"
          role="avatar"
        />
      </span>
      <span className="line-clamp-1 mx-2 text-sm">{user.displayName}</span>
    </button>
  );
};

export default UserButton;
