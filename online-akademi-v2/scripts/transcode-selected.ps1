param(
  [string]$Manifest = "C:\Users\RDC-GUEST\Documents\KravMaga\kravmaga-turk-website\online-akademi-v2\transcode-selected.json"
)
$ErrorActionPreference='Stop'
$ff='C:\Users\RDC-GUEST\Documents\KravMaga\tools\ffmpeg\ffmpeg-9.0.2-essentials_build\bin\ffmpeg.exe'
$srcRoot='\\BULICET\Users\RDC-GUEST\OneDrive\Belgeler\modul'
$outRoot='C:\Users\RDC-GUEST\Documents\KravMaga\prepared-media'
$log='C:\Users\RDC-GUEST\Documents\KravMaga\kravmaga-turk-website\online-akademi-v2\transcode-selected.log'
function Slug([string]$s){
  $x=$s.ToLowerInvariant()
  $x=$x.Replace('ı','i').Replace('ş','s').Replace('ğ','g').Replace('ü','u').Replace('ö','o').Replace('ç','c')
  $x=$x -replace '[^a-z0-9]+','-'
  return $x.Trim('-')
}
$j=Get-Content -LiteralPath $Manifest -Raw | ConvertFrom-Json
New-Item -ItemType Directory -Force -Path $outRoot | Out-Null
"START $(Get-Date -Format s) COUNT=$($j.items.Count)" | Set-Content -LiteralPath $log -Encoding UTF8
$i=0
foreach($item in $j.items){
  $i++
  $rel=[string]$item.relative
  $parts=$rel -split '/'
  $module=Slug $parts[0]
  $name=Slug ([IO.Path]::GetFileNameWithoutExtension($parts[-1]))
  $src=Join-Path $srcRoot ($rel -replace '/','\')
  $dir=Join-Path $outRoot $module
  $dst=Join-Path $dir ($name+'.mp4')
  New-Item -ItemType Directory -Force -Path $dir | Out-Null
  if(Test-Path -LiteralPath $dst){
    "SKIP $i/$($j.items.Count) $rel -> $dst" | Add-Content -LiteralPath $log
    continue
  }
  "BEGIN $i/$($j.items.Count) $rel" | Add-Content -LiteralPath $log
  & $ff -hide_banner -loglevel error -y -i $src -map 0:v:0 -map 0:a? -c:v libx264 -preset medium -crf 23 -c:a aac -b:a 128k -movflags +faststart $dst
  if($LASTEXITCODE -ne 0){throw "FFmpeg failed: $rel"}
  "DONE $i/$($j.items.Count) $rel -> $dst" | Add-Content -LiteralPath $log
}
"COMPLETE $(Get-Date -Format s)" | Add-Content -LiteralPath $log
