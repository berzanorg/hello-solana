import {
    Keypair,
    Connection,
    clusterApiUrl,
    TransactionInstruction,
    PublicKey,
    Transaction,
} from '@solana/web3.js'

const PROGRAM_ID_IN_BASE58 = "4QUoN6yh4v4gB11TzwFjNAo9GULUB81hwPBRFfDPUkp1";


(async () => {

    console.log('Launching client...\n')

    // Make a new Connection
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed')

    // Generate the program ID
    const programId = new PublicKey(PROGRAM_ID_IN_BASE58)

    // Generate a new Keypair to intereact with the program
    const triggerKeypair = Keypair.generate()

    // Request airdrop
    const airdropSignature = await connection.requestAirdrop(triggerKeypair.publicKey, 1e9)
    const latestBlock = await connection.getLatestBlockhash()
    await connection.confirmTransaction({
        blockhash: latestBlock.blockhash,
        lastValidBlockHeight: latestBlock.lastValidBlockHeight,
        signature: airdropSignature,
    })

    // Make a tx with the Program
    console.log('Pinging the program:', programId.toBase58(), '\n')
    const instructions = new TransactionInstruction({
        keys: [{
            pubkey: triggerKeypair.publicKey,
            isSigner: false,
            isWritable: true,
        }],
        programId: programId,
        data: Buffer.alloc(0),
    })
    
    const tx = new Transaction().add(instructions)
    
    const txId = await connection.sendTransaction(tx, [triggerKeypair])

    console.log('Tx ID:', txId)
    console.log('Fee:', 1e9 - await connection.getBalance(triggerKeypair.publicKey, 'confirmed'))



})()
