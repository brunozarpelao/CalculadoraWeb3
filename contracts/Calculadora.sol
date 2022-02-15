pragma solidity ^0.5.16;

contract Calculadora{

    address payable owner;

    constructor() public{
        owner = msg.sender;
    }

    modifier mediantePagamento{
	    address payable payee = msg.sender;

        require(msg.value>=100 szabo, "O valor transferido deve ser de pelo menos 100 szabo");

        bool sent = owner.send(100 szabo);
        require(sent, "Failed to send Ether to the owner");

        sent = payee.send(msg.value-100 szabo);
        require(sent, "Failed to send Ether to the payee");

	    _; //placeholder
    }


    function somar(uint32 a, uint32 b) public payable mediantePagamento {

       emit resultadoEvent(a+b);
    }

    function subtrair(uint32 a, uint32 b) public payable mediantePagamento {
        emit resultadoEvent(a-b);
    }

    function multiplicar(uint32 a, uint32 b) public payable mediantePagamento {
        emit resultadoEvent(a*b);
    }

    function dividir(uint32 a, uint32 b) public payable mediantePagamento {
        emit resultadoEvent(a/b);
    }

    event resultadoEvent (
        uint32 resultado
    );

}