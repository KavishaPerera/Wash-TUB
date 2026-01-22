# View all registered users in the laundry management system
# Run this script with: .\view-users.ps1

$mysqlPath = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
$user = "root"
$password = "1234"
$port = "3307"
$database = "laundry_management_system"

Write-Host "`n========== REGISTERED USERS ==========" -ForegroundColor Cyan

$query = "SELECT id, first_name, last_name, email, phone, role, is_active, created_at FROM users ORDER BY created_at DESC;"

echo $query | & $mysqlPath -u $user -p$password -P $port $database --table

Write-Host "`n=======================================" -ForegroundColor Cyan
