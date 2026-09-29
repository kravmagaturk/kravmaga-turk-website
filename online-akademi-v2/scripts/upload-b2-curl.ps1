param(
  [Parameter(Mandatory=$true)][string]$Manifest,
  [Parameter(Mandatory=$true)][string]$Log
)
$ErrorActionPreference='Stop'
$worker='https://kravmaga-online-video.bulicet.workers.dev'
$tokenPath='C:\Users\RDC-GUEST\Documents\KravMaga\kravmaga-turk-website-v2\online-akademi-v2\worker\.upload-token'
if(!(Test-Path -LiteralPath $tokenPath)){throw 'Upload token file missing'}
$adminToken=(Get-Content -LiteralPath $tokenPath -Raw).Trim()
$j=Get-Content -LiteralPath $Manifest -Raw | ConvertFrom-Json
$items=@($j.items)
function Get-UploadTarget {
  Invoke-RestMethod -Method Post -Uri ($worker+'/api/admin/upload-url') -Headers @{'X-Upload-Token'=$adminToken}
}
"START $(Get-Date -Format s) COUNT=$($items.Count)" | Set-Content -LiteralPath $Log -Encoding UTF8
$i=0
foreach($item in $items){
  $i++
  $file=[string]$item.localPath
  if(!(Test-Path -LiteralPath $file)){"MISS $i/$($items.Count) $($item.videoId) $file"|Add-Content $Log;continue}
  $sha=(Get-FileHash -Algorithm SHA1 -LiteralPath $file).Hash.ToLowerInvariant()
  $name=[uri]::EscapeDataString([string]$item.objectKey).Replace('%2F','/')
  $ok=$false
  for($try=1;$try -le 3 -and -not $ok;$try++){
    $target=Get-UploadTarget
    $resp=[IO.Path]::GetTempFileName()
    try{
      $args=@('-sS','--fail-with-body','-X','POST',$target.uploadUrl,'-H',('Authorization: '+$target.authorizationToken),'-H',('X-Bz-File-Name: '+$name),'-H',('X-Bz-Content-Sha1: '+$sha),'-H','Content-Type: video/mp4','--data-binary',('@'+$file),'-o',$resp,'-w','%{http_code}')
      $code=& curl.exe @args
      if($LASTEXITCODE -eq 0 -and [int]$code -ge 200 -and [int]$code -lt 300){
        $ok=$true
        "DONE $i/$($items.Count) $($item.videoId) $($item.objectKey)"|Add-Content $Log
      } else {
        $body=Get-Content -LiteralPath $resp -Raw -ErrorAction SilentlyContinue
        "RETRY $i/$($items.Count) $($item.videoId) TRY=$try HTTP=$code $body"|Add-Content $Log
      }
    } finally {Remove-Item -LiteralPath $resp -Force -ErrorAction SilentlyContinue}
  }
  if(-not $ok){"FAIL $i/$($items.Count) $($item.videoId)"|Add-Content $Log;throw "Upload failed: $($item.videoId)"}
}
"COMPLETE $(Get-Date -Format s)"|Add-Content $Log