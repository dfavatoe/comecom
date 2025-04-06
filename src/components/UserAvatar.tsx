import { auth } from "@/app/lib/auth";

export default async function UserAvatar() {
  const session = await auth();

  if (!session?.user) return null;
  console.log("name: ", session.user.name);
  return (
    <div>
      <img
        src={
          session.user.image ??
          "https://img.freepik.com/vecteurs-libre/homme-affaires-caractere-avatar-isole_24877-60111.jpg"
        }
        alt="User Avatar"
        width="250px"
      />
      <p>{session.user.id}</p>
      <p>{session.user.name}</p>
    </div>
  );
}
