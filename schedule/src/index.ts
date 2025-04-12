import { env } from "cloudflare:workers";

const randomTweets = [
    'Hello, world!',
    'This is a random tweet.',
    'Cloudflare Workers are awesome!',
    'Automated tweets are fun!',
    'Have a great day!',
];

async function sendTweet(tweet: string, env: any): Promise<void> {
    const url = 'https://api.twitter.com/2/tweets';
    const body = JSON.stringify({ text: tweet });

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `OAuth oauth_consumer_key="${env.TWITTER_CONSUMER_KEY}", oauth_token="${env.TWITTER_ACCESS_TOKEN}", oauth_signature_method="HMAC-SHA1", oauth_version="1.0"`,
                'Content-Type': 'application/json',
            },
            body,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to send tweet: ${response.status} - ${errorText}`);
        }

        console.log('Tweet sent successfully:', tweet);
    } catch (error) {
        console.error('Error sending tweet:', error);
    }
}

export default {
    async fetch(request, env, ctx): Promise<Response> {
        const randomTweet = randomTweets[Math.floor(Math.random() * randomTweets.length)];

        try {
            await sendTweet(randomTweet, env);
            return new Response(`Tweet sent: ${randomTweet}`);
        } catch (error) {
            return new Response(`Error sending tweet: ${error}`, { status: 500 });
        }
    },

    async scheduled(event, env, ctx): Promise<void> {
        const randomTweet = randomTweets[Math.floor(Math.random() * randomTweets.length)];

        try {
            await sendTweet(randomTweet, env);
        } catch (error) {
            console.error('Error sending tweet:', error);
        }
    },
} satisfies ExportedHandler<Env>;