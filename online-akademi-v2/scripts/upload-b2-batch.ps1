param(
  [Parameter(Mandatory=$true)][string]$Manifest,
  [Parameter(Mandatory=$true)][string]$Log
)
$ErrorActionPreference='Stop'
$worker='https://kravmaga-online-video.bulicet.workers.dev'
$tokenPath='C:\Users\RDC-GUEST\Documents\KravMaga\kravmaga-turk-website\online-akademi-v2\worker\.upload-token'
if(!(Test-Path -LiteralPath $tokenPath)){throw 'Upload token file missing'}
$adminToken=(Get-Content -LiteralPath $tokenPath -Raw).Trim()
$j=Get-Content -LiteralPath $Manifest -Raw | ConvertFrom-Json
$items=$j.items | Where-Object {$_.sourceExists -eq $true}
function Get-UploadTarget {
  Invoke-RestMethod -Method Post -Uri ($worker+'/api/admin/upload-url') -Headers @{'X-Upload-Token'=$adminToken}
}
"START $(Get-Date -Format s) COUNT=$($items.Count)" | Set-Content -LiteralPath $Log -Encoding UTF8
$target=$null;$i=0
foreach($item in $items){
  $i++;$file=[string]$item.localPath
  if(!(Test-Path -LiteralPath $file)){"MISS $file"|Add-Content $Log;continue}
  $sha=(Get-FileHash -Algorithm SHA1 -LiteralPath $file).Hash.ToLowerInvariant()
  $name=[uri]::EscapeDataString([string]$item.objectKey).Replace('%2F','/')
  $ok=$false
  for($try=1;$try -le 3 -and -not $ok;$try++){
    if(!$target){$target=Get-UploadTarget}
    try{
      Invoke-WebRequest -Method Post -Uri $target.uploadUrl -InFile $file -ContentType 'video/mp4' -Headers @{
        Authorization=$target.authorizationToken
        'X-Bz-File-Name'=$name
        'X-Bz-Content-Sha1'=$sha
      } -UseBasicParsing | Out-Null
      $ok=$true;"DONE $i/$($items.Count) $($item.videoId) $($item.objectKey)"|Add-Content $Log
    }catch{
      $target=$null
      if($try -eq 3){"FAIL $i/$($items.Count) $($item.videoId) $($_.Exception.Message)"|Add-Content $Log;throw}
    }
  }
}
"COMPLETE $(Get-Date -Format s)"|Add-Content $Log