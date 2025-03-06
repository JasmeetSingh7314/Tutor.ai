import logging
import os
from dotenv import load_dotenv
from eth_account import Account
from src.constants.abi import MAIN_CONTRACT_ABI
from src.action_handler import register_action

logger = logging.getLogger("actions.sonic_actions")

# Note: These action handlers are currently simple passthroughs to the sonic_connection methods.
# They serve as hook points where hackathon participants can add custom logic, validation,
# or additional processing before/after calling the underlying connection methods.
# Feel free to modify these handlers to add your own business logic!

@register_action("get-token-by-ticker")
def get_token_by_ticker(agent, **kwargs):
    """Get token address by ticker symbol
    """
    try:
        ticker = kwargs.get("ticker")
        if not ticker:
            logger.error("No ticker provided")
            return None
            
        # Direct passthrough to connection method - add your logic before/after this call!
        agent.connection_manager.connections["sonic"].get_token_by_ticker(ticker)

        return

    except Exception as e:
        logger.error(f"Failed to get token by ticker: {str(e)}")
        return None

@register_action("get-sonic-balance")
def get_sonic_balance(agent, **kwargs):
    """Get $S or token balance.
    """
    try:
        address = kwargs.get("address")
        token_address = kwargs.get("token_address")
        
        
        if not address:
            load_dotenv()
            private_key = os.getenv('SONIC_PRIVATE_KEY')
            web3 = agent.connection_manager.connections["sonic"]._web3
            account = web3.eth.account.from_key(private_key)
            address = account.address
        
        print(address)
        # Direct passthrough to connection method - add your logic before/after this call!
        balance=agent.connection_manager.connections["sonic"].get_balance(
            address=address,
            token_address=token_address
        )
        return balance

    except Exception as e:
        logger.error(f"Failed to get balance: {str(e)}")
        return None
    
@register_action("get-rewards")
def generate_rewards(agent,user_address, name, level, title):
    try:    
            load_dotenv()
            # Initialize Web3 connection
            web3 = agent.connection_manager.connections["sonic"]._web3

            # Get contract address and ABI
            contract_address = os.getenv("CONTRACT_ADDRESS")
            contract_abi = MAIN_CONTRACT_ABI  # Replace with your contract ABI

            # Create contract instance
            contract = web3.eth.contract(address=contract_address, abi=contract_abi)

            # Get private key and wallet address
            private_key_hex = os.getenv('SONIC_PRIVATE_KEY')  # Ensure this is a hex string
            private_key = bytes.fromhex(private_key_hex.replace('0x', ''))  # Convert to bytes
            wallet_address = Account.from_key(private_key).address  # Derive wallet address from private key

            # Fetch chain ID
            chain_id = web3.eth.chain_id

            # Fetch nonce
            nonce = web3.eth.get_transaction_count(wallet_address)

            # Encode transaction data
            data = contract.encodeABI(fn_name='processUserAchievement', args=[user_address, name, int(level), title])

            # Build transaction
            transaction = {
                'chainId': chain_id,
                'gas': 3000000,  # Adjust gas limit as needed
                'gasPrice': web3.to_wei('30', 'gwei'),  # Adjust gas price as needed
                'nonce': nonce,
                'to': contract_address,
                'data': data,
            }

            # Sign the transaction
            signed_txn = Account.sign_transaction(transaction, private_key)

            # Send the transaction
            txn_hash = web3.eth.send_raw_transaction(signed_txn.rawTransaction)

            # Wait for the transaction to be mined
            txn_receipt = web3.eth.wait_for_transaction_receipt(txn_hash)
            print(f"Transaction successful: {txn_receipt}")

    except Exception as e:
        print(f"Error: {e}")
        
@register_action("send-sonic")
def send_sonic(agent, **kwargs):
    """Send $S tokens to an address.
    This is a passthrough to sonic_connection.transfer().
    Add your custom logic here if needed!
    """
    try:
        to_address = kwargs.get("to_address")
        amount = float(kwargs.get("amount"))

        # Direct passthrough to connection method - add your logic before/after this call!
        agent.connection_manager.connections["sonic"].transfer(
            to_address=to_address,
            amount=amount
        )
        return

    except Exception as e:
        logger.error(f"Failed to send $S: {str(e)}")
        return None

@register_action("send-sonic-token")
def send_sonic_token(agent, **kwargs):
    """Send tokens on Sonic chain.
    This is a passthrough to sonic_connection.transfer().
    Add your custom logic here if needed!
    """
    try:
        to_address = kwargs.get("to_address")
        token_address = kwargs.get("token_address")
        amount = float(kwargs.get("amount"))

        # Direct passthrough to connection method - add your logic before/after this call!
        agent.connection_manager.connections["sonic"].transfer(
            to_address=to_address,
            amount=amount,
            token_address=token_address
        )
        return

    except Exception as e:
        logger.error(f"Failed to send tokens: {str(e)}")
        return None

@register_action("swap-sonic")
def swap_sonic(agent, **kwargs):
    """Swap tokens on Sonic chain.
    This is a passthrough to sonic_connection.swap().
    Add your custom logic here if needed!
    """
    try:
        token_in = kwargs.get("token_in")
        token_out = kwargs.get("token_out") 
        amount = float(kwargs.get("amount"))
        slippage = float(kwargs.get("slippage", 0.5))

        # Direct passthrough to connection method - add your logic before/after this call!
        agent.connection_manager.connections["sonic"].swap(
            token_in=token_in,
            token_out=token_out,
            amount=amount,
            slippage=slippage
        )
        return 

    except Exception as e:
        logger.error(f"Failed to swap tokens: {str(e)}")
        return None