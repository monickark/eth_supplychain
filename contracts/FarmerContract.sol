pragma solidity ^0.5.0;

contract FarmerContract {

uint public invoiceCount = 0;

  struct FarmerInvoice {
    uint invoiceId;
    string invoiceDate;
    string productName;
    string supplier;
    uint price;
    string measurement;
    uint quantity;
    uint amount;
    string status;
  }

mapping(uint => FarmerInvoice) public farmerInvoices;

 function createFarmerInvoice(string memory _invoiceDate, string memory _productName, string memory _supplier, uint _price, 
 string memory _measurement, uint _quantity, uint _amount ) public {
    invoiceCount ++;
    farmerInvoices[invoiceCount] = FarmerInvoice(invoiceCount, _invoiceDate, _productName,
     _supplier, _price, _measurement, _quantity, _amount, "C");
  }
 
 function changeStatus(uint index, string memory _status) public {
    FarmerInvoice memory invoiceObj = farmerInvoices[index];
    invoiceObj.status = _status;
    farmerInvoices[index] = invoiceObj;
 }

}
