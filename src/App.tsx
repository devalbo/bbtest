import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
// import BbnvEcPair from './BbnvEcPair';
var BbtEcPair = require('./BbtEcPair')
var networks = require('./BbtNetworks');



const BITBOXSDK = require('bitbox-sdk').BITBOX;

const bitbox = new BITBOXSDK({
  restURL: "https://trest.bitcoin.com/v2/",
  bitdbURL: "https://tbitdb.bitcoin.com/",
});



const App: React.FC = () => {

  const addr = "bchtest:qqvgw0quyl0h5gsn7yf4l5pnx9hdugzary4frr25th";
  const key = "cQUXY2he5AD2JAQkDq9VWTYSS7gV4T5DGUw6y8Ap1n2DqGQ6xU5h";
  const amount = 10000;

  const sendToAddr = "bchtest:qzxkxkjttk0c649hgh5r6gk2ysfdehvpaunz7pxl3c";

  useEffect(() => {
    const x = async() => {
      let details = await bitbox.Address.utxo(addr);
      console.log(details);
      const utxos = details.utxos;

      const transactionBuilder = new bitbox.TransactionBuilder("testnet");

      // const ecpair = bitbox.ECPair.fromWIF(key);
      const ecpair = BbtEcPair.fromWIF(key, networks.testnet);
      const redeemScript: any = undefined;
    
      utxos.forEach((utxo: any) => {
        transactionBuilder.addInput(utxo.txid, utxo.vout);
      });
    
      console.log("ADDING OUTPUT");
      transactionBuilder.addOutput(sendToAddr, amount);
    
      utxos.forEach((utxo: any, index: number) => {
        console.log("SIGNING UTXO " + index)
        transactionBuilder.sign(index, ecpair, redeemScript, transactionBuilder.hashTypes.SIGHASH_ALL, utxo.satoshis);
      });
    
      console.log("BUILDING TX")
      const tx = transactionBuilder.build();
      const txHex = tx.toHex();
      console.log(txHex)

    }

    x();
  })





  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
