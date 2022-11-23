import logo from './logo.svg';
import './App.css';
import {useState, useEffect} from  'react';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import {loadContract} from "./utils/load-contract";

function App() {
  const [web3Api,setweb3Api] = useState({
    provider :null,
    web3: null,
    contract: null
  });
  const[account, setAccount] = useState(null);
  const[balance,setBalance] = useState(null);
  const[reload,shouldReload]= useState(false);

  // for reloading website at every step to detect changes with having to reload manually.
  const reloadEffect =()=>shouldReload(!reload);
  useEffect(()=> {

    const loadProvider = async()=>{
      const provider = await detectEthereumProvider();
      const contract = await loadContract ("Funder",provider)
      if(provider){
        provider.request({method:"eth_requestAccounts"});
        setweb3Api({
          web3:new Web3(provider),
          provider,
          contract
        })
      }
      else {
        console.error('Please install MetaMask!')   //, error 
      }
      // if (window.ethereum){
      //   provider = window.ethereum;
      //   try{
      //     await provider.enable();
      //   }
      //   catch {
      //     console.error("user is not allowed");
      //   }
      // }
      //   else if (window.web3){
      //     provider = window.web3.currentProvider;
      //   }
      //   else if (!process.env.production){
      //     provider = new Web3.providers.HttpProvider("http://localhost:7545");
      //   }
        
    };

    loadProvider();
  },[]);
  //this useEffect is here for loading the balance of the contract.
  useEffect(()=> {
    const loadBalance = async () =>{
      const{contract,web3}=web3Api;
      const balance = await web3.eth.getBalance(contract.address);
      setBalance(web3.utils.fromWei(balance,"ether"));
    };
    web3Api.contract && loadBalance();

  },[web3Api,reload]);
  // useEffect used here for loading the account of metamsk you are connected to.


  useEffect(()=>{
    const getAccount = async()=>{
      const accounts = await web3Api.web3.eth.getAccounts()
      setAccount(accounts[0])
    }
    web3Api.web3 && getAccount()
  },[web3Api.web3,reload]);

  const transferFund = async()=>{
    const{web3, contract} = web3Api;
    await contract.transfer({
      from:account,
      value:web3.utils.toWei("2","ether")
    });
    reloadEffect()
  };
  const withdrawFund = async() =>{
    const {web3, contract} = web3Api;
    const withdrawAmount = web3.utils.toWei("2","ether") 
    await contract.withdraw(withdrawAmount, {
      from:account,
      
    });
    reloadEffect()
  };


  // console.log(web3Api.web3);
  return (
    
    <>
      <div class="card text-center">
        <div class="card-header">avneesh's Funding App</div>
        <div class="card-body">
          <h5 class="card-title">Balance: {balance} ETH</h5>
          <p class="card-text">
            Account : {account ? account :"not connected"}
          </p>
          {/* <button
            type="button" class="btn btn-success"
            onClick={async()=>{
              const accounts = await window.ethereum.request({method:"eth_requestAccounts",});
              console.log(accounts);
            }} 
            >
            Connect to metamask
          </button>*/}
          &nbsp;
          <button type="button" class="btn btn-success " 
          onClick ={transferFund}>
            Transfer
          </button>
          &nbsp;
          <button type="button" class="btn btn-primary " 
          onClick ={withdrawFund}>
            Withdraw
          </button>
        </div>
        <div class="card-footer text-muted">kaandi &bro's</div>
      </div>
    </>
  );
}

export default App;