USE [YET_Organization]
GO
/****** Object:  StoredProcedure [dbo].[sp_postEmployee]    Script Date: 04-05-2026 2:57:34 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[sp_postEmployee]
(
    @isRevision BIT,
    @base_emp_code NVARCHAR(10) = NULL,   -- ใช้ Revision

    @emp_code      NVARCHAR(10) = NULL,   -- ใช้ New
    @dep_code      NVARCHAR(20),
    @emp_img       NVARCHAR(255) = NULL,
    @emp_type      NVARCHAR(10),
    @emp_prefix    NVARCHAR(5),
    @emp_name      NVARCHAR(25),
    @emp_surname   NVARCHAR(25),
    @emp_position  NVARCHAR(10),
    @emp_email     NVARCHAR(100),
    @emp_password  NVARCHAR(100),
    @createdBy     NVARCHAR(50)
)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @newEmpCode NVARCHAR(20);
    DECLARE @maxRev NVARCHAR(10);
    DECLARE @Revision NVARCHAR(10);

    BEGIN TRAN;

    IF @isRevision = 1
    BEGIN
        IF @base_emp_code IS NULL
        BEGIN
            ROLLBACK;
            THROW 50001, 'base_emp_code is required for revision', 1;
        END

        -- หา Revision ล่าสุด
        SELECT @maxRev = MAX(SUBSTRING(emp_code, LEN(@base_emp_code), 10))
        FROM emp_tbls WITH (UPDLOCK, HOLDLOCK)
        WHERE emp_code LIKE LEFT(@base_emp_code, LEN(@base_emp_code) - 1) + '%';

        IF @maxRev IS NULL
            SET @Revision = 'A';
        ELSE
            SET @Revision = dbo.fn_NextRevision(@maxRev);

        SET @newEmpCode =
            LEFT(@base_emp_code, LEN(@base_emp_code) - LEN(ISNULL(@maxRev,'A'))) + @Revision;
    END
    ELSE
    BEGIN
        IF @emp_code IS NULL
        BEGIN
            ROLLBACK;
            THROW 50002, 'emp_code is required for new employee', 1;
        END
        SET @newEmpCode = @emp_code;
    END

    -- ตรวจสอบซ้ำ
    IF EXISTS (SELECT 1 FROM emp_tbls WHERE emp_code = @newEmpCode)
    BEGIN
        SELECT -1 AS Result;
        ROLLBACK;
        RETURN;
    END

    INSERT INTO emp_tbls
    (
        emp_code,
        dep_code,
        emp_img,
        emp_type,
        emp_prefix,
        emp_name,
        emp_surname,
        emp_position,
        emp_email,
        emp_password,
        [delete],
        createdBy,
        createdAt,
        updatedAt
    )
    VALUES
    (
        @newEmpCode,
        @dep_code,
        @emp_img,
        @emp_type,
        @emp_prefix,
        @emp_name,
        @emp_surname,
        @emp_position,
        @emp_email,
        @emp_password,
        'N',
        @createdBy,
        SYSDATETIME(),
        SYSDATETIME()
    );

    COMMIT;

    SELECT @newEmpCode AS emp_code;
END
