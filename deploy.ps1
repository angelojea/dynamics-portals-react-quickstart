$currentLocation = (Get-Location).Path;
$SourceCrmUrl = 'https://org7b1b2d3c.crm.dynamics.com';
$TargetCrmUrl = 'https://org1058a38c.crm.dynamics.com/';
$PortalId = '35be1770-b50c-ee11-8f6d-0022482bf95e';
$solutionsArr = $(
    "AOJ"
);



try {
    $SourceProfile = 'source';
    $TargetProfile = 'target';

    Write-Host 'Authenticating to source env';
    pac auth create --name $SourceProfile --url $SourceCrmUrl;
    Write-Host 'Authenticating to target env';
    pac auth create --name $TargetProfile --url $TargetCrmUrl;

    Write-Host '[EXPORTING SOLUTIONS]' -ForegroundColor black -BackgroundColor white;
    Write-Host 'Switching to source';
    pac auth select -n $SourceProfile;

    foreach ($solution in $solutionsArr)
    {
        Write-Host 'Exporting ' $solution;
        pac solution export --path $currentLocation/solutions/$solution.zip --name $solution --managed false --include general
        Write-Host 'Solution ' + $solution + ' exported successfully!';
    }
    
    Write-Host '[IMPORTING SOLUTIONS]' -ForegroundColor black -BackgroundColor white;
    Write-Host 'Switching to target';
    pac auth select -n $TargetProfile;

    cd $currentLocation/solutions;
    $solutions = Get-ChildItem -File;

    foreach ($solution in $solutions)
    {
        Write-Host 'Importing ' $solution;
        pac solution import --path $currentLocation/solutions/$solution
        Write-Host 'Solution ' $solution ' imported successfully!';
    }

    Write-Host '[MOVING PORTAL RECORDS]' -ForegroundColor black -BackgroundColor white;
    Write-Host 'Switching to source';
    pac auth select -n $SourceProfile;

    Write-Host 'Started downloading portal records';
    pac paportal download --path ./portal -id $PortalId;


    <#======================================#>

    cd $currentLocation/portal;

    $directories = Get-ChildItem -Directory;
    $portalPath = $currentLocation + '/portal/' + $directories[0].Name;

    cd $portalPath;

    Write-Host 'Switching to target';
    pac auth select -n $TargetProfile;

    Write-Host 'Started uploading portal records';
    pac paportal upload --path .;
}
catch {
    Write-Host '*************************' -BackgroundColor red;
    Write-Host '[ERROR CAUGHT]' -BackgroundColor red;
    Write-Host '*************************' -BackgroundColor red;
    Write-Host $_ -BackgroundColor red;
}
finally {
    cd $currentLocation;
    if (Test-Path -Path $currentLocation/portal) {
        Remove-Item -Path $currentLocation/portal -Recurse -Force;
    }
    if (Test-Path -Path $currentLocation/solutions) {
        Remove-Item -Path $currentLocation/solutions -Recurse -Force;
    }

    Write-Host 'Press <Enter> to finish execution';
    Read-Host;
}
