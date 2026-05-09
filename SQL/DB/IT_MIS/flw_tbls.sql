-- =========================================
-- Flow Control
-- =========================================

CREATE TABLE flw_tbls (
    flw_code              VARCHAR(30)        NOT NULL,
    flw_issuedDate       DATETIMEOFFSET(7)  NOT NULL,
    flw_needDate         DATETIMEOFFSET(7)  NULL,
    flw_review1          NVARCHAR(100)      NULL,
    flw_review1Date      DATETIMEOFFSET(7)  NULL,
    flw_review2          NVARCHAR(100)      NULL,
    flw_review2Date      DATETIMEOFFSET(7)  NULL,
    flw_review3          NVARCHAR(100)      NULL,
    flw_review3Date      DATETIMEOFFSET(7)  NULL,
    flw_itReview         NVARCHAR(100)      NULL,
    flw_itReviewDate     DATETIMEOFFSET(7)  NULL,
    flw_itApprove        NVARCHAR(100)      NULL,
    flw_itApproveDate    DATETIMEOFFSET(7)  NULL,
    flw_userResponse     NVARCHAR(100)      NULL,
    flw_userResponseDate DATETIMEOFFSET(7)  NULL,
    flw_ppsResponse      NVARCHAR(100)      NULL,
    flw_ppsResponseDate  DATETIMEOFFSET(7)  NULL,
    flw_itResponse       NVARCHAR(100)      NULL,
    flw_itResponseDate   DATETIMEOFFSET(7)  NULL,
    flw_confirm          NVARCHAR(100)      NULL,
    flw_confirmDate      DATETIMEOFFSET(7)  NULL,
    createdAt            DATETIMEOFFSET(7)  NOT NULL,
    updatedAt            DATETIMEOFFSET(7)  NULL,

    CONSTRAINT PK_flw_tbls PRIMARY KEY (flw_code)
);