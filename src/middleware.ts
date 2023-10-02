import { authMiddleware } from "@clerk/nextjs";
 
export default authMiddleware({
      // "/" will be accessible by everyone
      publicRoutes: ["/"]

});
 
export const config = {
      matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};