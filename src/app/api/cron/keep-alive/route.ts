import { NextRequest, NextResponse } from "next/server"
import { Redis } from "@upstash/redis"
import { makeCronKeepAliveKey } from "@/state/redis-keys"

const redis = Redis.fromEnv()

export async function GET(request: NextRequest) {
  // Verify the request is from Vercel Cron
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const timestamp = new Date().toISOString()
    const key = makeCronKeepAliveKey()
    
    // Update the single keep-alive record with latest timestamp
    await redis.set(key, {
      lastUpdated: timestamp,
      updateCount: await redis.incr(`${key}:count`),
      purpose: "keep-alive"
    })

    return NextResponse.json({
      success: true,
      timestamp,
      message: "Database keep-alive executed successfully"
    }, { status: 200 })
  } catch (error) {
    console.error("Cron keep-alive error:", error)
    return NextResponse.json({
      success: false,
      error: "Failed to execute keep-alive"
    }, { status: 500 })
  }
}