import { fetchUserEmail } from "modules/cache";
import { PLACEHOLDER_ARGON_PASSWORD } from "modules/constants";
import { E_AccountInvalidDetails } from "modules/errors";
import { generateUserToken } from "modules/token";
import { validateBody } from "modules/middleware";
import { warn } from "modules/logger";
import { yellow } from "colorette";
import { Router } from "express";

import j from "joi";

const r = Router();

r.post("/login",
validateBody(j.object({
    gift_code_sku_id: j.string().valid(null).optional(),
    login: j.string().email().required(),
    login_source: j.string().valid(null).optional(),
    password: j.string().required(),
    undelete: j.bool()
})),
async (req, res) => {
    const { login, password } = req.body;

    warn(`Attempting login for user ${yellow(login)}!`);
    const u = await fetchUserEmail(login, { select: { email: true, password: true, id: true } });
    
    const actualPwd = u?.password ?? PLACEHOLDER_ARGON_PASSWORD;
    if (!await Bun.password.verify(password, actualPwd)) { return res.error(E_AccountInvalidDetails, {}); }
    if (!u) { return res.error(E_AccountInvalidDetails, {}); }
    
    // todo MFA

    const token = generateUserToken(u.id, Date.now(), actualPwd);
    res.json({
        user_id: u.id,
        token,
        user_settings: { locale: "en-US", theme: "dark" }
    });
});

export default {
    app: r,
    entryPoint: "/api/v9/auth"
}