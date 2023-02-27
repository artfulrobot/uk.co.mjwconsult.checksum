{if $contactId}
  <div class="crm-block crm-form-block">
    <div class="help">
      <ul>
        <li>{ts}A contact checksum is used to generate special links to allow a contact to access details from their contact record without being logged in - they don't even need to have a user account!{/ts}</li>
        <li>{ts}Use the form below to generate links personal to this contact, and tokenised links for using in CiviMail{/ts}</li>
      </ul>
    </div>
    <div class="crm-section">
      <label for="ccs-linkType">{ts}Generate a link to...{/ts}</label>
      <select id="ccs-linkType"
        data-contact-id="{$contactId}"
        data-contact-checksum="{$checksum}"
      >
        <option value="" >{ts}--Select--{/ts}</option>
        <option value="contributionPage" >{ts}Contribution Page{/ts}</option>
        <option value="profilePage" >{ts}Profile Page{/ts}</option>
        <option value="eventRegistration" >{ts}Event Registration Page{/ts}</option>
        {if $userFramework eq 'Drupal'}
        <option value="webformUrl" >{ts}Webform{/ts}</option>
        {/if}
        <option value="advanced" >{ts}Advanced users{/ts}</option>
      </select>
    </div>

    <!-- UI to select a contributionPage -->
    <div id="ccs-selectContrib" style="display:none;">
      <label for="ccs-selectContribPage">{ts}Select Contribution Page{/ts}</label>
      <select id="ccs-selectContribPage" >
        <option value="">{ts}--Select--{/ts}</option>
      </select>
    </div>

    <!-- UI to select a Profile -->
    <div id="ccs-selectProfile" style="display:none;">
      <label for="ccs-profileID">{ts}Profile ID{/ts}</label>
      <input id="ccs-profileID" type=number step=1 />
      <p>{ts}You can get the profile ID number from Administer » Customise Data and Screens » Profiles page{/ts}</p>
      <!-- There's an API to fetch this (UFGroup) but I wasn't sure about
           which Profiles work as standalone forms. Seems to be UFJoin but
           I could not figure that in the time I have.
      -->
    </div>

    <!-- UI to select an event -->
    <div id="ccs-selectEventForm" style="display:none;">
      <label for="ccs-selectEventID">{ts}Select Event{/ts}</label>
      <select id="ccs-selectEventID" >
        <option value="">{ts}--Select--{/ts}</option>
      </select>

      <input type=checkbox id="ccs-selectEventTest" />
      <label for="ccs-selectEventTest">{ts}Test mode{/ts}</label>

    </div>

    <!-- UI to select a Webform -->
    <div id="ccs-selectWebform" style="display:none;">
      <label for="ccs-webformUrlInput">{ts}Webform URL{/ts}</label>
      <input id="ccs-webformUrlInput" type=text />
    </div>

    <!-- The main output view -->
    <div id="ccs-urls" style="display:none;">
      <p>{ts}You can use the following URL in CiviMail mailings to any contact; a unique link will be generated for each contact.{/ts}<p>
      <input readonly id="ccs-urlCiviMail" style="width:100%;" />
      <p>{ts}Personal link for this contact:{/ts}<p>
      <p><small><a href id="ccs-urlLink" class="ccs-longlink" ></a></small></p>
      <p>🙂 {ts}You can copy the link above to use in direct communication with the contact.{/ts}
      <p>😠 {ts}Remember that this link uniquely identifies this contact; if you send it to someone else, or worse, you make it publicly available (e.g. put it on social media or some other web page or you accidentally use it in a bulk CiviMail mailing) you will have sent this contact's personal information to other parties, which is illegal in many countries.{/ts}<p>
      <p>{ts}Each time you load this page the checksum will be different because part of it is calculated based on a number of different parameters including an expiry time{/ts}</p>
    </div>

    <!-- General info -->
    <div id="ccs-advanced" style="display:none;" >
      <p>{ts 1=$contactId} A checksum for contact ID %1{/ts}: <code>{$checksum}</code></p>
      <p>{ts 1=$checksumExpiryDays}The checksum expires after <strong>%1 days</strong>{/ts}</p>
      {capture assign=adminUrl}{crmURL p='civicrm/admin/setting/misc' q="reset=1" h=0 a=1 fe=1}{/capture}
      {ts}If you wish to change the expiry time you go to {/ts}<a href="{$adminUrl}">Administer » System Settings » Misc</a> {ts}and change the "Checksum Lifespan".{/ts}</p>

      <p>{ts}There are many places that support supplying checksums in the URL, but they each identify the contact with different parameters(!) so if your use case is not one of those supported by this helper, test test test!{/ts}</p>

      <p>{ts}Generally speaking the <code>{cs}</code> token gets replaced with `cs=xxxxx`, whereas most tokens do not include the <code>cs=</code> part. So to use in a URL parameter the format would be <code>https://example.org/your/url?x=1&{cs}&cid={contact.contact_id}</code>{/ts}: <code>{$checksum}</code></p>

      <p>😠 {ts}Remember that links with checksums uniquely identify this contact; if you send it to someone else, or worse, you make it publicly available (e.g. put it on social media or some other web page or you accidentally use it in a bulk CiviMail mailing) you will have sent this contact's personal information to other parties, which is illegal in many countries, and just plain rude the world over.{/ts}<p>

      <p>{ts}Each time you load this page the checksum will be different because part of it is calculated based on a number of different parameters including an expiry time{/ts}</p>
    </div>
  </div>
{else}
  <div class="alert-error">No contact ID specified!</div>
{/if}
{* FOOTER *}
<div class="crm-submit-buttons">
  {include file="CRM/common/formButtons.tpl" location="bottom"}
</div>
<script src="{$contactchecksumjs}"> </script>
<style>
{literal}
.ccs-longlink {
  white-space: pre;
  overflow: auto;
}
{/literal}
</style>
