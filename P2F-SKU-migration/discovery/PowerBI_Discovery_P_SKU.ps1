# Install required modules if not already installed and verify permissions
# Install-Module -Name MicrosoftPowerBIMgmt

# Connect to Power BI service using admin credentials
Connect-PowerBIServiceAccount

# Define the output CSV file path and output object
$csvFilePath = ".\PowerBI-Discovery-Report-Active.csv"
$workspaceDetails = New-Object System.Collections.Generic.List[object]

# Get all active premium workspaces list
try {
    # $workspaces = Get-PowerBIWorkspace -All
    $workspaces = Get-PowerBIWorkspace -Scope Organization -All -Filter "isOnDedicatedCapacity eq true and tolower(state) eq 'active'"
} catch {
    Write-Host "Error getting workspaces: $_"
    return
}

# Get access token for Fabric items API
try {
    $connection = Get-PowerBIAccessToken
    $token = $connection.values
    # Write-Host "Access token: $token"
} catch {
    Write-Host "Error getting access token: $_"
}


# get workspace details
foreach ($workspace in $workspaces){
    try {
        
        # Get dashboard, reports, dataflows and datasets for the current workspace
        $dasboards = Get-PowerBIDashboard -WorkspaceId $workspace.ID
        $reports = Get-PowerBIReport -WorkspaceId $workspace.ID
        $datasets = Get-PowerBIDataset -WorkspaceId $workspace.ID
        $dataflows = Get-PowerBIDataflow -WorkspaceId $workspace.ID
        # $migrationStatus = Get-PowerBIWorkspaceMigrationStatus -Id $workspace.ID

        # Define a threshold for large semantic models (e.g., 1 GB)
        $large_model_threshold_bytes = 1 * 1024 * 1024 * 1024  # 1 GB

        # Initialize a counter for large semantic models
        $large_model_count = 0

        # Check each dataset for size
        foreach ($dataset in $datasets) {
            if ($dataset.SizeInBytes -ge $large_model_threshold_bytes) {
                $large_model_count++
            }
        }

        # Get the owners of the workspace
        $owners = $workspace.Users | Where-Object { $_.AccessRight -eq 'Admin' } | ForEach-Object { $_.UserPrincipalName }

        # Fabric items rest API call
        $fabricItemsCount = 0
        
        # List of Fabric items - check and update from: https://learn.microsoft.com/en-us/rest/api/fabric/admin/items/list-items?tabs=HTTP#itemtype
        $fabricItemsTypes = @('Lakehouse', 'Warehouse', 'KQLDatabase', 'Notebook', 'DataPipeline', 'Eventstream','KQLQueryset', 'KQLDataConnection', 'MLExperiment', 'MLModel', 'MirroredWarehouse', 'SQLEndpoint', 'SparkJobDefinition')

        try {
            $endpoint = "https://api.fabric.microsoft.com/v1/admin/items?workspaceId=$($workspace.ID)"
            $headers = @{"Authorization" = "$token"}
            $response = Invoke-RestMethod -Uri $endpoint -Headers $headers -Method Get
            # Write-Host "Response: $response"

            foreach ($item in $response){
                foreach ($entity in $item.itemEntities){
                    $itemType = $entity.type
                    if ($fabricItemsTypes -contains $itemType){
                        $fabricItemsCount++
                    }
                }
            }
        } catch {
            Write-Host "Error verifying Fabric Items for workspace $($workspace.ID): $_"
        }


        # create custom object
        $item = [PSCustomObject] @{
            WorkspaceId = $workspace.ID
            WorkspaceName = $workspace.Name
            Type = $workspace.Type
            State = $workspace.State
            IsReadOnly = $workspace.IsReadOnly
            IsOrphaned = $workspace.IsOrphaned
            IsOnDedicatedCapacity = $workspace.IsOnDedicatedCapacity
            CapacityId = $workspace.CapacityId
            Owners = $owners -join ","
            DashboardsCount = $dasboards.Count
            ReportsCount = $reports.Count
            DatasetsCount = $datasets.Count
            LargeModelCount = $large_model_count
            DataflowsCount = $dataflows.Count
            FabricItemsCount = $fabricItemsCount
            # MigrationStatus = $migrationStatus.Status
            }
          

         $workspaceDetails.Add($item)
        } catch {
            Write-Host "Error processing workspace $($workspace.ID): $_"
        }

}


# Export the data to CSV
try {
    $workspaceDetails | Export-Csv -Path $csvFilePath -NoTypeInformation
    Write-Host "Workspace details exported to $csvFilePath"
} catch {
    Write-Host "Error exporting to CSV: $_"
}
