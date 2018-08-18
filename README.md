# What if it was Obama

### About
Experimental site to highlight the difference in perception of headlines between Donald Trump and
Barack Obama.

All headlines are pulled from public twitter feeds of a variety of news outlets.

### Development

While the local environment runs off of fixtures, if so configured, the Twitter API requires
a crednetials.json file with the following structure:

```json
{
    "consumerKey": "...",
    "consumerSecret": "...",
    "accessToken": "...",
    "accessTokenSecret": "...",
    "callBackUrl": "..."
}
```

This file is not checked in and should never be. generate that file with your own credentials to
run the site.
