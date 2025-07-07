-- Create OrchidDB database if it doesn't exist
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'OrchidDB')
BEGIN
    CREATE DATABASE OrchidDB;
    PRINT 'OrchidDB database created successfully';
END
ELSE
BEGIN
    PRINT 'OrchidDB database already exists';
END
GO

-- Switch to OrchidDB
USE OrchidDB;
GO

-- Create a simple test table to verify connection
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='health_check' AND xtype='U')
BEGIN
    CREATE TABLE health_check (
        id INT IDENTITY(1,1) PRIMARY KEY,
        created_at DATETIME DEFAULT GETDATE(),
        status NVARCHAR(50) DEFAULT 'OK'
    );
    
    INSERT INTO health_check (status) VALUES ('Database initialized');
    PRINT 'Health check table created and initialized';
END
GO