$("#supplierForm").validate({
  rules: {
    sproductName: 'required',
    sinvoiceId: 'required',
    smanufacturer: 'required',
    sinvoiceDate: {
      required: true,
      maxDate: true
    },
    sprice: {
    required: true,
    maxlength: 5,
    number: true
    },
    squantity: {
      required: true,
      maxlength: 5,
      number: true
    },
    smeasurement: 'required',
  },
  messages: {
    sproductName: 'Enter a product',
    sinventoryId: 'Select a product',
    smanufacturer: 'Select a manufacturer',
    sinvoiceDate: {
      required: "Enter a date",
      maxDate: "Future date not accepted"
    },
    sprice: {
      maxlength: 'Price must be within 5 characters long',
      number: 'Enter price only',
      required: 'Enter price',
    },
    squantity: {
      maxlength: 'Qty must be within 5 characters long',
      number: 'Enter qty only',
      required: 'Enter qty',
    },
    smeasurement: 'Select a measurement',
  },
  errorElement: 'div',
  errorPlacement: function(error, element) {
    var placement = $(element).data('error');
    if (placement) {
        $(placement).append(error)
    } else {
        error.insertAfter(element);
    }
  },
  submitHandler: function(form) {
    event.preventDefault();
    Supplier.createSupplierInvoice();
  },
  highlight: function ( element, errorClass, validClass ) {
    $( element ).parents( ".input-field" ).addClass( "has-error" ).removeClass( "has-success" );
    $( element ).next( "span" ).addClass( "glyphicon-remove" ).removeClass( "glyphicon-ok" );
  },
  unhighlight: function ( element, errorClass, validClass ) {
    $( element ).parents( ".input-field" ).addClass( "has-success" ).removeClass( "has-error" );
    $( element ).next( "span" ).addClass( "glyphicon-ok" ).removeClass( "glyphicon-remove" );
  }
});

$.validator.addMethod("maxDate", function(value, element) {
  var nameArr = value.split('-');
  var curDate = new Date();
  var inputDate = new Date(nameArr[1]+"-"+nameArr[0]+"-"+nameArr[2]);
  if (inputDate <= curDate)
      return true;
  return false;
}, "Invalid Date!");


inventoryGoods = [];
Supplier = {
  contracts: {},
  currentAccount : null,

  displayReceivedGoods : function (){
    console.log("inside display Received Goods");
    
    Supplier.contracts.FarmerContract.deployed().then(async function(instance){         
        var invoiceCount = await instance.invoiceCount();
        console.log("Display displayReceivedGoods invoice Count:"+ invoiceCount);              
        const $temp1 = $('.sr_dataRow');
        $('.sr_dataRow').remove();
       //  Render out each task with a new task template
        for (var i = invoiceCount; i >= 1; i--) {
         //  Fetch the task data from the blockchain
         const invoice = await instance.farmerInvoices(parseInt(i));
         // console.log("displayReceivedGoods invoice: "+JSON.stringify(invoice));
         console.log("Status : " + invoice[8]);
         
        
          const $newData = $temp1.clone();
          
          const sid = invoice[0].toNumber();
          const sindate = invoice[1];
          const spname = invoice[2];
          const smanufacturer = invoice[3];
          const sprice = invoice[4];
          const smeasurement = invoice[5];                  
          const squantity = invoice[6];
          const samount = invoice[7];  

          $newData.find('.sr_id').html(sid);
          $newData.find('.sr_indate').html(sindate);
          $newData.find('.sr_pname').html(spname);
          $newData.find('.sr_manufacturer').html(smanufacturer);
          $newData.find('.sr_price').html(sprice.toString());
          $newData.find('.sr_measurement').html(smeasurement);
          $newData.find('.sr_quantity').html(squantity.toString());
          $newData.find('.sr_amount').html(samount.toString());
          if(invoice[8] == 'C') {
          $newData.find('.sr_action').html(
            `<button class="btn btn-success btn-small waves-effect waves-light buttonAccept" type="submit" 
            >Accept</button>
            <button class="btn btn-danger btn-small waves-effect waves-light buttonReject" type="submit"  
            >Reject</button>`
          );
          } else if (invoice[8] == 'A') {
            $newData.find('.sr_action').html("ACCEPTED");
          } else {
            $newData.find('.sr_action').html("REJECTED");
          }

        //  console.log("b4: "+$('.sr_dataBody').html());
          $('.sr_dataBody').append($newData) ;  
      //    console.log("after: "+$('.sr_dataBody').html());
                
        
     } 
       
    }).catch((err) =>{
        console.log(err);
        Supplier.showError(err);
    })
  },

  changeGoodsStatus : function (id, status, obj){
    console.log("inside changeGoodsStatus :" + id + status, obj.html());         
         web3.eth.getAccounts(function (error,accounts){          
        if (error){
            Supplier.showError(error);
        }
       
        console.log("curr acc"+ Supplier.currentAccount);

        Supplier.contracts.FarmerContract.deployed().then(function(instance){
         return instance.changeStatus.sendTransaction(id, status, {from:Supplier.currentAccount})
        }).then(function(result){
            if(status == 'R') {
              obj.html("REJECTED");
              M.toast({html: 'You have rejected the received goods...', classes: 'rounded'});
              $('.buttonAccept').prop('disabled', false); 
              $('.buttonReject').prop('disabled', false); 
            }
        }).catch(function (error){
            Supplier.showError(error);
        })

      })
    
  },

  invoice: null,
   selectInventory: function (id){
    Supplier.isPaused = true;
    console.log("id :" + id);
    console.log("inside selectInventory");
    var sid = '1234';
    Supplier.contracts.FarmerContract.deployed().then(async function(instance){              
      Supplier.invoice = await instance.farmerInvoices(parseInt(id));
      console.log("Return Invoice: "+JSON.stringify(Supplier.invoice));  
      Supplier.isPaused = false;
    }).catch((err) =>{
        console.log(err);
        Supplier.showError(err);
    })

  },
  
  addGoodsToInventory : function (id,obj){ 
    if (Supplier.isPaused) {
      console.log("Waiting......");
        setTimeout(function(){Supplier.addGoodsToInventory(id,obj)},100);
    } else {             
      console.log("Invoice: "+JSON.stringify(Supplier.invoice)); 
      const sid = Supplier.invoice[0].toNumber();
      const sindate = Supplier.invoice[1];
      const spname = Supplier.invoice[2];
      const smanufacturer = Supplier.invoice[3];
      const sprice = Supplier.invoice[4];
      const smeasurement = Supplier.invoice[5];                  
      const squantity = Supplier.invoice[6];
      const samount = Supplier.invoice[7]; 

      console.log("inside addGoodsToInventory");
        console.log("sid: " + sid +" / sindate: " + sindate + " / spname: " + spname +"/ smanufacturer: "+ 
        smanufacturer+  "/ sprice: " + sprice   +"/ smeasurement: "+ smeasurement +
        "/ squantity: "+ squantity + "/ samount: "+ samount);
               
        web3.eth.getAccounts(function (error,accounts){
        if (error){
            Supplier.showError(error);
        }
        
        console.log("curr acc : "+ Supplier.currentAccount);
        var inventoryGoodsCount;   
        Supplier.contracts.SupplierContract.deployed().then(async function(instance){
          console.log("Inside SupplierContract....");
          inventoryGoodsCount = await instance.inventoryGoodsCount();
          console.log("goods Count b4:"+ JSON.stringify(inventoryGoodsCount));  
          console.log("goods Count b4:"+ inventoryGoodsCount);  
          inventoryGoodsCount++;
          console.log("goods Count after:"+ JSON.stringify(inventoryGoodsCount));  
          return instance.addGoodsToInventory.sendTransaction(spname, smanufacturer, parseInt(sprice), smeasurement, 
          parseInt(squantity), parseInt(samount), {from:Supplier.currentAccount});
            
        }).then(function(result){ 
          Supplier.changeGoodsStatus(id, 'A', obj);
          console.log("data saved..."); 
          console.log("Display goods Count:"+ JSON.stringify(inventoryGoodsCount));  
          console.log("Display goods Count:"+ inventoryGoodsCount); 
            M.toast({html: 'Invoice goods added to inventory successfully...', classes: 'rounded'});
            obj.html("ACCEPTED");    
            $("<tr><td>"+ inventoryGoodsCount +"</td><td>"+Supplier.invoice[2]+"</td><td>"+ 
            Supplier.invoice[4]+"</td> <td>"+Supplier.invoice[5]+"</td><td>"+Supplier.invoice[6]+"</td><td>"+
            Supplier.invoice[7]+ "</td></tr>").prependTo(".gi_dataBody");
            $('.buttonAccept').prop('disabled', false);
            $('.buttonReject').prop('disabled', false); 
       
            console.log("value: "+ inventoryGoodsCount);
            console.log("text: "+ Supplier.invoice[2]);
       
            var $newOpt = $("<option>").attr({value:inventoryGoodsCount, class:'prodOption'}).
            text(Supplier.invoice[2]);              
            $("#sproductName").append($newOpt);
            $("#sproductName").trigger('contentChanged');

        }).catch(function (error){
          $('.buttonAccept').prop('disabled', false); 
          $('.buttonReject').prop('disabled', false);
            console.log("Error in data saving...");
            console.log(error);
            Supplier.showError(error);
        })
      })  
    };
  },

  inventoryGoods : function (){
    console.log("inside inventoryGoods");
    
    Supplier.contracts.SupplierContract.deployed().then(async function(instance){   
      console.log("Deployed supplier contract");         
        var inventoryGoodsCount = await instance.inventoryGoodsCount();
        console.log("Display goods Count:"+ inventoryGoodsCount);   

        const $temp1 = $('.gi_dataRow');
        $('.gi_dataRow').remove();

        for (var i = inventoryGoodsCount; i >= 1; i--) {
         const goodObj = await instance.inventoryGoods(parseInt(i))
          console.log("goodObj: "+JSON.stringify(goodObj));         
        
          const $newData = $temp1.clone();
          
          const sid = goodObj[0].toNumber();
          const spname = goodObj[1];
          this.inventoryGoods[i-1]=goodObj;
          const smanufacturer = goodObj[2];
          const sprice = goodObj[3];
          const smeasurement = goodObj[4];                  
          const squantity = goodObj[5];
          const samount = goodObj[6];  

          $newData.find('.gi_id').html(sid);
          $newData.find('.gi_pname').html(spname);
          $newData.find('.gi_manufacturer').html(smanufacturer);
          $newData.find('.gi_price').html(sprice.toString());
          $newData.find('.gi_measurement').html(smeasurement);
          $newData.find('.gi_quantity').html(squantity.toString());
          $newData.find('.gi_amount').html(samount.toString());
     
        //  console.log("b4: "+$('.gi_dataBody').html());
          $('.gi_dataBody').append($newData) ;  
        //  console.log("after: "+$('.gi_dataBody').html());
     } 
     
    console.log("inventoryGoods length.... :"+ inventoryGoods.length);
    for (index = 0; index < inventoryGoods.length; index++) {
      console.log("inventoryGoods[index]: "+inventoryGoods[index]);
      console.log("inventoryGoods[index].quantity: "+inventoryGoods[index].quantity);
      if(inventoryGoods[index].quantity > 0)  {
        var $newOpt = $("<option>").attr({value:inventoryGoods[index].inventoryId, class:'prodOption'}).
        text(inventoryGoods[index].productName)
        $("#sproductName").append($newOpt);
        $("#sproductName").trigger('contentChanged');
      }      
    }   
    }).catch((err) =>{
        console.log(err);
        Supplier.showError(err);
    })

  },

  createSupplierInvoice: function (){
    console.log("inside createSupplierInvoice");
    var sinventoryId = $("#sinventoryId").val();
    var sinvoceDate = $('#sinvoiceDate').val();
    var sproductName = $('#sproductName option:selected').html();
    var smanufacturer = $('#smanufacturer').val();
    var sprice = $('#sprice').val();
    var smeasurement = $('#smeasurement').val();
    var squantity = $('#squantity').val();
    var samount = $('#samount').val();


    console.log("sproductName: " + sproductName +"/ smanufacturer: "+smanufacturer +     "/ sprice: " + 
    sprice    +"/ smeasurement: "+ smeasurement +     "/ squantity: "+ squantity + "/ samount: "+ samount);
    
    if (sproductName && smanufacturer  && sprice  && smeasurement && squantity && samount ){     
      $('#buttonSupplierSave').prop('disabled', true); 
         web3.eth.getAccounts(function (error,accounts){
        if (error){
            Supplier.showError(error);
        }
        
        console.log("curr acc"+ Supplier.currentAccount);

        var invoiceCount;
        Supplier.contracts.SupplierContract.deployed().then(async function(instance){
        invoiceCount =  await instance.invoiceCount();
        console.log("Display supplier Invoices count:"+ invoiceCount);  

        return instance.createSupplierInvoice.sendTransaction(sinvoceDate, sproductName, smanufacturer, 
        sprice , smeasurement, squantity, samount, {from:Supplier.currentAccount})
        }).then(function(result){
          $("<tr><td>"+parseInt(invoiceCount)+1+"</td><td>"+sinvoceDate+"</td><td>"+ sproductName+"</td> <td>"+
          smanufacturer+"</td><td>"+ sprice +"</td> <td>"+smeasurement+"</td><td>"+
          squantity+"</td><td>"+samount+"</td></tr>").prependTo(".sdataBody");
          Supplier.showMessage('Submitted data saved Successfully....');            
          
          Supplier.changeGoodsQuantity(sinventoryId, squantity);
          M.toast({html: 'New Invoice Added Successfully...', classes: 'rounded'});
          Supplier.ShowSavedSupplierInvoice();
         
          $('#buttonSupplierSave').prop('disabled', false); 
        }).catch(function (error){
          $('#buttonSupplierSave').prop('disabled', false); 
            console.log("Error.... : " + error);
            Supplier.showError(error);
        })
      })
    }
    else{
      console.log("Data not filled for all fields....");
        Supplier.showError('Please fill all fields...');
    }
  },

  ShowSavedSupplierInvoice : function (){
    console.log("inside ShowSavedInvoice");
      Supplier.contracts.SupplierContract.deployed().then(async function(instance){         
        var invoiceCount = await instance.invoiceCount();
          const $ss_temp = $('.ss_temp')
          console.log("ss_temp b4: "+JSON.stringify($ss_temp));
          var len = invoiceCount;
             const invoice = await instance.supplierInvoices(parseInt(len));
             console.log("Invoice: "+JSON.stringify(invoice));
             const sid = invoice[0].toNumber();
             const sindate = invoice[1];
             const spname = invoice[2];
             const smanufacturer = invoice[3];
             const sprice = invoice[4];
             const smeasurement = invoice[5];                  
             const squantity = invoice[6];
             const samount = invoice[7];  
             
            const $newData = $ss_temp;
            console.log("newData: "+JSON.stringify($newData));
            $newData.find('.ss_indate').html(sindate);   
            $newData.find('.ss_pname').html(spname);
            $newData.find('.ss_manufacturer').html(smanufacturer);
            $newData.find('.ss_price').html(sprice.toString());
            $newData.find('.ss_measurement').html(smeasurement);
            $newData.find('.ss_quantity').html(squantity.toString());
            $newData.find('.ss_amount').html(samount.toString());
      }).catch((err) =>{
          console.log(err);
          Supplier.showError(err);
      })
  },

  displaySuppliers : function (){
    console.log("inside load");
      Supplier.contracts.SupplierContract.deployed().then(async function(instance){         
          var invoiceCount = await instance.invoiceCount();
          console.log("Display invoice Count:"+ invoiceCount);              
          const $temp1 = $('.sdataRow');
          $('.sdataRow').remove();
         //  Render out each task with a new task template
          for (var i = invoiceCount; i >= 1; i--) {
           //  Fetch the task data from the blockchain
            const $newData = $temp1.clone();
            const invoice = await instance.supplierInvoices(parseInt(i));
         //   console.log("Invoice: "+JSON.stringify(invoice));
            const sid = invoice[0].toNumber();
            const sindate = invoice[1];
            const spname = invoice[2];
            const smanufacturer = invoice[3];
            const sprice = invoice[4];
            const smeasurement = invoice[5];                  
            const squantity = invoice[6];
            const samount = invoice[7];


            $newData.find('.sid').html(sid);
            $newData.find('.sindate').html(sindate);
            $newData.find('.spname').html(spname);
            $newData.find('.smanufacturer').html(smanufacturer);
            $newData.find('.sprice').html(sprice.toString());
            $newData.find('.smeasurement').html(smeasurement);
            $newData.find('.squantity').html(squantity.toString());
            $newData.find('.samount').html(samount.toString());
          //  console.log("b4: "+$('.sdataBody').html());
            $('.sdataBody').append($newData) ;  
         //   console.log("after: "+$('.sdataBody').html());
          
       } 
         
      }).catch((err) =>{
          console.log(err);
          Supplier.showError(err);
      })
  },

  changeGoodsQuantity : function (id, quantity){
    console.log("inside changeGoodsQty :" + id + quantity);         
         web3.eth.getAccounts(function (error,accounts){
        if (error){
            Supplier.showError(error);
        }       
        console.log("curr acc"+ Supplier.currentAccount);
        Supplier.contracts.SupplierContract.deployed().then(function(instance){
         return instance.changeQuantity.sendTransaction(id, quantity, {from:Supplier.currentAccount})
        }).then(function(result){
          Supplier.contracts.SupplierContract.deployed().then(async function(instance){
            const goodObj = await instance.inventoryGoods(parseInt(id));
            console.log("createSupplierInvoice Goodobj :"+JSON.stringify(goodObj));
            console.log("Goodobj qty :"+goodObj.quantity);
            if(goodObj.quantity == 0) {             
              console.log("Ready to remove");
              $("#sproductName option[value='"+sinventoryId+"']").remove();          
              $("#sproductName").trigger('contentChanged');
            }
          });
        }).catch(function (error){
            Supplier.showError(error);
        })
      })    
  },

  showMessage: function (msg){
    $('.success-data-supplier').html(msg.toString());
    $('#errorHolderSupplier').hide();
    $('#output-supplier').show();
    $('.buttonAccept').prop('disabled', false); 
     $('.buttonReject').prop('disabled', false);      
    $("input[type=text], textarea").val("");
  },

  showError: function(err){
      console.log("inside error...."+ err.toString());
      $('#errorHolderSupplier').html(err.toString());
      $('#errorHolderSupplier').show();
      $('#output-supplier').hide();
      $('.buttonAccept').prop('disabled', false); 
      $('.buttonReject').prop('disabled', false); 
  }
}

  $(function() {
    $(window).load(function() {
      $('#sproductName').formSelect();  
      $('.sproductName').on('contentChanged', function() {
      // alert("changed....");
       $(this).formSelect();
      });      
    });

    $('#sproductName').on('change',function(){
      var selectedIndex = $(this).val();

      Supplier.contracts.SupplierContract.deployed().then(async function(instance){
        
        var inventoryGoodsCount = await instance.inventoryGoodsCount();
        console.log("inventoryGoods length.... :"+ inventoryGoodsCount);        
       
        var goodObj;
        for (var i = inventoryGoodsCount; i >= 1; i--) {
          const tempObj = await instance.inventoryGoods(parseInt(i));
          // alert("id: "+ tempObj. inventoryId);
          if (tempObj. inventoryId == selectedIndex) {
            goodObj = tempObj;
            break;
          }
         
      } 
   
     // alert(goodObj.price);
      $("#sinventoryId").val(goodObj.inventoryId);
      $("#sinventoryId").focus();
      $("#sprice").val(goodObj.price);
      $("#sprice").focus();
      $("#smeasurement").val(goodObj.measurement);
      $("#smeasurement").focus();
      $("#squantity").val(goodObj.quantity);
      $("#squantity").focus();
      $("#samount").val(goodObj.amount);
      $("#samount").focus();

      }).then(function(result){
      });

   });

  });
  
  module.exports = Supplier;
