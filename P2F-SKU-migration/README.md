# Power BI P SKU Estate - Automated Discovery

## Introduction

If you’re in the process of migrating your Power BI P SKU to Fabric SKU, or even just thinking about it, you know how crucial it is to have a detailed understanding of your current environment. 

The seamless migration from **Power BI P SKU** to **Fabric F SKU** requires meticulous planning and comprehensive discovery. This post will introduce a PowerShell script that automates the discovery of the current Power BI P SKU estate, providing valuable insights for the migration process. This script aims to automate the discovery of your Power BI SKU estate and could be a great starting point for your discovery and assessment journey. You can, of course, tweak it to gather even more insights based on your specific needs!

## Pre-requisites

Before we dive into the script, ensure that you have the following pre-requisites:

1. PowerShell 5.1 or higher
2. MicrosoftPowerBIMgmt module installed. If not, you can install it using the command `Install-Module -Name MicrosoftPowerBIMgmt`
3. Admin / Service Principal credentials for Power BI service with appropriate permissions at workspace level.

## Powershell Script

- [PowerBI_Discovery_P_SKU.ps1](https://github.com/gyanisinha/allthingsdata/blob/68d594f6edd8f3aef99e555c97b8785f9bbd4fba/P2F-SKU-migration/discovery/PowerBI_Discovery_P_SKU.ps1)

If there are large number of workspaces, and you would prefer to run in tranches, you may use below script:

- [DiscoveryScriptWSTranches.ps1](https://github.com/gyanisinha/allthingsdata/blob/e515d1f3b7e7d166ba4aefbe0a1ef886a92a969b/P2F-SKU-migration/discovery/DiscoveryScriptWSTranches.ps1)

If there are large number of worspaces, alternatively you may use Groups API:
- [DiscoveryScriptUsingGroupsAPI](https://github.com/gyanisinha/allthingsdata/blob/dd83877378830c571b154c5aa9248cad57cfc3a8/P2F-SKU-migration/discovery/DiscoveryScriptusingGroupsAPI.ps1)

For detailed metadata scan, which could be useful for validaitons and troubleshooting post migration, you may use below script:

- [DetailedMetadataScan.ps1](https://github.com/gyanisinha/allthingsdata/blob/dd83877378830c571b154c5aa9248cad57cfc3a8/P2F-SKU-migration/discovery/DetailedMetadataScan.ps1)

```
  Response: @{id=4e5ec426-73c4-424f-ba23-5f4589a6e5eb; createdDateTime=2024-07-08T08:27:17.9711516Z; status=NotStarted}
  
  Response: @{id=4e5ec426-73c4-424f-ba23-5f4589a6e5eb; createdDateTime=2024-07-08T08:27:17.97; status=Succeeded}

  Metadata scan completed and result saved.
```

## Considerations

The script begins by connecting to the Power BI service using admin credentials. It then defines the output CSV file path and creates an output object to store the workspace details.

The script retrieves all workspaces and for each workspace, it fetches details such as dashboards, reports, dataflows, datasets, and owners, etc. It also makes a REST API call to verify Fabric items for each workspace. The details are as follows:
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
- FabricItemsCount

Finally, the script exports the workspace details to a CSV file. This automated process significantly reduces the time and effort required for manual discovery, providing a comprehensive overview of the current Power BI P SKU estate.
![image](https://github.com/gyanisinha/allthingsdata/assets/87772005/5d77cba1-0451-43dc-8cc1-a1b5cb4d054d)

## Sample Discovery Report

[PowerBI-Discovery-Report.csv](https://github.com/gyanisinha/allthingsdata/files/15319815/PowerBI-Discovery-Report.csv)

## Conclusion

Performing a comprehensive discovery of the current Power BI P SKU estate is a crucial step in planning for the migration to Fabric F SKU. This PowerShell script provides an automated solution for this task, offering valuable insights that can guide the migration process. By leveraging this script, organizations can ensure a smooth and efficient transition, ultimately enhancing their data management and visualization capabilities.


## Disclaimer

**Sample Code Disclaimer**: This Sample Code is provided for the purpose of illustration only and is not intended to be used in a production environment. THIS SAMPLE CODE AND ANY RELATED INFORMATION ARE PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A PARTICULAR PURPOSE.
