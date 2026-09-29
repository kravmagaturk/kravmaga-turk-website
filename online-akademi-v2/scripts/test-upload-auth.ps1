$ErrorActionPreference='Stop'
$token=(Get-Content -LiteralPath 'C:\Users\RDC-GUEST\Documents\KravMaga\kravmaga-turk-website\online-akademi-v2\worker\.upload-token' -Raw).Trim()
$r=Invoke-WebRequest -UseBasicParsing -Method Post -Uri 'https://kravmaga-online-video.bulicet.workers.dev/api/admin/upload-url' -Headers @{'X-Upload-Token'=$token}
Write-Output ('STATUS='+$r.StatusCode)
