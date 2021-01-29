
var Web3 = require('web3');
var TruffleContract = require('truffle-contract');
var Supplier = require('./supplier');
var Farmer = require('./farmer');
var User = require('./user');

let web31;
let curacc;

if(window.ethereum){
    console.log("inside etheerium");
	web31 = new Web3(window.ethereum)
	window.ethereum.enable()
} else if(window.web3) {
    console.log("inside web3");
	web31 = new Wb3(window.web3.currentProvider);
} else {
    console.log("inside console.log");
}
web3.eth.getAccounts(function (error,accounts){
    console.log("acc: "+ accounts);
    console.log("curr acc"+ accounts[0]);    
    curacc =    accounts[0];   
    Farmer.currentAccount =  accounts[0];  
    Supplier.currentAccount =  accounts[0];   
    User.currentAccount =  accounts[0];
  })
  
App = {
    web3Provider: null,
    contracts: {},
    currentAccount:{},
    

    /* *****************************  WEB 3 & CONTRACT   *********************************** */

    initWeb3 : async function (){
         if (process.env.MODE == 'development' || typeof window.web3 === 'undefined'){
             console.log("if");
             App.web3Provider = new Web3.providers.HttpProvider(process.env.LOCAL_NODE);
         }
         else{
              console.log("else");
              App.web3Provider = web3.currentProvider;
         }
    console.log("start");
        App.web3Provider = web31.currentProvider;
       console.log("inside ");
        web3 = new Web3(App.web3Provider);
        web3 = web31;
        return  await App.initContractHelloWorld();
    },

    initContractHelloWorld : async function (){
     console.log ("inside init");
        await $.getJSON('HelloWorld.json',function(data){
            var HelloWorldArtifact = data;
            User.contracts.HelloWorld = TruffleContract(HelloWorldArtifact);
            User.contracts.HelloWorld.setProvider(App.web3Provider);
        })

        await $.getJSON('FarmerContract.json',function(data){
            var FarmerArtifact = data;
            Farmer.contracts.FarmerContract = TruffleContract(FarmerArtifact);
            Farmer.contracts.FarmerContract.setProvider(App.web3Provider);

            Supplier.contracts.FarmerContract = TruffleContract(FarmerArtifact);
            Supplier.contracts.FarmerContract.setProvider(App.web3Provider);
        })

        await $.getJSON('SupplierContract.json',function(data){
          var SupplierArtifact = data;
          Supplier.contracts.SupplierContract = TruffleContract(SupplierArtifact);
          Supplier.contracts.SupplierContract.setProvider(App.web3Provider);
      })
        return App.bindEvents();
    },

    /* *****************************  GENERAL FUNCTIONS   *********************************** */
    bindEvents: function() {      
      $(document).on("click", ".buttonAccept", function(){
        var id = $(this).parent().parent().find(".sr_id").html();
        var obj = $(this).parent().parent().find(".sr_action"); 
        Supplier.selectInventory(id);     
        Supplier.addGoodsToInventory(id,obj);
      });

      $(document).on("click", ".buttonReject", function(){
        var id = $(this).parent().parent().find(".sr_id").html();
        var obj = $(this).parent().parent().find(".sr_action"); 
        Supplier.changeGoodsStatus(id, 'R', obj);
        
      });
  },

    init : async function (){
        await App.initWeb3();   
        await User.displayUsers();
        await Farmer.displayFarmers();
        await Supplier.displayReceivedGoods();   
        await Supplier.inventoryGoods();
       await Supplier.displaySuppliers();     
    }
}

  /* ************************ SCRIPT FUNCTIONS *************************** */

$(function() {
    $(window).load(function() {
      
       /* $('[id*="errorHolder"]').hide(); */
       $('[id*="output"]').hide();
      App.init();
      $('#price').change(function(){
        $('#price, #quantity').change(function(){
          var amount=$('#price').val() * $('#quantity').val();
          $('#amount').val(amount);
          $('#amount').focus();
      });
        });
        $('#sprice, #squantity').change(function(){
          var amount=$('#sprice').val() * $('#squantity').val();
          $('#samount').val(amount);
          $('#samount').focus();
        });
       
    });
  });
