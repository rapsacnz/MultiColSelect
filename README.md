# MultiColSelect
A Lightning Multi Column Select List with Drag and Drop

To use, look at the MultiColSelectApp app. Eg:

   <aura:application access="global" extends="force:slds" >
      <aura:attribute name="stagenames" type="Object[]" default="[
      {
        'label': 'Annual Review',
        'value': 'Annual Review'
      },
      {
        'label': 'Watching Rates',
        'value': 'Watching Rates'
      },
      {
        'label': 'Initial Contact',
        'value': 'Initial Contact'
      }
      ]"/>
        
      <div class="slds">
        <div class="slds-box">
          <c:MultiColSelect fieldName="Opportunity Stage" fieldAPIName="StageName" items="{!v.stagenames}" />
        </div>     
      </div>
    </aura:application>
    
You can:
 - Drag from source to destination
 - Drag from destination to source
 - Drag to reorder in destination list
 - Shift select several items in source or destination, then use the arrow buttons to move to either source or destination
 - Highlight an item and use the up / down buttons to move up and down.

At this point the component is very lightweight - you are required to pass in the source list.
When the selected items list changes, the component emits an event called "multiColumnSelectChange" of type "c:DataChange"
The changed items will be in data.items parameter on the event.

Enjoy!
