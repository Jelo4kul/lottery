pragma solidity ^0.4.17;

contract Lottery {
    address public manager;
    address[] public players; 
    
    function Lottery() public {
        manager = msg.sender;
    }
    
    //payable implies that an amountv of ether will be sent when calling this function
    function enter() public payable {
        
        require(msg.value > .01 ether );
        
        players.push(msg.sender);
    }
    
    function random() private view returns(uint) {
        //we use the block difficulty, current time and players take the hash of it and convert to an integer
        //we assume this is random but it isn't exactly random since we can predict the winner ahead of time.
        return uint(keccak256(block.difficulty, now, players));
    }
    
    function pickWinner() restricted public {
       
        uint index = random() % players.length;
        //we send the total ether in this address and send to the address we referenced using the global transfer option
        players[index].transfer(this.balance);
        
        //reset our player array by creating a new dynamic array with initial size of zero
        players = new address[](0);
    }
    
    modifier restricted() {
         require(msg.sender == manager);
         _;
    }
    
    function getplayers() public view returns(address[]) {
        return players;
    }
}