import UserAvatar from "@/components/UserAvatar";
import "@/app/globals.css";

export default function Home() {
  return (
    <>
      <h1 style={{ color: "var(--primary)" }}>Welcome</h1>
      <UserAvatar />
    </>
  );
}
