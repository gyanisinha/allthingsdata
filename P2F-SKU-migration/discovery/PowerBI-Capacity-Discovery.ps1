

param (  
        #If capacity Id is not specific, it will pull out the worksapce for all capacities
        [Parameter(Mandatory=$false)]
        $capacityId
)
 

#Connect to PBI Service with Fabric admin permission
Connect-PowerBIServiceAccount




# Define the input workspace list, output CSV file path and output object - to run in tranches

$OutputRootFolder = "C:\temp"
#Create output directory if it doesn't exist
if (!(Test-Path $OutputRootFolder)){
    New-Item -ItemType directory -Path $OutputRootFolder
}

$PBI_Capacity_Report_FilePath = $OutputRootFolder + "\PBI_Capacity_Report_$(Get-Date -Format 'yyyy-MM-dd').csv"
$PBI_Capacity_Workspace_Report_FilePath = $OutputRootFolder + "\PBI_Capacity_Workspace_Report_$(Get-Date -Format 'yyyy-MM-dd').csv" 



#Export capacity infomation
function Export-Capacity-Info{
    param(
        [string]$filepath
    )
    $capacityAPI = "https://api.powerbi.com/v1.0/myorg/capacities"
    $result = New-Object System.Collections.Generic.List[object]
    #Fetching capacity list if the $capacity param is not set
    $response = Invoke-PowerBIRestMethod  -method Get  -URL ($capacityAPI) | convertfrom-json
    foreach ($capacity in $response.value) {
        $item = [PSCustomObject] @{
            capacityId = $capacity.id
            capacityName = $capacity.displayName
            admins = [string]$capacity.admins
            sku = $capacity.sku
            state = $capacity.state
            region = $capacity.region
            users = [string]$capacity.users
        }
        $result.Add($item)
    }
    try {
    if($result.Count -gt 0){
        $result | Export-Csv  -Path $filepath -Encoding UTF8 -NoTypeInformation
        Write-Host "data exported to $filepath" -ForegroundColor Green
        }
    } catch {
        Write-Host "Error exporting to CSV: $_"
    
    }
    return $result
}

#Get the workspace based on capacity Id
function Get-Workspace-Info{
    param (
    [string] $capacityId
    )

    $workspaceAPI = "https://api.powerbi.com/v1.0/myorg/admin/groups"
    $result = New-Object System.Collections.Generic.List[object]

    # Get top 2000 workspaces list
    try {
           $connection = Get-PowerBIAccessToken
           $token = $connection.values
     
    } catch {
           Write-Host "Error getting access token: $_"
    }

    try {
            $filterCond = "capacityId eq toupper('$($capacityId)')"
            $topCond = 2000
            $endpoint = $workspaceAPI+"?`$filter=$($filterCond)&`$top=$($topCond)" 
            $headers = @{"Authorization" = "$token"}

            $response = Invoke-RestMethod -Uri $endpoint -Headers $headers -Method Get
        
            return $response.value

    } catch {
                Write-Host "Error retrieving workspaces info for capacity $($capacityId)" -ForegroundColor Yellow
    }

}

#retrieve assets under the specific workspace
function Get-Workspace-Asset{
    param(
        [PSCustomObject]$workspace
    )
    try {
        Write-Host "Fetching details for workspace $($workspace.ID) $($workspace.Name)"
        # Get details of the current workspace
        $datasets = Get-PowerBIDataset -WorkspaceId $workspace.ID
        $datasetsJson = $datasets | ConvertTo-Json
        Start-Sleep -Seconds 3
        $dataflows = Get-PowerBIDataflow -WorkspaceId $workspace.ID
        Start-Sleep -Seconds 3
        $dasboards = Get-PowerBIDashboard -WorkspaceId $workspace.ID
        Start-Sleep -Seconds 3
        $reports = Get-PowerBIReport -WorkspaceId $workspace.ID
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


        # Fabric items rest API call
        $fabricItemsCount = 0

        # Get access token for Fabric items API
        try {
            $connection = Get-PowerBIAccessToken
            $token = $connection.values
        } catch {
            Write-Host "Error getting access token: $_"
        }
        
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
            IsOnDedicatedCapacity = $workspace.isOnDedicatedCapacity
            CapacityId = $workspace.capacityId
            DefaultDatasetStorageFormat= $workspace.defaultDatasetStorageFormat
            HasWorkspaceLevelSettings = $workspace.hasWorkspaceLevelSettings
            DashboardsCount = $dasboards.Count
            ReportsCount = $reports.Count
            DatasetsCount = $datasets.Count
            LargeModelCount = $large_model_count
            LargeStorageFormatCount = $large_storage_format_count
            LargeStorageFormatModel = $large_storage_format_models
            DataflowsCount = $dataflows.Count
            FabricItemsCount = $fabricItemsCount
            
        }
        Start-Sleep -Seconds 1  

        return $item

    } catch {
        Write-Host "Error processing workspace $($workspace.ID): $_"
    }
    
}


# Export the capacity info  to CSV
$workspaceAssetList = New-Object System.Collections.Generic.List[object]
$capacityDetails= Export-Capacity-Info -filepath $PBI_Capacity_Report_FilePath
 

#If $capacityId param is set, fetching the workspace running on this capacity only
if ($capacityId -ne $null) {
    $workspaceDetails= Get-Workspace-Info -capacityId $capacityId
    foreach ($workspace in $workspaceDetails){
        $asset= Get-Workspace-Asset -workspace $workspace
        $workspaceAssetList.Add($asset)
    }
}
#If $capacityId param is NOT set, fetching the workspaces for all capacities
else{

    foreach ($capacity in $capacityDetails){
        $workspaceDetails= Get-Workspace-Info -capacityId $capacity.capacityId
        foreach ($workspace in $workspaceDetails){
            $asset= Get-Workspace-Asset -workspace $workspace
            $workspaceAssetList.Add($asset)
        }
    }
}

# Export workspace assets data to CSV
try {
    $workspaceAssetList | Export-Csv -Path $PBI_Capacity_Workspace_Report_FilePath -Encoding UTF8 -NoTypeInformation
    Write-Host "Workspace details exported to $PBI_Capacity_Workspace_Report_FilePath"
} catch {
    Write-Host "Error exporting to CSV: $_"
}
