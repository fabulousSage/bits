import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import TokenContract from '../TokenContract';

/**
 * KYCIntegration component handles integrating with a KYC provider to check 
 * if the user has passed KYC verification.
 * 
 * It fetches the user's token balance, checks if it meets the minimum required 
 * tokens, and if so calls the KYC check API. It displays the KYC status or 
 * instructions based on the results.
 * 
 * The component uses React hooks for state and effects.
 */
function KYCIntegration() {
    const [userTokenBalance, setUserTokenBalance] = useState(0);
    const [kycStatus, setKycStatus] = useState(null);
    const requiredTokens = 1000;

    // Use a Polygon RPC endpoint directly with Web3
    const web3 = new Web3('https://polygon-rpc.com');

    useEffect(() => {
        const fetchUserTokenBalance = async () => {
            try {
                const accounts = await web3.eth.getAccounts();
                const userAddress = accounts[0];
                const tokenContract = new web3.eth.Contract(TokenContract.abi, '0x5f5f7ca63A9d2c5200BC03CA3335a975D8f771d9');
                const tokenBalance = await tokenContract.methods.balanceOf(userAddress).call();
                setUserTokenBalance(parseInt(tokenBalance));

                if (parseInt(tokenBalance) >= requiredTokens) {
                    await kycCheck(userAddress);
                }
            } catch (error) {
                console.error('Error fetching user token balance:', error);
            }
        };

        fetchUserTokenBalance();
    }, []); // Add any dependencies here

    const kycCheck = async (userAddress) => {
        try {
            const kycResult = await doKycCheckWithBlockpass(userAddress);
            setKycStatus(kycResult.passed);
        } catch (error) {
            console.error('Error in KYC check:', error);
            setKycStatus(false);
        }
    };

    const renderKYCStatus = () => {
        if (userTokenBalance >= requiredTokens) {
            if (kycStatus === null) {
                return <p>Checking KYC status...</p>;
            } else if (kycStatus) {
                return <p>Your KYC check passed!</p>;
            } else {
                return <p>Your KYC check failed. Please try again.</p>;
            }
        } else {
            return <p>You need {requiredTokens - userTokenBalance} more tokens to qualify for KYC</p>;
        }
    };

    return (
        <div>
            {renderKYCStatus()}
        </div>
    );
}

// KYC check function
async function doKycCheckWithBlockpass(userAddress) {
    try {
        const response = await fetch('https://blockpass.org/kyc/api', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userAddress
            })
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error calling Blockpass KYC API:', error);
        throw error;
    }
}

export default KYCIntegration;
