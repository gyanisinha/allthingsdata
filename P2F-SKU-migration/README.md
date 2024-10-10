# Power BI P SKU Estate - Automated Discovery

## Introduction

If you’re in the process of migrating your Power BI P SKU to Fabric SKU, or even just thinking about it, you know how crucial it is to have a detailed understanding of your current environment. 

The seamless migration from **Power BI P SKU** to **Fabric F SKU** requires meticulous planning and comprehensive discovery. This post will introduce a PowerShell script that automates the discovery of the current Power BI P SKU estate, providing valuable insights for the migration process. This script aims to automate the discovery of your Power BI SKU estate and could be a great starting point for your discovery and assessment journey. You can, of course, tweak it to gather even more insights based on your specific needs!

## Pre-requisites

Before we dive into the script, ensure that you have the following pre-requisites:

**NOTE**: Follow [security best practices](https://learn.microsoft.com/en-us/fabric/security/) and edit/modify the scripts as per your organization needs and standards. These are sample scripts, only for reference.

1. PowerShell 5.1 or higher
2. MicrosoftPowerBIMgmt module installed. If not, you can install it using the command `Install-Module -Name MicrosoftPowerBIMgmt`
3. Admin / Service Principal credentials for Power BI service with appropriate permissions at workspace level.

## Powershell Script

Below are few options for automated discovery. It is recommended to test the scripts in lower environment before using in Prod, for expected results.

- Install required modules if not already installed and verify permissions

- Review API permissions from product documentation

- Verify scope, for example:
  - Service Principal: Tenant.ReadWrite.All, Capacity.Read.All, Workspace.Read.All, Items.Read.All
  - Admin user: Fabric Admin, Capacity Admin, Workspace Admin



| Usage | Script | Input | Output | Pre-requisites &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;        |
|-----|-----|-----|-----|--------------------------------------|
| **Detailed Metadata Scan** <br><br> This is useful to capture detailed metadata with lineage, datasets, and other details for assessment as well as troubleshooting if need be (post migration) | [DetailedMetadataScan.ps1](../P2F-SKU-migration/discovery/DetailedMetadataScan.ps1) | Workspaces list in a csv file - batches of 100 <br> Example: [WorkspacesT1.csv](https://github.com/user-attachments/files/16145860/WorkspacesT1.csv) | Json file | [Set up metadata scanning in an organization](https://learn.microsoft.com/en-us/fabric/admin/metadata-scanning-setup)  <br><br> **Permissions**: The user must have administrator rights (such as Microsoft 365 Global Administrator or Power BI Service Administrator) or authenticate using a service principal. When running under service principal authentication, an app must not have any admin-consent required permissions for Power BI set on it in the Azure portal.|
|**Discovery using Groups REST API** <br><br> If there are large number of worspaces, this can run in batches of 1000 workspaces | [DiscoveryScriptusingGroupsAPI.ps1](../P2F-SKU-migration/discovery/DiscoveryScriptusingGroupsAPI.ps1) |`$filterCond = "capacityId eq toupper('xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxx')"` <br> `$topCond = 1000` <br> `$endpoint = "https://api.powerbi.com/v1.0/myorg/admin/groups?%24filter=$($filterCond)&%24top=$($topCond)" -f $filterCond, $topCond `| CSV file with below details: <br> WorkspaceId, WorkspaceName,	Type,	State,	IsReadOnly,	IsOnDedicatedCapacity,	CapacityId,	DefaultDatasetStorageFormat,	HasWorkspaceLevelSettings,	DashboardsCount,	ReportsCount,	DatasetsCount,	LargeModelCount,	DataflowsCount,	FabricItemsCount | [Admin - Groups GetGroupsAsAdmin REST API](https://learn.microsoft.com/en-us/rest/api/power-bi/admin/groups-get-groups-as-admin) <br> Permissions: The user must have administrator rights (such as Office 365 Global Administrator or Power BI Service Administrator) or authenticate using a service principal. Delegated permissions are supported. When running under service principal authentication, an app must not have any admin-consent required permissions for Power BI set on it in the Azure portal.|
|**Discovery using Get-PowerBIWorkspace Powershell cmdlet in batches** <br><br> This could be used for small scale use cases, has the ability to run in batches of 50 worksapces |[DiscoveryScriptWSTranches.ps1](../P2F-SKU-migration/discovery/DiscoveryScriptWSTranches.ps1)| Workspaces list in a csv file - batches of 50 |CSV file with below details: <br> WorkspaceId, WorkspaceName,	Type,	State,	IsReadOnly,	IsOnDedicatedCapacity,	CapacityId,	DefaultDatasetStorageFormat,	HasWorkspaceLevelSettings,	DashboardsCount,	ReportsCount,	DatasetsCount,	LargeModelCount,	DataflowsCount,	FabricItemsCount | Install required modules if not already installed and verify permissions |



## Considerations

Install required modules if not already installed and verify permissions 

These script begins by connecting to the Power BI service using admin credentials or service principal. Refer to above table and scripts for details.

The scripts retrieve below details for the workspaces:
- WorkspaceId,
- WorkspaceName,
- Type,
- State,
- IsReadOnly,
- IsOrphaned,
- IsOnDedicatedCapacity,
- CapacityId,
- Owners,
- DashboardsCount,
- ReportsCount,
- DatasetsCount,
- DataflowsCount,
- FabricItemsCount,
- Additional metadata in case of Detailed Metadata Scan

For example: The script exports the workspace details to a CSV file. This automated process significantly reduces the time and effort required for manual discovery, providing a comprehensive overview of the current Power BI P SKU estate.
![image](https://github.com/gyanisinha/allthingsdata/assets/87772005/5d77cba1-0451-43dc-8cc1-a1b5cb4d054d)

## Sample Discovery Report

[PowerBI-Discovery-Report.csv](https://github.com/gyanisinha/allthingsdata/files/15319815/PowerBI-Discovery-Report.csv)

## Summary

Performing a comprehensive discovery of the current Power BI P SKU estate is a crucial step in planning for the migration to Fabric F SKU. This PowerShell script provides an automated solution for this task, offering valuable insights that can guide the migration process. By leveraging this script, organizations can ensure a smooth and efficient transition, ultimately enhancing their data management and visualization capabilities.

## Migration

For migration there are few options:
1. [Recommended] Bulk migration from Admin Portal (Workspaces>Reassign): https://learn.microsoft.com/en-us/fabric/admin/portal-workspaces#moving-data-around 
2. Bulk migration using PowerShell script for a given/specific list of workspaces:
    - [Migration Script - for specific list of workspaces](../P2F-SKU-migration/migration/MigrationWorkspacesTranches.ps1)
    - Input: Workspaces Id list in a CSV file and targetCapacity ID

3. Sometimes, you may need to bulk assign admin to the worksapces to be migrated. You may use below script:
   - [BulkAssignAdmin](../P2F-SKU-migration/migration/BulkAssignAdmin.ps1)
   - Input: Workspaces Id list in a CSV file and admin emailAddress = "powerbiadmin@test.com"
## Disclaimer

**Sample Code Disclaimer**: This Sample Code is provided for the purpose of illustration only and is not intended to be used in a production environment. THIS SAMPLE CODE AND ANY RELATED INFORMATION ARE PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A PARTICULAR PURPOSE.
