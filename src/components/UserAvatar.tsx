import { auth } from "@/app/lib/auth";

export default async function UserAvatar() {
  const session = await auth();

  if (!session?.user) return null;
  console.log("name: ", session.user.name);

  return (
    <div>
      <img
        src={session!.user!.avatar! || session?.user?.image!}
        alt="User Avatar"
        width="250px"
      />
      <p>{session.user.id}</p>
      <p>{session.user.name}</p>
    </div>
  );
}
