# Set-ExecutionPolicy -Scope Process Unrestricted
################################################
# please review the pre-reqs:
# 1. this script accepts input csv file for list of workspaces to be scanned in batches of 100s. For example:
#     WorkspaceId
#     wsid-1
#     wsid-2
# 2. update the admin id below to be assigned
####################################################################################################
Connect-PowerBIServiceAccount

# check if we are logged in and if not login to Power BI
try {
        get-powerbiaccesstoken | Out-Null
    }
catch {
        Connect-PowerBIServiceAccount | Out-null
    }


# Define the input workspace list to run in batches of 100
$wsFilePath = ".\WorkspacesT1.csv"

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

foreach ($workspace in $workspaces){
        
        ">> Assigning admin: $($workspace)"
        try {
                $endpoint = "https://api.powerbi.com/v1.0/myorg/admin/groups/$($workspace)/users"
                $body = @{
                            emailAddress = "admin@test.com"
                            groupUserAccessRight = "Admin"
                    }
                $bodyJson = $body | ConvertTo-Json
                $result = Invoke-PowerBIRestMethod -Method Post -Url $endpoint -Body $bodyJson
        }
        catch
        {
         
                Write-Host "Error assigning admin: $_"
        }
}
