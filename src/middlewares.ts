import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/login", "/_next", "/favicon.ico", "/api/auth"]; // ajuste conforme necessário

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permite acesso livre à página de login e arquivos públicos
  if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Verifica se existe token de autenticação do Supabase
  const supabaseToken = request.cookies.get("sb-access-token") || request.cookies.get("supabase-auth-token");

  // Se não autenticado, redireciona para login
  if (!supabaseToken) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
