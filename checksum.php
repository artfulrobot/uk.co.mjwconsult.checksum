<?php
/*
 +--------------------------------------------------------------------+
 | Copyright CiviCRM LLC. All rights reserved.                        |
 |                                                                    |
 | This work is published under the GNU AGPLv3 license with some      |
 | permitted exceptions and without any warranty. For full license    |
 | and copyright information, see https://civicrm.org/licensing       |
 +--------------------------------------------------------------------+
 */

require_once 'checksum.civix.php';
use CRM_Checksum_ExtensionUtil as E;

/**
 * Implements hook_civicrm_config().
 *
 * @link http://wiki.civicrm.org/confluence/display/CRMDOC/hook_civicrm_config
 */
function checksum_civicrm_config(&$config) {
  _checksum_civix_civicrm_config($config);
}

/**
 * Implements hook_civicrm_install().
 *
 * @link http://wiki.civicrm.org/confluence/display/CRMDOC/hook_civicrm_install
 */
function checksum_civicrm_install() {
  _checksum_civix_civicrm_install();
}

/**
 * Implements hook_civicrm_enable().
 *
 * @link http://wiki.civicrm.org/confluence/display/CRMDOC/hook_civicrm_enable
 */
function checksum_civicrm_enable() {
  _checksum_civix_civicrm_enable();
}

function checksum_civicrm_summaryActions(&$actions, $contactID) {
  $actions['checksum'] = array(
    'title' => 'Contact Checksum',
    'weight' => 999,
    'ref' => 'checksum',
    'key' => 'checksum',
    'class' => 'crm-popup',
    'href' => CRM_Utils_System::url('civicrm/contact/checksum/generate', "reset=1&cid={$contactID}"));
}

/**
 * hook_civicrm_pageRun
 *
 * @param \CRM_Core_Page $page
 */
function checksum_civicrm_pageRun(&$page) {
  $fname = 'checksum_civicrm_pageRun_'.$page->getVar('_name');
  if (function_exists($fname)) {
    $fname($page);
  }
}

/*
 * Display extra info on the recurring contribution view
 */
function checksum_civicrm_pageRun_CRM_Contribute_Page_ContributionRecur($page) {
  // get the recurring contribution record or quit
  $crid = CRM_Utils_Request::retrieve('id', 'Integer', $page, FALSE);
  try {
    $recur = civicrm_api3('ContributionRecur', 'getsingle', ['id' => $crid]);
  }
  catch (CiviCRM_API3_Exception $e) {
    return;
  }

  $paymentProcessor = \Civi\Payment\System::singleton()->getById($recur['payment_processor_id']);
  $template = CRM_Core_Smarty::singleton();
  $cancelSubscriptionUrl = $paymentProcessor->subscriptionURL($recur['id'], 'recur', 'cancel');
  $updateSubscriptionBillingUrl = $paymentProcessor->subscriptionURL($recur['id'], 'recur', 'billing');
  $updateSubscriptionUrl = $paymentProcessor->subscriptionURL($recur['id'], 'recur', 'update');

  $checksum = '&cs=' . CRM_Contact_BAO_Contact_Utils::generateChecksum($recur['contact_id']);
  if ($cancelSubscriptionUrl) {
    $template->assign('cancelSubscriptionUrl', $cancelSubscriptionUrl . $checksum);
  }
  if ($updateSubscriptionBillingUrl) {
    $template->assign('updateSubscriptionBillingUrl', $updateSubscriptionBillingUrl . $checksum);
  }
  if ($updateSubscriptionUrl) {
    $template->assign('updateSubscriptionUrl', $updateSubscriptionUrl . $checksum);
  }

  CRM_Core_Region::instance('page-body')->add([
    'template' => 'CRM/Checksum/Form/ContributionRecur.tpl',
  ]);
}

/**
 * Implements hook_civicrm_entityTypes().
 *
 * @link https://docs.civicrm.org/dev/en/latest/hooks/hook_civicrm_entityTypes
 */
function checksum_civicrm_entityTypes(&$entityTypes) {
  _checksum_civix_civicrm_entityTypes($entityTypes);
}
