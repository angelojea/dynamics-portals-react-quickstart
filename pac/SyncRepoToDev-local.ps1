<#
Variables to create:
- DevProfile: any string
- TenantId: tenant id to authenticate
- AppId: app id to authenticate
- ClientSecret: client secret to authenticate
- PortalId: Id of the portal being sync'd
#>
$DevProfile = DevProfile;
$TenantId = '';
$AppId = '';
$ClientSecret = '';
$CrmUrl = '';
$PortalId = '';

pac install latest;

<#
Authenticates and downloads the portal
#>
pac auth create --name $DevProfile --url $CrmUrl --tenant $TenantId --applicationId $AppId --clientSecret $ClientSecret;

pac auth select -n $DevProfile;

pac paportal download --path . -id $PortalId;
<#======================================#>

<#
Syncs the data from the repo to the downloaded portal
#>
$directories = Get-ChildItem -Directory;
$portalPath = './' + $directories[0].Name;
$reactAppFile = $portalPath + '/web-files/React-App';

Copy-Item -Path '../dist/react-app.js' -Destination $reactAppFile -Force;


$webTemplatesFolder = '../Web Templates/';

foreach ($file in Get-ChildItem -Path $webTemplatesFolder)
{
    $fullName = $file.Name;
    $name = $fullName.Split('.')[0];
    $nameLower = $name.ToLower();

    $path = $portalPath + '/web-templates/' + $nameLower + '/' + $name + '.webtemplate.source.html';
    if (Test-Path -Path $path -PathType Leaf) {
    
        $localFilePath = $webTemplatesFolder + $fullName;
        $localFileContent = Get-Content $localFilePath;

        Set-Content -Path $path -Value $localFileContent;
        $msg = "Updated " + $name;
        Write-Host $msg;
    }
    else {
        $msg = "Web Template " + $name + " not found!";
        Write-Host $msg;
    }
}
<#======================================#>

<#
Pushes changes to portal
#>
cd $portalPath;

pac paportal upload --path .;

<#
Delete downloaded portal
#>
cd ..;

rmdir $portalPath /s;