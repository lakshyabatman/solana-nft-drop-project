import React ,{useState, useEffect} from 'react';
import './App.css';
import twitterLogo from './assets/twitter-logo.svg';
import CandyMachine from './CandyMachine';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {

  const [walletAddress, setWalletAddress] = useState(null);

  const connectIfPhantomAvailable = async() => {
    try {
      const {solana} = window;
      if(solana && solana.isPhantom) {
        console.log("Phantom wallet is there! 🚀")
        const response = await solana.connect({ onlyIfTrusted: true })
        console.log("user's wallet address: ", response.publicKey.toString())
        setWalletAddress(response.publicKey.toString());
      }else {
        console.log(":( No solana or phantom here :(")
      }
    }catch(err) {
      console.error(err)
    }
  }

  useEffect(() => {
    const onLoad = async () => {
      await connectIfPhantomAvailable();
    };
    window.addEventListener("load", () => {
      onLoad()
    })
    return () => {
      window.removeEventListener("load",onLoad)
    }
  },[])

  const connectWallet = async () => {
    const { solana } = window;

    if (solana) {
      const response = await solana.connect();
      console.log('Connected with Public Key:', response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };
  
  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header">🍭 Candy Drop</p>
          <p className="sub-text">NFT drop machine with fair mint</p>
          {!walletAddress && renderNotConnectedContainer()}
          {walletAddress && <CandyMachine walletAddress={window.solana} />}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
