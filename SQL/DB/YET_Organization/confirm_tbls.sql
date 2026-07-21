-- =========================================
-- Booking Confirmation Control
-- =========================================

CREATE TABLE confirm_tbls (
    confirm_id      VARCHAR(30)    PRIMARY KEY,
    booking_id      VARCHAR(20)    NOT NULL REFERENCES booking_tbls(booking_id),
    confirm_status  VARCHAR(20)    NOT NULL DEFAULT 'confirmed',
    emp_code        VARCHAR(10)    NOT NULL REFERENCES emp_tbls(emp_code),
    confirm_remark  TEXT,
    deleteflag      VARCHAR(1)     NOT NULL DEFAULT 'N',
    createdby       VARCHAR(50)    NOT NULL,
    updatedby       VARCHAR(50),
    createdat       TIMESTAMP      NOT NULL DEFAULT NOW(),
    updatedat       TIMESTAMP      NOT NULL DEFAULT NOW()
);
