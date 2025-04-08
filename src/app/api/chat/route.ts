import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/model/usersModel";
import { auth } from "@/app/lib/auth";

export async function GET(req: Request) {
  const session = await auth();
  console.log("user :>> ", session?.user?.id);
  // try {
  //   // Connect to the database
  //   await dbConnect();
  //   console.log("Connected to DB");

  //   const userId = req.params.
  // Retrieve all messaged from the database for 1 user
  //   const getAllMessagesByUserId = await UserModel.findById(
  //     {

  //     }
  //   );
  //   console.log("User messages fetched:", getAllMessagesByUserId);

  //   // Return users as JSON response
  //   return new Response(JSON.stringify(users), { status: 200 });
  // } catch (error) {
  //   console.error("Error fetching users:", error);
  //   return new Response(
  //     JSON.stringify({
  //       message: "Internal Server Error",
  //       error: error,
  //     }),
  //     { status: 500 }
  //   );
  //};
}
