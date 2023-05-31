import type { RequestHandler } from "@builder.io/qwik-city";
import * as setCookie from "set-cookie-parser";
import {
  AppwriteEndpoint,
  AppwriteHostname,
  AppwriteProject,
  SsrHostname,
} from "~/AppwriteService";

// Called when the HTTP method is POST
export const onPost: RequestHandler = async (requestEvent) => {
  try {
    const response = await fetch(
      `${AppwriteEndpoint}/account/sessions/anonymous`,
      {
        method: "POST",
        headers: {
          "x-appwrite-project": AppwriteProject,
        },
      }
    );

    const json = await response.json();

    if (json.code >= 400) {
      requestEvent.json(400, { mesages: json.message });
      return;
    }

    const ssrHostname =
      SsrHostname === "localhost" ? SsrHostname : "." + SsrHostname;
    const appwriteHostname =
      AppwriteHostname === "localhost"
        ? AppwriteHostname
        : "." + AppwriteHostname;

    const cookiesStr = (response.headers.get("set-cookie") ?? "")
      .split(appwriteHostname)
      .join(ssrHostname);

    const cookiesArray = setCookie.splitCookiesString(cookiesStr);
    const cookiesParsed = cookiesArray.map((cookie: any) =>
      setCookie.parseString(cookie)
    );

    for (const cookie of cookiesParsed) {
      requestEvent.cookie.set(cookie.name, cookie.value, {
        domain: cookie.domain,
        secure: cookie.secure,
        sameSite: cookie.sameSite as any,
        path: cookie.path,
        maxAge: cookie.maxAge,
        httpOnly: cookie.httpOnly,
        expires: cookie.expires,
      });
    }

    requestEvent.json(200, json);
  } catch (err: any) {
    requestEvent.json(400, { mesages: err.message });
  }
};
