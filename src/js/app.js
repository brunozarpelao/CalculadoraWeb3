const { default: BigNumber } = require("bignumber.js");

App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function() {
    return App.initWeb3();
  },

  initWeb3: async function() {

    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access…
        console.error("User denied account access");
      }
    } else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    } else {
      App.web3Provider = new Web3.providers.HttpProvider("http://localhost:8545");
    }
    
    web3 = new Web3(App.web3Provider);

    
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Calculadora.json", function(calculadora) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Calculadora = TruffleContract(calculadora);
      // Connect provider to interact with contract
      App.contracts.Calculadora.setProvider(App.web3Provider);
      //inicializa o listener para capturar os eventos
      App.listenForEvents();

      return App.render(null);
    });
  },

  render: function(resultado) {
    var loader = $("#loader");
    var content = $("#content");
  
    loader.show();
    content.hide();
    
    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    $("#resultadoOperacao").html("Resultado: " + resultado);

    loader.hide();
    content.show();
  
    
  }, 

  calcular: function(){
    var operacaoId = $('#operacaoSelect').val();
    var valor1 = $('#valor1').val();
    var valor2 = $('#valor2').val();

    App.contracts.Calculadora.deployed().then(function(instance) {
      switch (operacaoId) {
        case 'somar':
          instance.somar(valor1, valor2, { from: App.account, value: 1000000000000000000 });
          break;
        case 'subtrair':
          instance.subtrair(valor1, valor2, { from: App.account, value: 1000000000000000000 });
          break;
        case 'multiplicar':
          instance.multiplicar(valor1, valor2, { from: App.account, value: 1000000000000000000 });
          break;
        case 'dividir':
          instance.dividir(valor1, valor2, { from: App.account, value: 1000000000000000000 });
          break;
        default:
          console.log('Opcao invalida');
      }
    }).catch(function(err) {
      console.error(err);
    });

    
  }, 

  //para efetivar o cálculo, é necessário transferir fundos
  //com isso, a transação que invoca a função tem como retorno
  //uma espécie de extrato da transaçao.
  //para que possamos ter o resultado do cálculo, 
  //precisamos criar um evento que retorna este resultado e é
  //capturado pela aplicação web. 
  listenForEvents: function() {
    App.contracts.Calculadora.deployed().then(function(instance) {
      instance.resultadoEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        const resultado = new BigNumber(event.args.resultado);
        App.render(resultado.toString());
      });
    });


    
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});