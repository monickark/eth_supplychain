pragma solidity ^0.5.0;

contract SupplierContract {

uint public invoiceCount = 0;
uint public inventoryGoodsCount = 0;

  struct SupplierInvoice {
    uint invoiceId;
    string invoiceDate;
    string productName;
    string manufacturer;
    uint price;
    string measurement;
    uint quantity;
    uint amount;
  }

  struct InventoryGood {
    uint inventoryId;
    string productName;
    string supplier;
    uint price;
    string measurement;
    uint quantity;
    uint amount;
  }

mapping(uint => SupplierInvoice) public supplierInvoices;
mapping(uint => InventoryGood) public inventoryGoods;

 function createSupplierInvoice(string memory _invoiceDate, string memory _productName, 
 string memory _manufacturer, uint _price, string memory _measurement, uint _quantity, uint _amount) public {
    invoiceCount ++;
    supplierInvoices[invoiceCount] = SupplierInvoice(invoiceCount, _invoiceDate, _productName, 
    _manufacturer, _price, _measurement, _quantity, _amount);
  }

  function addGoodsToInventory(string memory _productName, string memory _supplier, 
  uint _price, string memory _measurement, uint _quantity, uint _amount) public returns(uint) {
  inventoryGoodsCount ++;
  inventoryGoods[inventoryGoodsCount] = InventoryGood(inventoryGoodsCount, _productName,
    _supplier, _price, _measurement, _quantity, _amount);
    return inventoryGoodsCount;
  }

	 function changeQuantity(uint index, uint quantity) public {
    InventoryGood memory inventoryGood = inventoryGoods[index];
    inventoryGood.quantity = inventoryGood.quantity - quantity;
    inventoryGoods[index] = inventoryGood;
  }

}