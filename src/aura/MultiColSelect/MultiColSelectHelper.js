({
	doInit: function(component) {
    //at this stage, do nothing
    //causes a performance degradation - to prevent, pass in objects that contain sort and type attributes
    var items = component.get("v.items");
    items.forEach( function(item,index){
      item.sort = index;
      item.type = 'source';
    });
    component.set("v.items",items);
  },

  handleListClick : function(component,event, listName, selectedListName, selectedItemName ){
    var id = event.currentTarget.id;
    var items = component.get(listName);

    var itemOriginal = component.get(selectedItemName);

    var item = this.getItem(id,items);
    items = this.removeStyles(items);

    if (event.shiftKey && itemOriginal) {
      //make a selection from one to the next!
      var start = item.sort < itemOriginal.sort ? item.sort : itemOriginal.sort;
      var end = item.sort > itemOriginal.sort ? item.sort : itemOriginal.sort;

      var subset = this.getItems(start,end,items);

      subset = this.addStyles(subset,' spear-focus ');
      component.set(selectedListName,subset);
      component.set(selectedItemName,'');
    }
    else {
      component.set(selectedItemName,item);
      component.set(selectedListName,[]);
    }
    component.set(listName,items);

  },

  handleAddItems : function(component,event, sourceName, destinationName, selectedListName, selectedItemName,addTo){
    
    var itemsHighlight = component.get(selectedListName);
    var itemHighlight = component.get(selectedItemName);

    //source list (nominally lhs)
    var source = component.get(sourceName);
    //destination list (nominally rhs)
    var destination = component.get(destinationName);


    if (!itemsHighlight.length && itemHighlight){
      itemsHighlight.push(itemHighlight)
    }
    else if(!itemsHighlight.length && !itemHighlight){
      return;
    }
    var self = this;
    itemsHighlight.forEach(function(item){
      self.moveItemTo(source,destination,item,addTo);
    });

    //we never want to renumber the true source (lhs)
    if (addTo == 'source'){
      source = this.renumberItems(source);
    }
    else {
      destination = this.renumberItems(destination);
    }
    source = this.sortItems(source);
    destination = this.sortItems(destination);

    //write all values back
    component.set(sourceName,source);
    component.set(destinationName,destination);
    this.broadcastDataChange(component);

  },


  reorderItem : function (component,sourceName, selectedListName, selectedItemName, direction) {
    
    var item = component.get(selectedItemName);
    if (!item){
      return;
    }
    var swapItem,swapIndex;
    //clear selected list
    component.get(selectedListName,[]);

    var source = component.get(sourceName);
    source = this.renumberItems(source);
 
    if (direction == 'up'){
      if (item.sort < 1 ){
        return;
      }
      swapIndex = item.sort - 1;
    }
    if (direction == 'down'){
      if (item.sort == source.length ){
        return;
      }
      swapIndex = item.sort + 1;
    }
    swapItem = this.getItem(swapIndex,source);
    if (!swapItem){
      return;
    }
    var temp = item.sort;
    item.sort = swapItem.sort;
    swapItem.sort = temp;

    //sort and save
    source = this.sortItems(source);
    component.set(sourceName,source);

    item.style  = ' spear-focus ';
    component.set(selectedItemName,item);
    this.broadcastDataChange(component);


  },

  handleDragStart: function(component, event, listName) {

    var id = event.currentTarget.id;

    var items = component.get(listName);
    var item = this.getItem(id,items);

    event.dataTransfer.setData("text", JSON.stringify(item));

  },

  handleOnDragEnter: function(component, event) {
    var selectedItemsDiv = component.find("selectedItems");
    $A.util.addClass(selectedItemsDiv,' spear-focus ');
  },

  handleOnDragLeave: function(component, event) {
    var selectedItemsDiv = component.find("selectedItems");
    $A.util.removeClass(selectedItemsDiv,' spear-focus ');
  },

  handleOnDropSelf: function(component, event) {

    var selectedItemsDiv = component.find("selectedItems");
    $A.util.removeClass(selectedItemsDiv,' spear-focus ');

    var selectedItems = component.get("v.selectedItems");

    var droppedItem = JSON.parse(event.dataTransfer.getData('text'));
    var receivingItem;

    //if dropping destination onto destination
    if (droppedItem.type == 'destination') {
      //prevent event from going further
      
      //this item is not "connected" as it was serialized, so connect via it's index
      droppedItem = this.getItem(droppedItem.sort,selectedItems);
      receivingItem = this.getItem(event.currentTarget.id,selectedItems);

      selectedItems = this.insertItemAt(droppedItem,receivingItem,selectedItems);

      // selectedItems = this.sortItems(selectedItems);
      component.set("v.selectedItems",selectedItems);
      event.preventDefault();
      event.stopPropagation();
      this.broadcastDataChange(component);

    }
    //if not destination, allow to be handled by parent
  },

  handleOnDrop: function(component, event) {
    event.preventDefault();

    var selectedItemsDiv = component.find("selectedItems");
    $A.util.removeClass(selectedItemsDiv,' spear-focus ');

    var selectedItems = component.get("v.selectedItems");
    var items = component.get("v.items");

    var item = JSON.parse(event.dataTransfer.getData('text'));

    if (item.type == 'source') {
      //this item is not "connected" as it was serialized, so connect via it's index
      item = this.getItem(item.sort,items);
      item = this.moveItemTo(items,selectedItems,item,'destination');
      selectedItems = this.renumberItems(selectedItems);
    }
    else {
      //this item is not "connected" as it was serialized, so connect via it's index
      item = this.getItem(item.sort,selectedItems);
      item = this.moveItemTo(selectedItems,items,item,'source');
      items = this.sortItems(items);
    }
    selectedItems = this.renumberItems(selectedItems);

    component.set("v.selectedItems",selectedItems);
    component.set("v.items",items);
    this.broadcastDataChange(component);
  },

  broadcastDataChange : function(component){

    component.set("v.changeEventScheduled",true);
    var timer = component.get("v.storedTimer");
    if (timer){
      window.clearTimeout(timer);
    }

    timer = window.setTimeout(
      $A.getCallback(function() {
        var compEvent = component.getEvent("multiColumnSelectChange");
        compEvent.setParams({ "type": "multiColumnSelectChange","data" : component.get('v.selectedItems')});
        compEvent.fire();
        component.set("v.changeEventScheduled",false);
        console.log('event fired regular helper ' + JSON.stringify(compEvent.getParams()) );

      }), 1000
    );
  },


  insertItemAt : function (fromItem,toItem,items){
    var fromIndex = fromItem.sort;
    var toIndex = toItem.sort;

    if (fromIndex == toIndex){
      return items;
    }
    if (Math.abs(fromIndex-toIndex) == 1){  //just swap
      var temp = fromItem.sort;
      fromItem.sort = toItem.sort;
      toItem.sort = temp;
    }
    else if (fromIndex>toIndex){
      items.forEach( function(item){
        if (item.sort >= toIndex){
          item.sort++;
        }
      });
      fromItem.sort = toIndex;
    }
    else if (toIndex>fromIndex){
      items.forEach( function(item){
        if (item.sort <= toIndex && item.sort > fromIndex){
          item.sort--;
        }
      });
      fromItem.sort = toIndex;
    }
    return this.sortItems(items);
  },


  getItem : function(indexVar,items) {
    var itemToReturn;
    items.forEach( function(item){
      if (item.sort == indexVar){
        itemToReturn = item;
      }
    });
    return itemToReturn;
  },

  moveItemTo : function(source,destination,item,addTo){
    item.type = addTo;
    item.style = '';
    //if we put back to the source, we'll grab this sort and reinstate it.
    if (addTo == 'destination'){
      item.sort = item.savedSort;
    }
    else {
      item.savedSort = item.sort;
    }
    source = this.removeItem(item.sort,source);
    destination.push(item);

    return item;
  },

  getItems : function(start,end,items) {
    var itemsToReturn = [];
    items.forEach( function(item){
      if (item.sort >= start && item.sort <= end){
        itemsToReturn.push(item);
      }
    });
    return itemsToReturn;
  },

  removeStyles : function(items) {
    items.forEach( function(item){
      item.style = '';
    });
    return items;
  },

  addStyles : function(items,style) {
    items.forEach( function(item){
      item.style = style;
    });
    return items;
  },

  removeItem : function(indexVar,items) {
    items.forEach(function(item, index) {
      if (item.sort == indexVar) {
        items.splice(index, 1);
      }
    });
    return items;
  },

  sortItems : function(items) {
    items.sort(function(a, b) {
      return a.sort > b.sort ? 1 : -1;
    });
    return items;
  },

  renumberItems : function(items) {

    items = this.sortItems(items);
    items.forEach(function(item, index) {
      item.sort = index;
    });
    return items;
  },

})
