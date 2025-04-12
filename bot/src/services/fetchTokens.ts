import { Token } from "../types";
import { TokenApiResponse } from "../types";
import { responseTokens } from "../types";


export async function fetchTokens(): Promise<responseTokens[]> {
    const url = `https://api.geckoterminal.com/api/v2/networks/cro/tokens/multi/0x5c7f8a570d578ed84e63fdfa7b1ee72deae1ae23%2C0x9d8c68f185a04314ddc8b8216732455e8dbb7e45%2C0x2d03bece6747adc00e1a131bba1469c15fd11e03%2C0x062e66477faf219f25d27dced647bf57c3107d52%2C0xccccccccdbec186dc426f8b5628af94737df0e60%2C0x3b41b27e74dd366ce27cb389dc7877d4e1516d4d%2C0x6b431b8a964bfcf28191b07c91189ff4403957d0%2C0xd2ee4bd0d1be7e84160dc459006f6e0970f8313c%2C0xdd73dea10abc2bff99c60882ec5b2b81bb1dc5b2%2C0xdbb3a75b102f1e65653adb19ee282d209843a1b6`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'accept': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error fetching coins: ${response.status} - ${response.statusText}. Response: ${errorText}`);
            throw new Error(`Failed to fetch coins: ${response.statusText}`);
        }
        const jsonData = await response.json() as TokenApiResponse;
        const tokens = jsonData.data.map((token: Token) => ({
            name: token.attributes.name,
            symbol: token.attributes.symbol,
            price_usd: token.attributes.price_usd,
            top_pools: token.relationships.top_pools.data[0].id.replace('cro_', ''),
        }));
        return tokens;
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error in fetchTokens:', error.message);
            throw new Error(`Error fetchTokens: ${error.message}`);
        } else {
            console.error('Unknown error in fetchTokens:', error);
            throw new Error('An unknown error occurred while fetchTokens.');
        }
    }
}