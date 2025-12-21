import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const url = searchParams.get("url")
  const filename = searchParams.get("filename") || "image"

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 })
  }

  try {
    const response = await fetch(url)

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch image" },
        { status: response.status }
      )
    }

    const contentType = response.headers.get("content-type") || "image/png"
    const extension = contentType.split("/")[1] || "png"
    const buffer = await response.arrayBuffer()

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${encodeURIComponent(filename)}.${extension}"`,
        "Cache-Control": "no-cache",
      },
    })
  } catch (error) {
    console.error("Download error:", error)
    return NextResponse.json(
      { error: "Failed to download image" },
      { status: 500 }
    )
  }
}
