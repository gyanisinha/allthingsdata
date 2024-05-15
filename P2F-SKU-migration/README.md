# Power BI P SKU Estate - Automated Discovery

## Introduction

The seamless migration from *Power BI P SKU* to *Fabric F SKU* requires meticulous planning and comprehensive discovery. This post will introduce a PowerShell script that automates the discovery of the current Power BI P SKU estate, providing valuable insights for the migration process.

## Pre-requisites

Before we dive into the script, ensure that you have the following pre-requisites:

1. PowerShell 5.1 or higher
2. MicrosoftPowerBIMgmt module installed. If not, you can install it using the command `Install-Module -Name MicrosoftPowerBIMgmt`
3. Admin credentials for Power BI service

## Powershell Script

[PowerBI_Discovery_P_SKU.ps1](https://github.com/gyanisinha/allthingsdata/blob/68d594f6edd8f3aef99e555c97b8785f9bbd4fba/P2F-SKU-migration/discovery/PowerBI_Discovery_P_SKU.ps1)

## Considerations

The script begins by connecting to the Power BI service using admin credentials. It then defines the output CSV file path and creates an output object to store the workspace details.

The script retrieves all workspaces and for each workspace, it fetches details such as dashboards, reports, dataflows, datasets, and owners, etc. It also makes a REST API call to verify Fabric items for each workspace.

Finally, the script exports the workspace details to a CSV file. This automated process significantly reduces the time and effort required for manual discovery, providing a comprehensive overview of the current Power BI P SKU estate.

## Conclusion

Performing a comprehensive discovery of the current Power BI P SKU estate is a crucial step in planning for the migration to Fabric F SKU. This PowerShell script provides an automated solution for this task, offering valuable insights that can guide the migration process. By leveraging this script, organizations can ensure a smooth and efficient transition, ultimately enhancing their data management and visualization capabilities.
