import arcjet, { shield, detectBot, tokenBucket} from "@arcjet/node";
import { ARCJET_KEY } from "./env.js";

const aj = arcjet({
    key: ARCJET_KEY,
    characteristics: ["ip.src"],
    rules: [
        shield({ mode: "LIVE" }),
        detectBot({
            mode: process.env.NODE_ENV === 'production' ? 'LIVE' : 'DRY_RUN',
            allow: [
                "CATEGORY:SEARCH_ENGINE",
            ],
        }),
        tokenBucket({
            mode: "LIVE",
            refillRate: 5,
            interval: 10,
            capacity: 10,
        }),
    ],
});

export default aj;