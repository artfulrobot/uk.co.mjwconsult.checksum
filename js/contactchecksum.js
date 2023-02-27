(() => {
  const els = {}; // = document.getElementById('ccs-linktype')
  ['linkType', 'selectContrib', 'selectProfile', 'selectEventForm',
    'selectContribPage', 'urls', 'urlCiviMail', 'urlLink', 'selectEventID',
    'profileID', 'selectEventTest', 'advanced', 'selectWebform', 'webformUrlInput'
  ].forEach(i => {
    els[i] = document.getElementById(`ccs-${i}`);
  })

  let contactID = els.linkType.dataset.contactId;
  let checksum = els.linkType.dataset.contactChecksum;
  els.linkType.addEventListener('change', async() => {
    ['selectContrib', 'selectProfile', 'selectEventForm', 'advanced', 'urls', 'selectWebform'].forEach(i => els[i].style.display = 'none');
    if (!els.linkType.value) {
      return;
    }

    if (els.linkType.value === 'contributionPage') {
      els.selectContribPage.value = '';

      let opts = await CRM.api4('ContributionPage', 'get', {
        select: ["title"],
        where: [["is_active", "=", true]],
        orderBy: {title: 'ASC'}
      });
      opts.forEach(row => {
        const li = document.createElement('option');
        li.setAttribute('value', row.id);
        li.textContent = row.title;
        els.selectContribPage.append(li);
      });

      // Show select page
      els.selectContrib.style.display = '';

    }
    else if (els.linkType.value === 'profilePage') {
      els.selectProfile.style.display = '';
    }
    else if (els.linkType.value === 'eventRegistration') {
      els.selectContribPage.value = '';

      // /event/register?reset=1&id=88
      // x/event/register?reset=1&action=preview&id=88&cid=8685&cs=2b77aacfaa03c941391137782a897653_1677503168_168
      // x/event/register?reset=1&action=preview&id=88
      let opts = await CRM.api4('Event', 'get', {
        select: ["title"],
        where: [
          ["registration_start_date", "<=", "today"],
          ["is_online_registration", "=", true],
          ["is_active", "=", true],
          ["start_date", ">", "today"]
        ],
        orderBy: {start_date: 'ASC', title: 'ASC'}
      });
      opts.forEach(row => {
        const li = document.createElement('option');
        li.setAttribute('value', row.id);
        li.textContent = row.title;
        els.selectEventID.append(li);
      });

      // Show select page
      els.selectEventForm.style.display = '';

    }
    else if (els.linkType.value === 'webformUrl') {
      els.selectWebform.style.display = '';
    }
    else if (els.linkType.value === 'advanced') {
      // Is this right? @fixme
      els.advanced.style.display = '';
    }
  });

  els.selectContribPage.addEventListener('change', async() => {
    els.urls.style.display = 'none';
    if (!els.selectContribPage.value) return;
    els.urls.style.display = '';
    let urlBase = getBaseURl('civicrm/contribute/transact');
    els.urlCiviMail.value = `${urlBase}cid={contact.contact_id}&{contact.checksum}&id=${els.selectContribPage.value}`;
    setLinkUrl(`${urlBase}cid=${contactID}&cs=${checksum}&id=${els.selectContribPage.value}`);
  });

  els.profileID.addEventListener('input', () => {
    let v = els.profileID.value || '';
    if (!v) {
      els.urls.style.display = 'none';
    }
    else {
      let urlBase = getBaseURl('civicrm/profile/edit');
      els.urlCiviMail.value = `${urlBase}id={contact.contact_id}&{contact.checksum}&gid=${v}`;
      setLinkUrl(`${urlBase}id=${contactID}&cs=${checksum}&gid=${v}`);
      els.urls.style.display = '';
    }
  });

  function doEventUrl() {
    let v = els.selectEventID.value || '';
    if (!v) {
      els.urls.style.display = 'none';
    }
    else {
      let urlBase = getBaseURl('civicrm/event/register', {reset:1});
      let test = els.selectEventTest.checked ? '&action=preview' : '';

      els.urlCiviMail.value = `${urlBase}cid={contact.contact_id}${test}&{contact.checksum}&id=${v}`;
      setLinkUrl(`${urlBase}cid=${contactID}${test}&cs=${checksum}&id=${v}`);
      els.urls.style.display = '';
    }
  }
  els.selectEventID.addEventListener('change', doEventUrl);
  els.selectEventTest.addEventListener('change', doEventUrl);

  els.selectWebform.addEventListener('input', () => {
    let v = els.webformUrlInput.value;
    if (!v || els.webformUrlInput.validationMessage) {
      els.urls.style.display = 'none';
    }
    else {
      let urlBase = v;
      if (!urlBase.match(/^https?:\/\//)) {
        urlBase = window.location.origin + (v.match(/^\//) ? '' : '/') + v;
      }
      urlBase += (urlBase.indexOf('?') > -1) ? '&' : '?';
      els.urlCiviMail.value = `${urlBase}cid1={contact.contact_id}&{contact.checksum}`;
      setLinkUrl(`${urlBase}cid1=${contactID}&cs`);
      els.urls.style.display = '';
    }
  })

  els.urlCiviMail.addEventListener('click', () => {
    els.urlCiviMail.select();
    els.urlCiviMail.setSelectionRange(0, els.urlCiviMail.value.length); /* For mobile devices */
    setClipboard(els.urlCiviMail.value);
  });

  function getBaseURl(path, query) {
    let urlBase = CRM.url(path, query || {}, 'front');
    if (!urlBase.match(/^https?:\/\//)) {
      console.log(urlBase, "does not sart http");
      urlBase = window.location.origin + urlBase;
    }
    urlBase += (urlBase.indexOf('?') > -1) ? '&' : '?';
    return urlBase;
  }

  function setLinkUrl(actualUrl) {
    els.urlLink.setAttribute('href', actualUrl);
    els.urlLink.innerText = actualUrl;
    els.urls.style.display = '';
  }

  function setClipboard(text) {
  const type = "text/plain";
  const blob = new Blob([text], { type });
  let data;
  if (!('ClipboardItem' in window) && 'writeText' in navigator.clipboard) {
    // Grrr. Firefox of all things doesn't yet support new clipboard API.
    navigator.clipboard.writeText(text).then(
        () => { CRM.status(CRM.ts()('Copied!'));}
      );
  }
  else {
    data = [new ClipboardItem({ [type]: blob })];
    navigator.clipboard.write(data).then(
      () => { CRM.status(CRM.ts()('Copied!')); }
    );
  }

}

})();


