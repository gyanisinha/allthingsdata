# Install required modules if not already installed and verify permissions
# Install-Module -Name MicrosoftPowerBIMgmt

# Connect to Power BI service using admin credentials or Service Principal (use KeyVault in Prod): example https://github.com/SQLSwimmer/powerbi-admin-scripts/blob/main/GetGatewayDatasources.ps1
# $password = ConvertTo-SecureString $SecretValue -AsPlainText -Force
# $Cred = New-Object System.Management.Automation.PSCredential ($AppId, $password)
# Connect-PowerBIServiceAccount -Tenant $TenantId -ServicePrincipal -Credential $Cred

Connect-PowerBIServiceAccount

# Define the input workspace list, output CSV file path and output object - to run in tranches
$csvFilePath = "C:\temp\PowerBI-Discovery-Report-Active-XXXX-Output.csv"
$workspaceDetails = New-Object System.Collections.Generic.List[object]

# Get all active premium workspaces list
try {
       $connection = Get-PowerBIAccessToken
       $token = $connection.values
       # Write-Host "Access token: $token"
} catch {
       Write-Host "Error getting access token: $_"
}

try {
        $filterCond = "capacityId eq toupper('xxxxc637-0b33-4d8e-8425-826b1d882ab7')"
        $topCond = 1000
        $endpoint = "https://api.powerbi.com/v1.0/myorg/admin/groups?%24filter=$($filterCond)&%24top=$($topCond)" -f $filterCond, $topCond
        $headers = @{"Authorization" = "$token"}
        $response = Invoke-RestMethod -Uri $endpoint -Headers $headers -Method Get
        Write-Host "Response: $response"
        
        $workspaces = $response.value
        
        Write-Host "Workspaces count: $($workspaces.count)"

} catch {
            Write-Host "Error verifying Items for workspace $($workspace.ID): $_"
}

# get workspace details
foreach ($workspace in $workspaces){
    try {
        Write-Host "Fetching details for workspace $($workspace.ID) $($workspace.Name)"
        # Get details of the current workspace
        $datasets = Get-PowerBIDataset -Scope Organization -WorkspaceId $workspace.ID
        $datasetsJson = $datasets | ConvertTo-Json
        Start-Sleep -Seconds 3
        $dataflows = Get-PowerBIDataflow -Scope Organization -WorkspaceId $workspace.ID
        Start-Sleep -Seconds 3
        $dasboards = Get-PowerBIDashboard -Scope Organization -WorkspaceId $workspace.ID
        Start-Sleep -Seconds 3
        $reports = Get-PowerBIReport -Scope Organization -WorkspaceId $workspace.ID
        Start-Sleep -Seconds 3


        # Define a threshold for large semantic models (e.g., 1 GB)
        $large_model_threshold_bytes = 1 * 1024 * 1024 * 1024  # 1 GB

        # Initialize a counter for large semantic models
        $large_model_count = 0

        # Initialize a counter for large storage format semantic models
        $large_storage_format_count = 0 

        # The list of large storage format enabled semantic model names
        $large_storage_format_models=""

        # Check each dataset for size
        foreach ($dataset in $datasets) {
            if ($dataset.SizeInBytes -ge $large_model_threshold_bytes) {
                $large_model_count++
            }
            if($dataset.TargetStorageMode -eq "PremiumFiles") {
                $large_storage_format_count ++

                # Record the semantic model name with large storage format enabled
                if ($large_storage_format_models -ne "") {
                    $large_storage_format_models += "|"
                }
                $large_storage_format_models += $dataset.Name  
            }
        }

        # Get the owners of the workspace
        # $owners = $workspace.Users | Where-Object { $_.AccessRight -eq 'Admin' } | ForEach-Object { $_.UserPrincipalName }

        # Fabric items rest API call
        $fabricItemsCount = 0

        # Get access token for Fabric items API
        try {
            $connection = Get-PowerBIAccessToken
            $token = $connection.values
            # Write-Host "Access token: $token"
        } catch {
            Write-Host "Error getting access token: $_"
        }
        
        # List of Fabric items - check and update from: https://learn.microsoft.com/en-us/rest/api/fabric/admin/items/list-items?tabs=HTTP#itemtype
        # $fabricItemsTypes = @('Lakehouse', 'Warehouse', 'KQLDatabase', 'Notebook', 'DataPipeline', 'Eventstream','KQLQueryset', 'KQLDataConnection', 'MLExperiment', 'MLModel', 'MirroredWarehouse', 'SQLEndpoint', 'SparkJobDefinition')
        $fabricItemsTypes = @('Lakehouse', 'Warehouse', 'KQLDatabase', 'Notebook', 'DataPipeline', 'Eventstream','KQLQueryset', 'KQLDataConnection', 'MLExperiment', 'MLModel', 'MirroredWarehouse', 'SQLEndpoint', 'SparkJobDefinition', 'Environment', 'Eventhouse', 'GraphQLApi', 'KQLDashboard', 'MirroredDatabase', 'Reflex')
        try {
            $endpoint = "https://api.fabric.microsoft.com/v1/admin/items?workspaceId=$($workspace.ID)"
            $headers = @{"Authorization" = "$token"}
            $response = Invoke-RestMethod -Uri $endpoint -Headers $headers -Method Get
            # Write-Host "Response: $response"

            foreach ($item in $response){
                foreach ($entity in $item.itemEntities){
                    $itemType = $entity.type
                    # Write-Host "Item $itemType"
                    if ($fabricItemsTypes -contains $itemType){
                        $fabricItemsCount++
                        Start-Sleep -Seconds 3
                    }
                }
            }
        } catch {
            Write-Host "Error verifying Items for workspace $($workspace.ID): $_"
        }


        # create custom object
        $item = [PSCustomObject] @{
            WorkspaceId = $workspace.id
            WorkspaceName = $workspace.name
            Type = $workspace.type
            State = $workspace.state
            IsReadOnly = $workspace.isReadOnly
            # IsOrphaned = $workspace.IsOrphaned
            IsOnDedicatedCapacity = $workspace.isOnDedicatedCapacity
            CapacityId = $workspace.capacityId
            DefaultDatasetStorageFormat= $workspace.defaultDatasetStorageFormat
            HasWorkspaceLevelSettings = $workspace.hasWorkspaceLevelSettings
            # Owners = $owners -join ","
            DashboardsCount = $dasboards.Count
            ReportsCount = $reports.Count
            DatasetsCount = $datasets.Count
            # DatasetsDetails = $datasetsJson
            LargeModelCount = $large_model_count
            LargeStorageFormatCount = $large_storage_format_count
            LargeStorageFormatModel = $large_storage_format_models
            DataflowsCount = $dataflows.Count
            FabricItemsCount = $fabricItemsCount
            
            }
          

         $workspaceDetails.Add($item)
         Start-Sleep -Seconds 1
        } catch {
            Write-Host "Error processing workspace $($workspace.ID): $_"
        }

}


# Export the data to CSV
try {
    $workspaceDetails | Export-Csv -Path $csvFilePath -Encoding UTF8 -NoTypeInformation
    Write-Host "Workspace details exported to $csvFilePath"
} catch {
    Write-Host "Error exporting to CSV: $_"
}
