$c = Get-Content 'd:\DevProject\breastcalculator\style.css' -Raw
Write-Output $c.Substring($c.Length - 500)
