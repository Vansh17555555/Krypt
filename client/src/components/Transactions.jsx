//import React from 'react'
import { useContext } from "react"
import { TransactionContext } from "../context/TransactionContext"

import { shortenAddress } from "../utils/shortenAddress"
//import { Transaction } from "ethers"
import useFetch from "../hooks/useFetch"
// eslint-disable-next-line react/prop-types
const TransactionCard=({addressTo,addressFrom,timestamp,message,amount,keyword,url})=>{
  const gifUrl=useFetch({keyword})
  
  return <div className="bg-[#181918] m-4 flex flex-1 2xl:min-w-[450px] 2xl:max-w-[500px] sm:min-w-[270px] sm:max-w-[300px] flex-col p-3 rounded-md hover:shadow-2xl">
    <div className="flex flex-col items-center w-full mt-3">
      <div className="display-flex justify-start w-full mb-6 p-2">
        <a href={`https://sepolia.etherscan.io/address/${addressFrom}`} target="_blank">
        <p className="text-white text-base">
          From: {shortenAddress(addressFrom)}
        </p>
        </a>
        <a href={`https://sepolia.etherscan.io/address/${addressTo}`} target="_blank">
        <p className="text-white text-base">
          From: {shortenAddress(addressTo)}
        </p>
        </a>
        <p className="text-white text-base">Amount:{amount}</p>
        {message && (
          <>
          <br/>
          <p className="text-white text-base">Message: {message}</p>
          </>
        )}
        </div>
        <img src={gifUrl||url} alt="gif" className="w-full h-64 2x:h-96 rounded-md shadow-lg object-cover"></img>
        <div className="bg-black p-3 px-5 w-max rounded-3xl -mt-5 shadow-2xl">
          <p className="text-[#37c7da] font-bold">
            {timestamp}
          </p>
        </div>

    </div>
  </div>
}

const Transactions = () => {
  const {connectedAccount,transactions}=useContext(TransactionContext)
  return (
    <div className="flex w-full justify-center items-center 2xl:px-20 gradient-bg-transactions">
      <div className="flex flex-col md:p-12 py-12 px-4 ">
       {
        connectedAccount?(
          <h3 className="text-white text-3xl text-center my-2">transacation history</h3>
        ):(  <h3 className="text-white text-3xl text-center my-2">connect your account</h3>)
       }
       <div className="flex flex-wrap justify-center items-center mt-10">
       {transactions && transactions.length > 0 ? (
            transactions.map((transaction, i) => (
              <TransactionCard key={i} {...transaction} />
            ))
          ) : (
            <p className="text-white text-xl text-center">No transactions found</p>
          )}
       </div>
      </div>
    </div>
  )
}

export default Transactions