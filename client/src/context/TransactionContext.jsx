import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "../utils/constant";

export const TransactionContext = React.createContext();

const { ethereum } = window;

const getEthereumContract = async () => {
  const provider = new ethers.BrowserProvider(ethereum);
  const signer = await provider.getSigner();
  const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);
  return transactionContract;
};

// eslint-disable-next-line react/prop-types
export const TransactionProvider = ({ children }) => {
  const [connectedAccount, setConnectedAccount] = useState();
  const [formData, setFormData] = useState({ addressTo: '', amount: '', keyword: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'));
  // eslint-disable-next-line no-unused-vars
  const [transactions, setTransactions] = useState([]);
  const handleChange = (e, name) => {
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };
  const getAllTransaction=async()=>{
    try {
      if(!ethereum) return alert("install metamask")
        const transactionContract = await getEthereumContract();

        const availableTransactions=await transactionContract.getAllTransaction()
        const structuredTransactions = availableTransactions.map((transaction) => ({
          addressTo: transaction.receiver,
          addressFrom: transaction.sender,
          timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
          message: transaction.message,
          keyword: transaction.keyword,
          amount: parseInt(transaction.amount._hex) / (10 ** 18)
        }));

        console.log(structuredTransactions);
        setTransactions(structuredTransactions);
    }
    catch(error){
      console.log(error)
    }
  }

  const checkIfWalletIsConnect = async () => {
    if (!ethereum) {
      console.log("Ethereum object not found");
      return null;
    }
    const accounts = await ethereum.request({ method: "eth_accounts" });
    console.log(accounts);
    if (accounts.length) {
      setConnectedAccount(accounts[0]);
      getAllTransaction()
    } else {
      console.log("No accounts found");
    }
  };
  const checkifTransactionExist=async()=>{
    try {
      const transactionContract = await getEthereumContract();
      const transactionCount = await transactionContract.getTransactionCount();
      window.localStorage.setItem("transactionCount",transactionCount)
    }
    catch(error){
      console.log(error)
    }
  }
  const connectWallet = async () => {
    try {
      if (!ethereum) {
        alert("Please install MetaMask");
        return;
      }
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      console.log(accounts);
      setConnectedAccount(accounts[0]);
    } catch (error) {
      console.log(error);
      throw new Error("No Ethereum object");
    }
  };

  const sendTransaction = async () => {
    try {
      if (!ethereum) return alert("Please install metamask");
      const { addressTo, amount, keyword, message } = formData;
      const transactionContract = await getEthereumContract();
      const parsedAmount = ethers.parseEther(amount);

      await ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: connectedAccount,
          to: addressTo,
          gas: '0x5208', // 21000 gwei
          value: parsedAmount.toString(16),
        }]
      });

      const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword);
      setIsLoading(true);
      console.log(`Loading - ${transactionHash.hash}`);
      await transactionHash.wait();
      setIsLoading(false);
      console.log(`Success - ${transactionHash.hash}`);

      const transactionCount = await transactionContract.getTransactionCount();
      setTransactionCount(transactionCount.toNumber());
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnect();
    checkifTransactionExist()
  }, []);

  return (
    <TransactionContext.Provider value={{ connectWallet, connectedAccount, formData, setFormData, handleChange, sendTransaction, isLoading }}>
      {children}
    </TransactionContext.Provider>
  );
};