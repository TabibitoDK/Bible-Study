param([string]$Archive = "$PSScriptRoot/bsb-headings.zip")
# Source: https://bereanbible.com/bsb_usfm.zip (public domain).
# First section heading in each chapter; continuing sections retain their heading.
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [IO.Compression.ZipFile]::OpenRead((Resolve-Path $Archive))
$titles = [ordered]@{}
try {
  foreach ($entry in $zip.Entries) {
    if (-not $entry.Name.EndsWith('.usfm')) { continue }
    $reader = New-Object IO.StreamReader($entry.Open())
    try { $text = $reader.ReadToEnd() } finally { $reader.Dispose() }
    $book = [regex]::Match($text, '(?m)^\\h (.+)').Groups[1].Value.Trim()
    if ($book -eq 'Song of Songs') { $book = 'Song of Solomon' }
    if ($book -eq 'Psalm') { $book = 'Psalms' }
    $chapters = [regex]::Matches($text, '(?ms)^\\c (\d+)\s*\n(.*?)(?=^\\c |\z)')
    if (-not $book -or -not $chapters.Count) { continue }
    $list = @()
    $previous = ''
    foreach ($chapter in $chapters) {
      $heading = [regex]::Match($chapter.Groups[2].Value, '(?m)^\\s[12] (.+)').Groups[1].Value.Trim()
      if ($heading) { $previous = $heading } elseif ($previous) { $heading = "$previous (continued)" }
      if (-not $heading) { throw "Missing heading: $book $($chapter.Groups[1].Value)" }
      $list += $heading
    }
    $titles[$book] = $list
  }
} finally { $zip.Dispose() }
if ($titles.Count -ne 66 -or ($titles.Values | ForEach-Object { $_.Count } | Measure-Object -Sum).Sum -ne 1189) { throw 'Expected 66 books and 1,189 chapter titles.' }
$output = $titles | ConvertTo-Json -Depth 5
[IO.File]::WriteAllText("$PSScriptRoot/../src/data/chapterTitles.json", $output, (New-Object Text.UTF8Encoding($false)))
Write-Output 'Imported titles for all 1,189 chapters.'
