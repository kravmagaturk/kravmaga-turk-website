param(
  [string]$SourceRoot = "\\BULICET\Users\RDC-GUEST\OneDrive\Belgeler\modul",
  [string]$OutputRoot = "C:\Users\RDC-GUEST\Documents\KravMaga\kravmaga-turk-website\_online-akademi-media-ready",
  [string]$Ffmpeg = "C:\Users\RDC-GUEST\Documents\KravMaga\tools\ffmpeg\ffmpeg-9.0.2-essentials_build\bin\ffmpeg.exe",
  [switch]$Convert
)

$ErrorActionPreference = "Stop"
$courseFile = Join-Path $PSScriptRoot "..\courses.json"
$data = Get-Content -LiteralPath $courseFile -Raw -Encoding UTF8 | ConvertFrom-Json

$jobs = @()
foreach ($module in $data.modules) {
  foreach ($lesson in $module.lessons) {
    $input = Join-Path $SourceRoot ($lesson.sourceRelativePath -replace '/', '\')
    $relOut = ($lesson.r2Key -replace '^media/', '') -replace '/', '\'
    $output = Join-Path $OutputRoot $relOut
    $jobs += [pscustomobject]@{
      id = $lesson.id
      input = $input
      output = $output
      exists = (Test-Path -LiteralPath $input)
    }
  }
}

$missing = $jobs | Where-Object { -not $_.exists }
if ($missing.Count -gt 0) {
  Write-Host "Missing source files:" -ForegroundColor Yellow
  $missing | Format-Table id,input
  throw "Source validation failed."
}

Write-Host ("Validated {0} lessons." -f $jobs.Count) -ForegroundColor Green
if (-not $Convert) {
  Write-Host "Dry run only. Use -Convert to transcode." -ForegroundColor Cyan
  $jobs | Select-Object id,input,output | Format-Table -AutoSize
  exit 0
}

foreach ($job in $jobs) {
  $dir = Split-Path $job.output
  New-Item -ItemType Directory -Force -Path $dir | Out-Null
  if (Test-Path -LiteralPath $job.output) {
    Write-Host ("SKIP {0} (already exists)" -f $job.id)
    continue
  }
  Write-Host ("CONVERT {0}" -f $job.id) -ForegroundColor Cyan
  & $Ffmpeg -y -i $job.input -map 0:v:0 -map '0:a?' -c:v libx264 -preset medium -crf 23 -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart $job.output
  if ($LASTEXITCODE -ne 0) { throw "FFmpeg failed: $($job.id)" }
}

Write-Host "All conversions completed." -ForegroundColor Green
