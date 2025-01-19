import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { Execute } from "../../../components/db/connection";

export async function POST(request) {
  try {
    const data = await request.json();
    const { email, password } = data;
    const result = await Execute(
      "SELECT user_id,user_name FROM users WHERE user_email=? AND password=?",
      [email, password]
    );

    if (result.length === 0) {
      return NextResponse.json(
        { data: [], message: "Invalid email or password" },
        { status: 200 }
      );
    }
    await Execute("UPDATE users SET online_status=1  WHERE user_email=?", [
      email,
    ]);

    const token = jwt.sign({ id: result[0].user_id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    const response = NextResponse.json(
      {
        data: result,
        message: "Query executed successfull",
      },
      { status: 200 }
    );

    response.cookies.set("authToken", token, {
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: 60 * 60,
    });

    response.cookies.set("userData", JSON.stringify(result[0]), {
      path: "/",
      maxAge: 60 * 60,
    });
    return response;
  } catch (error) {
    return new Response("Login failed : " + error.message, {
      status: 400,
    });
  }
}
