var Calculadora = artifacts.require("./Calculadora.sol");

module.exports = function(deployer) {
  deployer.deploy(Calculadora);
};