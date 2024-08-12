import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Balances = () => {
    const [balances, setBalances] = useState({ checking: 0, savings: 0 });
    const [transaction, setTransaction] = useState({ accountType: 'checking', amount: 0 });
    const navigate = useNavigate();

    const fetchBalances = async () => {
        try {
            const response = await fetch("http://localhost:5000/account", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Network response was not ok');
            }

            const balancesData = await response.json();
            setBalances({
                checking: balancesData.checking || 0,
                savings: balancesData.savings || 0
            });
        } catch (error) {
            console.error('Fetch balances error:', error);
        }
    };

    useEffect(() => {
        fetchBalances();
    }, []);

    const handleTransaction = async (type) => {
        const url = type === 'deposit' ? '/deposit' : '/withdraw';
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(transaction),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Network response was not ok');
            }

            await fetchBalances();

            navigate('/summary'); 
        } catch (error) {
            console.error('Transaction error:', error);
        }
    };

    // Check if balances are null or undefined to determine loading state
    if (balances === null || balances === undefined) {
        return <div>Loading...</div>;
    }

    // Check if user is not authenticated, then redirect to login page
    if (!localStorage.getItem('token')) {
        navigate('/');
    }

    return (
        <div>
            <h1>Account Balances</h1>
            <p>Checking: ${balances.checking}</p>
            <p>Savings: ${balances.savings}</p>
            <h2>Transaction</h2>
            <form onSubmit={(e) => e.preventDefault()}>
                <label>
                    Account Type:
                    <select value={transaction.accountType} onChange={(e) => setTransaction({ ...transaction, accountType: e.target.value })}>
                        <option value="checking">Checking</option>
                        <option value="savings">Savings</option>
                    </select>
                </label>
                <label>
                    Amount:
                    <input type="number" value={transaction.amount} onChange={(e) => setTransaction({ ...transaction, amount: parseFloat(e.target.value) })} />
                </label>
                <button type="button" onClick={() => handleTransaction('deposit')}>Deposit</button>
                <button type="button" onClick={() => handleTransaction('withdraw')}>Withdraw</button>
            </form>
        </div>
    );
};

export default Balances;
