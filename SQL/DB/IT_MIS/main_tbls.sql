-- =========================================
-- Maintenance Equipment
-- =========================================

CREATE TABLE main_tbls (
    main_req_code     NVARCHAR(20)      NOT NULL,
    flw_code          NVARCHAR(20)      NULL,
    emp_code          NVARCHAR(10)      NULL,
    typ_main_code     NVARCHAR(10)      NULL,
    main_req_subject  NVARCHAR(255)     NULL,
    main_req_detail   NVARCHAR(MAX)     NULL,
    main_res_detail   NVARCHAR(MAX)     NULL,
    main_req_file     NVARCHAR(255)     NULL,
    soft_req_status   NVARCHAR(20)      NULL,
    [delete]          NVARCHAR(1)       NULL,
    createdBy         NVARCHAR(30)      NULL,
    updatedBy         NVARCHAR(30)      NULL,
    createdAt         DATETIMEOFFSET(7)  NULL,
    updatedAt         DATETIMEOFFSET(7)  NULL,

    CONSTRAINT PK_main_tbls PRIMARY KEY (main_req_code)
);
