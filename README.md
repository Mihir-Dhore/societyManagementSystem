Parent To Child Relationship in LWC 
Scenario:- When User Select Society From the Lookup Input Field from the Modal the it should show the Related Events to that Society

Parent Component(SocietyModal Screen):
```
<template>
  <template if:true={showSocietyModal}>
   <section role="dialog" tabindex="-1" aria-modal="true" aria-labelledby="modal-heading-01" class="slds-modal slds-fade-in-open">
        <div class="slds-modal__container">
          <button class="slds-button slds-button_icon slds-modal__close slds-button_icon-inverse">
            <svg class="slds-button__icon slds-button__icon_large" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
            </svg>
            <span class="slds-assistive-text">Cancel and close</span>
          </button>
          <div class="slds-modal__header">
            <h1 id="modal-heading-01" class="slds-modal__title slds-hyphenate">SELECT SOCIETY</h1>
          </div>
          <div class="slds-modal__content slds-p-around_medium" id="modal-content-id-1">
            <lightning-record-edit-form
            density="compact"
            object-api-name="Event__c"
            onsuccess={handleSocietySuccess}
           >
              <lightning-input-field field-name="Society__c" data-id="society" variant="standard">
              </lightning-input-field>
              <div class="slds-modal__footer">
                <button class="slds-button slds-button_neutral" aria-label="Cancel and close">Cancel</button>
                <button onclick={handleSave} class="slds-button slds-button_brand">Save</button>
              </div>
           </lightning-record-edit-form>
          </div>
        </div>
      </section>
      <div class="slds-backdrop slds-backdrop_open" role="presentation"></div> 
    </template>

//This child component, c-event-screen, is passed a property called storeEventId with the value of eventId. This allows data to be passed from the parent component to the child component.
    <template if:true={eventScreenParent}>
      <c-event-screen > storeEventId={eventId}</c-event-screen>
    </template>
</template>
```
