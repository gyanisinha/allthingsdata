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
    # $workspaces = Get-PowerBIWorkspace -Scope Organization -All -Filter "capacityId eq toupper('a00000-0000-0000-0000-xxxxxxxxxx')"
    $workspaces = Get-PowerBIWorkspace -Scope Organization -All -Filter "isOnDedicatedCapacity eq true and tolower(state) eq 'active'"
    Write-Host "Workspaces count: $($workspaces.count)"
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
        Write-Host "Fetching details for workspace $($workspace.ID) $($workspace.Name)"
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
        $AdminObjects = $workspace.Users | Where-Object { $_.AccessRight -eq 'Admin' } 
        Foreach ($WsUser in $AdminObjects)
        {
            $DisplayName = ''
            If($WsUser.PrincipalType -eq 'User')
            {
                $DisplayName       = $WsUser.UserPrincipalName
            }
            ElseIf ($WsUser.PrincipalType -eq 'Group')
            {
                Try{
                    $AdGroup    = Get-MgGroup -GroupId $Wsuser.Identifier -ErrorAction SilentlyContinue
                    $DisplayName       = "Group: $($AdGroup.DisplayName)"
                }
                Catch{
                    $DisplayName       = "GroupId: $($Wsuser.Identifier)"
                }
            }   
            ElseIf ($WsUser.PrincipalType -eq 'App')
            {
                $AppName        = "AppId: $($Wsuser.Identifier)"
                $DisplayName    = $AppName
            }
            Else
            {
                $DisplayName = "PrincipalType: $($WsUser.PrincipalType) ID: $($Wsuser.Identifier)" 
            }
            $Owners += $DisplayName
        }

        # Fabric items rest API call
        $fabricItemsCount = 0
        
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
