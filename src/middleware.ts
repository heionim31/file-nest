import { authMiddleware } from "@clerk/nextjs";
 
// Public routes are exempted from authentication.
export default authMiddleware({
    publicRoutes: ["/"]
});
 
// Every endpoint requires authentication
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};