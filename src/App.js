import { useState } from 'react';
import { ethers } from 'ethers';

// Contract ki details yahan aayengi
const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
const abi = [
  "function greeting() view returns (string)",
  "function setGreeting(string) public"
];

function App() {
  const [message, setMessage] = useState('');
  const [currentGreeting, setCurrentGreeting] = useState('');

  // 1. Wallet Connect aur Contract Read karna
  async function fetchGreeting() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, abi, provider);
      try {
        const data = await contract.greeting();
        setCurrentGreeting(data);
      } catch (err) {
        console.log("Error: ", err);
      }
    }
  }

  // 2. Blockchain par data likhna (Transaction)
  async function updateGreeting() {
    if (!message) return;
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner(); // User ka wallet signature chahiye
      const contract = new ethers.Contract(contractAddress, abi, signer);
      
      const transaction = await contract.setGreeting(message);
      await transaction.wait(); // Wait for block confirmation
      fetchGreeting();
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>DApp Greeting: {currentGreeting}</h2>
      <button onClick={fetchGreeting}>Fetch From Blockchain</button>
      <br /><br />
      <input 
        onChange={e => setMessage(e.target.value)} 
        placeholder="Naya message likho" 
      />
      <button onClick={updateGreeting}>Update Blockchain</button>
    </div>
  );
}

export default App;