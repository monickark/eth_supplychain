$("#farmerForm").validate({
  rules: {
    productName: 'required',
    supplier: 'required',
    invoiceDate: {
      required: true,
      maxDate: true
    },
    price: {
    required: true,
    maxlength: 5,
    number: true
    },
    quantity: {
      required: true,
      maxlength: 5,
      number: true
    },
    measurement: 'required',
  },
  messages: {
    productName: 'Enter a product',
    supplier: 'Select a supplier',
    invoiceDate: {
      required: "Enter a date",
      maxDate: "Future date not accepted"
    },
    price: {
    maxlength: 'Price must be within 5 characters long',
    number: 'Enter price only',
    required: 'Enter price',
    },
    quantity: {
      maxlength: 'Qty must be within 5 characters long',
      number: 'Enter qty only',
      required: 'Enter qty',
    },
    measurement: 'Select a measurement',
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
    Farmer.createFarmerInvoice();
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

Farmer = {
  contracts: {},
  currentAccount : null,

  createFarmerInvoice: function (){
    if ($('#productName').val() && $('#supplier').val()  && $('#price').val()  && $('#measurement').val() 
    && $('#quantity').val() && $('#amount').val() ){        
         web3.eth.getAccounts(function (error,accounts){
          $('#buttonFarmerSave').prop('disabled', true);
        if (error){
            Farmer.showError(error);
        }
       
        console.log("curr acc"+ Farmer.currentAccount);
        Farmer.contracts.FarmerContract.deployed().then(function(instance){
          return instance.createFarmerInvoice.sendTransaction($('#invoiceDate').val(), $('#productName').val(), $('#supplier').val(), 
          $('#price').val() , $('#measurement').val(), $('#quantity').val(), $('#amount').val(), 
          {from:Farmer.currentAccount})
        }).then(function(result){          
             Farmer.showMessage('Submitted data saved Successfully....');
             Farmer.ShowSavedInvoice();
            $('#buttonFarmerSave').prop('disabled', false);
            M.toast({html: 'New Invoice Added Successfully...', classes: 'rounded'});
        }).catch(function (error){
          $('#buttonFarmerSave').prop('disabled', false);
          Farmer.showError("You have rejected the transaction.");
        })
      })
    }
    else{
      console.log("Data not filled for all fields....");
        Farmer.showError('Please fill all fields...');
    }
  },
  ShowSavedInvoice : function (){
      console.log("inside ShowSavedInvoice");
        Farmer.contracts.FarmerContract.deployed().then(async function(instance){         
          var invoiceCount = await instance.invoiceCount();
            const $sf_temp = $('.sf_temp')
          //  console.log("sf_temp b4: "+JSON.stringify($sf_temp));
            var len = invoiceCount;
               const invoice = await instance.farmerInvoices(parseInt(len));
               console.log("Invoice: "+JSON.stringify(invoice));
               const fid = invoice[0].toNumber();
               const findate = invoice[1];
               const fpname = invoice[2];
               const fsupplier = invoice[3];
               const fprice = invoice[4];
               const fmeasurement = invoice[5];                  
               const fquantity = invoice[6];
               const famount = invoice[7];  
               
              const $newData = $sf_temp;
              console.log("newData: "+JSON.stringify($newData));   
              $newData.find('.sf_indate').html(findate);
              $newData.find('.sf_pname').html(fpname);
              $newData.find('.sf_supplier').html(fsupplier);
              $newData.find('.sf_price').html(fprice.toString());
              $newData.find('.sf_measurement').html(fmeasurement);
              $newData.find('.sf_quantity').html(fquantity.toString());
              $newData.find('.sf_amount').html(famount.toString());
              $("<tr><td>"+fid+"</td><td>"+findate+"</td><td>"+fpname+"</td> <td>"+fsupplier+"</td><td>"+fprice.toString()+"</td><td>"+fmeasurement+"</td><td>"+fquantity.toString()+"</td><td>"+famount.toString()+"</td></tr>")
          .prependTo("table > tbody");
        }).catch((err) =>{
            console.log(err);
            Farmer.showError(err);
        })
    },

  displayFarmers : function (){
      console.log("inside load");
        Farmer.contracts.FarmerContract.deployed().then(async function(instance){         
            var invoiceCount = await instance.invoiceCount();
            console.log("Display farmer invoice Count:"+ invoiceCount);              
            const $temp1 = $('.fdataRow');
            $('.fdataRow').remove();
           //  Render out each task with a new task template
            for (var i = invoiceCount; i >= 1; i--) {
             //  Fetch the task data from the blockchain
              const $newData = $temp1.clone();
              const invoice = await instance.farmerInvoices(parseInt(i));

              const fid = invoice[0].toNumber();
              const findate = invoice[1];
              const fpname = invoice[2];
              const fsupplier = invoice[3];
              const fprice = invoice[4];
              const fmeasurement = invoice[5];                  
              const fquantity = invoice[6];
              const famount = invoice[7];  


              $newData.find('.fid').html(fid);
              $newData.find('.findate').html(findate);
              $newData.find('.fpname').html(fpname);
              $newData.find('.fsupplier').html(fsupplier);
              $newData.find('.fprice').html(fprice.toString());
              $newData.find('.fmeasurement').html(fmeasurement);
              $newData.find('.fquantity').html(fquantity.toString());
              $newData.find('.famount').html(famount.toString());

              $('.fdataBody').append($newData) ;  
            
          } 
           
        }).catch((err) =>{
            console.log(err);
            Farmer.showError(err);
        })
    },
  showMessage: function (msg){
    $('.success-data-farmer').html(msg.toString());
    $('#errorHolderFarmer').hide();
    $('#output-farmer').show();
    $("input[type=text], textarea").val("");
  },
  showError: function(err){
      console.log("inside error...."+ err.toString());
      $('#errorHolderFarmer').html(err.toString());
      $('#errorHolderFarmer').show();
      $('#output-farmer').hide();
  }

}
  
module.exports = Farmer;
