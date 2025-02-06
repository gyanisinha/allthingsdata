# Migrating list of workspaces from P capacity to F capacity in same region
###################################################################################################
# please review the pre-reqs
# 1. this script accepts input csv file for list of workspaces to be migrated in batches. For example:
#     WorkspaceId
#     wsid-1
#     wsid-2
# 2. target capacity id: $targetCapacityId <change capacity id in the script below>
####################################################################################################

# Connect to Power BI service using admin credentials or Service Principal (use KeyVault in Prod): example https://github.com/SQLSwimmer/powerbi-admin-scripts/blob/main/GetGatewayDatasources.ps1
# Set-ExecutionPolicy -Scope Process Unrestricted
Connect-PowerBIServiceAccount

# check if we are logged in and if not login to Power BI
try {
        get-powerbiaccesstoken | Out-Null
    }
catch {
        Connect-PowerBIServiceAccount | Out-null
    }


# Define the input workspace list to run in batches of 100
$wsFilePath = ".\P2F\WorkspacesT1.csv"

# Read workspaces list to run in tranches
$workspaceIds = Import-Csv -Path $wsFilePath
# Write-Host "Workspaces file count: $($workspaceIds.count)"
$workspaces = @()

try {
    foreach ($row in $workspaceIds){
        $workspaceId = $row.WorkspaceId
        $workspaces += $workspaceId
    }
    Write-Host "Workspaces count: $($workspaces.count)"
    Write-Host "Workspaces: $($workspaces)"
} catch {
    Write-Host "Error getting workspaces: $_"
}


# Migration - provide target capacity ID (should be in same region and same tenant)
$targetCapacityId = "AAAAAAA-FBB9-4792-BBFF-6000000000E" # example
$errorCnt = 0

foreach ($workspace in $workspaces){
        
        ">> Moving Workspace: $($workspace)"
        try {
                $endpoint = "https://api.powerbi.com/v1.0/myorg/groups/$($workspace)/AssignToCapacity"
                $result = Invoke-PowerBIRestMethod -Method Post -Url $endpoint -Body "{`"capacityId`": `"$targetCapacityId`"}" -ErrorAction stop
        }
        catch
        {
                $errorCnt = $errorCnt + 1
                throw $_.Exception.InnerException
        }
}

# Error check
if ($errorCnt -eq 0) {
        Write-Host -ForegroundColor Green "Capacity Assignment Complete"
    } else
    {
        Write-Host "$errorCnt error(s) occurred while trying to move $($workspaces.count) workspace(s)" -ForegroundColor Red
    }
    
