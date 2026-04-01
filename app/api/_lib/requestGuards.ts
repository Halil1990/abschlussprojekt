import { NextResponse } from "next/server";

type GuardOptions = {
  routeKey: string;
  windowMs: number;
  maxRequests: number;
};

type BucketEntry = {
  count: number;
  resetAt: number;
};

const requestBuckets = new Map<string, BucketEntry>();

function getClientIp(req: Request) {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return req.headers.get("x-real-ip") || "unknown";
}

function isLikelyAutomatedClient(req: Request) {
  const userAgent = (req.headers.get("user-agent") || "").toLowerCase();
  if (!userAgent) return true;

  const botSignatures = [
    "curl",
    "wget",
    "python-requests",
    "postmanruntime",
    "insomnia",
    "httpie",
  ];

  return botSignatures.some((signature) => userAgent.includes(signature));
}

function isCrossOriginRequest(req: Request) {
  const host = req.headers.get("host");
  if (!host) return false;

  const origin = req.headers.get("origin");
  if (origin) {
    try {
      return new URL(origin).host !== host;
    } catch {
      return true;
    }
  }

  const referer = req.headers.get("referer");
  if (referer) {
    try {
      return new URL(referer).host !== host;
    } catch {
      return true;
    }
  }

  return false;
}

function checkRateLimit(req: Request, options: GuardOptions) {
  const now = Date.now();
  const ip = getClientIp(req);
  const bucketKey = `${options.routeKey}:${ip}`;
  const current = requestBuckets.get(bucketKey);

  if (!current || now >= current.resetAt) {
    requestBuckets.set(bucketKey, {
      count: 1,
      resetAt: now + options.windowMs,
    });
    return null;
  }

  if (current.count >= options.maxRequests) {
    const retryAfterSeconds = Math.max(1, Math.ceil((current.resetAt - now) / 1000));
    return NextResponse.json(
      {
        error: "Zu viele Anfragen. Bitte spaeter erneut versuchen.",
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfterSeconds),
        },
      },
    );
  }

  current.count += 1;
  requestBuckets.set(bucketKey, current);
  return null;
}

export function runRequestGuards(req: Request, options: GuardOptions) {
  if (process.env.NODE_ENV === "production") {
    if (isCrossOriginRequest(req)) {
      return NextResponse.json(
        { error: "Ungueltige Request-Herkunft." },
        { status: 403 },
      );
    }

    if (isLikelyAutomatedClient(req)) {
      return NextResponse.json(
        { error: "Automatisierte Anfragen sind nicht erlaubt." },
        { status: 403 },
      );
    }
  }

  return checkRateLimit(req, options);
}