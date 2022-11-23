// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Funder {
    uint256 public numOfFunders;

    mapping(uint256 => address) private funders;

    receive() external payable {}

    function transfer() external payable {
        funders[numOfFunders] = msg.sender;
    }

    function withdraw(uint256 withdrawAmount) external {
        require(
            withdrawAmount <= 2000000000000000000,
            "Cannot withdraw more than 2 ether"
        );
        payable(msg.sender).transfer(withdrawAmount);
    }
}
//1) this is our smart contract. we have added transfer, withdraw function in this and one receive function.
//2) after migration we will change the directory for contract's json file that is ./funding/public/contracts. we are doing this because 
//we can communicate with the items in public folder very easily.
//3) i'll show you how to change the directory. add this to your truffle-config.js.
//4) now create your app.js copy the code as i have listed down the github link.
//5) now connect your ganache to your metamask account.
//6) and start your local host by npm start in the terminal.
//7) now i'll show you how my project works.
//8) let me reload my website.
//9) metamask will auto pop up and ask for my password to connect to my account.
//10) i've set the transaction limit to 2 ether for transfer and withdrawal.
//11) thats it for my prject.