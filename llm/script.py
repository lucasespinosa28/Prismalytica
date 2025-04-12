from web3 import Web3

w3 = Web3(Web3.HTTPProvider('https://mainnet.zkevm.cronos.org'))

def main():
    # Example of using the Web3 instance
    print("Connected to Ethereum node:", w3.is_connected())

    # Example of getting the latest block number
    latest_block = w3.eth.block_number
    print("Latest block number:", latest_block)

main()