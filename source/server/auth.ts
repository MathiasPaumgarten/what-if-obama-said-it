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
}

const credentialsFile: string = readFileSync( process.cwd() + "/auth.json", "utf-8" );
const credentials: Credentials = JSON.parse(credentialsFile);

export const AUTH_LOGIN = "/auth/login";
export const AUTH_CALLBACK = "/auth/callback";
export const SESSION_SECRET = credentials.sessionSecret;

export function authRequired( request: Request, response: Response, next: NextFunction ) {
    if ( !request.user ) {
        request.session!.oauth2return = request.originalUrl;
        return response.redirect( AUTH_LOGIN );
    }

    next();
}

export const strategy: passport.Strategy = new Strategy( {
    clientID: credentials.clientId,
    clientSecret: credentials.clientSecret,
    callbackURL: credentials.clientCallback,
    accessType: "offline",
}, ( _1: string, _2: string, profile: object, cb: ( error: Error | null, profile: object ) => void ) => {
    cb( null, profile );
} );


