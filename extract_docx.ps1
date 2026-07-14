Add-Type -AssemblyName 'System.IO.Compression.FileSystem'
$docxPath = 'd:\SD\projects\socialAgency\SRS_Social_Media_Agency_Platform.docx'
$zip = [System.IO.Compression.ZipFile]::OpenRead($docxPath)
foreach ($entry in $zip.Entries) {
    if ($entry.Name -like '*.xml' -and $entry.FullName -like 'word/document*') {
        $stream = $entry.Open()
        $reader = New-Object System.IO.StreamReader($stream)
        $content = $reader.ReadToEnd()
        $reader.Close()
        $stream.Close()
        $text = [regex]::Replace($content, '<[^>]+>', ' ')
        $text = [regex]::Replace($text, '\s+', ' ')
        Write-Output $text.Trim()
    }
}
$zip.Dispose()
