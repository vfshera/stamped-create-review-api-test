import {
  STAMPED_BASE_URL,
  STAMPED_PRIVATE_API_KEY,
  STAMPED_PUBLIC_API_KEY,
  STAMPED_STORE_HASH,
} from "@/constants";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.formData();

  const url = new URL(`${STAMPED_BASE_URL}/reviews3`);

  url.searchParams.append("apiKey", STAMPED_PUBLIC_API_KEY);
  url.searchParams.append("sId", STAMPED_STORE_HASH);

  const headers = new Headers({
    "Content-Type": "multipart/form-data",

    Authorization: `Basic ${Buffer.from(
      `${STAMPED_PUBLIC_API_KEY}:${STAMPED_PRIVATE_API_KEY}`,
      "utf8"
    ).toString("base64")}`,
  });

  try {
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: data,
    }).then((response) => {
      console.log(response);

      return {
        message: response.statusText,
        status: response.status,
        ok: response.ok,
      };
    });

    return NextResponse.json(res);
  } catch (e) {
    throw { error: e };
  }
}
