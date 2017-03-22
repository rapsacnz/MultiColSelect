({
	doInit : function(component, event, helper) {
    helper.doInit(component);
	},

  handleListClickSource : function(component, event, helper) {
    helper.handleListClick(component,event,"v.items","v.sourceHighlightedItems","v.sourceHighlightedItem");
  },
  handleListClickDestination : function(component, event, helper) {
    helper.handleListClick(component,event,"v.selectedItems","v.destHighlightedItems","v.destHighlightedItem");
  },


  handleAddItemsFromSource : function(component,event, helper){
    helper.handleAddItems(component,event,"v.items","v.selectedItems","v.sourceHighlightedItems","v.sourceHighlightedItem",'destination');
  },
  handleAddItemsFromDestination : function(component,event, helper){
    helper.handleAddItems(component,event,"v.selectedItems","v.items","v.destHighlightedItems","v.destHighlightedItem",'source');
  },

  handleReorderItemUp : function(component,event, helper){
    helper.reorderItem(component,"v.selectedItems","v.destHighlightedItems","v.destHighlightedItem",'up');
  },
  handleReorderItemDown : function(component,event, helper){
    helper.reorderItem(component,"v.selectedItems","v.destHighlightedItems","v.destHighlightedItem",'down');
  },

  handleDragStartFromSource: function(component, event, helper) {
    helper.handleDragStart(component,event,"v.items");
  },
  handleDragStartFromDestination: function(component, event, helper) {
    helper.handleDragStart(component,event,"v.selectedItems");
  },
  
  handleOnDragOver: function(component, event, helper) {
    event.preventDefault();
  },
  handleOnDragEnter: function(component, event, helper) {
    helper.handleOnDragEnter(component,event);
  },
  handleOnDragLeave: function(component, event, helper) {
    helper.handleOnDragLeave(component,event);
  },
  handleOnDrop: function(component, event, helper) {
    helper.handleOnDrop(component,event);
  },
  handleOnDropSelf: function(component, event, helper) {
    helper.handleOnDropSelf(component,event);
  },
  handleOnDragOverDummy: function(component, event, helper) {
    event.preventDefault();
  },
  handleOnDragEnterDummy: function(component, event, helper) {
    event.preventDefault();
  },
  handleOnDragLeaveDummy: function(component, event, helper) {
    event.preventDefault();
  },

  
})
