-- =========================================
-- Software Request Control
-- =========================================

CREATE TABLE soft_req_tbls (
    soft_req_code         NVARCHAR(20)      NOT NULL,
    emp_code              NVARCHAR(10)      NULL,
    eqp_code              NVARCHAR(20)      NULL,
    soft_req_Detail       NVARCHAR(MAX)     NULL,
    soft_res_Detail       NVARCHAR(MAX)     NULL,
    soft_activate         NVARCHAR(1)       NULL,
    soft_req_installDate  DATETIMEOFFSET(7)  NULL,
    soft_req_status       NVARCHAR(20)      NULL,
    [delete]              NVARCHAR(1)       NULL,
    createdBy             NVARCHAR(30)      NULL,
    updatedBy             NVARCHAR(30)      NULL,
    createdAt             DATETIMEOFFSET(7)  NULL,
    updatedAt             DATETIMEOFFSET(7)  NULL,

    CONSTRAINT PK_soft_req_tbls PRIMARY KEY (soft_req_code)
);