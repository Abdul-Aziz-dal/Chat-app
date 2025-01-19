import { NextResponse } from "next/server";
import { Execute } from "../../components/db/connection";

export async function POST(request) {
  try {
    const result = await Execute(
      "SELECT user_id,user_name,online_status FROM users",
      []
    );

    if (result.length === 0) {
      return NextResponse.json(
        { data: [], message: "Users not found..!" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        data: result,
        message: "Query executed successfull",
      },
      { status: 200 }
    );
  } catch (error) {
    return new Response("Error in getting users : " + error.message, {
      status: 400,
    });
  }
}
