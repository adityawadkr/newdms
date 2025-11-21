import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
    // baseURL omitted - uses relative path, automatically works with current origin
    plugins: [
        emailOTPClient()
    ]
});
