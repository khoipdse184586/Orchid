PS C:\Users\khoi\Downloads> .\mc.exe alias set myminio http://localhost:9000 orchid_admin SecurePassword@1234
Added `myminio` successfully.
PS C:\Users\khoi\Downloads> .\mc.exe policy set-json policy.json myminio/orchid-bucket
mc.exe: Please use 'mc anonymous'
PS C:\Users\khoi\Downloads> .\mc.exe anonymous set download myminio/orchid-bucket
Access permission for `myminio/orchid-bucket` is set to `download`
