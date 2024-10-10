# Set-ExecutionPolicy -Scope Process Unrestricted
################################################
# please review the pre-reqs: https://learn.microsoft.com/en-us/fabric/admin/metadata-scanning-setup
# this script accepts input csv file for list of workspaces to be scanned in batches of 100s. For example:
#     WorkspaceId
#     wsid-1
#     wsid-2
####################################################################################################

# Connect to Power BI service using admin credentials or Service Principal (use KeyVault in Prod): example https://github.com/SQLSwimmer/powerbi-admin-scripts/blob/main/GetGatewayDatasources.ps1
Connect-PowerBIServiceAccount
#$TenantId = ''
#$AppId = ''
#$SecretValue = ''
#$Cred = New-Object System.Management.Automation.PSCredential ($AppId, $password)
#Connect-PowerBIServiceAccount -Tenant $TenantId -ServicePrincipal -Credential $Cred

# Define the input workspace list to run in batches of 100
$wsFilePath = ".\WorkspacesT1.csv"
$outFilePath = ".\PowerBI-Discovery-Metadata-Scan.json"
$workspaceDetails = New-Object System.Collections.Generic.List[object]

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


# Get access token for Fabric items API
try {
    $connection = Get-PowerBIAccessToken
    $token = $connection.values
    Write-Host "Access token: $token"
} catch {
    Write-Host "Error getting access token: $_"
}

# Run metadata scan - ensure relevant tenant settings are enabled
try {
        $getInfo_endpoint = "https://api.powerbi.com/v1.0/myorg/admin/workspaces/getInfo?lineage=True&datasourceDetails=True&datasetSchema=True&datasetExpressions=True"
        # $getInfo_endpoint = "https://api.powerbi.com/v1.0/myorg/admin/workspaces/getInfo"
        $headers = @{
            "Authorization" = "$token" 
            "Content-Type" = "application/json"
            }
        
        # Create a custom object with the desired format
        $bodyObject = [PSCustomObject]@{
            workspaces = $workspaces
        }
        # Convert the custom object to JSON
        $body = $bodyObject | ConvertTo-Json
 
        Write-Host "Invoke-RestMethod -Uri $($getInfo_endpoint) -Headers $($headers) -Method POST -Body $($body)"
        $getInfo_response = Invoke-RestMethod -Method POST -Uri $getInfo_endpoint -Headers $headers  -Body $body
        Write-Host "Response: $($getInfo_response)"

        $scanId = $($getInfo_response.id)
        
        # Check scan status loop with 30 secs wait
        do {
            $getStatus_endpoint = "https://api.powerbi.com/v1.0/myorg/admin/workspaces/scanStatus/$($scanId)"
            $getStatus_response = Invoke-RestMethod -Method GET -Uri $getStatus_endpoint -Headers $headers
            $scanStatus = $($getStatus_response.status)
            Start-Sleep -Seconds 30
        } until ($scanStatus -eq "Succeeded")
        Write-Host "Response: $($getStatus_response)"


        # Get scan results
        $getResults_endpoint = "https://api.powerbi.com/v1.0/myorg/admin/workspaces/scanResult/$($scanId)"
        $getResults_response = Invoke-RestMethod -Method GET -Uri $getResults_endpoint -Headers $headers

        $getResults_responseJson = $getResults_response | ConvertTo-Json | Out-File -FilePath $outFilePath

        Write-Host "Metadata scan completed and result saved."

        } catch {
            Write-Host "Error scanning metadata for workspaces: $_"
}
