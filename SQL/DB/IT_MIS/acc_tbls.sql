-- =========================================
-- Access Control
-- =========================================

CREATE TABLE acc_tbls (
    acc_code        NVARCHAR(20)    NOT NULL,
    emp_code        NVARCHAR(10)    NULL,
    acc_dashboard   NVARCHAR(20)    NULL,
    acc_request     NVARCHAR(20)    NULL,
    acc_receive     NVARCHAR(20)    NULL,
    acc_review      NVARCHAR(20)    NULL,
    acc_access      NVARCHAR(20)    NULL,
    acc_employee    NVARCHAR(20)    NULL,
    acc_department  NVARCHAR(20)    NULL,
    acc_software    NVARCHAR(20)    NULL,
    acc_login       NVARCHAR(20)    NULL,
    [delete]        NVARCHAR(1)     NULL,
    createdBy       NVARCHAR(30)    NULL,
    updatedBy       NVARCHAR(30)    NULL,
    createdAt       DATETIMEOFFSET(7) NULL,
    updatedAt       DATETIMEOFFSET(7) NULL,

    CONSTRAINT PK_acc_tbls PRIMARY KEY (acc_code)
);