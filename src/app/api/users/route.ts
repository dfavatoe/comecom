import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/model/usersModel";

export async function GET(req: Request) {
  try {
    // Connect to the database
    await dbConnect();
    console.log("Connected to DB");

    // Retrieve all users from the database
    const users = await UserModel.find();
    console.log("Users fetched:", users);

    // Return users as JSON response
    return Response.json(users, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return Response.json(
      {
        message: "Internal Server Error",
        error: error,
      },
      { status: 500 }
    );
  }
}
