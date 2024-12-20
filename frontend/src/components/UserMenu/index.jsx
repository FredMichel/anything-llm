import UserButton from "./UserButton";

export default function UserMenu({ children }) {
  return (
    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
      <UserButton />
      {children}
    </div>
  );
}
