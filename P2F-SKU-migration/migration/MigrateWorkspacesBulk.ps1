# Migrating workspaces in bulk from current P capacity to target F capacity in the same tenant
#################################################################################
# Update below parameters::
# $batchSize
# $targetCapacityId
# $csvFilePath
# Note: If the $workspacesString gets too long, the Power BI API might throw an error due to the URL length limit. Consider breaking the request into smaller batches if this happens (or if you expect this to happen).
# Recommend: Test the script in dev/test env and modify as necessary
##################################################################################
# Connect to Power BI service using admin credentials or Service Principal (use KeyVault in Prod)
# Example login: https://github.com/SQLSwimmer/powerbi-admin-scripts/blob/main/GetGatewayDatasources.ps1
# Set-ExecutionPolicy -Scope Process Unrestricted

# Check if we are logged in and if not, login to Power BI
try {
    get-powerbiaccesstoken | Out-Null
} catch {
    Write-Host "Not logged in. Logging in..."
    Connect-PowerBIServiceAccount | Out-Null
}

# Define the batch size for API calls
$batchSize = 1000
# Migration - provide target capacity ID (should be in same tenant)
$targetCapacityId = "AAAAAAA-FBB9-4792-BBFF-6000000000E" # example
$workspaces = @()
$migrationResults = @()  # This will store the workspace IDs and their statuses
$csvFilePath = "C:\path\to\save\workspace_migration_status.csv"  # Ensure this path exists

try {
    # Get all active premium workspaces list
    $workspacesList = Get-PowerBIWorkspace -Scope Organization -All -Filter "isOnDedicatedCapacity eq true and tolower(state) eq 'active'"
    Write-Host "Workspaces count: $($workspacesList.Count)"
    
    foreach ($row in $workspacesList) {
        $workspaceId = $row.Id
        $workspaces += $workspaceId
        
        # If batch size is reached, send the batch
        if ($workspaces.Count -eq $batchSize) {

            # Call the API to assign workspaces in batch
            try {
                # Construct the request body for the migration
                $requestBody = @{
                    "workspaces" = $workspaces
                    "capacityId" = $targetCapacityId
                } | ConvertTo-Json
                $response = Invoke-RestMethod -Uri "https://api.powerbi.com/v1.0/myorg/admin/capacities/AssignWorkspaces" `
                                              -Method Post `
                                              -Body $requestBody `
                                              -ContentType "application/json"

                Write-Host "Successfully assigned $batchSize workspaces."

                # Log success for each workspace in this batch
                foreach ($workspace in $workspaces) {
                    $migrationResults += [PSCustomObject]@{
                        WorkspaceId = $workspace
                        Status      = "Success"
                    }
                }
            } catch {
                Write-Host "Error calling API: $_"

                # Log failure for each workspace in this batch
                foreach ($workspace in $workspaces) {
                    $migrationResults += [PSCustomObject]@{
                        WorkspaceId = $workspace
                        Status      = "Failed"
                    }
                }
            }

            # Clear the workspaces array for the next batch
            $workspaces.Clear()
        }
    }

    # Handle any remaining workspaces that didn't fill up a complete batch
    if ($workspaces.Count -gt 0) {
        try {
            # Construct the request body for the migration
            $requestBody = @{
                "workspaces" = $workspaces
                "capacityId" = $targetCapacityId
            } | ConvertTo-Json
            $response = Invoke-RestMethod -Uri "https://api.powerbi.com/v1.0/myorg/admin/capacities/AssignWorkspaces" `
                                              -Method Post `
                                              -Body $requestBody `
                                              -ContentType "application/json"

            Write-Host "Successfully assigned remaining workspaces."

            # Log success for each remaining workspace
            foreach ($workspace in $workspaces) {
                $migrationResults += [PSCustomObject]@{
                    WorkspaceId = $workspace
                    Status      = "Success"
                }
            }
        } catch {
            Write-Host "Error calling API for remaining workspaces: $_"

            # Log failure for remaining workspaces
            foreach ($workspace in $workspaces) {
                $migrationResults += [PSCustomObject]@{
                    WorkspaceId = $workspace
                    Status      = "Failed"
                }
            }
        }
    }

    # Export migration results to a CSV file with UTF-8 encoding
    $migrationResults | Export-Csv -Path $csvFilePath -NoTypeInformation -Encoding UTF8
    Write-Host "Migration results saved to $csvFilePath"

} catch {
    Write-Host "Error retrieving workspaces: $_"
}
