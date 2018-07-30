declare module "twitter-js-client" {

    interface TwitterConfig {
        consumerKey: string,
        consumerSecret: string,
        accessToken: string,
        accessTokenSecret: string,
        callBackUrl: string,
    }

    class Twitter {
        constructor(config: TwitterConfig)

        getUserTimeline(
            option: { screen_name: string, count: string },
            error: ( error: string ) => void,
            success: ( value: string ) => void
        ): void
    }
}