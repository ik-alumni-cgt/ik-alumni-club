import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./app/web/i18n/routing";

const publicRoutes = [
  "/login",
  "/signup",
  "/",
  "/information",
  "/schedule",
  "/past-events",
  "/video",
  "/blog",
  "/profiles",
  "/contact",
  "/supporters",
  "/register/terms",
  "/register/plan",
  "/register/auth",
  "/sponsor-form",
  "/goods/thank-you",
  "/migrate-login",
  "/migrate-login/callback",
  "/forgot-password",
  "/reset-password",
  "/register/email",
  "/feature/5th-anniversary",
  "/terms",
  "/privacy",
  "/legal",
  // 編集者エリア。実際の認可は /team-blog のレイアウト（verifyEditor）で行うため、
  // ここで弾くと LINE ログイン画面にも到達できなくなる
  "/team-login",
  "/team-blog",
];
const adminRoutes = ["/admin-login"]; // 管理者ログインページは認証不要

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
	// セッションチェック
	const sessionCookie = getSessionCookie(request);
	const pathname = request.nextUrl.pathname;

	// ロケールを除いたパスを取得
	const pathnameWithoutLocale = pathname.replace(/^\/(ja|en)/, "") || "/";

	// 管理者エリアへのアクセスチェック
	const isAdminRoute = pathnameWithoutLocale.startsWith("/admin");
	const isAdminLoginRoute = adminRoutes.includes(pathnameWithoutLocale);

	// 管理者エリア(ログインページ以外)にアクセスした場合、未ログインなら管理者ログインページへ
	if (isAdminRoute && !isAdminLoginRoute && !sessionCookie) {
		return NextResponse.redirect(new URL("/admin-login", request.url));
	}

	// 一般の非公開ルートチェック（前方一致で判定）
	const isPublicRoute = publicRoutes.some(
		(route) => pathnameWithoutLocale === route || pathnameWithoutLocale.startsWith(route + "/")
	);
	const isPrivateRoute = !isPublicRoute && !isAdminRoute;

	// THIS IS NOT SECURE!
	// This is the recommended approach to optimistically redirect users
	// We recommend handling auth checks in each page/route
	if (!sessionCookie && isPrivateRoute) {
		const loginUrl = new URL("/login", request.url);
		// ログイン後に元のページに戻れるようにreturnUrlを付与
		loginUrl.searchParams.set("returnUrl", pathname);
		return NextResponse.redirect(loginUrl);
	}

	// 国際化ミドルウェアを実行
	return intlMiddleware(request);
}

export const config = {
	matcher: ["/((?!api|static|.*\\..*|_next).*)"],
};