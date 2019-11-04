const randomstring = require('randomstring')
const { URL, URLSearchParams } = require('url')

exports.handler = (event, context, callback) => {
    const {
        GIT_HOSTNAME='https://github.com',
        OAUTH_AUTHORIZE_PATH='/login/oauth/authorize',
        OAUTH_SCOPES='user,repo',
        CLIENT_ID
    } = event.stageVariables || {}

    if (!CLIENT_ID)
        callback(new Error('No client_id configured for authorization.'))

    const state = randomstring.generate(32)

    const authURL = new URL(OAUTH_AUTHORIZE_PATH, GIT_HOSTNAME)
    authURL.search = new URLSearchParams({
        client_id: CLIENT_ID,
        scope: OAUTH_SCOPES,
        allow_signup: false,
        state: state
    })

    return callback(null, {
        statusCode: 302,
        headers: {
            'Location': authURL.toString(),
            'Set-Cookie': `state=${state}; Max-Age=600; Domain=${event.headers.Host}; Path=/${event.requestContext.stage}/callback; Secure; HttpOnly`,
        },
        body: null
    })
}
