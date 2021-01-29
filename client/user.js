$("#userForm").validate({
  rules: {
      firstName: 'required',
      lastName: 'required',
      age: {
      required: true,
      minlength: 2,
      maxlength: 3,
      number: true
      },
      city: 'required'
    },
    messages: {
      firstName: 'Enter a first name',
      lastName: 'Enter a last name',
      age: {
        required: 'Enter age',
      minlength: 'Age must be at least 2 characters long',
      maxlength: 'Age must be within 3 characters long',
      number: 'Enter only numbers'
      },
      city: 'Enter a city'
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
      User.createUser();
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


User = {
  contracts: {},
  currentAccount : null,

  createUser: function (){                   
    console.log("First Name: "+ $('#firstName').val());
    console.log("Last Name: "+ $('#lastName').val());
    console.log("Age: "+ $('#age').val());
    console.log("Is city: "+ $('#city').val());

  if ($('#firstName').val() && $('#lastName').val()  && $('#age').val()  && $('#city').val() ){        
       web3.eth.getAccounts(function (error,accounts){
      if (error){
          User.showError(error);
      }
      $('#buttonUserSave').prop('disabled', true);
      
      let tipAmount = window.web3.utils.toWei('0.005', 'Ether');
      console.log("tipAmount" + tipAmount);
      console.log("curr acc"+ User.currentAccount);
      User.contracts.HelloWorld.deployed().then(function(instance){
        return instance.createUser.sendTransaction($('#firstName').val(), $('#lastName').val(), 
        $('#age').val() , $('#city').val(), {from:User.currentAccount, value: tipAmount})
      }).then(function(result){
           User.showMessage('New User Added Successfully...');
           User.ShowSavedUser();    
          $('#buttonUserSave').prop('disabled', false);      
          M.toast({html: 'New User Added Successfully...', classes: 'rounded'});
      }).catch(function (error){
        $('#buttonUserSave').prop('disabled', false); 
           User.showError("You have rejected the transaction.");
      })
    })
  }
  else{
    console.log("Data not filled for all fields....");
      User.showError("Please fill all fields.");
  }
},

ShowSavedUser : function (){
  console.log("inside load");
    User.contracts.HelloWorld.deployed().then(async function(instance){         
        var userCount = await instance.userCount();
        console.log("Save user Count:"+ userCount);

        const $temp1 = $('.temp1')
      //  console.log("temp1 b4: "+JSON.stringify($temp1));
        var len = userCount;
        console.log("Length...."+ len);
           const user = await instance.Users(parseInt(len));
          // console.log("User: "+JSON.stringify(user));
           const userId = user[0].toNumber();
           const fname = user[1];
           const lname = user[2];
           const age = user[3];
           const city = user[4];

           const $newData = $temp1;
           $newData.find('.tfname').html(fname);
           $newData.find('.tlname').html(lname);
           $newData.find('.tempage').html(age.toString());
           $newData.find('.tcity').html(city);
         // console.log("newData: "+JSON.stringify($newData));  
          $("<tr><td>"+userId+"</td><td>"+fname+"</td><td>"+lname+"</td><td>"+age.toString()+"</td><td>"+city+"</td></tr>")
          .prependTo("table > tbody");
    }).catch((err) =>{
        console.log(err);
        User.showError(err);
    })
},

displayUsers : function (){
    console.log("inside load");
      User.contracts.HelloWorld.deployed().then(async function(instance){         
          var userCount = await instance.userCount();
          console.log("Display User Count:"+ userCount);              
          const $temp1 = $('.dataRow');
          $('.dataRow').remove();
         //  Render out each task with a new task template
          for (var i = userCount; i >= 1; i--) {
           //  Fetch the task data from the blockchain
            const $newData = $temp1.clone();
            const user = await instance.Users(parseInt(i));
           // console.log("User: "+JSON.stringify(user));
            const userId = user[0].toNumber();
            const fname = user[1];
            const lname = user[2];
            const age = user[3];
            console.log("age: "+age);
            const city = user[4];  
            $newData.find('.did').html(userId);
            $newData.find('.dfname').html(fname);
            $newData.find('.dlname').html(lname);
            $newData.find('.dage').html(age.toString());
            $newData.find('.dcity').html(city);
           // console.log("b4: "+$('.dataBody').html());
                $('.dataBody').append($newData) ;  
            //    console.log("after: "+$('.dataBody').html());
          
       } 
         
      }).catch((err) =>{
          console.log(err);
          User.showError(err);
      })
  },

  
  showMessage: function (msg){
    $('.success-data-user').html(msg);
    $('#errorHolderUser').hide();
    $('#output-user').show();
    $("input[type=text], textarea").val("");
  },
  showError: function(err){
      console.log("inside error...."+ JSON.stringify(err));
      $('#errorHolderUser').html(err);
     $('#errorHolderUser').show();
      $('#output-user').hide();
  }

  }
  
  module.exports = User;