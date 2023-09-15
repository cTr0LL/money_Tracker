import './App.css';
import {useEffect, useState} from "react";

function App() {

  const [name,setName]=useState("");
  const [datetime,setDatetime]=useState("");
  const [description,setDesciption]=useState('');
  const [transactions,setTransactions]=useState([]);

  useEffect(()=>{
    getTransactions().then(setTransactions)
  },[]);

  async function getTransactions()
  {
    const url = process.env.REACT_APP_API_URL+'/transaction';
    const response = await fetch(url);
    return await response.json();
  }


  function addNewTransaction(ev) {
    ev.preventDefault();
    const url = process.env.REACT_APP_API_URL+"/transaction";
    const price=name.split(" ")[0];
    console.log(url);

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        price,
        name: name.substring(price.length + 1),
        description,
        datetime,
      }),
    }).then((response) => {
      response.json().then((json) => {
        setName("");
        setDatetime("");
        setDesciption("");
        setTransactions([...transactions,json]);
        console.log("result", json);
      });
    });


  }

  let balance=0;
  for(const transaction of transactions)
  {
    balance = balance+transaction.price;
  }

  balance=balance.toFixed(2);
  const fraction=balance.split('.')[1];
  balance=balance.split('.')[0];

  return (
   <main>
    <h1>${balance}<span>{fraction}</span></h1>
    <form action="" onSubmit={addNewTransaction}>
      <div className="basic">      
        <input 
          type='text' 
          value={name}
          onChange={ev=>setName(ev.target.value)}
          placeholder={'+200 textbooks subscription'}
        />
        <input 
          value={datetime}
          onChange={ev=>setDatetime(ev.target.value)}
          type='datetime-local'
        />
      </div>
      <div className="description">
        <input 
          type='text' 
          value={description}
          onChange={ev=>setDesciption(ev.target.value)}
          placeholder={'description'}
        />
      </div>
      <button type="submit">Add new transaction</button>
    </form>
    <div className="transactions">
      {transactions.length>0&&transactions.map(transaction=>(
        <div>
          <div className="transaction">
            <div className="left">
                    <div className="name">{transaction.name}</div>
                    <div className="description">{transaction.description}</div>
            </div>
            <div className="right">
              <div className={"price "+((transaction.price<0)?'red':'green')}>{transaction.price}</div>
              <div classname="datetime">2023-09-13</div>
            </div>
          </div>
        </div>
      ))}
      
    </div>
   </main>
  );
}

export default App;
