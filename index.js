const randomstring = require('randomstring')
const { URL, URLSearchParams } = require('url')

exports.handler = async (event, context) => {
    const {
        GIT_HOSTNAME='https://github.com',
        OAUTH_AUTHORIZE_PATH='/login/oauth/authorize',
        OAUTH_SCOPES='user,repo',
        CLIENT_ID
    } = event.stageVariables || {}

    if (!CLIENT_ID)
        throw new Error('No client_id configured for authorization.')

    const state = randomstring.generate(32)

    const authURL = new URL(OAUTH_AUTHORIZE_PATH, GIT_HOSTNAME)
    authURL.search = new URLSearchParams({
        client_id: CLIENT_ID,
        scope: OAUTH_SCOPES,
        allow_signup: false,
        state: state
    })

    // let eState = await encrypt({
    //     KeyId: 'bfc9c59c-7876-43e1-b436-006d62b19ea8',
    //     Plaintext: state
    // })
    // eState = eState.CiphertextBlob.toString()

    return {
        statusCode: 302,
        headers: {
            'Location': authURL.toString(),
            'Set-Cookie': `state=${state}; Max-Age=600; Domain=${event.requestContext.domainName}; Path=${event.requestContext.path.replace(/(?<=\/)auth$/, 'callback')}; Secure; HttpOnly`,
        },
        body: null
    }
}
