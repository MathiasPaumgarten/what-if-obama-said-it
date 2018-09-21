import { NextFunction, Request, Response } from "express";
import { readFileSync } from "fs";
import * as passport from "passport";
// @ts-ignore
import { Strategy } from "passport-google-oauth20";

interface Credentials {
    clientId: string;
    clientSecret: string;
    clientCallback: string;
    sessionSecret: string;
    whitelist: string[];
}

/**
 * Subset of profile object recieved from authentication.
 */
interface Profile {
    id: string;
    displayName: string;
    emails: Array<{ value: string, type: string }>;
    gender: string;
}

export interface User {
    email: string;
}

const credentialsFile: string = readFileSync( process.cwd() + "/auth.json", "utf-8" );
const credentials: Credentials = JSON.parse( credentialsFile );

function pruneProfile( profile: Profile ): User {
    const email = profile.emails.find( o => o.type === "account" );

    return {
        email: email ? email.value : "",
    };
}

export const INVALID_USER = "/auth/invalid";
export const AUTH_LOGIN = "/auth/login";
export const AUTH_CALLBACK = "/auth/callback";
export const SESSION_SECRET = credentials.sessionSecret;

export function authRequired( request: Request, response: Response, next: NextFunction ) {
    if ( !request.user ) {

        request.session!.oauth2return = request.originalUrl;
        return response.redirect( AUTH_LOGIN );

    } else if ( credentials.whitelist.indexOf( request.user.email ) < 0 ) {

        return response.redirect( INVALID_USER );

    }

    next();
}

export const strategy: passport.Strategy = new Strategy( {
    clientID: credentials.clientId,
    clientSecret: credentials.clientSecret,
    callbackURL: credentials.clientCallback,
    accessType: "offline",
}, ( _1: string, _2: string, profile: Profile, cb: ( error: Error | null, profile: User ) => void ) => {
    cb( null, pruneProfile( profile ) );
} );


