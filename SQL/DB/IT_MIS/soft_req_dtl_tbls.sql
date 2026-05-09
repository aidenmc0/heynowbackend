-- =========================================
-- Software Request Detail
-- =========================================

CREATE TABLE soft_req_dtl_tbls (
    soft_req_dtl_code  NVARCHAR(20)      NOT NULL,
    soft_req_code      NVARCHAR(20)      NULL,
    soft_code          NVARCHAR(20)      NULL,
    soft_version       NVARCHAR(100)     NULL,
    [delete]           NVARCHAR(1)       NULL,
    createdBy          NVARCHAR(30)      NULL,
    updatedBy          NVARCHAR(30)      NULL,
    createdAt          DATETIMEOFFSET(7)  NULL,
    updatedAt          DATETIMEOFFSET(7)  NULL,

    CONSTRAINT PK_soft_req_dtl_tbls PRIMARY KEY (soft_req_dtl_code)
);